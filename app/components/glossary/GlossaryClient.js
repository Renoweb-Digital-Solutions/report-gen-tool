"use client";

/**
 * Interactive reading room for /glossary, rendered by app/glossary/page.js.
 * Uses the supplied PDF's complete static Q&A collection; all search, topic,
 * letter, and page changes happen locally without authentication or API calls.
 * Shared Navbar/Footer preserve the public site's navigation and brand identity.
 * One view object keeps filter changes and page resets atomic, preventing empty
 * stale pages. Animated disclosures retain native buttons and explicit ARIA state;
 * reduced-motion preferences disable positional and height animations.
 */
import { useRef, useState } from "react";
import Link from "next/link";
// Existing motion dependency handles interruptible disclosure and layout changes.
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  Search,
  X,
} from "lucide-react";
import { Navbar } from "../layout/Navbar";
import { Footer } from "../layout/Footer";
import { GLOSSARY_CATEGORIES, GLOSSARY_ENTRIES } from "../../data/glossary";
import styles from "./glossary.module.css";

// ============================================================================
// READING INDEX
// Sort a copy so the source document order remains available in the data module.
// Six definitions per page keep long source answers readable on small screens.
// ============================================================================
const PAGE_SIZE = 6;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const INITIAL_VIEW = { query: "", category: "all", letter: "all", page: 1 };
const SORTED_ENTRIES = [...GLOSSARY_ENTRIES].sort((a, b) =>
  a.term.localeCompare(b.term, "en", { sensitivity: "base" }),
);
const TOPIC_NAMES = Object.fromEntries(
  GLOSSARY_CATEGORIES.map(({ id, name }) => [id, name]),
);

// ============================================================================
// ANIMATED DEFINITION DISCLOSURE
// Keep open state local to a stable entry. The parent remounts each result set,
// preserving the existing first-card-open behavior after filters/page changes.
// ============================================================================
/**
 * Render one definition with an interruptible height/opacity transition.
 * Native buttons provide Enter/Space support; aria-controls targets a stable
 * answer region. AnimatePresence retains the text during closing so height
 * can interpolate; answers contain no interactive elements. Reduced motion
 * changes instantly without delaying access to the definition.
 */
function GlossaryDefinition({ entry, position, initiallyOpen, reduceMotion }) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const answerId = `glossary-answer-${entry.id}`;
  const triggerId = `glossary-trigger-${entry.id}`;

  return (
    <motion.article
      layout={!reduceMotion}
      whileHover={reduceMotion ? undefined : { y: -3 }}
      className={styles.definition}
      data-open={isOpen}
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduceMotion ? 0 : 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <h3 className={styles.definitionHeading}>
        <button
          id={triggerId}
          className={styles.definitionToggle}
          type="button"
          aria-expanded={isOpen}
          aria-controls={answerId}
          onClick={() => setIsOpen((previous) => !previous)}
        >
          <span className={styles.definitionTopline}>
            <span>{TOPIC_NAMES[entry.category]}</span>
            <span>{String(position).padStart(3, "0")}</span>
          </span>
          <span className={styles.termLine}>
            <span className={styles.term}>{entry.term}</span>
            <ChevronDown size={19} aria-hidden="true" />
          </span>
          <span className={styles.question}>{entry.question}</span>
          <span className={styles.readDefinition}>
            {isOpen ? "Close definition" : "Read the definition"}
            <ArrowDown size={13} aria-hidden="true" />
          </span>
        </button>
      </h3>
      {/* The stable region remains mounted for aria-controls even when its
          animated content is absent; closed answers are removed from reading. */}
      <div id={answerId} role="region" aria-labelledby={triggerId}>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              className={styles.answerReveal}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.42,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className={styles.answer}>
                <p>{entry.answer}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}

/**
 * Render filters, definition cards, and a term-preview pagination shelf.
 * Search includes complete answers, so users can find a concept without knowing
 * its exact label. Counts and available letters respect the selected topic and
 * search, while letter filtering only narrows the final reading collection.
 */
export default function GlossaryClient() {
  const [view, setView] = useState(INITIAL_VIEW);
  // Read the OS preference reactively; no timers, listeners, or animation loops
  // are owned by this page, so route changes require no manual cleanup.
  const reduceMotion = useReducedMotion();
  const resultsHeading = useRef(null);
  const searchInput = useRef(null);
  const query = view.query.trim().toLocaleLowerCase("en");

  // Topic counts deliberately ignore the selected topic/letter: every topic
  // remains a useful escape route when a narrower filter produces no results.
  const searchedEntries = SORTED_ENTRIES.filter((entry) =>
    `${entry.term} ${entry.question} ${entry.answer}`
      .toLocaleLowerCase("en")
      .includes(query),
  );
  const topicEntries = searchedEntries.filter(
    (entry) => view.category === "all" || entry.category === view.category,
  );
  const availableLetters = new Set(
    topicEntries.map((entry) => entry.term[0].toUpperCase()),
  );
  const filteredEntries = topicEntries.filter(
    (entry) =>
      view.letter === "all" || entry.term[0].toUpperCase() === view.letter,
  );
  const pageCount = Math.ceil(filteredEntries.length / PAGE_SIZE);
  const currentPage = Math.min(view.page, Math.max(1, pageCount));
  const offset = (currentPage - 1) * PAGE_SIZE;
  const visibleEntries = filteredEntries.slice(offset, offset + PAGE_SIZE);

  // A moving five-page window bounds the shelf on large collections. The direct
  // page selector below still exposes every page, including the first and last.
  const shelfStart = Math.max(1, Math.min(currentPage - 2, pageCount - 4));
  const shelfPages = Array.from(
    { length: Math.min(5, pageCount) },
    (_, index) => shelfStart + index,
  );

  /** Reset pagination alongside a changed filter; topics/search also clear A–Z. */
  function updateFilter(patch) {
    setView((previous) => ({ ...previous, letter: "all", ...patch, page: 1 }));
  }

  /**
   * Move to a valid page and place keyboard focus on the updated results heading.
   * Smooth scrolling follows the motion preference; focus moves without a jump.
   * The heading has a navbar offset in CSS so it stays visible after navigation.
   */
  function goToPage(page) {
    if (page < 1 || page > pageCount || page === currentPage) return;
    setView((previous) => ({ ...previous, page }));
    resultsHeading.current?.focus({ preventScroll: true });
    resultsHeading.current?.scrollIntoView({
      block: "start",
      behavior: reduceMotion ? "instant" : "smooth",
    });
  }

  /** Clear every constraint together, then return typing focus to glossary search. */
  function resetFilters() {
    setView(INITIAL_VIEW);
    searchInput.current?.focus();
  }

  return (
    // Share the OS motion preference with Navbar/Footer motion descendants too.
    <MotionConfig reducedMotion="user">
      <div className={styles.page}>
        <Navbar />
        <main>
          {/* Editorial hero: typography and a decorative dictionary card introduce
            the reading experience without adding external images or animation. */}
          <motion.section
            className={styles.hero}
            aria-labelledby="glossary-title"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.8 }}
          >
            <div className={styles.container}>
              <div className={styles.breadcrumb}>
                <Link href="/">Home</Link>
                <span aria-hidden="true">/</span>
                <span>Glossary</span>
              </div>
              <div className={styles.heroGrid}>
                <div>
                  <p className={styles.eyebrow}>
                    <span /> THE FLAWDITS GLOSSARY
                  </p>
                  <h1 id="glossary-title">
                    Big terms.
                    <br />
                    <span>Simple meanings.</span>
                  </h1>
                  <p className={styles.intro}>
                    A little clarity goes a long way. Get to know the words
                    behind your report, one plain-language explanation at a
                    time.
                  </p>
                  <a href="#glossary-library" className={styles.browseLink}>
                    Find your next “aha”{" "}
                    <ArrowDown size={16} aria-hidden="true" />
                  </a>
                </div>
                <div className={styles.heroArt} aria-hidden="true">
                  <div className={styles.backCard} />
                  <div className={styles.dictionaryCard}>
                    <div className={styles.cardTopline}>
                      <BookOpen size={19} />
                      <span>A FIELD GUIDE TO DIGITAL</span>
                    </div>
                    <div className={styles.dictionaryLetters}>
                      Aa<span>— Zz</span>
                    </div>
                    <div className={styles.dictionaryRule} />
                    <strong>Clarity, by definition.</strong>
                    <p>
                      Less jargon.
                      <br />
                      More understanding.
                    </p>
                    <div className={styles.cardBottomline}>
                      <span>FLAWDITS / REFERENCE NO. 01</span>
                      <ArrowUpRight size={19} />
                    </div>
                  </div>
                  <span className={styles.artStamp}>
                    {GLOSSARY_ENTRIES.length}
                    <small>
                      explanations
                      <br />
                      made simple
                    </small>
                  </span>
                </div>
              </div>
              <div className={styles.heroFoot}>
                <span>
                  <BookOpen size={15} aria-hidden="true" /> Your report’s
                  reading companion
                </span>
                <span>
                  {GLOSSARY_CATEGORIES.length} topics{" "}
                  <span aria-hidden="true">·</span> From SEO to brand strategy
                </span>
              </div>
            </div>
          </motion.section>

          {/* Search precedes the topic index in DOM order. Every filter is a native
            input/button, and results announce changes without stealing focus. */}
          <section
            id="glossary-library"
            className={styles.library}
            aria-label="Browse glossary"
          >
            <div className={styles.container}>
              <div className={styles.searchRow}>
                <div className={styles.searchBox}>
                  <Search size={21} aria-hidden="true" />
                  <label className={styles.srOnly} htmlFor="glossary-search">
                    Search terms and definitions
                  </label>
                  <input
                    ref={searchInput}
                    id="glossary-search"
                    type="search"
                    placeholder="A term on your mind? Search it here…"
                    value={view.query}
                    onChange={(event) =>
                      updateFilter({ query: event.target.value })
                    }
                  />
                  {view.query && (
                    <button
                      type="button"
                      aria-label="Clear search"
                      onClick={() => updateFilter({ query: "" })}
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
                <span className={styles.searchNote}>
                  A good question is a great place to start.
                </span>
              </div>

              <div className={styles.libraryGrid}>
                <aside
                  className={styles.topicIndex}
                  aria-label="Glossary topics"
                >
                  <div className={styles.indexHeading}>
                    <span>THE TOPIC INDEX</span>
                    <span>01—14</span>
                  </div>
                  <div className={styles.topicList}>
                    <button
                      type="button"
                      aria-pressed={view.category === "all"}
                      onClick={() => updateFilter({ category: "all" })}
                    >
                      <span className={styles.topicNumber}>
                        <BookOpen size={15} aria-hidden="true" />
                      </span>
                      <span>All topics</span>
                      <span className={styles.topicCount}>
                        {searchedEntries.length}
                      </span>
                    </button>
                    {GLOSSARY_CATEGORIES.map((category, index) => (
                      <button
                        key={category.id}
                        type="button"
                        aria-pressed={view.category === category.id}
                        onClick={() => updateFilter({ category: category.id })}
                      >
                        <span className={styles.topicNumber}>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span>{category.name}</span>
                        <span className={styles.topicCount}>
                          {
                            searchedEntries.filter(
                              (entry) => entry.category === category.id,
                            ).length
                          }
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className={styles.sidebarNote}>
                    <span className={styles.noteAsterisk}>✳</span>
                    <p>
                      You don’t need to be an expert to understand your digital
                      presence.
                    </p>
                  </div>
                </aside>

                <div className={styles.readingArea}>
                  <div className={styles.resultsTopline}>
                    <div>
                      <p className={styles.eyebrow}>
                        A LITTLE KNOWLEDGE, A LOT OF CLARITY
                      </p>
                      <h2
                        ref={resultsHeading}
                        tabIndex={-1}
                        className={styles.resultsHeading}
                      >
                        {view.category === "all"
                          ? "The glossary"
                          : TOPIC_NAMES[view.category]}
                      </h2>
                    </div>
                    <span
                      className={styles.resultCount}
                      role="status"
                      aria-live="polite"
                      aria-atomic="true"
                    >
                      {filteredEntries.length} explanations
                    </span>
                  </div>

                  <nav
                    className={styles.alphabet}
                    aria-label="Filter by first letter"
                  >
                    <button
                      type="button"
                      aria-pressed={view.letter === "all"}
                      onClick={() => updateFilter({ letter: "all" })}
                    >
                      All
                    </button>
                    {ALPHABET.map((letter) => (
                      <button
                        key={letter}
                        type="button"
                        disabled={!availableLetters.has(letter)}
                        aria-pressed={view.letter === letter}
                        onClick={() => updateFilter({ letter })}
                      >
                        {letter}
                      </button>
                    ))}
                  </nav>

                  <div className={styles.readingMeta}>
                    <span>
                      {filteredEntries.length
                        ? `Showing ${offset + 1}–${Math.min(offset + PAGE_SIZE, filteredEntries.length)} of ${filteredEntries.length}`
                        : "No matching explanations"}
                    </span>
                    <span>ALPHABETICALLY ARRANGED</span>
                  </div>

                  {/* Result-set entrances and disclosure heights animate independently;
                    keys reset open state without delaying search behind an exit. */}
                  <div
                    className={styles.definitionGrid}
                    key={`${view.category}-${view.letter}-${view.query}-${currentPage}`}
                  >
                    {visibleEntries.map((entry, index) => (
                      <GlossaryDefinition
                        key={entry.id}
                        entry={entry}
                        position={offset + index + 1}
                        initiallyOpen={index === 0}
                        reduceMotion={reduceMotion}
                      />
                    ))}
                  </div>

                  {!filteredEntries.length && (
                    <div className={styles.emptyState}>
                      <Search size={30} aria-hidden="true" />
                      <h3>No definition found. Yet.</h3>
                      <p>
                        Try a shorter phrase, another letter, or a different
                        topic.
                      </p>
                      <button type="button" onClick={resetFilters}>
                        Start fresh <ArrowRight size={16} aria-hidden="true" />
                      </button>
                    </div>
                  )}

                  {/* The shelf gives pages content previews, rather than numbers
                    alone. Labels expose the complete range to assistive tools;
                    the select provides direct access beyond the moving window. */}
                  {pageCount > 0 && (
                    <nav
                      className={styles.pagination}
                      aria-label="Glossary pages"
                    >
                      <div className={styles.paginationHeading}>
                        <span>KEEP EXPLORING</span>
                        <span>
                          Page {currentPage} of {pageCount}
                        </span>
                      </div>
                      <div className={styles.pageShelf}>
                        {shelfPages.map((page) => {
                          // Derive previews from the filtered/sorted collection so
                          // every shelf button describes its actual destination.
                          const first =
                            filteredEntries[(page - 1) * PAGE_SIZE].term;
                          const last =
                            filteredEntries[
                              Math.min(
                                page * PAGE_SIZE,
                                filteredEntries.length,
                              ) - 1
                            ].term;
                          return (
                            <button
                              key={page}
                              type="button"
                              aria-current={
                                page === currentPage ? "page" : undefined
                              }
                              aria-label={`Page ${page}: ${first} to ${last}`}
                              onClick={() => goToPage(page)}
                            >
                              <span className={styles.pageNumber}>
                                {String(page).padStart(2, "0")}
                                <ArrowUpRight size={15} aria-hidden="true" />
                              </span>
                              <span className={styles.pageRange}>
                                {first}
                                <span>to {last}</span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      <div className={styles.pageControls}>
                        <button
                          type="button"
                          disabled={currentPage === 1}
                          onClick={() => goToPage(currentPage - 1)}
                        >
                          <ArrowLeft size={16} aria-hidden="true" /> Previous
                        </button>
                        <label className={styles.pageSelect}>
                          Jump to page
                          <select
                            value={currentPage}
                            onChange={(event) =>
                              goToPage(Number(event.target.value))
                            }
                          >
                            {Array.from({ length: pageCount }, (_, index) => (
                              <option key={index + 1} value={index + 1}>
                                {index + 1} / {pageCount}
                              </option>
                            ))}
                          </select>
                        </label>
                        <button
                          type="button"
                          disabled={currentPage === pageCount}
                          onClick={() => goToPage(currentPage + 1)}
                        >
                          Next <ArrowRight size={16} aria-hidden="true" />
                        </button>
                      </div>
                    </nav>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className={styles.closingNote} aria-label="Further reading">
            <div className={styles.container}>
              <BookOpen size={25} aria-hidden="true" />
              <div>
                <h2>Understanding is the first step.</h2>
                <p>
                  Now put the words into context and see how Flawdits reads your
                  digital presence.
                </p>
              </div>
              <Link href="/how-it-works">
                See how it works <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
