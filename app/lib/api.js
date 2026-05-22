/**
 * Renoweb Report API client
 * Base URL: http://72.62.247.229:8004
 */

const BASE_URL = 'http://72.62.247.229:8004';

/**
 * Normalise an error from a fetch response into a human-readable string.
 */
async function extractError(res) {
  try {
    const body = await res.json();
    const detail = body.detail;

    // FastAPI can return detail as a plain string
    if (typeof detail === 'string') return detail;

    // FastAPI validation errors come as an array: [{loc, msg, type}, ...]
    if (Array.isArray(detail)) {
      return detail.map((d) => d.msg || JSON.stringify(d)).join('; ');
    }

    // Some APIs return detail as a nested object
    if (detail && typeof detail === 'object') {
      return JSON.stringify(detail);
    }

    return body.message || body.error || `Request failed (${res.status})`;
  } catch {
    return `Request failed (${res.status})`;
  }
}

/**
 * Generate a Full Report.
 * Returns { html_report, ... }
 */
export async function generateFullReport(payload) {
  const res = await fetch(`${BASE_URL}/report/generate-full`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
}

/**
 * Generate a Website Anatomy (SEO) Report.
 */
export async function generateWebsiteReport(payload) {
  const res = await fetch(`${BASE_URL}/report/generate-seo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
}

/**
 * Generate an Instagram Audit Report.
 */
export async function generateInstagramReport(payload) {
  const res = await fetch(`${BASE_URL}/report/generate-instagram`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
}

/**
 * Generate a LinkedIn Audit Report.
 */
export async function generateLinkedInReport(payload) {
  const res = await fetch(`${BASE_URL}/report/generate-linkedin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
}

/**
 * Generate a Visual Brand Match Report.
 * payload is a FormData object (multipart/form-data).
 */
export async function generateVisualReport(formData) {
  const res = await fetch(
    `${BASE_URL}/report/check-website-instagram-alignment`,
    {
      method: 'POST',
      // Do NOT set Content-Type — browser sets it with boundary automatically
      body: formData,
    }
  );
  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
}

/**
 * Convert an HTML string to a PDF blob.
 * Returns a Blob of type application/pdf.
 * Do NOT use for client-side PDF generation (no WeasyPrint / html2pdf).
 */
export async function convertHtmlToPdf(htmlReport, filename) {
  const res = await fetch(`${BASE_URL}/report/html-to-pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html: htmlReport, filename }),
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.blob();
}

/**
 * Trigger a browser download from a Blob.
 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
