/**
 * Dashboard's primary, conversational Agentic workspace, mounted by dashboard/page.
 * Owns chat, the single in-flight request, per-send atmosphere and artifacts;
 * api.js owns HTTP/auth semantics and AgentReportPanel owns result presentation.
 * State stays in memory while switching dashboard tabs, and clears on page exit.
 * The backend streams observed task phases and permitted reply text. State stays
 * ephemeral; never present durable chat history or invented provider progress.
 */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { createWordReveal } from "./wordReveal";
import {
  ArrowUp,
  ArrowUpRight,
  BookOpen,
  ChevronRight,
  FileText,
  Globe,
  HelpCircle,
  Megaphone,
  PanelRight,
  Plus,
  Sparkles,
  Square,
} from "lucide-react";
import {
  composeTask,
  runAgentTask,
  taskLength,
  TASK_LIMIT,
  validateAgentAttachments,
} from "@/app/features/agent/api";
import AgentReportPanel from "./AgentReportPanel";
import AgentText from "./AgentText";
import AgentImages from "./AgentImages";
import VoiceInput from "./VoiceInput";
import { FlairAtmosphere, FlairMark, FlairWorking } from "./FlairPresence";
import styles from "./agent.module.css";

// ============================================================================
// CAPABILITY-ALIGNED STARTERS
// These only prefill the composer. They never execute paid/provider work before
// the user sends a message, and only describe registered tools or knowledge Q&A.
// ============================================================================
const STARTERS = [
  {
    icon: Globe,
    label: "Understand my website",
    description: "Find what needs attention",
    prompt:
      "Audit my website and summarize the most important issues. My website is ",
    tone: "blue",
  },
  {
    icon: Megaphone,
    label: "Explore competitor ads",
    description: "See what others are running",
    prompt: "Find Meta ads for ",
    tone: "purple",
  },
  {
    icon: BookOpen,
    label: "Make sense of a metric",
    description: "Turn audit jargon into insight",
    prompt: "Explain what website health score means and how to interpret it.",
    tone: "peach",
  },
];
// ============================================================================
// INDIVIDUAL AUDIT DISCOVERY AND DOCUMENT ALLOWLIST
// Prompts only prefill inputs; backend tools still validate/authorize execution.
// Full Report deliberately has no starter or document type in this release.
// ============================================================================
const REPORT_TYPES = new Set([
  "website_anatomy",
  "gmb_audit",
  "instagram_audit",
  "linkedin_company",
  "linkedin_personal",
  "visual_brand_match",
  "ads_audit",
  "ui_ux",
]);
const AUDIT_PROMPTS = [
  ["Website Anatomy", "Generate a Website Anatomy report for "],
  [
    "GMB Audit",
    "Run a GMB Audit. My business name, profile link and location are ",
  ],
  ["Instagram Audit", "Run an Instagram Audit for @"],
  ["LinkedIn Audit", "Audit this LinkedIn company page: "],
  ["LinkedIn Personal", "Audit my LinkedIn personal profile: "],
  [
    "Visual Brand Match",
    "Compare my attached website screenshot and Instagram moodboard with Visual Brand Match.",
  ],
  ["Ads Audit", "Generate an Ads Audit with AI analysis for "],
  ["UI/UX Audit", "Run a UI/UX Audit for "],
  ["Ads Library", "Find Meta ads for "],
];

const STATUS_LABELS = {
  needs_input: "A little more detail",
  needs_verification: "Not yet verified",
  rejected: "Request could not proceed",
  failed: "Could not complete",
};

// ============================================================================
// CONTEXTUAL VISUAL INPUT DISCOVERY
// Upload controls belong to a visual comparison, not every audit. This is only
// a display hint: backend tools still choose/validate the actual operation.
// Selected files stay visible so users can remove them instead of sending hidden
// attachments. Completed requests/new chats clear that request-local intent.
// ============================================================================
function requestsVisualMatch(text) {
  /** Recognize explicit visual matching and website/Instagram image comparisons. */
  return (
    /\bvisual(?:\s+brand)?\s+(?:match|alignment|comparison)\b|\bmoodboard\b/i.test(
      text,
    ) ||
    (/\b(?:compare|match|align)\b/i.test(text) &&
      ((/\bwebsite\b/i.test(text) && /\binstagram\b/i.test(text)) ||
        /\bbrand\s+(?:images|visuals|identity|colou?rs)\b/i.test(text)))
  );
}

/** Detect an actual clarification asking for this comparison's two image roles. */
function asksForVisualUploads(text) {
  return (
    /\b(?:attach|upload|provide|add|send)\b/i.test(text) &&
    (requestsVisualMatch(text) ||
      (/\bwebsite\b/i.test(text) && /\binstagram\b/i.test(text)))
  );
}

/** Derive an artifact label from the actual returned tool, never the intended prompt. */
function artifactTitle(result) {
  return result.tool === "website.report"
    ? "Website Anatomy"
    : result.tool === "website.audit"
      ? "Website intelligence"
      : result.tool === "ads_library.search"
        ? "Ads library results"
        : "Agent result";
}

/**
 * Provide a chat-driven entry point without replacing existing manual audit tabs.
 * `disabled` mirrors suspension for UX; get_active_user remains authoritative.
 * `active` gates focus/scroll while this mounted workspace is hidden by another tab.
 * `onBusyChange` lets Dashboard pause feedback reminders during an agent request.
 * `onOpenSupport` opens the existing Dashboard dialog without a floating overlay
 * on the chat input; support requests retain their existing authentication flow.
 */
export default function AgentWorkspace({
  username,
  disabled,
  active,
  onBusyChange,
  onOpenSupport,
}) {
  const reducedMotion = useReducedMotion();
  const [progress, setProgress] = useState("");
  const [messages, setMessages] = useState([]);
  const [artifacts, setArtifacts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [draft, setDraft] = useState("");
  // Images stay only in this workspace until the explicit send. Backend checks
  // remain authoritative; a complete pair is required before paid work starts.
  const [images, setImages] = useState({ website: null, moodboard: null });
  const [visualRequested, setVisualRequested] = useState(false);
  const showVisualInputs =
    visualRequested ||
    requestsVisualMatch(draft) ||
    Boolean(images.website || images.moodboard);
  const [voiceBusy, setVoiceBusy] = useState(false);
  const voiceBusyRef = useRef(false);
  const draftRef = useRef(draft);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  // Re-key only on explicit sends: each request gets one holographic ripple,
  // while replies/report selections never restart that decorative animation.
  const [sendPulse, setSendPulse] = useState(0);
  const composerRef = useRef(null);
  const scrollRef = useRef(null);
  const requestRef = useRef(null);
  const epochRef = useRef(0);
  const openerRef = useRef(null);
  const lastInputRef = useRef("");
  const selected = artifacts.find((artifact) => artifact.id === selectedId);
  const hasMessages = messages.length > 0;

  // ========================================================================
  // LIFECYCLE AND SCROLL
  // Abort browser work on page exit and invalidate its callbacks before they can
  // update state. Switching modules leaves this component mounted intentionally.
  // Scroll only our transcript; never move the surrounding dashboard or report.
  // ========================================================================
  useEffect(
    () => () => {
      epochRef.current += 1;
      requestRef.current?.abort();
    },
    [],
  );

  useEffect(() => {
    onBusyChange(busy || voiceBusy);
  }, [busy, voiceBusy, onBusyChange]);

  // Microphone state also closes the same-tick send race. Audio is an editable
  // input aid, not a task: never submit on transcript completion or cut off text.
  const setVoicePending = useCallback((pending) => {
    voiceBusyRef.current = pending;
    setVoiceBusy(pending);
  }, []);
  useEffect(() => {
    draftRef.current = draft;
  }, [draft]);
  /** Append reviewed dictation without dispatch; false retains overflow in its tray. */
  function appendDictation(text) {
    const prefix = draftRef.current.trimEnd();
    const next = prefix ? `${prefix}\n${text}` : text;
    if (taskLength(next) > TASK_LIMIT) return false;
    draftRef.current = next;
    setDraft(next);
    setError("");
    requestAnimationFrame(() => composerRef.current?.focus());
    return true;
  }

  useEffect(() => {
    if (active && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, busy, active]);

  useEffect(() => {
    const textarea = composerRef.current;
    if (!textarea || !active) return;
    // Pixel limits match CSS: grow for multiline input, then scroll internally.
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  }, [draft, active]);

  /** Focus a starter's editable prompt rather than submitting it automatically. */
  function chooseStarter(prompt) {
    if (voiceBusyRef.current) return;
    setDraft(prompt);
    setVisualRequested(requestsVisualMatch(prompt));
    setError("");
    composerRef.current?.focus();
  }

  /** Open any retained artifact; preserve the real opener for accessible return focus. */
  function openArtifact(id, target) {
    openerRef.current = target;
    setSelectedId(id);
  }

  /** Close the non-modal report and return to its opener or the message composer. */
  function closeArtifact() {
    setSelectedId(null);
    const target = openerRef.current;
    // On small screens chat was display:none; wait for React to reveal its
    // opener before focusing, rather than focusing a still-hidden control.
    requestAnimationFrame(() => {
      if (target?.isConnected) target.focus();
      else composerRef.current?.focus();
    });
  }

  /** Clear in-memory conversation only when no request is running; no remote delete. */
  function newChat() {
    if (requestRef.current || voiceBusyRef.current) return;
    setMessages([]);
    setArtifacts([]);
    setSelectedId(null);
    setDraft("");
    setError("");
    setSendPulse(0);
    setImages({ website: null, moodboard: null });
    setVisualRequested(false);
    composerRef.current?.focus();
  }

  /**
   * Execute one explicit send. The ref guard closes the rapid-click race before
   * React rerenders. Context overflow is rejected before adding a message; failed
   * transport turns remain visible but are excluded from subsequent task context.
   * The server alone selects tools and verifies completion. Never retry on error,
   * as a timed-out/disconnected request may already have executed a provider tool.
   */
  async function sendMessage(event) {
    event.preventDefault();
    if (requestRef.current || disabled || voiceBusyRef.current) return;
    const input = draft.trim();
    let task;
    try {
      validateAgentAttachments(images);
      task = composeTask(
        messages.filter((message) => !message.failed && !message.streaming),
        input,
      );
    } catch (validationError) {
      setError(validationError.message);
      composerRef.current?.focus();
      return;
    }
    const controller = new AbortController();
    // Keep the visual controls available while their explicit request is being
    // answered, including a follow-up clarification after the draft is cleared.
    setVisualRequested(
      requestsVisualMatch(input) || Boolean(images.website || images.moodboard),
    );
    requestRef.current = controller;
    const epoch = ++epochRef.current;
    const userId = crypto.randomUUID();
    const replyId = crypto.randomUUID();
    let partial = "";
    // The network reader never sleeps. A separate abortable queue reveals whole
    // words gently, capped at 1.8 seconds of artificial pacing from first text.
    const reveal = createWordReveal(
      (text) => {
        if (epoch !== epochRef.current || !text) return;
        setMessages((previous) => {
          const row = { id: replyId, role: "assistant", text, streaming: true };
          return previous.some((message) => message.id === replyId)
            ? previous.map((message) =>
                message.id === replyId ? row : message,
              )
            : [...previous, row];
        });
      },
      { signal: controller.signal, reducedMotion },
    );
    setProgress("Sending your request");
    lastInputRef.current = input;
    setMessages((previous) => [
      ...previous,
      { id: userId, role: "user", text: input },
    ]);
    setDraft("");
    setError("");
    setBusy(true);
    setSendPulse((previous) => previous + 1);

    try {
      const result = await runAgentTask(task, controller.signal, images, {
        onProgress: (label) => {
          if (epoch === epochRef.current) setProgress(label);
        },
        onDelta: (text) => {
          if (epoch !== epochRef.current) return;
          partial += text;
          if (partial.length > 12000)
            throw new Error("The reply was too long. Please try again.");
          reveal.push(partial);
        },
      });
      await reveal.finish(result.message);
      if (epoch !== epochRef.current) return;
      // Keep uploads if the agent asks a clarification, so the next explicit
      // send carries the same references. Settled/error states never auto-replay.
      if (result.status !== "needs_input")
        setImages({ website: null, moodboard: null });
      setVisualRequested(
        result.status === "needs_input" &&
          (requestsVisualMatch(input) || asksForVisualUploads(result.message)),
      );

      // Full HTML bypasses model history. Retain every server-generated document
      // rather than fabricating a report from the model summary or crawl scores.
      const documents = Array.isArray(result.artifacts)
        ? result.artifacts.filter(
            (document) =>
              REPORT_TYPES.has(document.type) &&
              typeof document.html_report === "string" &&
              document.html_report.trim() &&
              document.result,
          )
        : [];
      const documentArtifacts = documents.map((document) => ({
        id: document.id,
        title: document.title,
        report: document,
        result: { ...result, tool: document.tool, data: document.result },
      }));
      // Only real, nonfailed tool data becomes an artifact. Unverified results
      // stay inspectable, with their backend status shown in both chat and panel.
      const envelope = result.data;
      const hasArtifact = Boolean(
        result.tool &&
        envelope &&
        ["success", "partial"].includes(envelope.status) &&
        envelope.data &&
        typeof envelope.data === "object",
      );
      const replyArtifactIds = documentArtifacts.length
        ? documentArtifacts.map((artifact) => artifact.id)
        : hasArtifact
          ? [replyId]
          : [];
      // Only done confirms the final outcome. Replace provisional text with the
      // authoritative reply and bind its existing report preview/PDF artifacts.
      setMessages((previous) => {
        const row = {
          id: replyId,
          role: "assistant",
          text: result.message,
          status: result.status,
          artifactIds: replyArtifactIds,
          streaming: false,
        };
        return previous.some((message) => message.id === replyId)
          ? previous.map((message) => (message.id === replyId ? row : message))
          : [...previous, row];
      });
      if (documentArtifacts.length || hasArtifact) {
        setArtifacts((previous) => [
          ...previous,
          ...(documentArtifacts.length
            ? documentArtifacts
            : [{ id: replyId, result, title: artifactTitle(result) }]),
        ]);
        // Auto-open the real report once available, as in an artifact workspace.
        openerRef.current = composerRef.current;
        setSelectedId(replyArtifactIds.at(-1));
      }
    } catch (requestError) {
      if (epoch !== epochRef.current) return;
      setMessages((previous) =>
        previous.map((message) =>
          message.id === userId || message.id === replyId
            ? { ...message, failed: true, streaming: false }
            : message,
        ),
      );
      setError(
        requestError.name === "AbortError"
          ? "Stopped waiting. The request may still finish on the server."
          : requestError.message,
      );
    } finally {
      reveal.dispose();
      if (epoch === epochRef.current) {
        requestRef.current = null;
        setBusy(false);
        setProgress("");
      }
    }
  }

  /** Submit Enter, preserve Shift+Enter and IME composition for multilingual input. */
  function handleComposerKey(event) {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <section
      className={`${styles.workspace} ${selected ? styles.withReport : ""} ${busy ? styles.isBusy : ""}`}
      aria-label="Flair by Flawdits workspace"
      data-active={active}
    >
      {/* Client-only atmosphere responds to send/wait state, never tool phases.
          All decorative layers are inert and respect reduced-motion settings. */}
      <FlairAtmosphere pulse={sendPulse} busy={busy} active={active} />
      <div className={styles.chatColumn}>
        <header className={styles.workspaceHeader}>
          <div className={styles.workspaceIdentity}>
            <span className={styles.smallMark}>
              <FlairMark />
            </span>
            <span className={styles.identityText}>
              <strong>Flair</strong>
              <small>by Flawdits</small>
            </span>
            <span className={styles.beta}>BETA</span>
          </div>
          <div className={styles.headerActions}>
            {/* Reuse Dashboard's support dialog from the header so its floating
                launcher cannot cover the mobile composer or report content. */}
            <button
              type="button"
              className={styles.iconButton}
              onClick={onOpenSupport}
              aria-label="Help and support"
              title="Help and support"
            >
              <HelpCircle size={17} />
            </button>
            {artifacts.length > 0 && (
              <button
                type="button"
                className={styles.quietButton}
                onClick={(event) =>
                  openArtifact(artifacts.at(-1).id, event.currentTarget)
                }
                aria-controls="agent-report-panel"
                aria-expanded={Boolean(selected)}
              >
                <PanelRight size={16} />
                <span>Reports</span>
                <span className={styles.count}>{artifacts.length}</span>
              </button>
            )}
            <button
              type="button"
              className={styles.quietButton}
              onClick={newChat}
              disabled={busy || voiceBusy}
              title="Start a new chat"
            >
              <Plus size={17} />
              <span>New chat</span>
            </button>
          </div>
        </header>

        {/* Product scope stays visible in both empty and ongoing conversations.
            This is release guidance, not a substitute for backend permissions. */}
        <div className={styles.betaNotice}>
          <span className={styles.betaNoticeLabel}>BETA</span>
          <p>
            Flair is in beta. AI can make mistakes; review your results.
            <span> Full Report is not available in Flair yet.</span>
          </p>
        </div>

        <div
          className={`${styles.chatStage} ${hasMessages ? styles.conversationStage : ""}`}
        >
          {!hasMessages ? (
            <div className={styles.welcome}>
              <div className={styles.heroMark} aria-hidden="true">
                <FlairMark />
              </div>
              <p className={styles.eyebrow}>
                MEET FLAIR. YOUR FLAWDITS COMPANION.
              </p>
              <h1>
                Less friction.
                <br />
                <span>A little more Flair.</span>
              </h1>
              <p className={styles.welcomeCopy}>
                Hi {username || "there"}. Tell me what you want to explore.
                <br className={styles.desktopBreak} /> I’ll find the right tools
                and bring the insights to you.
              </p>
              <div className={styles.starters}>
                {STARTERS.map(
                  ({ icon: Icon, label, description, prompt, tone }) => (
                    <button
                      type="button"
                      key={label}
                      onClick={() => chooseStarter(prompt)}
                      disabled={disabled}
                      className={styles.starter}
                    >
                      <span className={`${styles.starterIcon} ${styles[tone]}`}>
                        <Icon size={18} />
                      </span>
                      <strong>{label}</strong>
                      <span>{description}</span>
                      <ArrowUpRight size={15} className={styles.starterArrow} />
                    </button>
                  ),
                )}
              </div>
            </div>
          ) : (
            <div
              className={styles.transcript}
              ref={scrollRef}
              role="log"
              aria-label="Conversation"
              aria-live="polite"
              aria-relevant="additions"
              tabIndex={0}
            >
              <div className={styles.messageList}>
                {messages.map((message) => (
                  <article
                    key={message.id}
                    className={`${styles.message} ${message.role === "user" ? styles.userMessage : styles.assistantMessage}`}
                    aria-label={message.role === "user" ? "You" : "Flair"}
                    aria-busy={Boolean(message.streaming)}
                  >
                    {message.role === "assistant" && (
                      <div className={styles.assistantLabel}>
                        <span className={styles.replyMark}>
                          <FlairMark />
                        </span>
                        <span>Flair</span>
                        {STATUS_LABELS[message.status] && (
                          <span className={styles.statusLabel}>
                            {STATUS_LABELS[message.status]}
                          </span>
                        )}
                      </div>
                    )}
                    <AgentText text={message.text} />
                    {message.failed && (
                      <span className={styles.failedLabel}>
                        {message.role === "assistant"
                          ? "Reply interrupted"
                          : "No complete response received"}
                      </span>
                    )}
                    {message.artifactIds?.map((artifactId) => (
                      <button
                        key={artifactId}
                        type="button"
                        className={styles.artifactCard}
                        onClick={(event) =>
                          openArtifact(artifactId, event.currentTarget)
                        }
                        aria-controls="agent-report-panel"
                        aria-expanded={selectedId === artifactId}
                      >
                        <span className={styles.artifactIcon}>
                          <FileText size={21} />
                        </span>
                        <span>
                          <strong>
                            {
                              artifacts.find(
                                (artifact) => artifact.id === artifactId,
                              )?.title
                            }
                          </strong>
                          <small>
                            {message.status === "completed"
                              ? "Open report"
                              : "Inspect partial / unverified result"}
                          </small>
                        </span>
                        <ChevronRight size={17} />
                      </button>
                    ))}
                  </article>
                ))}
                {/* Display real backend phases until reply text begins. No timers
                    are used to invent completed tools or provider progress. */}
                {busy &&
                  !messages.some(
                    (message) => message.streaming && message.text,
                  ) && <FlairWorking active={active} progress={progress} />}
              </div>
            </div>
          )}

          <div className={styles.composerArea}>
            {disabled && (
              <p className={styles.error} role="alert">
                Your account is suspended. Contact support to use Flair.
              </p>
            )}
            {error && (
              <div className={styles.error} role="alert">
                <p>{error}</p>
                {lastInputRef.current && !busy && (
                  <button
                    type="button"
                    onClick={() => chooseStarter(lastInputRef.current)}
                  >
                    Edit last message
                  </button>
                )}
              </div>
            )}
            {/* Discoverable individual tools remain available during follow-ups;
                selecting one never runs a provider or submits an empty request. */}
            <details className={styles.auditDiscovery}>
              <summary>Explore supported audits</summary>
              <div>
                {AUDIT_PROMPTS.map(([label, prompt]) => (
                  <button
                    type="button"
                    key={label}
                    disabled={busy || disabled || voiceBusy}
                    onClick={() => chooseStarter(prompt)}
                  >
                    {label}
                    <ArrowUpRight size={12} />
                  </button>
                ))}
              </div>
            </details>
            <form className={styles.composer} onSubmit={sendMessage}>
              {/* Mount/open uploads only for a requested visual comparison or
                  an actual image clarification, never on ordinary chat entry. */}
              {showVisualInputs && (
                <AgentImages
                  images={images}
                  onChange={setImages}
                  disabled={busy || disabled || voiceBusy}
                />
              )}
              <label className={styles.srOnly} htmlFor="agent-message">
                Message Flair
              </label>
              <textarea
                id="agent-message"
                ref={composerRef}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={handleComposerKey}
                placeholder={
                  hasMessages
                    ? "Ask a follow-up or add a little more detail…"
                    : "Ask Flair to look into something…"
                }
                rows={2}
                maxLength={TASK_LIMIT}
                disabled={disabled || voiceBusy}
                aria-describedby="agent-composer-hint"
              />
              <div className={styles.composerFooter}>
                <span className={styles.composerHint}>
                  <Sparkles size={14} />A little clarity, on command.
                </span>
                <div className={styles.sendControls}>
                  {taskLength(draft) > 1600 && (
                    <span className={styles.characterCount}>
                      {taskLength(draft)}/{TASK_LIMIT}
                    </span>
                  )}
                  <VoiceInput
                    disabled={busy || disabled}
                    active={active}
                    onBusyChange={setVoicePending}
                    onTranscript={appendDictation}
                  />
                  {busy ? (
                    <button
                      type="button"
                      className={styles.sendButton}
                      onClick={() => requestRef.current?.abort()}
                      aria-label="Stop waiting for response"
                      title="Stop waiting (server work may continue)"
                    >
                      <Square size={14} fill="currentColor" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className={styles.sendButton}
                      disabled={!draft.trim() || disabled || voiceBusy}
                      aria-label="Send message"
                    >
                      <ArrowUp size={20} />
                    </button>
                  )}
                </div>
              </div>
            </form>
            <p className={styles.composerDisclaimer} id="agent-composer-hint">
              {hasMessages
                ? "AI can make mistakes. Review the sources behind your results."
                : "Individual audits, ad research, and answers. Just ask."}
              <span>Enter to send · Shift + Enter for a new line</span>
            </p>
          </div>
        </div>
      </div>
      {selected && (
        <AgentReportPanel
          artifact={selected}
          active={active}
          onClose={closeArtifact}
        />
      )}
    </section>
  );
}
