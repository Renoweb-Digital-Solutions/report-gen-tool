/**
 * Per-turn word pacing for AgentWorkspace's real streamed reply. Network chunks
 * enter push immediately; display updates advance complete words every 26 ms.
 * A growing backlog increases words per tick and flushes after 1.8 seconds from
 * first text, so animation adds a light cadence instead of a long typing delay.
 * Stop/reset/unmount share the request AbortSignal. Reduced motion shows text
 * immediately. No API calls, persistence or timers survive the controller's owner.
 */

// ============================================================================
// COMPLETE-WORD DISPLAY QUEUE
// Keep a trailing incomplete network word buffered until more text or finish.
// Final authoritative text can replace a provisional reply after verification.
// ============================================================================
export function createWordReveal(onReveal, { signal, reducedMotion }) {
  let target = "";
  let tokens = [];
  let shown = 0;
  let first = null;
  let timer = null;
  let stopped = false;
  let finishing = false;
  let waiter = null;

  /** Advance words without splitting emoji/surrogate pairs or delaying the reader. */
  const tick = () => {
    timer = null;
    if (stopped) return;
    const left = tokens.length - shown;
    const step =
      reducedMotion || performance.now() - first >= 1800
        ? left
        : Math.max(1, Math.ceil(left / 24));
    shown = Math.min(tokens.length, shown + step);
    onReveal(tokens.slice(0, shown).join(""));
    if (shown < tokens.length) timer = setTimeout(tick, 26);
    else if (finishing && waiter) {
      waiter.resolve();
      waiter = null;
    }
  };

  /** Buffer a full text snapshot while the API continues consuming its stream. */
  const push = (text) => {
    if (stopped) return;
    if (!text.startsWith(target)) shown = 0;
    target = text;
    tokens = text.match(/\S+\s*|\s+/gu) || [];
    if (
      !finishing &&
      !reducedMotion &&
      tokens.length &&
      !/\s$/u.test(tokens.at(-1))
    )
      tokens.pop();
    shown = Math.min(shown, tokens.length);
    if (first === null) first = performance.now();
    if (timer === null) tick();
  };

  /** Cancel pending display work and wake a caller awaiting finish, if present. */
  const dispose = () => {
    stopped = true;
    clearTimeout(timer);
    signal.removeEventListener("abort", dispose);
    waiter?.reject(new DOMException("Reply stopped", "AbortError"));
    waiter = null;
  };
  signal.addEventListener("abort", dispose, { once: true });
  if (signal.aborted) dispose();
  return {
    push,
    dispose,
    /** Let the caller publish status/artifacts only after final text is visible. */
    finish(text) {
      if (stopped)
        return Promise.reject(new DOMException("Reply stopped", "AbortError"));
      finishing = true;
      return new Promise((resolve, reject) => {
        waiter = { resolve, reject };
        push(text);
      });
    },
  };
}
