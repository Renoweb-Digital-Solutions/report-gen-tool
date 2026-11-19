/**
 * SSE reader for api.runAgentTask's authenticated POST response. It separates
 * UTF-8 packets from event frames and reports only public progress/text callbacks.
 * The final done frame keeps status, tool data and every report document together.
 * No event is trusted as completed until done; EOF/error is an interrupted turn.
 * The caller's AbortSignal cancels fetch, and finally releases the response reader.
 */
const OUTCOMES = new Set([
  "completed",
  "needs_input",
  "needs_verification",
  "rejected",
  "failed",
]);

// ============================================================================
// NETWORK FRAMING, NOT DISPLAY PACING
// A 64 MiB wire cap accommodates the existing five 5 MB HTML artifact budget plus
// JSON escaping. Word reveal runs separately so it never slows network consumption.
// ============================================================================
export async function readAgentStream(response, { onDelta, onProgress } = {}) {
  if (
    !response.body ||
    !response.headers.get("content-type")?.includes("text/event-stream")
  ) {
    throw new Error("The reply did not come through. Please try again.");
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) throw new Error("The reply was interrupted. Please try again.");
      bytes += value.byteLength;
      if (bytes > 64 * 1024 * 1024)
        throw new Error(
          "This response was too large. Please try a smaller request.",
        );
      buffer += decoder.decode(value, { stream: true });
      let boundary;
      while ((boundary = buffer.indexOf("\n\n")) >= 0) {
        const frame = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);
        let event = "";
        const lines = [];
        for (const line of frame.split("\n")) {
          if (line.startsWith("event:")) event = line.slice(6).trim();
          if (line.startsWith("data:")) lines.push(line.slice(5).trimStart());
        }
        if (!lines.length) continue; // Connected/idle heartbeat comments.
        let data;
        try {
          data = JSON.parse(lines.join("\n"));
        } catch {
          throw new Error("The reply was interrupted. Please try again.");
        }
        if (!data || typeof data !== "object" || event === "error")
          throw new Error("The reply was interrupted. Please try again.");
        if (
          event === "progress" &&
          typeof data.label === "string" &&
          data.label.length <= 160
        ) {
          onProgress?.(data.label);
        } else if (event === "delta" && typeof data.text === "string") {
          onDelta?.(data.text);
        } else if (
          event === "done" &&
          OUTCOMES.has(data.status) &&
          typeof data.message === "string"
        ) {
          return data;
        } else {
          throw new Error("The reply was interrupted. Please try again.");
        }
      }
    }
  } finally {
    try {
      await reader.cancel();
    } finally {
      reader.releaseLock();
    }
  }
}
