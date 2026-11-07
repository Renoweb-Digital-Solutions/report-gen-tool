/**
 * Dashboard's primary, conversational Agentic workspace, mounted by dashboard/page.
 * Owns chat, the single in-flight request, first-message animation and artifacts;
 * api.js owns HTTP/auth semantics and AgentReportPanel owns result presentation.
 * State stays in memory while switching dashboard tabs, and clears on page exit.
 * The backend has no chat session, streaming feed or report history endpoint for
 * this feature: never present simulated tool activity or durable chat history.
 */
'use client';

import { useEffect, useRef, useState } from 'react';
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
} from 'lucide-react';
import {
  composeTask,
  runAgentTask,
  taskLength,
  TASK_LIMIT,
} from '@/app/features/agent/api';
import AgentReportPanel from './AgentReportPanel';
import AgentText from './AgentText';
import styles from './agent.module.css';

// ============================================================================
// CAPABILITY-ALIGNED STARTERS
// These only prefill the composer. They never execute paid/provider work before
// the user sends a message, and only describe registered tools or knowledge Q&A.
// ============================================================================
const STARTERS = [
  {
    icon: Globe,
    label: 'Understand my website',
    description: 'Find what needs attention',
    prompt:
      'Audit my website and summarize the most important issues. My website is ',
    tone: 'blue',
  },
  {
    icon: Megaphone,
    label: 'Explore competitor ads',
    description: 'See what others are running',
    prompt: 'Find Meta ads for ',
    tone: 'purple',
  },
  {
    icon: BookOpen,
    label: 'Make sense of a metric',
    description: 'Turn audit jargon into insight',
    prompt: 'Explain what website health score means and how to interpret it.',
    tone: 'peach',
  },
];
const STATUS_LABELS = {
  needs_input: 'A little more detail',
  needs_verification: 'Not yet verified',
  rejected: 'Request could not proceed',
  failed: 'Could not complete',
};

/** Derive an artifact label from the actual returned tool, never the intended prompt. */
function artifactTitle(result) {
  return result.tool === 'website.report'
    ? 'Website Anatomy'
    : result.tool === 'website.audit'
      ? 'Website intelligence'
      : result.tool === 'ads_library.search'
        ? 'Ads library results'
        : 'Agent result';
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
  const [messages, setMessages] = useState([]);
  const [artifacts, setArtifacts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [firstSend, setFirstSend] = useState(false);
  const composerRef = useRef(null);
  const scrollRef = useRef(null);
  const requestRef = useRef(null);
  const epochRef = useRef(0);
  const openerRef = useRef(null);
  const lastInputRef = useRef('');
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
    onBusyChange(busy);
  }, [busy, onBusyChange]);

  useEffect(() => {
    if (active && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, busy, active]);

  useEffect(() => {
    const textarea = composerRef.current;
    if (!textarea || !active) return;
    // Pixel limits match CSS: grow for multiline input, then scroll internally.
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  }, [draft, active]);

  /** Focus a starter's editable prompt rather than submitting it automatically. */
  function chooseStarter(prompt) {
    setDraft(prompt);
    setError('');
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
    if (requestRef.current) return;
    setMessages([]);
    setArtifacts([]);
    setSelectedId(null);
    setDraft('');
    setError('');
    setFirstSend(false);
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
    if (requestRef.current || disabled) return;
    const input = draft.trim();
    let task;
    try {
      task = composeTask(
        messages.filter((message) => !message.failed),
        input,
      );
    } catch (validationError) {
      setError(validationError.message);
      composerRef.current?.focus();
      return;
    }
    const controller = new AbortController();
    requestRef.current = controller;
    const epoch = ++epochRef.current;
    const userId = crypto.randomUUID();
    lastInputRef.current = input;
    setMessages((previous) => [
      ...previous,
      { id: userId, role: 'user', text: input },
    ]);
    setDraft('');
    setError('');
    setBusy(true);
    if (!hasMessages) setFirstSend(true);

    try {
      const result = await runAgentTask(task, controller.signal);
      if (epoch !== epochRef.current) return;
      const replyId = crypto.randomUUID();
      // Full HTML bypasses model history. Retain every server-generated document
      // rather than fabricating a report from the model summary or crawl scores.
      const documents = Array.isArray(result.artifacts)
        ? result.artifacts.filter(
            (document) =>
              document.type === 'website_anatomy' &&
              typeof document.html_report === 'string' &&
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
          ['success', 'partial'].includes(envelope.status) &&
          envelope.data &&
          typeof envelope.data === 'object',
      );
      const replyArtifactIds = documentArtifacts.length
        ? documentArtifacts.map((artifact) => artifact.id)
        : hasArtifact
          ? [replyId]
          : [];
      setMessages((previous) => [
        ...previous,
        {
          id: replyId,
          role: 'assistant',
          text: result.message,
          status: result.status,
          artifactIds: replyArtifactIds,
        },
      ]);
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
          message.id === userId ? { ...message, failed: true } : message,
        ),
      );
      setError(
        requestError.name === 'AbortError'
          ? 'Stopped waiting. The request may still finish on the server.'
          : requestError.message,
      );
    } finally {
      if (epoch === epochRef.current) {
        requestRef.current = null;
        setBusy(false);
      }
    }
  }

  /** Submit Enter, preserve Shift+Enter and IME composition for multilingual input. */
  function handleComposerKey(event) {
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <section
      className={`${styles.workspace} ${selected ? styles.withReport : ''} ${firstSend ? styles.firstSend : ''}`}
      aria-label="Agentic workspace"
    >
      {/* Decorative layers never intercept input. CSS disables motion on request. */}
      <div
        className={styles.ambient}
        aria-hidden="true"
        onAnimationEnd={() => setFirstSend(false)}
      />
      <div className={styles.chatColumn}>
        <header className={styles.workspaceHeader}>
          <div className={styles.workspaceIdentity}>
            <span className={styles.smallMark}>
              <Sparkles size={16} />
            </span>
            <span>
              Flawdits <strong>Agentic</strong>
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
              disabled={busy}
              title="Start a new chat"
            >
              <Plus size={17} />
              <span>New chat</span>
            </button>
          </div>
        </header>

        <div
          className={`${styles.chatStage} ${hasMessages ? styles.conversationStage : ''}`}
        >
          {!hasMessages ? (
            <div className={styles.welcome}>
              <div className={styles.heroMark} aria-hidden="true">
                <Sparkles size={32} strokeWidth={1.35} />
              </div>
              <p className={styles.eyebrow}>
                LESS FILLING FORMS. MORE MOVING FORWARD.
              </p>
              <h1>
                A little conversation.
                <br />
                <span>A clearer direction.</span>
              </h1>
              <p className={styles.welcomeCopy}>
                Hi {username || 'there'}. Tell me what you want to explore.
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
                    className={`${styles.message} ${message.role === 'user' ? styles.userMessage : styles.assistantMessage}`}
                    aria-label={
                      message.role === 'user' ? 'You' : 'Flawdits Agentic'
                    }
                  >
                    {message.role === 'assistant' && (
                      <div className={styles.assistantLabel}>
                        <Sparkles size={15} />
                        <span>Flawdits</span>
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
                        No response received
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
                            {message.status === 'completed'
                              ? 'Open report'
                              : 'Inspect partial / unverified result'}
                          </small>
                        </span>
                        <ChevronRight size={17} />
                      </button>
                    ))}
                  </article>
                ))}
                {busy && (
                  <div className={styles.working} role="status">
                    <span className={styles.workingMark}>
                      <Sparkles size={18} />
                    </span>
                    <div>
                      <strong>Working on your request</strong>
                      <span>
                        I’ll bring the results here when they’re ready.
                      </span>
                    </div>
                    <span className={styles.dots} aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className={styles.composerArea}>
            {disabled && (
              <p className={styles.error} role="alert">
                Your account is suspended. Contact support to use Agentic.
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
            <form className={styles.composer} onSubmit={sendMessage}>
              <label className={styles.srOnly} htmlFor="agent-message">
                Message Flawdits Agentic
              </label>
              <textarea
                id="agent-message"
                ref={composerRef}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={handleComposerKey}
                placeholder={
                  hasMessages
                    ? 'Ask a follow-up or add a little more detail…'
                    : 'What would you like to explore today?'
                }
                rows={2}
                maxLength={TASK_LIMIT}
                disabled={disabled}
                aria-describedby="agent-composer-hint"
              />
              <div className={styles.composerFooter}>
                <span className={styles.composerHint}>
                  <Sparkles size={14} />
                  Your goal. The right tools.
                </span>
                <div className={styles.sendControls}>
                  {taskLength(draft) > 1600 && (
                    <span className={styles.characterCount}>
                      {taskLength(draft)}/{TASK_LIMIT}
                    </span>
                  )}
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
                      disabled={!draft.trim() || disabled}
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
                ? 'AI can make mistakes. Review the sources behind your results.'
                : 'Website insights, ad research, and answers. Just ask.'}
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
