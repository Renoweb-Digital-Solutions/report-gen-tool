/**
 * Cookie-authenticated adapter for report_main.py's stateless task SSE endpoints.
 * AgentWorkspace supplies visible conversation text; this module enforces the
 * actual 2,000-character server limit and preserves structured failure results.
 * It never selects tools, invents progress, retries a task, or stores credentials.
 */
import { browserFetch, clearSessionHint } from "@/app/features/auth/api";
import { readAgentStream } from "./stream";

// ============================================================================
// REQUEST BOUNDARIES
// Python counts Unicode code points, so use Array.from rather than UTF-16 length.
// Real Website Anatomy reports run provider actors: allow 15 minutes for the
// controller's 14-minute budget plus knowledge retrieval and response transport.
// ============================================================================
export const TASK_LIMIT = 2000;
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

/** Count server-compatible characters for both the composer and request guard. */
export function taskLength(value) {
  return Array.from(value).length;
}

// ============================================================================
// REQUEST-LOCAL VISUAL INPUTS
// UI validation is a convenience; the authenticated backend repeats size/type
// checks. Files never enter localStorage, composeTask history, or JSON prompts.
// ============================================================================
/** Reject unsupported or oversized files before constructing a paid request. */
export function validateAgentImage(file) {
  if (
    !file ||
    !["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
    !file.size ||
    file.size > 8 * 1024 * 1024
  ) {
    throw new Error("Choose a PNG, JPEG or WebP image up to 8 MB.");
  }
}

/** Require the two named image roles together; return whether multipart is needed. */
export function validateAgentAttachments(images = {}) {
  const hasFiles = Boolean(images.website || images.moodboard);
  if (!hasFiles) return false;
  if (!images.website || !images.moodboard)
    throw new Error(
      "Attach both the website screenshot and Instagram moodboard for Visual Brand Match.",
    );
  validateAgentImage(images.website);
  validateAgentImage(images.moodboard);
  return true;
}

// ============================================================================
// DICTATION ONLY: NEVER DISPATCH AN AGENT TASK
// Receive bounded WAV data produced by voiceAudio, keep credentials server-side,
// and return draft text. The visitor must review and press Send separately.
// ============================================================================
/** Send VoiceInput's WAV with a 55-second budget; return text, never start a task. */
export async function transcribeVoice(audio, signal) {
  const controller = new AbortController();
  const abort = () => controller.abort();
  if (signal?.aborted) abort();
  signal?.addEventListener("abort", abort, { once: true });
  // Distinguish an intentional cancellation from the browser safety deadline so
  // the composer can offer useful recovery rather than reporting a false cancel.
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    abort();
  }, 55000);
  const body = new FormData();
  body.append("audio", audio, "voice.wav");
  try {
    const response = await browserFetch(`${BASE_URL}/agent/transcribe`, {
      method: "POST",
      body,
      signal: controller.signal,
    });
    if (response.status === 401) {
      clearSessionHint();
      window.dispatchEvent(new Event("auth-expired"));
      throw new Error(
        "Your session expired. Please sign in to use voice input.",
      );
    }
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const messages = {
        400: "That recording could not be read. Please record it again.",
        413: "Keep voice messages under 60 seconds.",
        422: "No speech was detected. Please try again.",
        429: "Please pause before recording another message.",
      };
      throw new Error(
        messages[response.status] ||
          "Voice input is temporarily unavailable. Please type your message or try again.",
      );
    }
    if (
      typeof data?.text !== "string" ||
      !data.text.trim() ||
      data.text.length > 12000
    )
      throw new Error("No clear speech was detected. Please try again.");
    return data.text.trim();
  } catch (error) {
    if (timedOut)
      throw new Error(
        "Transcription took too long. Please try again or type your message.",
      );
    if (controller.signal.aborted)
      throw new DOMException("Voice input stopped", "AbortError");
    if (error.name === "TypeError")
      throw new Error("Voice input could not connect. Please try again.");
    throw error;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", abort);
  }
}

/**
 * Re-submit visible conversation text because the backend has no conversation ID
 * or continuation API. Never silently truncate an original task or clarification.
 * Follow-ups can execute tools again; previous tool payloads are not replayed as
 * trusted results. A full context must fit the same bound as a standalone task.
 */
export function composeTask(messages, input) {
  const text = input.trim();
  if (!text) throw new Error("Write a message to get started.");
  const task = messages.length
    ? // Keep the latest request first: the backend's knowledge-only verifier checks
      // informational wording at the beginning, and the planner must distinguish
      // the current goal from prior conversation supplied only as context.
      `${text}\n\nPrevious conversation (context only; answer the latest request above):\n${messages.map((message) => `${message.role === "user" ? "User" : "Assistant"}: ${message.text}`).join("\n\n")}`
    : text;
  if (taskLength(task) > TASK_LIMIT) {
    throw new Error(
      "This conversation has reached its context limit. Start a new chat with your next request, or shorten your message.",
    );
  }
  return task;
}

/**
 * Send one task with the shared cookie/CSRF transport. Progress and reply deltas
 * arrive before a done frame containing the normal outcome and report artifacts.
 * Aborting closes the stream and cancels async task work; already-started
 * external provider jobs may continue. No task is automatically retried.
 * Timers and abort listeners are always released, including JSON/network failures.
 */
export async function runAgentTask(task, signal, images = {}, callbacks = {}) {
  // Guard the exported transport too, so future callers cannot bypass the same
  // request bound enforced by AgentWorkspace's conversation composer.
  if (
    typeof task !== "string" ||
    !task.trim() ||
    taskLength(task) > TASK_LIMIT
  ) {
    throw new Error("Send a nonempty request of at most 2,000 characters.");
  }
  // Keep the normal JSON contract for every text-only turn. When both images
  // exist, let fetch set the multipart boundary; never set Content-Type manually.
  const multipart = validateAgentAttachments(images);
  let body = JSON.stringify({ task });
  if (multipart) {
    body = new FormData();
    body.append("task", task);
    body.append("website_image", images.website);
    body.append("instagram_moodboard_image", images.moodboard);
  }
  const controller = new AbortController();
  let timedOut = false;
  const abort = () => controller.abort();
  if (signal?.aborted) abort();
  signal?.addEventListener("abort", abort, { once: true });
  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, 900_000);

  try {
    const response = await browserFetch(
      `${BASE_URL}/agent/${multipart ? "task-with-attachments" : "task"}/stream`,
      {
        method: "POST",
        headers: multipart
          ? { Accept: "text/event-stream" }
          : { "Content-Type": "application/json", Accept: "text/event-stream" },
        body,
        signal: controller.signal,
      },
    );
    if (response.status === 401) {
      clearSessionHint();
      window.dispatchEvent(new Event("auth-expired"));
      throw new Error("Your session has expired. Please sign in again.");
    }
    // HTTP admission/auth failures happen before SSE. Never replay automatically:
    // the request might already have created provider work or a report artifact.
    if (!response.ok) {
      throw new Error(
        response.status === 429
          ? "Too many requests. Please wait a moment before trying again."
          : "The agent could not respond. Please try again.",
      );
    }
    return await readAgentStream(response, callbacks);
  } catch (error) {
    if (controller.signal.aborted && !timedOut)
      throw new DOMException("Waiting stopped", "AbortError");
    if (timedOut) {
      throw new Error(
        "The agent is taking longer than expected. Waiting has stopped; the request may still finish on the server.",
      );
    }
    if (error.name === "TypeError") {
      throw new Error(
        "Could not reach the agent. Check your connection and try again.",
      );
    }
    throw error;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", abort);
  }
}
