import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  FileText,
  Globe,
  Camera,
  Briefcase,
  MapPin,
  MonitorSmartphone,
  ScanLine,
} from "lucide-react";
import { PRICING_PLANS } from "../../data/pricingPlans";
import styles from "./fullReport.module.css";

const CHANNEL_ICONS = [
  Globe,
  Camera,
  Briefcase,
  MapPin,
  MonitorSmartphone,
  ScanLine,
];

// # Small shared primitives keep every chapter on the same typographic baseline.
// Use real anchor links so visitors can move through the report without JS state,
// hidden panels, or scroll-triggered content that can obscure essential copy.
function Chapter({ number, children }) {
  return (
    <p className={styles.chapter}>
      <span>{number}</span>
      {children}
    </p>
  );
}

function DetailLinks({ links }) {
  return links?.map((link) => (
    <Link key={link.href} href={link.href} className={styles.link}>
      {link.label}
      <ArrowRight size={15} aria-hidden="true" />
    </Link>
  ));
}

// # A static, responsive source-to-export schematic echoes the homepage's
// convergence motif. It communicates the product without fabricated scores.
export function FullReportPreview() {
  return (
    <div className={styles.preview}>
      <div className={styles.previewTop}>
        <span>FULL REPORT / SOURCE MAP</span>
        <span>One setup. One export.</span>
      </div>
      <div className={styles.previewFlow}>
        <div className={styles.sourceNames}>
          <span>
            <Globe size={18} aria-hidden="true" />
            Website
          </span>
          <span>
            <Camera size={18} aria-hidden="true" />
            Social profiles
          </span>
          <span>
            <MapPin size={18} aria-hidden="true" />
            Google Business
          </span>
        </div>
        <div className={styles.connector} aria-hidden="true">
          <span />
          <ArrowRight size={22} />
        </div>
        <div className={styles.export}>
          <FileText size={34} aria-hidden="true" />
          <div>
            <strong>Your Full Report</strong>
            <span>Grades · Evidence · Recommendations</span>
          </div>
          <span className={styles.pdf}>PDF</span>
        </div>
      </div>
      <p className={styles.previewFoot}>
        Website required · Add the channels you have · A point-in-time audit
      </p>
    </div>
  );
}

// # The Full Report has a document-like reading order, distinct from single audits.
// All supplied paragraphs stay visible. The visual language borrows the homepage's
// converging sources and export document, using rails and rules instead of tiles.
// The three score labels below illustrate hierarchy, not fabricated report data.
export default function FullReportStory({ data, onStart }) {
  const [overview, rationale, scores, executive] = data.contentBlocks;

  return (
    <div className={styles.story}>
      <div className={styles.shell}>
        <nav className={styles.index} aria-label="Full Report sections">
          <span className={styles.indexLabel}>
            <FileText size={16} aria-hidden="true" /> Inside the report
          </span>
          <a href="#report-coverage">01 / Coverage</a>
          <a href="#report-scores">02 / Scores</a>
          <a href="#report-workflow">03 / Process</a>
          <a href="#report-plans">04 / Plan limits</a>
        </nav>

        <section
          className={styles.intro}
          aria-labelledby="report-overview-title"
        >
          <div>
            <Chapter number="/">The whole picture</Chapter>
            <h2 id="report-overview-title">{overview.h2}</h2>
            <button className={styles.start} onClick={onStart}>
              Start My Full Report <ArrowRight size={17} aria-hidden="true" />
            </button>
          </div>
          <div className={styles.introCopy}>
            <p>{overview.body}</p>
            <h3>{rationale.h2}</h3>
            <p>{rationale.body}</p>
          </div>
        </section>

        {/* # Variable-length content gets natural row heights, never equal-height empty cards. */}
        <section
          id="report-coverage"
          className={styles.section}
          aria-labelledby="coverage-title"
        >
          <Chapter number="01">The report, unpacked</Chapter>
          <div className={styles.sectionHeading}>
            <h2 id="coverage-title">{data.featureGrid.h2}</h2>
            <p>{data.featureGrid.subtitle}</p>
          </div>
          <div className={styles.coverage}>
            {data.featureGrid.items.map((item, index) => {
              const Icon = CHANNEL_ICONS[index];
              return (
                <article key={item.title} className={styles.channel}>
                  <span className={styles.rowNumber}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3>
                    <Icon size={20} aria-hidden="true" />
                    {item.title}
                  </h3>
                  <div>
                    <p>{item.desc}</p>
                    <div className={styles.links}>
                      <DetailLinks links={item.links} />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <aside className={styles.note}>
            <span>Missing assets</span>
            <p>{data.featureGrid.note}</p>
          </aside>
        </section>

        <section
          id="report-scores"
          className={styles.scoreSection}
          aria-labelledby="scores-title"
        >
          <div>
            <Chapter number="02">Read the result first</Chapter>
            <h2 id="scores-title">{scores.h2}</h2>
            <p>{scores.body}</p>
          </div>
          <div className={styles.scoreSheet}>
            <div className={styles.sheetHeader}>
              <FileText size={18} aria-hidden="true" />
              <span>REPORT / READING ORDER</span>
            </div>
            <ol className={styles.scoreList}>
              {["Authority Score", "Website Health", "AI Visibility Score"].map(
                (label, index) => (
                  <li key={label}>
                    <span>0{index + 1}</span>
                    <strong>{label}</strong>
                    <span className={styles.scoreMark} aria-hidden="true">
                      ↗
                    </span>
                  </li>
                ),
              )}
            </ol>
            <div className={styles.evidenceFlow}>
              <span>Grades</span>
              <ArrowRight size={14} aria-hidden="true" />
              <span>Evidence</span>
              <ArrowRight size={14} aria-hidden="true" />
              <span>Recommendations</span>
            </div>
            <p className={styles.caption}>
              Report structure · Scores appear after generation
            </p>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="audience-title">
          <Chapter number="/">Put it to work</Chapter>
          <div className={styles.sectionHeading}>
            <h2 id="audience-title">{data.audienceGrid.h2}</h2>
            <p>{data.audienceGrid.subtitle}</p>
          </div>
          <div className={styles.useCases}>
            {data.audienceGrid.items.map((item, index) => (
              <article key={item.title}>
                <span className={styles.rowNumber}>0{index + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
          <aside className={styles.note}>
            <span>Scope of the report</span>
            <p>{data.audienceGrid.note}</p>
          </aside>
        </section>

        <section
          id="report-workflow"
          className={styles.section}
          aria-labelledby="workflow-title"
        >
          <Chapter number="03">From sources to PDF</Chapter>
          <div className={styles.workflow}>
            <div className={styles.workflowIntro}>
              <h2 id="workflow-title">{data.workflow.h2}</h2>
              <div className={styles.route} aria-hidden="true">
                <span>YOUR SOURCES</span>
                <ArrowDown size={22} />
                <FileText size={35} />
                <strong>ONE FULL REPORT</strong>
              </div>
            </div>
            <div>
              <ol className={styles.steps}>
                {data.workflow.steps.map((step, index) => (
                  <li key={step.title}>
                    <span className={styles.stepNumber}>0{index + 1}</span>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className={styles.screenLink}>
                Want to see the steps with screens?{" "}
                <Link href="/how-it-works" className={styles.link}>
                  How it works <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* # Executive advice is its own visible section, not the final tab of a carousel. */}
        <section className={styles.executive} aria-labelledby="executive-title">
          <Chapter number="/">Ready for the next conversation</Chapter>
          <div className={styles.executiveBody}>
            <h2 id="executive-title">{executive.h2}</h2>
            <div>
              {executive.body.split("\n\n").map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <DetailLinks
                links={[
                  {
                    label: "Explore Flawdits for agencies",
                    href: "/for-agencies",
                  },
                ]}
              />
            </div>
          </div>
          <div className={styles.handoff}>
            <span>Prospect call</span>
            <ArrowRight size={16} aria-hidden="true" />
            <span>Client proposal</span>
            <ArrowRight size={16} aria-hidden="true" />
            <span>Leadership brief</span>
          </div>
        </section>

        {/* # Prices and limits are read from the same source as the Pricing page.
            The table stays semantic on mobile and scrolls within its own region. */}
        <section
          id="report-plans"
          className={styles.section}
          aria-labelledby="plans-title"
        >
          <Chapter number="04">Choose your reporting capacity</Chapter>
          <div className={styles.sectionHeading}>
            <h2 id="plans-title">Plan limits</h2>
            <p>From your first audit to reporting at agency scale.</p>
          </div>
          <div
            className={styles.tableScroll}
            role="region"
            aria-label="Plan prices and daily report limits"
            tabIndex={0}
          >
            <table className={styles.plans}>
              <caption>Full Report pricing and daily report allowances</caption>
              <thead>
                <tr>
                  <th scope="col">Plan</th>
                  <th scope="col">Price</th>
                  <th scope="col">Report allowance</th>
                </tr>
              </thead>
              <tbody>
                {PRICING_PLANS.map((plan) => (
                  <tr key={plan.name}>
                    <th scope="row">
                      {plan.name === "Custom (Agency)"
                        ? "Custom (Agency and Enterprise)"
                        : plan.name}
                    </th>
                    <td>
                      {plan.name === "Free"
                        ? plan.trial
                        : plan.price === "Custom"
                          ? "Contact sales"
                          : `${plan.price} per month`}
                    </td>
                    <td>
                      {plan.allowance}
                      {plan.price === "Custom" && (
                        <span className={styles.whiteLabel}>
                          White-label branding included
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.planFooter}>
            <p>All plans are billed monthly.</p>
            <Link href="/pricing" className={styles.link}>
              See full plan details <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
