const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

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
 * Authenticated fetch wrapper
 */
async function authFetch(url, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const updatedOptions = { ...options, headers };
  const res = await fetch(url, updatedOptions);

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      window.dispatchEvent(new Event('auth-expired'));
    }
  }
  return res;
}

/**
 * Authenticated fetch wrapper for Admins
 */
async function adminAuthFetch(url, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_access_token') : null;
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const updatedOptions = { ...options, headers };
  const res = await fetch(url, updatedOptions);

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_access_token');
      window.location.href = '/admin/login';
    }
  }
  return res;
}

/**
 * Register a new user
 */
export async function registerUser(payload) {
  const res = await fetch(`${BASE_URL}/auth/create-user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await extractError(res));
  return true;
}

/**
 * Log in to get access token
 */
export async function loginUser(username, password) {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);

  const res = await fetch(`${BASE_URL}/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
}

/**
 * Forgot password - request OTP
 */
export async function forgotPasswordRequestOtp(email) {
  const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
}

/**
 * Forgot password - verify OTP
 */
export async function forgotPasswordVerifyOtp(email, otp) {
  const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
}

/**
 * Forgot password - reset password
 */
export async function forgotPasswordReset(email, otp, newPassword, confirmPassword) {
  const res = await fetch(`${BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp, new_password: newPassword, confirm_password: confirmPassword }),
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
}

/**
 * Generate a Full Report.
 * Returns { html_report, ... }
 */
export async function generateFullReport(payload) {
  const res = await authFetch(`${BASE_URL}/report/generate-full`, {
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
  const res = await authFetch(`${BASE_URL}/report/generate-seo`, {
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
export function generateInstagramReport(payload) {
  return new Promise((resolve, reject) => {
    const wsUrl = BASE_URL.replace(/^http/, 'ws') + '/ws/report/generate-instagram';
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const ws = new WebSocket(token ? `${wsUrl}?token=${encodeURIComponent(token)}` : wsUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify(payload));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'result') {
          ws.close();
          resolve(data);
        } else if (data.type === 'error') {
          ws.close();
          reject(new Error(data.message || 'Error from backend'));
        }
        // Progress messages are ignored for now as requested
      } catch (err) {
        console.error('WebSocket message parse error:', err);
      }
    };

    ws.onerror = (error) => {
      reject(new Error('WebSocket connection failed'));
    };

    ws.onclose = (event) => {
      if (!event.wasClean) {
        reject(new Error('WebSocket closed unexpectedly'));
      }
    };
  });
}

/**
 * Generate a LinkedIn Audit Report.
 */
export async function generateLinkedInReport(payload) {
  const res = await authFetch(`${BASE_URL}/report/generate-linkedin`, {
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
  const res = await authFetch(
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
 * Search Google Maps for businesses matching a query.
 */
export async function searchGmbBusinesses(payload) {
  const res = await authFetch(`${BASE_URL}/gmb/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
}

/**
 * Generate a GMB Audit Report.
 */
export async function generateGmbReport(payload) {
  const res = await authFetch(`${BASE_URL}/report/generate-gmb`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
}

/**
 * Convert an HTML string to a PDF blob.
 * Returns a Blob of type application/pdf.
 * Do NOT use for client-side PDF generation (no WeasyPrint / html2pdf).
 */
export async function convertHtmlToPdf(htmlReport, filename) {
  const res = await authFetch(`${BASE_URL}/report/html-to-pdf`, {
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

/**
 * Fetch all users for the admin panel
 */
export async function getAdminUsers() {
  const res = await adminAuthFetch(`${BASE_URL}/admin/users`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
}

/**
 * Login specifically for admin portal
 */
export async function adminLogin(username, password) {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);

  const res = await fetch(`${BASE_URL}/auth/admin/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });

  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
}
