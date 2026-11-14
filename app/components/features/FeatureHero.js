import { ArrowRight } from "lucide-react";
import styles from "./featureHero.module.css";

// # Shared presentation for the five revised audit pages.
// Every visible string comes directly from the existing data or unchanged preview
// children. Do not split headings, substitute shorter copy, add metrics, or create
// extra labels here: this component changes hierarchy and styling only.
// FeatureClient owns navigation/authentication and supplies its existing handler.
export default function FeatureHero({ data, icon: Icon, onStart, children }) {
  return (
    <section className={styles.hero} aria-labelledby="feature-hero-title">
      <div className={styles.shell}>
        <div className={styles.layout}>
          <div className={styles.introduction}>
            <div className={styles.eyebrow}>
              <span className={styles.moduleIcon}>
                <Icon size={19} strokeWidth={1.6} aria-hidden="true" />
              </span>
              <span>{data.eyebrow}</span>
              <span className={styles.eyebrowRule} aria-hidden="true" />
            </div>
            <h1 id="feature-hero-title" className={styles.title}>
              {data.hero.h1}
            </h1>
            <p className={styles.description}>{data.hero.subtitle}</p>
            <div className={styles.actionRow}>
              <button type="button" className={styles.cta} onClick={onStart}>
                <span>{data.hero.ctaText}</span>
                {!data.hero.ctaText.endsWith("→") && (
                  <ArrowRight size={18} aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* # The original badge, summary heading and full summary each appear
              exactly once. Decorative corner marks contain no additional text. */}
          <div className={styles.summaryFrame}>
            <div className={styles.summary}>
              <div className={styles.summaryHeader}>
                <span className={styles.summaryIcon}>
                  <Icon size={23} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <p className={styles.badge}>{data.hero.badge}</p>
              </div>
              {data.hero.summaryTitle && (
                <h3 className={styles.summaryTitle}>
                  {data.hero.summaryTitle}
                </h3>
              )}
              <p className={styles.summaryText}>{data.hero.summary}</p>
              <div className={styles.summaryRule} aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            </div>
            <span className={styles.cornerTop} aria-hidden="true" />
            <span className={styles.cornerBottom} aria-hidden="true" />
          </div>
        </div>

        {/* # Preserve every existing schematic and caption below the new hero.
            This keeps full-width preview text readable on all screen sizes. */}
        <div className={styles.preview}>{children}</div>
      </div>
    </section>
  );
}
