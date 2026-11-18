import {
  ArrowRight,
  Globe,
  Quote,
  FileText,
  Search,
  Braces,
  ScanLine,
} from "lucide-react";
import styles from "./aiVisibility.module.css";
import AiVisibilityDetails from "./AiVisibilityDetails";

const COVERAGE_ICONS = [Quote, ScanLine, Braces, Search, FileText];

// # This schematic fills the manuscript's screenshot slot without pretending to
// be a real report. The score is labelled as a scale; no account results, engines
// checked, prompts, or timing claims are invented while build details are pending.
export function AiVisibilityPreview({ caption }) {
  return (
    <figure className={styles.preview}>
      <div className={styles.previewHeader}>
        <span>
          <ScanLine size={16} aria-hidden="true" /> AI VISIBILITY AUDIT
        </span>
        <span>DOMAIN → REPORT</span>
      </div>
      <div className={styles.previewBody}>
        <div className={styles.domain}>
          <span className={styles.label}>DOMAIN</span>
          <div className={styles.domainField}>
            <Globe size={18} aria-hidden="true" />
            <span>yourbrand.com</span>
          </div>
        </div>
        <ArrowRight size={22} className={styles.flowArrow} aria-hidden="true" />
        <div className={styles.previewResults}>
          <span className={styles.label}>REPORT STRUCTURE</span>
          <div>
            <strong>AI Visibility Score</strong>
            <span>0–100 scale</span>
          </div>
          <div>
            <strong>AI mentions</strong>
            <Quote size={16} aria-hidden="true" />
          </div>
          <div>
            <strong>Cited pages</strong>
            <FileText size={16} aria-hidden="true" />
          </div>
        </div>
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

// # Every supplied section remains visible in the document rather than inside
// tabs. The manuscript bodies are rendered directly without trimming, splitting
// into shorter summaries, or replacing paragraphs with their visual counterparts.
export default function AiVisibilityStory({ data }) {
  const [score, mentions, readiness] = data.contentBlocks;

  return (
    <div className={styles.story}>
      <div className={styles.shell}>
        <nav className={styles.index} aria-label="AI visibility sections">
          <span>
            <ScanLine size={16} aria-hidden="true" /> Inside the AI Visibility
            Audit
          </span>
          <a href="#ai-visibility-score">01 / Score</a>
          <a href="#ai-brand-mentions">02 / Mentions</a>
          <a href="#ai-readiness">03 / Readiness</a>
          <a href="#ai-coverage">04 / Coverage</a>
          <a href="#ai-real-results">06 / Examples</a>
          <a href="#ai-reading-guide">07 / Reading guide</a>
        </nav>

        <section
          id="ai-visibility-score"
          className={styles.scoreSection}
          aria-labelledby="ai-score-title"
        >
          <div>
            <p className={styles.chapter}>
              <span>01</span>Three figures, one view
            </p>
            <h2 id="ai-score-title">{score.h2}</h2>
            <p>{score.body}</p>
          </div>
          <div className={styles.scoreInstrument}>
            <div className={styles.dial}>
              <svg viewBox="0 0 160 100" aria-hidden="true">
                <path d="M 15 85 A 65 65 0 0 1 145 85" />
                <path d="M 15 85 A 65 65 0 0 1 145 85" pathLength="100" />
              </svg>
              <strong>0–100</strong>
              <span>AI Visibility Score scale</span>
            </div>
            <div className={styles.signalRows}>
              <div>
                <Quote size={18} aria-hidden="true" />
                <span>AI mention count</span>
              </div>
              <div>
                <FileText size={18} aria-hidden="true" />
                <span>Cited-page count</span>
              </div>
            </div>
          </div>
        </section>

        <section
          id="ai-brand-mentions"
          className={styles.section}
          aria-labelledby="ai-mentions-title"
        >
          <p className={styles.chapter}>
            <span>02</span>From a mention to its source
          </p>
          <div className={styles.editorial}>
            <h2 id="ai-mentions-title">{mentions.h2}</h2>
            <p>{mentions.body}</p>
          </div>
          <div
            className={styles.citationPath}
            aria-label="Brand mentions and source pages"
          >
            <span>
              <Globe size={20} aria-hidden="true" />
              Your brand
            </span>
            <ArrowRight size={18} aria-hidden="true" />
            <span>
              <Quote size={20} aria-hidden="true" />
              AI answers
            </span>
            <ArrowRight size={18} aria-hidden="true" />
            <span>
              <FileText size={20} aria-hidden="true" />
              Cited source pages
            </span>
          </div>
        </section>

        <section
          id="ai-readiness"
          className={styles.section}
          aria-labelledby="ai-readiness-title"
        >
          <p className={styles.chapter}>
            <span>03</span>Search visibility, in context
          </p>
          <div className={styles.editorial}>
            <h2 id="ai-readiness-title">{readiness.h2}</h2>
            <p>{readiness.body}</p>
          </div>
          {/* # File names illustrate the checks without asserting a detected status. */}
          <div className={styles.fileRail}>
            <span>READINESS CHECKS</span>
            {["llms.txt", "robots.txt", "sitemap.xml"].map((file) => (
              <span key={file}>
                <Braces size={17} aria-hidden="true" />
                {file}
              </span>
            ))}
          </div>
        </section>

        <section
          id="ai-coverage"
          className={styles.section}
          aria-labelledby="ai-coverage-title"
        >
          <p className={styles.chapter}>
            <span>04</span>The report, unpacked
          </p>
          <h3 id="ai-coverage-title" className={styles.coverageHeading}>
            {data.featureGrid.h2}
          </h3>
          <ul className={styles.coverage}>
            {data.featureGrid.items.map((item, index) => {
              const Icon = COVERAGE_ICONS[index];
              return (
                <li key={item.title}>
                  <span className={styles.number} aria-hidden="true">
                    0{index + 1}
                  </span>
                  <Icon size={21} aria-hidden="true" />
                  <p>
                    <strong>{item.title}:</strong> {item.desc}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
        <AiVisibilityDetails data={data} />
      </div>
    </div>
  );
}
