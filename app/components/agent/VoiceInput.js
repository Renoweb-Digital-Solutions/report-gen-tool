"use client";

/**
 * Flair's explicit push-to-talk input, rendered beside the composer's Send button.
 * Owns permission, local recording, live amplitude, WAV conversion and a single
 * transcription request. AgentWorkspace accepts text into its editable draft;
 * this component never submits a chat task or starts an audit. Stop releases mic
 * tracks immediately. Cancel, hidden tabs, module changes and unmount invalidate
 * pending callbacks, stop capture and abort browser delivery. No audio is stored.
 */
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Copy, LoaderCircle, Mic, Square, X } from "lucide-react";
import { transcribeVoice } from "@/app/features/agent/api";
import { VOICE_SECONDS, voiceToWav } from "./voiceAudio";
import styles from "./voice.module.css";

// ============================================================================
// RESOURCE OWNERSHIP
// MediaRecorder emits its final data asynchronously after stop(). Keep the
// AudioContext until decoding finishes, but release actual input tracks first.
// ============================================================================
function releaseCapture(session, closeContext = true) {
  if (!session) return;
  cancelAnimationFrame(session.frame);
  clearInterval(session.timer);
  session.stream?.getTracks().forEach((track) => track.stop());
  session.source?.disconnect();
  if (closeContext && session.context?.state !== "closed")
    session.context?.close().catch(() => {});
}

/** Record a short message and offer editable transcription without auto-send. */
export default function VoiceInput({
  disabled,
  active,
  onBusyChange,
  onTranscript,
}) {
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState("idle");
  const [seconds, setSeconds] = useState(0);
  const [level, setLevel] = useState(0);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const [copied, setCopied] = useState(false);
  const sessionRef = useRef(null);
  const requestRef = useRef(null);
  const epoch = useRef(0);
  const alive = useRef(true);
  const insert = useRef(onTranscript);
  const copyTimer = useRef(null);
  const micButton = useRef(null);

  useEffect(() => {
    insert.current = onTranscript;
  }, [onTranscript]);

  /** Invalidate late permissions/provider responses before stopping their resources. */
  function cancel(message = "") {
    epoch.current += 1;
    const session = sessionRef.current;
    sessionRef.current = null;
    if (session?.recorder?.state === "recording") session.recorder.stop();
    releaseCapture(session);
    requestRef.current?.abort();
    requestRef.current = null;
    if (alive.current) {
      setPhase("idle");
      setLevel(0);
      setError(message);
      setPreview("");
      onBusyChange(false);
    }
  }

  useEffect(() => {
    alive.current = true;
    /** Background microphone recording is never intentional in this composer. */
    const visibility = () => {
      if (document.hidden) cancel();
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      alive.current = false;
      cancel();
      clearTimeout(copyTimer.current);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  useEffect(() => {
    if (!active || disabled) cancel();
  }, [active, disabled]);

  /** Stop capture now; the recorder's final event starts local decode/transcription. */
  function stop() {
    const session = sessionRef.current;
    if (session?.recorder?.state !== "recording") return;
    session.recorder.stop();
    releaseCapture(session, false);
  }

  /** Convert/transcribe one recording; ignore stale results after cancel/navigation. */
  async function finish(session, token) {
    releaseCapture(session, false);
    if (!alive.current || token !== epoch.current) {
      releaseCapture(session);
      return;
    }
    setPhase("transcribing");
    setLevel(0);
    const controller = new AbortController();
    requestRef.current = controller;
    try {
      const blob = new Blob(session.chunks, {
        type: session.recorder.mimeType,
      });
      const wav = await voiceToWav(blob, session.context);
      releaseCapture(session);
      if (!alive.current || token !== epoch.current) return;
      const text = await transcribeVoice(wav, controller.signal);
      if (!alive.current || token !== epoch.current) return;
      setPhase("idle");
      onBusyChange(false);
      // Never truncate dictated text to fit an existing long draft. Preserve it
      // in an editable/copyable preview until the visitor makes space or cancels.
      if (!insert.current(text)) {
        setPreview(text);
        setError(
          "Your draft is nearly full. Shorten it, then add this transcript.",
        );
      }
    } catch (failure) {
      if (
        alive.current &&
        token === epoch.current &&
        !controller.signal.aborted
      ) {
        setError(
          failure.message || "Voice input could not finish. Please try again.",
        );
        setPhase("idle");
        onBusyChange(false);
      }
    } finally {
      releaseCapture(session);
      if (sessionRef.current === session) sessionRef.current = null;
      if (requestRef.current === controller) requestRef.current = null;
    }
  }

  /** Start only from a direct visitor action; never request microphone on mount. */
  async function begin() {
    // Refs close the same-render double-click race before React commits phase.
    if (
      !active ||
      disabled ||
      phase !== "idle" ||
      sessionRef.current ||
      requestRef.current
    )
      return;
    const Context = window.AudioContext || window.webkitAudioContext;
    const Offline =
      window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (
      !window.isSecureContext ||
      !navigator.mediaDevices?.getUserMedia ||
      !window.MediaRecorder ||
      !Context ||
      !Offline
    ) {
      setError(
        "Voice input needs microphone support on HTTPS or localhost. You can still type your message.",
      );
      return;
    }
    const token = ++epoch.current;
    const session = { chunks: [], bytes: 0 };
    sessionRef.current = session;
    setError("");
    setPreview("");
    setSeconds(0);
    setPhase("permission");
    onBusyChange(true);
    try {
      session.context = new Context();
      // Resume within the click gesture for browsers that suspend new contexts.
      await session.context.resume();
      // Cancel may run while the browser resumes its audio subsystem. Do not
      // open a later permission prompt for an already abandoned recording.
      if (!alive.current || token !== epoch.current) {
        releaseCapture(session);
        return;
      }
      session.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          channelCount: 1,
        },
      });
      if (!alive.current || token !== epoch.current) {
        releaseCapture(session);
        return;
      }
      const mimeType = [
        "audio/webm;codecs=opus",
        "audio/mp4",
        "audio/ogg;codecs=opus",
      ].find((type) => MediaRecorder.isTypeSupported(type));
      session.recorder = new MediaRecorder(
        session.stream,
        mimeType ? { mimeType } : undefined,
      );
      session.recorder.ondataavailable = (event) => {
        if (token !== epoch.current || !event.data.size) return;
        session.bytes += event.data.size;
        if (session.bytes > 8 * 1024 * 1024) {
          cancel("That recording was too large. Please try a shorter message.");
          return;
        }
        session.chunks.push(event.data);
      };
      session.recorder.onstop = () => finish(session, token);
      session.recorder.onerror = () =>
        cancel("The microphone stopped unexpectedly. Please try again.");
      session.source = session.context.createMediaStreamSource(session.stream);
      session.analyser = session.context.createAnalyser();
      session.analyser.fftSize = 256;
      session.source.connect(session.analyser); // No connection to speakers/feedback.
      const samples = new Uint8Array(session.analyser.fftSize);
      let painted = 0;
      /** Sample actual microphone amplitude at about 10 Hz; animation is cosmetic. */
      const meter = (now) => {
        if (token !== epoch.current || session.recorder.state !== "recording")
          return;
        if (now - painted >= 100) {
          session.analyser.getByteTimeDomainData(samples);
          const energy = samples.reduce(
            (sum, value) => sum + ((value - 128) / 128) ** 2,
            0,
          );
          setLevel(Math.min(1, Math.sqrt(energy / samples.length) * 6));
          painted = now;
        }
        session.frame = requestAnimationFrame(meter);
      };
      session.recorder.start(250);
      session.started = performance.now();
      setPhase("recording");
      session.frame = requestAnimationFrame(meter);
      session.timer = setInterval(() => {
        const elapsed = (performance.now() - session.started) / 1000;
        setSeconds(Math.min(VOICE_SECONDS, Math.floor(elapsed)));
        if (elapsed >= VOICE_SECONDS) stop();
      }, 100);
    } catch (failure) {
      releaseCapture(session);
      if (alive.current && token === epoch.current) {
        sessionRef.current = null;
        const message =
          failure.name === "NotAllowedError"
            ? "Microphone access was denied. Allow it in your browser settings to dictate."
            : failure.name === "NotFoundError"
              ? "No microphone was found. Connect one or type your message."
              : "The microphone could not start. Please try again.";
        setError(message);
        setPhase("idle");
        onBusyChange(false);
      }
    }
  }

  /** Copy a retained transcript without submitting it; allow ordinary selection too. */
  async function copyTranscript() {
    try {
      await navigator.clipboard.writeText(preview);
      setCopied(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      setError("Select the transcript text to copy it.");
    }
  }

  const pending = phase !== "idle";
  const open = pending || Boolean(error || preview);
  return (
    <div className={styles.voice}>
      <button
        type="button"
        ref={micButton}
        className={`${styles.micButton} ${pending ? styles.micActive : ""}`}
        disabled={
          disabled || phase === "permission" || phase === "transcribing"
        }
        onClick={phase === "recording" ? stop : begin}
        aria-label={
          phase === "recording"
            ? "Stop recording and transcribe"
            : "Dictate a message"
        }
        aria-pressed={phase === "recording"}
        title={
          phase === "recording" ? "Stop and transcribe" : "Dictate a message"
        }
      >
        {phase === "transcribing" || phase === "permission" ? (
          <LoaderCircle className={styles.spinner} size={17} />
        ) : phase === "recording" ? (
          <Square size={13} fill="currentColor" />
        ) : (
          <Mic size={18} />
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.tray}
            initial={{
              opacity: 0,
              y: reducedMotion ? 0 : 9,
              scale: reducedMotion ? 1 : 0.97,
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : 5 }}
            transition={{ duration: reducedMotion ? 0 : 0.2 }}
          >
            <div className={styles.trayHeader}>
              <span className={styles.voiceGlyph}>
                <Mic size={17} />
              </span>
              <div>
                <strong>
                  {phase === "recording"
                    ? "Your voice. Your next move."
                    : phase === "permission"
                      ? "Allow your microphone"
                      : phase === "transcribing"
                        ? "Turning your words into text"
                        : preview
                          ? "Your transcript"
                          : "Voice input"}
                </strong>
                <span>
                  {phase === "recording"
                    ? "Speak naturally. Stop when you’re ready."
                    : phase === "transcribing"
                      ? "You’ll be able to review it before sending."
                      : phase === "permission"
                        ? "Use your browser’s microphone prompt."
                        : "You’re always in control of what gets sent."}
                </span>
              </div>
              <button
                type="button"
                className={styles.cancel}
                onClick={() => {
                  cancel();
                  micButton.current?.focus();
                }}
                aria-label="Cancel voice input"
              >
                <X size={16} />
              </button>
            </div>
            {phase === "recording" && (
              <div className={styles.capture}>
                <span className={styles.recordDot} />
                <time aria-label={`${seconds} seconds recorded`}>
                  {String(Math.floor(seconds / 60)).padStart(2, "0")}:
                  {String(seconds % 60).padStart(2, "0")}
                </time>
                <div className={styles.wave} aria-hidden="true">
                  {[0.35, 0.65, 0.9, 0.55, 1, 0.7, 0.9, 0.5, 0.3].map(
                    (weight, index) => (
                      <i
                        key={index}
                        style={{ "--bar-level": 0.12 + level * weight * 0.88 }}
                      />
                    ),
                  )}
                </div>
                <button type="button" className={styles.finish} onClick={stop}>
                  <Check size={15} /> Done
                </button>
              </div>
            )}
            {(phase === "transcribing" || phase === "permission") && (
              <div className={styles.processing}>
                <span />
                <span />
                <span />
              </div>
            )}
            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}
            {preview && (
              <div className={styles.preview}>
                <textarea
                  aria-label="Voice transcript"
                  value={preview}
                  onChange={(event) => setPreview(event.target.value)}
                />
                <div>
                  <button type="button" onClick={copyTranscript}>
                    {copied ? <Check size={13} /> : <Copy size={13} />}{" "}
                    {copied ? "Copied" : "Copy"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (insert.current(preview)) {
                        setPreview("");
                        setError("");
                      }
                    }}
                  >
                    Add to message
                  </button>
                </div>
              </div>
            )}
            <span className={styles.note}>
              {phase === "recording"
                ? "Up to 60 seconds · microphone stops when you stop"
                : "Transcription only. Nothing is sent as a chat message."}
            </span>
            <span className={styles.srOnly} role="status">
              {phase === "recording"
                ? "Recording started."
                : phase === "transcribing"
                  ? "Recording stopped. Transcribing."
                  : phase === "permission"
                    ? "Waiting for microphone permission."
                    : "Voice input ready."}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
