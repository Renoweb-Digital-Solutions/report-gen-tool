/**
 * Lightweight display pacing for PublicChat.send's real streamed answer text.
 * Network reading continues at full speed; this controller reveals buffered text
 * in small steps and lets send await the final visible answer before suggestions.
 * It owns only a per-turn timer, never API work, React state or stored messages.
 * Stop/reset/unmount share the request AbortSignal, so pending animation and its
 * completion promise cannot survive the turn. Reduced motion bypasses all delay.
 */

// ============================================================================
// BOUNDED TEXT REVEAL
// A 20 ms tick adds gentle motion. An adaptive step catches up on larger replies,
// and 1,800 ms after first text we flush any backlog instead of imposing a long
// artificial wait. Slower live streams beyond that point display immediately.
// ============================================================================
const TICK_MS = 20;
const MAX_REVEAL_MS = 1800;

/** Create an abortable, per-turn reveal queue; onReveal receives full visible text. */
export function createTextReveal(onReveal, { signal, reducedMotion }) {
  let target = [];
  let visible = 0;
  let started = null;
  let timer = null;
  let stopped = false;
  let completion = null;

  /** Advance one display step without splitting a Unicode surrogate pair. */
  const tick = () => {
    timer = null;
    if (stopped) return;
    const remaining = target.length - visible;
    const elapsed = performance.now() - started;
    // Larger buffers reveal more per tick. The hard time budget prevents a long
    // answer from becoming a slow character-by-character typing demonstration.
    const step =
      reducedMotion || elapsed >= MAX_REVEAL_MS
        ? remaining
        : Math.max(3, Math.ceil(remaining / 18));
    visible = Math.min(target.length, visible + step);
    onReveal(target.slice(0, visible).join(""));
    if (visible < target.length) {
      timer = setTimeout(tick, TICK_MS);
    } else if (completion) {
      completion.resolve();
      completion = null;
    }
  };

  /** Replace the buffered snapshot; keep consuming SSE independently of pacing. */
  const push = (text) => {
    if (stopped) return;
    // Array.from groups Unicode code points, preserving non-BMP emoji when a
    // display step falls near them. It is not a language-specific word tokenizer.
    target = Array.from(text);
    visible = Math.min(visible, target.length);
    if (started === null) started = performance.now();
    if (timer === null) tick();
  };

  /** Stop timers and reject only an existing waiter; no detached rejected promise. */
  const dispose = () => {
    stopped = true;
    clearTimeout(timer);
    timer = null;
    signal.removeEventListener("abort", dispose);
    completion?.reject(new DOMException("Reply stopped", "AbortError"));
    completion = null;
  };
  signal.addEventListener("abort", dispose, { once: true });
  if (signal.aborted) dispose();

  return {
    push,
    /** Wait until the authoritative final answer is visible before showing prompts. */
    finish(text) {
      if (stopped)
        return Promise.reject(new DOMException("Reply stopped", "AbortError"));
      return new Promise((resolve, reject) => {
        completion = { resolve, reject };
        push(text);
      });
    },
    dispose,
  };
}
