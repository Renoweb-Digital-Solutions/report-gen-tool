/**
 * Encode MediaRecorder output into Flair's bounded transcription wire format.
 * VoiceInput supplies the locally recorded Blob and its AudioContext after Stop.
 * Browser-native WebM/MP4 codecs vary; decoding/resampling here gives the backend
 * one inspectable format: mono, 16 kHz, PCM16 WAV, capped at 60 seconds. No audio
 * is uploaded, persisted or played by this helper. The caller owns context cleanup.
 */
export const VOICE_SECONDS = 60;

// ============================================================================
// LOCAL DECODE, MONO RESAMPLE AND PCM HEADER
// OfflineAudioContext downmixes browser channel layouts. A bounded destination
// cuts off capture/stop scheduling overshoot at the same 60-second server limit.
// ============================================================================
/**
 * Return a bounded WAV Blob from VoiceInput's native recording. Reject unreadable
 * or sub-150 ms audio with recovery text. The caller retains context ownership;
 * this function never requests microphone access or performs network operations.
 */
export async function voiceToWav(blob, context) {
  // Browser codec exceptions contain implementation details rather than helpful
  // recovery instructions. Keep those out of the customer-facing error tray.
  let decoded;
  try {
    decoded = await context.decodeAudioData(await blob.arrayBuffer());
  } catch {
    throw new Error(
      "That recording could not be read. Please record it again.",
    );
  }
  const duration = Math.min(decoded.duration, VOICE_SECONDS);
  if (!Number.isFinite(duration) || duration < 0.15)
    throw new Error(
      "That recording was too short. Try speaking for a little longer.",
    );
  const Offline =
    window.OfflineAudioContext || window.webkitOfflineAudioContext;
  const offline = new Offline(1, Math.floor(duration * 16000), 16000);
  const source = offline.createBufferSource();
  source.buffer = decoded;
  source.connect(offline.destination);
  source.start();
  const rendered = await offline.startRendering();
  const samples = rendered.getChannelData(0);
  const bytes = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(bytes);
  /** Write the standard ASCII RIFF chunk names, never browser-supplied metadata. */
  function label(offset, value) {
    for (let index = 0; index < value.length; index++)
      view.setUint8(offset + index, value.charCodeAt(index));
  }
  label(0, "RIFF");
  view.setUint32(4, bytes.byteLength - 8, true);
  label(8, "WAVE");
  label(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, 16000, true);
  view.setUint32(28, 32000, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  label(36, "data");
  view.setUint32(40, samples.length * 2, true);
  for (let index = 0; index < samples.length; index++) {
    const value = Math.max(-1, Math.min(1, samples[index]));
    view.setInt16(
      44 + index * 2,
      Math.round(value * (value < 0 ? 32768 : 32767)),
      true,
    );
  }
  return new Blob([bytes], { type: "audio/wav" });
}
