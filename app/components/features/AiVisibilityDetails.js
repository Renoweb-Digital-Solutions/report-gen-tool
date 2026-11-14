import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./aiVisibility.module.css";

// # Both manuscript tables share column/row header semantics. The examples have
// an intentionally blank first header in the document; give it an accessible
// label without inserting additional visible editorial text into the table.
function ReportTable({ table, comparison = false }) {
  return (
    <table
      className={`${styles.reportTable} ${comparison ? styles.comparisonTable : ""}`}
    >
      <caption>{table.h2}</caption>
      <thead>
        <tr>
          {table.columns.map((column, index) => (
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
        {table.rows.map(([label, ...values]) => (
          <tr key={label}>
            <th scope="row">{label}</th>
            {values.map((value, index) => (
              <td key={index}>{value}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// # Append the supplied second half without rewriting any manuscript passages.
// Interpretation leads remain inline with their bodies so a whole bullet can
// still be read and selected as one paragraph. Source-only method instructions
// are intentionally excluded until the product team provides verified content.
export default function AiVisibilityDetails({ data }) {
  return (
    <>
      <section
        id="ai-report-items"
        className={styles.section}
        aria-labelledby="ai-report-items-title"
      >
        <p className={styles.chapter}>
          <span>05</span>The outputs, in context
        </p>
        <h2 id="ai-report-items-title">{data.reportItems.h2}</h2>
        <ReportTable table={data.reportItems} />
      </section>

      <section
        id="ai-real-results"
        className={styles.examplesSection}
        aria-labelledby="ai-examples-title"
      >
        <p className={styles.chapter}>
          <span>06</span>Two reports, side by side
        </p>
        <h2 id="ai-examples-title">{data.examples.h2}</h2>
        <p className={styles.exampleIntro}>
          {data.examples.introduction} <em>{data.examples.note}</em>
        </p>
        <ReportTable table={data.examples} comparison />
        <p className={styles.exampleConclusion}>{data.examples.conclusion}</p>
      </section>

      <section
        id="ai-reading-guide"
        className={styles.section}
        aria-labelledby="ai-reading-guide-title"
      >
        <p className={styles.chapter}>
          <span>07</span>Make sense of the signals
        </p>
        <h2 id="ai-reading-guide-title">{data.interpretation.h2}</h2>
        <ul className={styles.readingGuide}>
          {data.interpretation.items.map((item, index) => (
            <li key={item.lead}>
              <span className={styles.guideNumber} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p>
                <strong>{item.lead}</strong> {item.body}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section
        id="ai-audiences"
        className={styles.section}
        aria-labelledby="ai-audiences-title"
      >
        <p className={styles.chapter}>
          <span>08</span>Put the findings to work
        </p>
        <h2 id="ai-audiences-title">{data.audience.h2}</h2>
        <div className={styles.audiences}>
          {data.audience.items.map((item, index) => (
            <article key={item.h3}>
              <span className={styles.guideNumber} aria-hidden="true">
                0{index + 1}
              </span>
              <h3>{item.h3}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
        <Link className={styles.fullReportLink} href="/full-report">
          Full Report <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>
    </>
  );
}
