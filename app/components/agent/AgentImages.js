"use client";

/**
 * Request-scoped Visual Brand Match file controls mounted inside Flair's composer.
 * AgentWorkspace owns the File objects in memory; api.js validates them again and
 * sends multipart data to the existing authenticated attachment endpoint. Nothing
 * is persisted, embedded into conversation text or exposed as a model file path.
 */
import { useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { validateAgentImage } from "@/app/features/agent/api";
import styles from "./agent.module.css";

// ============================================================================
// TWO EXPLICIT IMAGE ROLES
// Both files are required when sending attachments. Separate labels prevent
// accidental reversal of website and Instagram reference images in the pipeline.
// ============================================================================
const ROLES = [
  ["website", "Website screenshot"],
  ["moodboard", "Instagram moodboard"],
];

/** Select bounded image files; disable editing while their request is in flight. */
export default function AgentImages({ images, onChange, disabled }) {
  const [error, setError] = useState("");
  /** Validate each selection immediately; retain a previous valid file on error. */
  function select(role, event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      validateAgentImage(file);
      onChange({ ...images, [role]: file });
      setError("");
    } catch (failure) {
      setError(failure.message);
    }
  }
  return (
    // AgentWorkspace mounts this only after visual intent/image clarification.
    // Open on appearance so the requested upload action is immediately visible.
    <details className={styles.agentImages} open>
      <summary>
        <ImagePlus size={15} /> Visual Brand Match images{" "}
        {images.website || images.moodboard ? "· attached" : ""}
      </summary>
      <p>
        Add both images for a visual comparison. PNG, JPEG or WebP, up to 8 MB
        each.
      </p>
      <div className={styles.imageRoles}>
        {ROLES.map(([role, label]) => (
          <div key={role}>
            <label>
              <span>{label}</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                disabled={disabled}
                onChange={(event) => select(role, event)}
              />
            </label>
            {images[role] && (
              <span className={styles.imageFilename}>
                {images[role].name}
                <button
                  type="button"
                  disabled={disabled}
                  aria-label={`Remove ${label}`}
                  onClick={() => onChange({ ...images, [role]: null })}
                >
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        ))}
      </div>
      {error && <p role="alert">{error}</p>}
    </details>
  );
}
