import Link from "next/link";
import { ArrowRight, Camera, FileText, ScanLine } from "lucide-react";
import styles from "./instagramAudit.module.css";

// # Editorial text stays in the data module. These small wrappers only establish
// reading order and section hierarchy; they never shorten or paraphrase content.
function Chapter({ number, children }) {
  return (
    <p className={styles.chapter}>
      <span>{number}</span>
      {children}
    </p>
  );
}

// # This is a schematic in the manuscript's screenshot slot, not a live form or
// a captured product image. No controls are interactive and no account is implied.
export function InstagramPreview({ screenshot }) {
  return (
    <figure className={styles.preview}>
      <div className={styles.previewHeader}>
        <span>
          <Camera size={17} aria-hidden="true" /> INSTAGRAM AUDIT
        </span>
        <span>Setup → Analysis → Report</span>
      </div>
      <div className={styles.previewBody}>
        <div className={styles.fields}>
          {[
            "Instagram Username",
            "Target Audience",
            "Hashtags",
            "Results Limit",
          ].map((field, index) => (
            <div key={field}>
              <span>0{index + 1}</span>
              <strong>{field}</strong>
              <span className={styles.fieldLine} aria-hidden="true" />
            </div>
          ))}
        </div>
        <ArrowRight
          className={styles.previewArrow}
          size={25}
          aria-hidden="true"
        />
        <div className={styles.previewOutput}>
          <ScanLine size={30} aria-hidden="true" />
          <strong>Engagement & content-funnel analysis</strong>
          <span>
            <FileText size={15} aria-hidden="true" /> Client-ready report
          </span>
        </div>
      </div>
      <figcaption>
        <span>{screenshot.placeholder}</span>
        {screenshot.caption}
      </figcaption>
    </figure>
  );
}

// # Instagram uses a continuous editorial layout, inspired by the Full Report's
// numbered rails. Examples supplement the original paragraph rather than replace
// it, and all long-form copy stays visible without tabs or expansion controls.
export default function InstagramStory({ data }) {
  return (
    <div className={styles.story}>
      <div className={styles.shell}>
        <nav className={styles.index} aria-label="Instagram audit sections">
          <span>
            <Camera size={16} aria-hidden="true" /> Inside the Instagram Audit
          </span>
          <a href="#instagram-engagement">01 / Engagement</a>
          <a href="#instagram-content">02 / Content</a>
          <a href="#instagram-coverage">03 / Coverage</a>
          <a href="#instagram-use-cases">04 / Use cases</a>
        </nav>

        <section
          id="instagram-engagement"
          className={styles.section}
          aria-labelledby="instagram-engagement-title"
        >
          <Chapter number="01">Beyond follower counts</Chapter>
          <div className={styles.split}>
            <div>
              <h2 id="instagram-engagement-title">{data.engagement.h2}</h2>
              <p>{data.engagement.body}</p>
            </div>
            {/* # Both examples are copied from the manuscript. Bar lengths express
                rates on the same 0–4% scale; they are not live account results. */}
            <div className={styles.comparison}>
              <div className={styles.comparisonHeader}>
                FOLLOWERS ≠ ENGAGEMENT
              </div>
              <div className={styles.account}>
                <span>
                  <strong>40</strong> followers
                </span>
                <b>0.6%</b>
                <div className={styles.rateTrack}>
                  <span style={{ width: "15%" }} />
                </div>
                <small>0.24 interactions per post</small>
              </div>
              <div className={styles.account}>
                <span>
                  <strong>992</strong> followers
                </span>
                <b>3.451%</b>
                <div className={styles.rateTrack}>
                  <span style={{ width: "86.275%" }} />
                </div>
                <small>34.23 interactions per post</small>
              </div>
              <div className={styles.benchmarks}>
                <span>Follower benchmarks</span>
                <strong>1%</strong>
                <strong>2%</strong>
              </div>
            </div>
          </div>
        </section>

        <section
          className={styles.section}
          aria-labelledby="instagram-inputs-title"
        >
          <Chapter number="/">From account to analysis</Chapter>
          <h2 id="instagram-inputs-title">{data.inputs.h2}</h2>
          <div className={styles.inputFlow}>
            <div>
              <span className={styles.smallLabel}>INPUT</span>
              <p>{data.inputs.entered}</p>
            </div>
            <ArrowRight
              size={22}
              className={styles.flowArrow}
              aria-hidden="true"
            />
            <div>
              <span className={styles.smallLabel}>ANALYSIS</span>
              <p>{data.inputs.reviewed}</p>
            </div>
          </div>
        </section>

        {/* # Visible semantic table keeps every metric definition searchable.
            Narrow screens wrap the text instead of requiring a horizontal scrollbar. */}
        <section
          className={styles.section}
          aria-labelledby="instagram-metrics-title"
        >
          <h2 id="instagram-metrics-title">{data.metrics.h2}</h2>
          <table className={styles.metrics}>
            <caption>{data.metrics.h2}</caption>
            <thead>
              <tr>
                {data.metrics.columns.map((column) => (
                  <th key={column} scope="col">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.metrics.rows.map((row) => (
                <tr key={row.metric}>
                  <th scope="row">{row.metric}</th>
                  <td>{row.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section
          id="instagram-content"
          className={styles.contentSection}
          aria-labelledby="instagram-strategy-title"
        >
          <Chapter number="02">The post, then the pattern</Chapter>
          <div className={styles.strategy}>
            <h2 id="instagram-strategy-title">{data.strategy.h2}</h2>
            <p>{data.strategy.body}</p>
          </div>
          <div
            className={styles.postAnatomy}
            aria-label="Post analysis sequence"
          >
            <span>Hook</span>
            <ArrowRight size={16} aria-hidden="true" />
            <span>Body</span>
            <ArrowRight size={16} aria-hidden="true" />
            <span>Call to action</span>
          </div>
          <div className={styles.funnel}>
            <div>
              <h2>{data.funnel.h2}</h2>
              <p>{data.funnel.body}</p>
            </div>
            <div className={styles.funnelDiagram}>
              <span className={styles.smallLabel}>IDEAL CONTENT MIX</span>
              <div
                className={styles.funnelBar}
                role="img"
                aria-label="Ideal content mix: TOFU 60%, MOFU 20%, BOFU 20%"
              >
                <span>60%</span>
                <span>20%</span>
                <span>20%</span>
              </div>
              <dl className={styles.funnelLegend}>
                <div>
                  <dt>TOFU</dt>
                  <dd>Awareness</dd>
                </div>
                <div>
                  <dt>MOFU</dt>
                  <dd>Consideration</dd>
                </div>
                <div>
                  <dt>BOFU</dt>
                  <dd>Decision</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section
          id="instagram-coverage"
          className={styles.section}
          aria-labelledby="instagram-coverage-title"
        >
          <Chapter number="03">The report, unpacked</Chapter>
          <h2 id="instagram-coverage-title">What the Instagram Audit Covers</h2>
          {/* # Preserve each supplied bullet as one text string, including its colon
              and terminal punctuation. Numbers are decorative, not rewritten copy. */}
          <ul className={styles.capabilities}>
            {data.capabilities.map((line, index) => (
              <li key={line}>
                <span aria-hidden="true">0{index + 1}</span>
                <p>{line}</p>
                <ArrowRight size={16} aria-hidden="true" />
              </li>
            ))}
          </ul>
        </section>

        <section
          id="instagram-use-cases"
          className={styles.section}
          aria-labelledby="instagram-use-cases-title"
        >
          <Chapter number="04">Put the findings to work</Chapter>
          <h2 id="instagram-use-cases-title">When to Run an Instagram Audit</h2>
          <div className={styles.useCases}>
            {data.useCases.map((item, index) => (
              <article key={item.title}>
                <span className={styles.useNumber}>0{index + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
          <Link href="/full-report" className={styles.reportLink}>
            Full Report <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </section>
      </div>
    </div>
  );
}
