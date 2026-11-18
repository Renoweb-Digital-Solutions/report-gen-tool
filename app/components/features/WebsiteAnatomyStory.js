import Link from "next/link";
import {
  ArrowRight,
  Globe,
  Gauge,
  ShieldCheck,
  ListChecks,
  Link as LinkIcon,
  Search,
  ScanLine,
  FileText,
} from "lucide-react";
import editorial from "./aiVisibility.module.css";
import listing from "./gmbAudit.module.css";
import WebsiteAnatomyDetails from "./WebsiteAnatomyDetails";

const COVERAGE_ICONS = [
  Gauge,
  ShieldCheck,
  ListChecks,
  LinkIcon,
  Search,
  ScanLine,
  FileText,
];

// # Reuse the shared source-to-results schematic, with Website Anatomy labels.
// This is an explicit screenshot placeholder rather than a real scan: no grades,
// authority values, traffic estimates or generation-time promises are invented.
export function WebsiteAnatomyPreview({ caption }) {
  return (
    <figure className={editorial.preview}>
      <div className={editorial.previewHeader}>
        <span>
          <Globe size={16} aria-hidden="true" /> WEBSITE ANATOMY / SCAN OVERVIEW
        </span>
        <span>DOMAIN → FINDINGS → REPORT</span>
      </div>
      <div className={editorial.previewBody}>
        <div>
          <span className={editorial.label}>DOMAIN</span>
          <div className={editorial.domainField}>
            <Globe size={18} aria-hidden="true" />
            <span>yourwebsite.com</span>
          </div>
        </div>
        <ArrowRight
          size={22}
          className={editorial.flowArrow}
          aria-hidden="true"
        />
        <div className={editorial.previewResults}>
          <span className={editorial.label}>REPORT STRUCTURE</span>
          <div>
            <strong>Authority Score</strong>
            <Gauge size={16} aria-hidden="true" />
          </div>
          <div>
            <strong>Website Health</strong>
            <ShieldCheck size={16} aria-hidden="true" />
          </div>
          <div>
            <strong>AI Visibility</strong>
            <ScanLine size={16} aria-hidden="true" />
          </div>
        </div>
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

// # Use the same aligned editorial rows as GMB and the same semantic table as
// AI Visibility. Manuscript passages remain complete and visible, while layout
// annotations are kept separate from the actual copy. The extended manuscript
// follows the definitions without changing the current FAQ design.
export default function WebsiteAnatomyStory({ data }) {
  return (
    <div className={editorial.story}>
      <div className={editorial.shell}>
        <nav className={editorial.index} aria-label="Website Anatomy sections">
          <span>
            <Globe size={16} aria-hidden="true" /> Inside Website Anatomy
          </span>
          <a href="#website-overview">01 / Overview</a>
          <a href="#website-coverage">02 / Coverage</a>
          <a href="#website-report-items">03 / Report definitions</a>
          <a href="#website-performance">04 / Performance</a>
          <a href="#website-examples">06 / Examples</a>
        </nav>
        <section
          id="website-overview"
          className={editorial.section}
          aria-label="Website Anatomy overview"
        >
          <p className={editorial.chapter}>
            <span>01</span>One domain, a connected picture
          </p>
          <div className={listing.overview}>
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
          {/* # The rail lists technical areas only; it makes no claim that the
              scan collected browser-based Core Web Vitals measurements. */}
          <div className={editorial.fileRail}>
            <span>TECHNICAL GRADES</span>
            {[
              "HTTP",
              "SSL",
              "DNS",
              "Security Headers",
              "Meta",
              "Performance",
            ].map((area) => (
              <span key={area}>{area}</span>
            ))}
          </div>
        </section>
        <section
          id="website-coverage"
          className={editorial.section}
          aria-labelledby="website-coverage-title"
        >
          <p className={editorial.chapter}>
            <span>02</span>The report, unpacked
          </p>
          <h3 id="website-coverage-title" className={editorial.coverageHeading}>
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
          id="website-report-items"
          className={editorial.section}
          aria-labelledby="website-report-items-title"
        >
          <p className={editorial.chapter}>
            <span>03</span>Read the numbers with context
          </p>
          <h2 id="website-report-items-title">{data.reportItems.h2}</h2>
          {/* # Fixed column proportions wrap all definitions on narrow screens.
              Link the supplied AI reference without altering its sentence. */}
          <table
            className={`${editorial.reportTable} ${listing.scoringTable}`}
            aria-labelledby="website-report-items-title"
          >
            <thead>
              <tr>
                {data.reportItems.columns.map((column) => (
                  <th key={column} scope="col">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.reportItems.rows.map((row) => (
                <tr key={row.item}>
                  <th scope="row">{row.item}</th>
                  <td>
                    {row.href ? (
                      <Link
                        className={editorial.fullReportLink}
                        href={row.href}
                        style={{ marginTop: 0 }}
                      >
                        {row.meaning}
                      </Link>
                    ) : (
                      row.meaning
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <WebsiteAnatomyDetails data={data} />
      </div>
    </div>
  );
}
