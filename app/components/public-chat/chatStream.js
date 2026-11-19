/**
 * POST-based SSE reader consumed by PublicChat.send. The backend emits decoded
 * answer deltas followed by a validated done event containing answer/suggestions.
 * This module handles transport framing only; it owns no React state, credentials
 * or persistence. browserFetch supplies the existing cookie/CSRF transport.
 * Never assume HTTP chunks match events: UTF-8 characters and SSE frames can be
 * split anywhere. Server errors remain generic and raw response bodies stay out
 * of the UI. The caller's AbortController owns Stop/reset/navigation cancellation.
 */

// ============================================================================
// INCREMENTAL UTF-8 AND SSE FRAMING
// Exactly one done event confirms success. EOF without it is an interrupted reply,
// even if useful provisional text has already appeared in the assistant bubble.
// ============================================================================
/** Mark intentionally public errors; unexpected browser errors remain generic. */
export class ChatStreamError extends Error {}

/** Read one response, publish text deltas, and return the final validated reply. */
export async function readChatStream(response, onDelta) {
  if (
    !response.body ||
    !response.headers.get("content-type")?.includes("text/event-stream")
  ) {
    throw new ChatStreamError(
      "That reply did not come through. Please try again.",
    );
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let received = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done)
        throw new ChatStreamError(
          "The reply was interrupted. Please try again.",
        );
      // Streaming decoding preserves Unicode split across network packets.
      // The 256 KiB wire budget bounds framing overhead as well as answer text;
      // the backend independently enforces its stricter answer/schema limits.
      received += value.byteLength;
      if (received > 262144)
        throw new ChatStreamError("That reply was too long. Try again.");
      buffer += decoder.decode(value, { stream: true });
      let boundary;
      while ((boundary = buffer.indexOf("\n\n")) !== -1) {
        const frame = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);
        let event = "";
        const data = [];
        for (const line of frame.split("\n")) {
          if (line.startsWith("event:")) event = line.slice(6).trim();
          if (line.startsWith("data:")) data.push(line.slice(5).trimStart());
        }
        // Initial keepalive comments and future heartbeat comments have no data.
        if (!data.length) continue;
        let payload;
        try {
          payload = JSON.parse(data.join("\n"));
        } catch {
          throw new ChatStreamError(
            "The reply was interrupted. Please try again.",
          );
        }
        if (!payload || typeof payload !== "object") {
          throw new ChatStreamError(
            "The reply was interrupted. Please try again.",
          );
        }
        if (event === "error") {
          // Do not trust arbitrary server/provider text as a user-facing error.
          throw new ChatStreamError(
            "The reply was interrupted. Please try again.",
          );
        }
        if (event === "delta" && typeof payload.text === "string") {
          onDelta(payload.text);
        } else if (
          event === "done" &&
          typeof payload.answer === "string" &&
          payload.answer.trim() &&
          payload.answer.length <= 12000 &&
          Array.isArray(payload.suggestions) &&
          payload.suggestions.length === 3 &&
          payload.suggestions.every(
            (item) =>
              typeof item === "string" && item.trim() && item.length <= 120,
          )
        ) {
          return payload;
        } else {
          throw new ChatStreamError(
            "The reply was interrupted. Please try again.",
          );
        }
      }
    }
  } finally {
    // Stop reading after completion/error. Abort also rejects reader.read; always
    // release its lock so reset/unmount cannot leave a dangling response reader.
    try {
      await reader.cancel();
    } finally {
      reader.releaseLock();
    }
  }
}
