import Link from "next/link";
import { ArrowRight } from "lucide-react";
import editorial from "./aiVisibility.module.css";

// # Both metric definitions and report takeaways retain their supplied sentence
// boundaries. Decorative numbering adds structure without replacing any copy.
function DefinitionList({ items }) {
  return (
    <ul className={editorial.readingGuide}>
      {items.map((item, index) => (
        <li key={item.lead}>
          <span className={editorial.guideNumber} aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <p>
            <strong>{item.lead}</strong> {item.body}
          </p>
        </li>
      ))}
    </ul>
  );
}

// # Keep glossary concepts separate from measured report outputs. All sections
// and the full comparison matrix remain visible; the FAQ uses the existing shared
// accordion elsewhere. Reuse the established blue editorial system for consistency.
export default function WebsiteAnatomyDetails({ data }) {
  return (
    <>
      <section
        id="website-performance"
        className={editorial.section}
        aria-labelledby="website-performance-title"
      >
        <p className={editorial.chapter}>
          <span>04</span>Concepts and reported signals
        </p>
        <div className={editorial.editorial}>
          <h2 id="website-performance-title">{data.performance.h2}</h2>
          <p>{data.performance.definition}</p>
        </div>
        <p className={editorial.exampleConclusion}>
          {data.performance.reported}
        </p>
      </section>

      <section
        id="website-authority"
        className={editorial.section}
        aria-labelledby="website-authority-title"
      >
        <p className={editorial.chapter}>
          <span>05</span>Understand the search picture
        </p>
        <h2 id="website-authority-title">{data.authority.h2}</h2>
        <DefinitionList items={data.authority.items} />
      </section>

      <section
        id="website-examples"
        className={editorial.examplesSection}
        aria-labelledby="website-examples-title"
      >
        <p className={editorial.chapter}>
          <span>06</span>Two reports, side by side
        </p>
        <h2 id="website-examples-title">{data.examples.h2}</h2>
        {/* # Blank first header follows the manuscript; an aria label provides
            its meaning to assistive technology without adding visible copy. */}
        <table
          className={`${editorial.reportTable} ${editorial.comparisonTable}`}
        >
          <caption>{data.examples.h2}</caption>
          <thead>
            <tr>
              {data.examples.columns.map((column, index) => (
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
            {data.examples.rows.map(([label, ...values]) => (
              <tr key={label}>
                <th scope="row">{label}</th>
                {values.map((value, index) => (
                  <td key={index}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className={editorial.exampleConclusion}>
          <strong>{data.examples.takeawaysTitle}</strong>
        </p>
        <DefinitionList items={data.examples.takeaways} />
        <p className={editorial.exampleConclusion}>
          {data.examples.findingLabel} <em>{data.examples.finding}</em>
        </p>
      </section>

      <section
        id="website-audiences"
        className={editorial.section}
        aria-labelledby="website-audiences-title"
      >
        <p className={editorial.chapter}>
          <span>07</span>Put the findings to work
        </p>
        <h2 id="website-audiences-title">{data.audience.h2}</h2>
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
    </>
  );
}
