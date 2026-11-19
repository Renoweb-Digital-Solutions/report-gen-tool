/**
 * Small, inert text renderer for AgentWorkspace messages and report summaries.
 * Supports paragraphs, headings, bullets and bold without interpreting HTML,
 * executing model content, or accepting model-provided component attributes.
 * Everything outside the supported formatting is rendered as escaped React text.
 */
import styles from './agent.module.css';

// ============================================================================
// SAFE PRESENTATION
// Model output and crawled content are untrusted. Keep text as React children;
// do not replace this renderer with dangerouslySetInnerHTML for richer formatting.
// ============================================================================

/** Render paired bold delimiters while leaving unmatched markers as plain text. */
function inlineText(text) {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .map((part, index) =>
      part.startsWith('**') && part.endsWith('**') ? (
        <strong key={index}>{part.slice(2, -2)}</strong>
      ) : (
        part
      ),
    );
}

/** Display the backend's message as readable blocks; no external fetches occur. */
export default function AgentText({ text }) {
  const blocks = String(text || '').split(/\n\s*\n/);
  return (
    <div className={styles.prose}>
      {blocks.map((block, index) => {
        const lines = block.split('\n');
        if (lines.every((line) => /^\s*[-*]\s+/.test(line))) {
          return (
            <ul key={index}>
              {lines.map((line, lineIndex) => (
                <li key={lineIndex}>
                  {inlineText(line.replace(/^\s*[-*]\s+/, ''))}
                </li>
              ))}
            </ul>
          );
        }
        if (/^#{1,6}\s/.test(block)) {
          return (
            <p className={styles.textHeading} key={index}>
              {inlineText(block.replace(/^#{1,6}\s+/, ''))}
            </p>
          );
        }
        return <p key={index}>{inlineText(block)}</p>;
      })}
    </div>
  );
}
