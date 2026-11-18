import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Newspaper,
  PenLine,
  Radio,
} from "lucide-react";
import ResourceLayout, { ResourceLink } from "./ResourceLayout";
import styles from "./resources.module.css";

// # Present real collection content when available, otherwise one deliberate empty
// state. Avoid dummy articles, disabled search, fake dates or a simulated loading
// state: an empty collection is a supported result, not a broken request.
export default function ResourceCollection({ kind, content, entries }) {
  const Icon = kind === "press" ? Newspaper : BookOpen;
  const Accent = kind === "press" ? Radio : PenLine;
  return (
    <ResourceLayout label={content.label}>
      <header className={styles.collectionHero}>
        <div>
          <p className={styles.eyebrow}>
            <Icon size={16} aria-hidden="true" />
            {content.eyebrow}
          </p>
          <h1>{content.title}</h1>
        </div>
        <p className={styles.heroDescription}>{content.description}</p>
      </header>
      <section
        className={styles.collection}
        aria-labelledby="resource-collection-title"
      >
        <div className={styles.collectionHeader}>
          <h2 id="resource-collection-title">{content.collectionTitle}</h2>
          <span>
            {entries.length} {kind === "press" ? "announcements" : "articles"}
          </span>
        </div>
        {entries.length ? (
          <ul className={styles.entryList}>
            {entries.map((entry) => (
              <li key={entry.id}>
                <Link href={entry.href}>
                  <div>
                    {entry.dateLabel && (
                      <span className={styles.entryDate}>
                        {entry.dateLabel}
                      </span>
                    )}
                    <h3>{entry.title}</h3>
                    <p>{entry.summary}</p>
                  </div>
                  <ArrowUpRight size={22} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles.emptyState}>
            {/* # A decorative paper stack gives the empty state its own visual
                identity. It contains no imaginary article titles or result data. */}
            <div className={styles.paperScene} aria-hidden="true">
              <div className={styles.paperBack} />
              <div className={styles.paperFront}>
                <Icon size={35} strokeWidth={1.2} />
                <span />
                <span />
                <span />
                <div className={styles.paperStamp}>
                  <Accent size={21} />
                </div>
              </div>
            </div>
            <div className={styles.emptyCopy}>
              <h3>{content.emptyTitle}</h3>
              <p>{content.emptyDescription}</p>
              <div className={styles.actions}>
                {content.links.map((link, index) => (
                  <ResourceLink
                    key={link.href}
                    href={link.href}
                    primary={index === 0}
                  >
                    {link.label}
                  </ResourceLink>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className={styles.collectionFooter}>
          <span className={styles.footerDot} aria-hidden="true" />
          <p>{content.footerNote}</p>
          <span className={styles.footerRule} aria-hidden="true" />
        </div>
      </section>
    </ResourceLayout>
  );
}
