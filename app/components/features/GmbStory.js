import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  Building2,
  Link as LinkIcon,
  ListChecks,
  Star,
  Camera,
  FileText,
} from "lucide-react";
import editorial from "./aiVisibility.module.css";
import styles from "./gmbAudit.module.css";

const COVERAGE_ICONS = [Star, ListChecks, Building2, MapPin, FileText];

// # Keep the example matrix and every takeaway visible. The blank first column
// header in the manuscript gets an accessible label without extra visible copy.
// Supplied figures remain literal strings: do not round or recompute scores.
function GmbExamples({ examples }) {
  return (
    <section
      id="gmb-examples"
      className={styles.examples}
      aria-labelledby="gmb-examples-title"
    >
      <p className={editorial.chapter}>
        <span>04</span>Three listings, side by side
      </p>
      <h2 id="gmb-examples-title">{examples.h2}</h2>
      <p>{examples.introduction}</p>
      <table className={`${editorial.reportTable} ${styles.examplesTable}`}>
        <caption>{examples.h2}</caption>
        <thead>
          <tr>
            {examples.columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                aria-label={column ? undefined : "Report item"}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {examples.rows.map(([metric, ...values]) => (
            <tr key={metric}>
              <th scope="row">{metric}</th>
              {values.map((value, index) => (
                <td key={index}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className={styles.takeawayHeading}>
        <strong>{examples.takeawaysTitle}</strong>
      </p>
      <ul className={styles.takeaways}>
        {examples.takeaways.map((item, index) => (
          <li key={item.lead}>
            <span className={editorial.number} aria-hidden="true">
              0{index + 1}
            </span>
            <p>
              <strong>{item.lead}</strong> {item.body}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

// # Explicit schematic for the screenshot slot. No editable controls or invented
// customer scores appear here; replace it with a real capture when available.
export function GmbPreview({ caption }) {
  return (
    <figure className={styles.preview}>
      <div className={styles.previewHeader}>
        <span>
          <MapPin size={17} aria-hidden="true" /> GMB AUDIT / LISTING OVERVIEW
        </span>
        <span>One listing. One report.</span>
      </div>
      <div className={styles.previewBody}>
        <div className={styles.inputs}>
          {[
            { icon: Building2, name: "Business name" },
            { icon: LinkIcon, name: "Google Maps URL" },
            { icon: MapPin, name: "Location" },
          ].map(({ icon: Icon, name }) => (
            <div key={name}>
              <Icon size={18} aria-hidden="true" />
              <span>{name}</span>
            </div>
          ))}
        </div>
        <ArrowRight className={styles.flowArrow} size={23} aria-hidden="true" />
        <div className={styles.listing}>
          <div className={styles.listingHeader}>
            <MapPin size={24} aria-hidden="true" />
            <div>
              <strong>Profile score & grade</strong>
              <span>Score format: /100</span>
            </div>
          </div>
          <div className={styles.subscores}>
            <span>
              <ListChecks size={15} aria-hidden="true" />
              Completeness
            </span>
            <span>
              <Star size={15} aria-hidden="true" />
              Reviews and ratings
            </span>
            <span>
              <Camera size={15} aria-hidden="true" />
              Photos and media
            </span>
          </div>
          <div className={styles.listingFooter}>
            Detected details <span aria-hidden="true">/</span> Competitor table
          </div>
        </div>
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

// # Share the established editorial rail and semantic table styles with AI
// Visibility. GMB-specific visuals stay scoped separately. Render all supplied
// passages directly, without hidden tabs, clipped paragraphs or shorter summaries.
export default function GmbStory({ data }) {
  return (
    <div className={editorial.story}>
      <div className={editorial.shell}>
        <nav className={editorial.index} aria-label="GMB audit sections">
          <span>
            <MapPin size={16} aria-hidden="true" /> Inside the GMB Audit
          </span>
          <a href="#gmb-overview">01 / Overview</a>
          <a href="#gmb-coverage">02 / Coverage</a>
          <a href="#gmb-scoring">03 / Scoring</a>
          <a href="#gmb-examples">04 / Examples</a>
          <a href="#gmb-audiences">05 / Use cases</a>
        </nav>
        <section
          id="gmb-overview"
          className={editorial.section}
          aria-label="GMB audit overview"
        >
          <p className={editorial.chapter}>
            <span>01</span>The listing, in context
          </p>
          <div className={styles.overview}>
            {data.contentBlocks.map((block, index) => (
              <article key={block.h2}>
                <span className={editorial.number} aria-hidden="true">
                  0{index + 1}
                </span>
                <h2>{block.h2}</h2>
                <p>{block.body}</p>
              </article>
            ))}
          </div>
        </section>
        <section
          id="gmb-coverage"
          className={editorial.section}
          aria-labelledby="gmb-coverage-title"
        >
          <p className={editorial.chapter}>
            <span>02</span>The report, unpacked
          </p>
          <h3 id="gmb-coverage-title" className={editorial.coverageHeading}>
            {data.featureGrid.h2}
          </h3>
          <ul className={editorial.coverage}>
            {data.featureGrid.items.map((item, index) => {
              const Icon = COVERAGE_ICONS[index];
              return (
                <li key={item.title}>
                  <span className={editorial.number} aria-hidden="true">
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
        <section
          id="gmb-scoring"
          className={editorial.section}
          aria-labelledby="gmb-scoring-title"
        >
          <p className={editorial.chapter}>
            <span>03</span>From inputs to findings
          </p>
          <h2 id="gmb-scoring-title">{data.scoring.h2}</h2>
          <div className={styles.entered}>
            <h3>{data.scoring.inputTitle}</h3>
            <p>{data.scoring.input}</p>
          </div>
          <h3 className={styles.reportTitle} id="gmb-report-table-title">
            {data.scoring.reportTitle}
          </h3>
          {/* # Native table headers keep all seven definitions accessible. Text
              wraps in fixed proportions instead of adding a horizontal scrollbar. */}
          <table
            className={`${editorial.reportTable} ${styles.scoringTable}`}
            aria-labelledby="gmb-report-table-title"
          >
            <thead>
              <tr>
                {data.scoring.columns.map((column) => (
                  <th key={column} scope="col">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.scoring.rows.map(([metric, meaning]) => (
                <tr key={metric}>
                  <th scope="row">{metric}</th>
                  <td>{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <GmbExamples examples={data.examples} />
        <section
          id="gmb-audiences"
          className={editorial.section}
          aria-labelledby="gmb-audiences-title"
        >
          <p className={editorial.chapter}>
            <span>05</span>Put the findings to work
          </p>
          <h2 id="gmb-audiences-title">{data.audience.h2}</h2>
          <div className={editorial.audiences}>
            {data.audience.items.map((item, index) => (
              <article key={item.h3}>
                <span className={editorial.guideNumber} aria-hidden="true">
                  0{index + 1}
                </span>
                <h3>{item.h3}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
          <Link className={editorial.fullReportLink} href="/full-report">
            Full Report <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </section>
      </div>
    </div>
  );
}
