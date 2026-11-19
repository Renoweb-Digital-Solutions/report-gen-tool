/**
 * Display exact branded HTML produced by any supported individual audit service.
 * AgentReportPanel mounts this for allowlisted server-generated report artifacts.
 * PDF export reuses /report/html-to-pdf through the existing authenticated adapter;
 * it converts this document and never triggers another audit or invents metrics.
 * HTML is isolated in a sandboxed iframe without script or same-origin privileges.
 */
"use client";

import { useEffect, useRef, useState } from "react";
import { Download, LoaderCircle } from "lucide-react";
import { convertHtmlToPdf, downloadBlob } from "@/app/lib/api";
import styles from "./agent.module.css";

// ============================================================================
// REAL DOCUMENT PREVIEW AND ON-DEMAND PDF
// The HTML is never inserted into the dashboard DOM. Conversion is user-initiated
// and serialized with a ref guard; repeated downloads reuse the held PDF blob.
// On unmount, a late conversion must not download into a different conversation.
// ============================================================================

/** Render one immutable report; the parent keys this component by artifact ID. */
export default function WebsiteAnatomyArtifact({ report, verified }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const pdfRef = useRef(null);
  const pendingRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  /** Convert the same report HTML used by the manual tab, retaining export errors. */
  async function downloadPdf() {
    if (pendingRef.current) return;
    pendingRef.current = true;
    setLoading(true);
    setError("");
    try {
      const blob =
        pdfRef.current ||
        (await convertHtmlToPdf(report.html_report, report.filename));
      if (!mountedRef.current) return;
      pdfRef.current = blob;
      downloadBlob(blob, report.filename);
    } catch (conversionError) {
      if (mountedRef.current)
        setError(
          conversionError.message ||
            "Could not prepare the PDF. Please try again.",
        );
    } finally {
      pendingRef.current = false;
      if (mountedRef.current) setLoading(false);
    }
  }

  return (
    <div className={styles.documentArtifact}>
      <div className={styles.documentActions}>
        <div>
          <span
            className={`${styles.resultStatus} ${verified ? styles.verified : styles.unverified}`}
          >
            {verified ? "Report ready" : "Report generated · task unverified"}
          </span>
          <strong>{report.title || "Audit report"}</strong>
        </div>
        <button
          type="button"
          onClick={downloadPdf}
          disabled={loading}
          className={styles.pdfButton}
        >
          {loading ? <LoaderCircle size={15} /> : <Download size={15} />}
          {loading ? "Preparing PDF…" : "Download PDF"}
        </button>
      </div>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      {/* Neither allow-scripts nor allow-same-origin is needed for the branded
          static report. Scraped/model-generated markup cannot access chat state. */}
      <iframe
        className={styles.documentFrame}
        srcDoc={report.html_report}
        title={report.title || "Audit report"}
        sandbox=""
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
