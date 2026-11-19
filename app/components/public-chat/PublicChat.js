"use client";

/**
 * Public-site Flawdits guide, mounted once by RootLayout. The outer gate excludes
 * private routes synchronously and checks the real cookie session before showing
 * the widget. ChatWidget owns ephemeral conversation state, streamed answer text,
 * contextual next-question buttons and accessible keyboard interactions. It never
 * persists messages, reads tokens, starts audits or touches dashboard support.
 */
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUp,
  ArrowUpRight,
  Check,
  Copy,
  CornerDownLeft,
  RotateCcw,
  Square,
  X,
} from "lucide-react";
import { browserFetch } from "../../features/auth/api";
import styles from "./PublicChat.module.css";
import { ChatStreamError, readChatStream } from "./chatStream";
import { createTextReveal } from "./textReveal";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
const STARTERS = [
  {
    label: "Find my starting point",
    question: "Which Flawdits audit should I start with?",
  },
  {
    label: "Explore the Full Report",
    question: "What does a Flawdits Full Report include?",
  },
  {
    label: "Understand the workflow",
    question: "How do I get started with Flawdits?",
  },
];

// ============================================================================
// PUBLIC ROUTE AND SESSION BOUNDARY
// This is a visibility rule, not authorization. Backend account APIs remain the
// authority. Unknown/unreachable session state hides the launcher conservatively.
// Routes and cross-tab auth changes unmount ChatWidget and clear its private state.
// ============================================================================
/** Show the guide only on public pages with a confirmed unauthenticated session. */
export default function PublicChat() {
  const pathname = usePathname();
  const [guest, setGuest] = useState(false);
  const excluded =
    !pathname ||
    ["/dashboard", "/admin", "/auth"].some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );

  useEffect(() => {
    if (excluded) return;
    let active = true;
    let controller;
    /** Recheck real cookie state without changing navigation hints or report data. */
    const verifyGuest = async () => {
      controller?.abort();
      controller = new AbortController();
      const current = controller;
      const timeout = setTimeout(() => current.abort(), 10000);
      try {
        const response = await browserFetch(
          `${API_BASE}/auth/session?kind=user`,
          { signal: current.signal },
        );
        if (active && controller === current) setGuest(response.status === 401);
      } catch {
        if (active && controller === current) setGuest(false);
      } finally {
        clearTimeout(timeout);
      }
    };
    /** Auth events carry no credentials; a server check decides widget visibility. */
    const onStorage = (event) => {
      if (!event.key || event.key === "flawdits_user_session_hint") {
        setGuest(false);
        verifyGuest();
      }
    };
    verifyGuest();
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", verifyGuest);
    window.addEventListener("auth-expired", verifyGuest);
    return () => {
      active = false;
      controller?.abort();
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", verifyGuest);
      window.removeEventListener("auth-expired", verifyGuest);
    };
  }, [excluded, pathname]);

  return !excluded && guest ? <ChatWidget /> : null;
}

// ============================================================================
// VISUAL IDENTITY
// A bespoke four-part aperture mark echoes discovery and focus without using a
// stock robot/message glyph. SVG is code-native, decorative and inherits color.
// ============================================================================
/** Render the guide's geometric mark in the launcher, header and assistant rows. */
function GuideMark() {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
      {[0, 90, 180, 270].map((angle) => (
        <path
          key={angle}
          transform={`rotate(${angle} 20 20)`}
          d="M20 3.5 30 13.5 25 18.5 20 13.5 15 18.5 10 13.5Z"
          fill="currentColor"
        />
      ))}
      <circle cx="20" cy="20" r="2.5" fill="currentColor" />
    </svg>
  );
}

// ============================================================================
// EPHEMERAL CONVERSATION AND REQUEST LIFECYCLE
// One bounded streamed request at a time; no stored conversations. Answer deltas
// are provisional until done; interrupted answers never become model history.
// The request ref blocks same-tick duplicate submissions and discards stale replies
// after reset, unmount or auth navigation. Retrying reuses the failed user turn.
// ============================================================================
/** Own the nonmodal guide panel and stream turns from the public RAG API. */
function ChatWidget() {
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [failedTurn, setFailedTurn] = useState(null);
  const [copied, setCopied] = useState(null);
  const launcher = useRef(null);
  const composer = useRef(null);
  const transcript = useRef(null);
  const request = useRef(null);
  const copyTimer = useRef(null);

  useEffect(
    () => () => {
      const current = request.current;
      request.current = null;
      current?.abort();
      clearTimeout(copyTimer.current);
    },
    [],
  );

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => composer.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (!composer.current) return;
    composer.current.style.height = "0px";
    composer.current.style.height = `${Math.min(composer.current.scrollHeight, 112)}px`;
  }, [draft, open]);

  useEffect(() => {
    if (transcript.current)
      transcript.current.scrollTo({
        top: transcript.current.scrollHeight,
        // Streamed chunks should track the bottom without stacking smooth-scroll
        // animations; completed turns retain the existing reduced-motion rule.
        behavior: reducedMotion || busy ? "instant" : "smooth",
      });
  }, [messages, busy, error, open, reducedMotion]);

  /** Collapse the nonmodal panel and restore focus to its launcher. */
  const close = () => {
    setOpen(false);
    launcher.current?.focus();
  };

  /** Clear this in-memory conversation; abort and ignore any previous response. */
  const reset = () => {
    const current = request.current;
    request.current = null;
    current?.abort();
    setMessages([]);
    setBusy(false);
    setError("");
    setFailedTurn(null);
    setDraft("");
    composer.current?.focus();
  };

  /** Send/retry a turn; keep only bounded history matching the backend schema. */
  const send = async (text, retry = null) => {
    const message = text.trim();
    if (!message || message.length > 2000 || request.current) return;
    const history =
      retry?.history ||
      messages
        .filter((item) => item.role === "user" || item.complete)
        .slice(-10)
        .map((item) => ({
          role: item.role,
          content: item.content.slice(0, 4000),
        }));
    // Each request owns one assistant row. Retry removes its interrupted row and
    // reuses the original user turn/history instead of duplicating the question.
    const assistantId = crypto.randomUUID();
    let partial = "";
    if (retry?.assistantId) {
      setMessages((previous) =>
        previous.filter((item) => item.id !== retry.assistantId),
      );
    }
    const controller = new AbortController();
    // Decouple fast network delivery from gentle display pacing. The helper's
    // abort signal shares Stop/reset/unmount cleanup with this request, and its
    // short time budget prevents long replies from adding a lengthy typing wait.
    const reveal = createTextReveal(
      (content) => {
        if (request.current !== controller) return;
        setMessages((previous) => {
          const row = {
            id: assistantId,
            role: "assistant",
            content,
            complete: false,
          };
          return previous.some((item) => item.id === assistantId)
            ? previous.map((item) => (item.id === assistantId ? row : item))
            : [...previous, row];
        });
      },
      { signal: controller.signal, reducedMotion },
    );
    request.current = controller;
    setBusy(true);
    setError("");
    setFailedTurn(null);
    setDraft("");
    if (!retry)
      setMessages((previous) => [
        ...previous,
        { id: crypto.randomUUID(), role: "user", content: message },
      ]);
    // Browser budget exceeds the backend's 55-second stream deadline. Stop or
    // navigation aborts fetch; the ASGI response closes Gemini and frees its slot.
    const timeout = setTimeout(() => controller.abort(), 75000);
    try {
      const response = await browserFetch(`${API_BASE}/public/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify({ message, history }),
        signal: controller.signal,
      });
      if (!response.ok) {
        throw new ChatStreamError(
          response.status === 429
            ? "A few too many questions at once. Pause for a moment, then try again."
            : "I couldn’t get a reply just now. Please try again.",
        );
      }
      // Network packets are not tokens or SSE frames. The reader decodes UTF-8
      // and frames; this callback only receives plain answer text, never raw JSON.
      const data = await readChatStream(response, (delta) => {
        if (request.current !== controller) return;
        partial += delta;
        if (partial.length > 12000)
          throw new ChatStreamError("That reply was too long. Try again.");
        reveal.push(partial);
      });
      // The server may finish before the short reveal animation. Await display
      // catch-up so the final row and suggestions do not snap in ahead of text.
      await reveal.finish(data.answer);
      if (request.current !== controller) return;
      // A done event confirms the schema and delivers contextual suggestions.
      // Replace provisional text with the authoritative normalized final answer.
      setMessages((previous) => {
        const row = {
          id: assistantId,
          role: "assistant",
          content: data.answer,
          suggestions: data.suggestions,
          complete: true,
        };
        return previous.some((item) => item.id === assistantId)
          ? previous.map((item) => (item.id === assistantId ? row : item))
          : [...previous, row];
      });
    } catch (failure) {
      if (request.current !== controller) return;
      setError(
        controller.signal.aborted
          ? "Reply stopped. You can try this question again."
          : failure instanceof ChatStreamError
            ? failure.message
            : "I couldn't get a reply just now. Please try again.",
      );
      // Keep partial text visible, but exclude it from future request history.
      // Retrying replaces this row; no automatic replay can duplicate model text.
      setFailedTurn({ message, history, assistantId });
    } finally {
      clearTimeout(timeout);
      reveal.dispose();
      if (request.current === controller) {
        request.current = null;
        setBusy(false);
        composer.current?.focus();
      }
    }
  };

  /** Copy an answer without storing it; failure leaves normal text selection usable. */
  const copyAnswer = async (item) => {
    try {
      await navigator.clipboard.writeText(item.content);
      setCopied(item.id);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopied(null);
    }
  };

  return (
    <div className={styles.widget}>
      <AnimatePresence>
        {open && (
          <motion.section
            id="flawdits-public-chat"
            className={styles.panel}
            role="dialog"
            aria-labelledby="flawdits-guide-title"
            initial={{
              opacity: 0,
              y: reducedMotion ? 0 : 16,
              scale: reducedMotion ? 1 : 0.97,
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
            transition={{
              duration: reducedMotion ? 0 : 0.22,
              ease: [0.22, 1, 0.36, 1],
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.stopPropagation();
                close();
              }
            }}
          >
            <header className={styles.header}>
              <span className={styles.headerMark}>
                <GuideMark />
              </span>
              <div className={styles.headerText}>
                <h2 id="flawdits-guide-title">Flawdits guide</h2>
                <p>A little clarity. Your next move.</p>
              </div>
              <button
                type="button"
                className={styles.iconButton}
                onClick={reset}
                aria-label="Start a new conversation"
                title="New conversation"
              >
                <RotateCcw size={16} />
              </button>
              <button
                type="button"
                className={styles.iconButton}
                onClick={close}
                aria-label="Close Flawdits guide"
              >
                <X size={19} />
              </button>
            </header>

            <div
              ref={transcript}
              className={styles.transcript}
              role="log"
              aria-label="Conversation"
              aria-live="polite"
              aria-relevant="additions text"
              aria-busy={busy}
            >
              {!messages.length && (
                <div className={styles.welcome}>
                  <div className={styles.orbit} aria-hidden="true">
                    <span />
                    <span />
                    <GuideMark />
                  </div>
                  <span className={styles.eyebrow}>
                    A clearer starting point
                  </span>
                  <h3>
                    Big picture.
                    <br />
                    <span>Small questions.</span>
                  </h3>
                  <p>
                    Find the right audit, explore a feature, or get to know
                    Flawdits. Where should we start?
                  </p>
                  <div className={styles.starters}>
                    {STARTERS.map((item, index) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => send(item.question)}
                      >
                        <span className={styles.number}>0{index + 1}</span>
                        <span>{item.label}</span>
                        <ArrowUpRight size={17} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((item, index) => (
                <div
                  key={item.id}
                  className={
                    item.role === "user"
                      ? styles.userTurn
                      : styles.assistantTurn
                  }
                >
                  {item.role === "assistant" && (
                    <span className={styles.answerLabel}>
                      <GuideMark /> FLAWDITS
                    </span>
                  )}
                  {/* Model/user strings remain escaped React text. Never interpret
                      HTML, remote markup, source filenames or tool output here. */}
                  <div className={styles.messageText}>{item.content}</div>
                  {item.role === "assistant" && item.complete && (
                    <button
                      type="button"
                      className={styles.copyButton}
                      onClick={() => copyAnswer(item)}
                      aria-label={
                        copied === item.id ? "Answer copied" : "Copy answer"
                      }
                    >
                      {copied === item.id ? (
                        <Check size={13} />
                      ) : (
                        <Copy size={13} />
                      )}{" "}
                      {copied === item.id ? "Copied" : "Copy"}
                    </button>
                  )}
                  {item.role === "assistant" &&
                    index === messages.length - 1 &&
                    !busy &&
                    item.suggestions?.length > 0 && (
                      <div className={styles.followUps}>
                        <span className={styles.followUpLabel}>
                          Take it a step further
                        </span>
                        {item.suggestions.map((question) => (
                          <button
                            key={question}
                            type="button"
                            onClick={() => send(question)}
                          >
                            {question}
                            <ArrowUpRight size={14} />
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              ))}
              {busy && messages[messages.length - 1]?.role !== "assistant" && (
                <div className={styles.thinking} role="status">
                  <span className={styles.thinkingMark}>
                    <GuideMark />
                  </span>
                  <span>
                    Connecting the dots
                    <span className={styles.dots} aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </span>
                  </span>
                </div>
              )}
              {error && (
                <div className={styles.error} role="alert">
                  <p>{error}</p>
                  {failedTurn && (
                    <button
                      type="button"
                      onClick={() => send(failedTurn.message, failedTurn)}
                    >
                      Try again <RotateCcw size={13} />
                    </button>
                  )}
                </div>
              )}
            </div>

            <form
              className={styles.composerArea}
              onSubmit={(event) => {
                event.preventDefault();
                send(draft);
              }}
            >
              <div className={styles.composerBox}>
                <label
                  className={styles.srOnly}
                  htmlFor="flawdits-guide-message"
                >
                  Your question about Flawdits
                </label>
                <textarea
                  ref={composer}
                  id="flawdits-guide-message"
                  value={draft}
                  maxLength={2000}
                  rows={1}
                  placeholder="What would you like to know?"
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" &&
                      !event.shiftKey &&
                      !event.nativeEvent.isComposing
                    ) {
                      event.preventDefault();
                      send(draft);
                    }
                  }}
                />
                {busy ? (
                  <button
                    className={styles.sendButton}
                    type="button"
                    aria-label="Stop generating the reply"
                    onClick={() => request.current?.abort()}
                  >
                    <Square size={14} fill="currentColor" />
                  </button>
                ) : (
                  <button
                    className={styles.sendButton}
                    type="submit"
                    disabled={!draft.trim()}
                    aria-label="Send question"
                  >
                    <ArrowUp size={19} />
                  </button>
                )}
              </div>
              <div className={styles.composerHint}>
                <span>Made for your next question.</span>
                <span>
                  {draft.length > 1600 ? (
                    `${draft.length}/2000`
                  ) : (
                    <>
                      <CornerDownLeft size={11} /> to send
                    </>
                  )}
                </span>
              </div>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
      <button
        ref={launcher}
        type="button"
        className={`${styles.launcher} ${open ? styles.launcherOpen : ""}`}
        aria-label={open ? "Close Flawdits guide" : "Ask the Flawdits guide"}
        aria-expanded={open}
        aria-controls="flawdits-public-chat"
        onClick={() => (open ? close() : setOpen(true))}
      >
        <span className={styles.launcherIcon}>
          {open ? <X size={23} /> : <GuideMark />}
        </span>
        <span className={styles.launcherLabel}>
          Ask Flawdits <ArrowUpRight size={14} />
        </span>
      </button>
    </div>
  );
}
