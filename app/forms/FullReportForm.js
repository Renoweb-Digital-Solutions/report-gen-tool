"use client";

// ============================================================================
// CONSENTED CONFIGURATION OBSERVATION
// Explicit data-analytics attributes expose only stable settings/control codes to
// AnalyticsProvider. They never change form state, validation or API payloads.
// Customer text, domains, profile links and advertiser IDs remain unannotated.
// ============================================================================

import { useState, useEffect } from "react";
import FileUploadZone from "../components/FileUploadZone";
import FormField from "../components/FormField";
import ErrorBanner from "../components/ErrorBanner";
import { useSessionState } from "../hooks/useSessionState";
import { getMetaCountries, getGoogleRegions } from "../lib/api";
import {
  Globe,
  Camera,
  Briefcase,
  MapPin,
  ChevronDown,
  Sparkles,
  User,
  Palette,
} from "lucide-react";
import AnimatedSubmitButton from "../components/AnimatedSubmitButton";
// Composite social sections explain their own rates; the button sums all modules.
import PostCreditRate from "../features/credits/pricing/PostCreditRate";

const POSTED_OPTIONS = [
  { value: "24h", label: "Last 24 hours" },
  { value: "week", label: "Last week" },
  { value: "month", label: "Last month" },
  { value: "3months", label: "Last 3 months" },
  { value: "6months", label: "Last 6 months" },
  { value: "year", label: "Last year" },
];

const DEFAULTS = {
  domain: "",
  ig_username: "",
  ig_results_limit: 25,
  linkedin_company_url: "",
  linkedin_results_limit: 25,
  linkedin_posted_limit: "3months",
  // Personal settings persist with the existing form, independently of company
  // settings. Older saved sessions omit these keys, so consumers supply defaults.
  linkedin_personal_url: "",
  linkedin_personal_results_limit: 20,
  linkedin_personal_posted_limit: "3months",
  gmb_company_name: "",
  gmb_target_url: "",
  gmb_location_query: "",
  ui_ux_url: "",
  ads_platform: "google",
  ads_google_domain: "",
  ads_google_region: "anywhere",
  ads_google_time_period: "last_30_days",
  ads_google_ad_format: "all",
  ads_google_platform: "all",
  ads_meta_query: "",
  ads_meta_country: "ALL",
  ads_meta_media_type: "all",
  ads_meta_active_status: "all",
  ads_meta_platforms: ["facebook", "instagram"],
  ads_limit: 20,
};

// ============================================================================
// EPHEMERAL VISUAL UPLOADS
// Full Report uses JSON, while the standalone visual form uses multipart uploads.
// Convert files to the backend's existing data-URL fields only during submission;
// never place image bytes in the session-persisted fields object. The 8 MiB limit
// matches the backend upload limit and is enforced again by request validation.
// ============================================================================
/** Read one selected image for handleSubmit; reject invalid or unreadable files. */
function readVisualImage(file) {
  return new Promise((resolve, reject) => {
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      reject(new Error("Please upload PNG, JPG or WEBP images."));
      return;
    }
    if (!file.size || file.size > 8 * 1024 * 1024) {
      reject(new Error("Each image must contain data and be 8 MB or smaller."));
      return;
    }
    const reader = new FileReader();
    // These handlers belong to this single read and settle the promise once.
    // Fail before onSubmit so incomplete images never start a paid audit.
    reader.onload = () => resolve(reader.result);
    reader.onerror = () =>
      reject(new Error("An image could not be read. Please select it again."));
    reader.onabort = () =>
      reject(new Error("Image loading was cancelled. Please try again."));
    reader.readAsDataURL(file);
  });
}

/** Collect optional audit inputs for the dashboard's existing Full Report runner. */
export default function FullReportForm({
  loading,
  error,
  onDismissError,
  onSubmit,
}) {
  const [fields, setFields] = useSessionState("form_full", DEFAULTS);

  // Files live only in this mounted form, avoiding sessionStorage quota and privacy
  // issues. Resetting the key also clears FileUploadZone's displayed filenames.
  const [visualFiles, setVisualFiles] = useState({
    website: null,
    instagram: null,
  });
  const [uploadKey, setUploadKey] = useState(0);
  const [preparingImages, setPreparingImages] = useState(false);
  const [formError, setFormError] = useState("");

  const [metaCountries, setMetaCountries] = useState([]);
  const [googleRegions, setGoogleRegions] = useState([]);

  useEffect(() => {
    getMetaCountries()
      .then((data) => {
        if (data && data.countries) {
          const sorted = [...data.countries].sort((a, b) => {
            const nameA = (typeof a === "string" ? a : a.name) || "";
            const nameB = (typeof b === "string" ? b : b.name) || "";
            return nameA.localeCompare(nameB);
          });
          setMetaCountries(sorted);
        }
      })
      .catch(() => {});

    getGoogleRegions()
      .then((data) => {
        if (data && data.regions) {
          const sorted = [...data.regions].sort((a, b) => {
            const nameA = (typeof a === "string" ? a : a.name) || "";
            const nameB = (typeof b === "string" ? b : b.name) || "";
            return nameA.localeCompare(nameB);
          });
          setGoogleRegions(sorted);
        }
      })
      .catch(() => {});
  }, []);

  // Accordion state
  const [openSections, setOpenSections] = useState({
    ig: false,
    li: false,
    li_personal: false,
    visual: false,
    gmb: false,
    ui_ux: false,
    ads: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  /** Let keyboard users open the two added optional accordion sections. */
  const handleSectionKey = (event, section) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleSection(section);
    }
  };

  /** Store a selected File locally; actual reading waits until form submission. */
  const selectVisualFile = (field) => (file) => {
    // Disabled inputs do not suppress custom drop handlers; guard this callback
    // while files are being read or the report is running as well.
    if (loading || preparingImages) return;
    setVisualFiles((previous) => ({ ...previous, [field]: file }));
    setFormError("");
  };

  /** Remove both optional images and reset the upload controls together. */
  const clearVisualFiles = () => {
    setVisualFiles({ website: null, instagram: null });
    setUploadKey((previous) => previous + 1);
    setFormError("");
  };

  const set = (key) => (e) =>
    setFields((prev) => ({ ...prev, [key]: e.target.value }));

  /** Build shared audit selections for submission and estimation; never send prices.
   * Image bytes are added only in handleSubmit. The local visual-selection hint
   * below is used for pricing display and is never submitted to the server.
   */
  function buildPricingPayload() {
    const payload = {
      domain: fields.domain.trim(),
      ...(fields.ig_username.trim() && {
        ig_username: fields.ig_username.trim(),
        ig_results_limit: Number(fields.ig_results_limit),
      }),
      ...(fields.linkedin_company_url.trim() && {
        linkedin_company_url: fields.linkedin_company_url.trim(),
        linkedin_results_limit: Number(fields.linkedin_results_limit),
        linkedin_posted_limit: fields.linkedin_posted_limit,
      }),
      // Use optional access because pre-existing saved form sessions have none
      // of these new keys. Company and personal profiles can both be submitted.
      ...(fields.linkedin_personal_url?.trim() && {
        linkedin_personal_url: fields.linkedin_personal_url.trim(),
        linkedin_personal_results_limit: Number(
          fields.linkedin_personal_results_limit ?? 20,
        ),
        linkedin_personal_posted_limit:
          fields.linkedin_personal_posted_limit || "3months",
      }),
    };

    if (
      fields.gmb_company_name?.trim() &&
      fields.gmb_target_url?.trim() &&
      fields.gmb_location_query?.trim()
    ) {
      payload.gmb_company_name = fields.gmb_company_name.trim();
      payload.gmb_target_url = fields.gmb_target_url.trim();
      payload.gmb_location_query = fields.gmb_location_query.trim();
    }

    if (fields.ui_ux_url?.trim()) {
      payload.ui_ux_url = fields.ui_ux_url.trim();
    }

    if (fields.ads_google_domain?.trim() || fields.ads_meta_query?.trim()) {
      payload.ads_platform = fields.ads_platform;
      payload.ads_limit = Number(fields.ads_limit);
      if (
        fields.ads_platform === "google" &&
        fields.ads_google_domain?.trim()
      ) {
        payload.ads_google_domain = fields.ads_google_domain.trim();
        payload.ads_google_region = fields.ads_google_region;
        payload.ads_google_time_period = fields.ads_google_time_period;
        payload.ads_google_ad_format = fields.ads_google_ad_format;
        payload.ads_google_platform = fields.ads_google_platform;
      } else if (
        fields.ads_platform === "meta" &&
        fields.ads_meta_query?.trim()
      ) {
        payload.ads_meta_query = fields.ads_meta_query.trim();
        payload.ads_meta_country = fields.ads_meta_country;
        payload.ads_meta_media_type = fields.ads_meta_media_type;
        payload.ads_meta_active_status = fields.ads_meta_active_status;
        payload.ads_meta_platforms = fields.ads_meta_platforms;
      }
    }

    return payload;
  }

  // Rebuilding this small object is local only; settings changes never fetch pricing.
  const pricingPayload = buildPricingPayload();

  // Estimate visual matching when both references are selected without reading
  // images on every render. Server pricing uses actual submitted images instead
  // of trusting this display-only flag; amounts never enter the request payload.
  const pricingInput = {
    ...pricingPayload,
    visual_images_selected: Boolean(
      visualFiles.website && visualFiles.instagram,
    ),
  };

  /** Submit the estimated selections, adding image bytes before server billing. */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || preparingImages) return;
    setFormError("");
    // Clone selections so image preparation cannot mutate the render-time
    // estimate or accidentally submit the local visual-selection flag.
    const payload = { ...pricingPayload };
    // The comparison requires both references. Leaving both blank omits the
    // module; a partially filled pair needs feedback instead of a silent skip.
    if (Boolean(visualFiles.website) !== Boolean(visualFiles.instagram)) {
      setFormError(
        "Upload both the website screenshot and Instagram moodboard for Visual Brand Match.",
      );
      setOpenSections((previous) => ({ ...previous, visual: true }));
      return;
    }
    if (visualFiles.website && visualFiles.instagram) {
      setPreparingImages(true);
      try {
        const [websiteImage, instagramImage] = await Promise.all([
          readVisualImage(visualFiles.website),
          readVisualImage(visualFiles.instagram),
        ]);
        payload.website_image_base64 = websiteImage;
        payload.ig_moodboard_base64 = instagramImage;
      } catch (readError) {
        setFormError(readError.message);
        return;
      } finally {
        setPreparingImages(false);
      }
    }
    onSubmit(payload);
  };

  return (
    <form id="form-full-report" onSubmit={handleSubmit} noValidate>
      <h2 className="form-panel-title">Full Report</h2>
      <p className="form-panel-subtitle">
        Comprehensive audit combining SEO, social, and visual brand analysis.
      </p>

      {error && <ErrorBanner message={error} onDismiss={onDismissError} />}
      {/* Local image errors are separate from the dashboard's request errors. */}
      {formError && (
        <ErrorBanner message={formError} onDismiss={() => setFormError("")} />
      )}

      <div className="form-grid" style={{ marginTop: error ? 16 : 0 }}>
        {/* ── Website ── */}
        <div className="form-section-header">
          <div className="section-icon-chip">
            <Globe size={16} strokeWidth={2.5} />
          </div>
          <div className="form-section-title">Website</div>
        </div>

        <FormField
          label="Website Domain"
          htmlFor="full-domain"
          required
          tooltip="The primary domain to audit"
        >
          <input
            id="full-domain"
            className="form-input"
            type="text"
            placeholder="e.g. example.com"
            value={fields.domain}
            onChange={set("domain")}
            required
          />
        </FormField>

        {/* ── Instagram ── */}
        <div
          className="form-section-header clickable"
          data-analytics-control="section_instagram"
          aria-expanded={openSections.ig}
          onClick={() => toggleSection("ig")}
        >
          <div className="section-icon-chip">
            <Camera size={16} strokeWidth={2.5} />
          </div>
          <div className="form-section-title">
            Instagram
            <span className="optional-badge">Optional</span>
          </div>
          <ChevronDown
            size={18}
            className="accordion-chevron"
            style={{
              transform: openSections.ig ? "rotate(180deg)" : "none",
              transition: "transform 0.3s",
            }}
          />
        </div>

        <div className={`accordion-content ${openSections.ig ? "open" : ""}`}>
          <div className="form-grid">
            <FormField
              label="Instagram Username"
              htmlFor="full-ig-username"
              tooltip="Brand's handle without the @ symbol"
            >
              <input
                id="full-ig-username"
                className="form-input"
                type="text"
                placeholder="yourbrand"
                value={fields.ig_username}
                onChange={set("ig_username")}
              />
            </FormField>

            <FormField
              label="Instagram Results Limit"
              htmlFor="full-ig-limit"
              tooltip="Number of recent posts to analyze"
            >
              {/* Composite audits use the same post bounds as standalone runs. */}
              <input
                id="full-ig-limit"
                aria-describedby="full-ig-post-price"
                data-analytics-setting="ig_results_limit"
                className="form-input"
                type="number"
                min={1}
                max={100}
                value={fields.ig_results_limit}
                onChange={set("ig_results_limit")}
              />
              {/* Per-component help stays available before optional target entry. */}
              <PostCreditRate
                id="full-ig-post-price"
                module="instagram"
                payload={fields}
              />
            </FormField>
          </div>
        </div>

        {/* ── LinkedIn ── */}
        <div
          className="form-section-header clickable"
          data-analytics-control="section_linkedin"
          aria-expanded={openSections.li}
          onClick={() => toggleSection("li")}
        >
          <div className="section-icon-chip">
            <Briefcase size={16} strokeWidth={2.5} />
          </div>
          <div className="form-section-title">
            LinkedIn Company
            <span className="optional-badge">Optional</span>
          </div>
          <ChevronDown
            size={18}
            className="accordion-chevron"
            style={{
              transform: openSections.li ? "rotate(180deg)" : "none",
              transition: "transform 0.3s",
            }}
          />
        </div>

        <div className={`accordion-content ${openSections.li ? "open" : ""}`}>
          <div className="form-grid">
            <FormField
              label="LinkedIn Company URL"
              htmlFor="full-li-url"
              tooltip="Full URL to the company page"
            >
              <input
                id="full-li-url"
                className="form-input"
                type="url"
                placeholder="https://linkedin.com/company/yourbrand"
                value={fields.linkedin_company_url}
                onChange={set("linkedin_company_url")}
              />
            </FormField>

            <div className="form-grid-2">
              <FormField label="Results Limit" htmlFor="full-li-limit">
                <input
                  id="full-li-limit"
                  aria-describedby="full-li-post-price"
                  data-analytics-setting="linkedin_results_limit"
                  className="form-input"
                  type="number"
                  min={1}
                  value={fields.linkedin_results_limit}
                  onChange={set("linkedin_results_limit")}
                />
                {/* Map the Full Report window field to standalone pricing keys. */}
                <PostCreditRate
                  id="full-li-post-price"
                  module="linkedin"
                  payload={{
                    ...fields,
                    posted_limit: fields.linkedin_posted_limit,
                  }}
                />
              </FormField>
              <FormField label="Time Range" htmlFor="full-li-posted">
                <select
                  id="full-li-posted"
                  data-analytics-setting="linkedin_posted_limit"
                  className="form-select"
                  value={fields.linkedin_posted_limit}
                  onChange={set("linkedin_posted_limit")}
                >
                  {POSTED_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
          </div>
        </div>

        {/* ==================================================================
            PERSONAL LINKEDIN: independent URL, limit and period are forwarded to
            the shared personal-profile pipeline in the combined backend request.
            ================================================================== */}
        <div
          className="form-section-header clickable"
          role="button"
          tabIndex={0}
          aria-expanded={openSections.li_personal}
          aria-controls="full-personal-section"
          onClick={() => toggleSection("li_personal")}
          onKeyDown={(event) => handleSectionKey(event, "li_personal")}
        >
          <div className="section-icon-chip">
            <User size={16} strokeWidth={2.5} />
          </div>
          <div className="form-section-title">
            LinkedIn Personal<span className="optional-badge">Optional</span>
          </div>
          <ChevronDown
            size={18}
            className="accordion-chevron"
            style={{
              transform: openSections.li_personal ? "rotate(180deg)" : "none",
            }}
          />
        </div>
        <div
          id="full-personal-section"
          className={`accordion-content ${openSections.li_personal ? "open" : ""}`}
        >
          <div className="form-grid">
            <FormField
              label="LinkedIn Personal Profile URL"
              htmlFor="full-personal-url"
              tooltip="Full URL to the personal profile to audit"
            >
              <input
                id="full-personal-url"
                className="form-input"
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={fields.linkedin_personal_url || ""}
                onChange={set("linkedin_personal_url")}
              />
            </FormField>
            <div className="form-grid-2">
              <FormField label="Results Limit" htmlFor="full-personal-limit">
                <input
                  id="full-personal-limit"
                  aria-describedby="full-personal-post-price"
                  className="form-input"
                  type="number"
                  min={1}
                  max={50}
                  value={fields.linkedin_personal_results_limit ?? 20}
                  onChange={set("linkedin_personal_results_limit")}
                />
                {/* Reuse Credits' dynamic per-post rate with the personal field
                    aliases; this hint and the total share the same rule catalog. */}
                <PostCreditRate
                  id="full-personal-post-price"
                  module="linkedin_personal"
                  payload={{
                    linkedin_url: fields.linkedin_personal_url || "",
                    results_limit: fields.linkedin_personal_results_limit ?? 20,
                    posted_limit:
                      fields.linkedin_personal_posted_limit || "3months",
                  }}
                />
              </FormField>
              <FormField label="Time Range" htmlFor="full-personal-posted">
                <select
                  id="full-personal-posted"
                  className="form-select"
                  value={fields.linkedin_personal_posted_limit || "3months"}
                  onChange={set("linkedin_personal_posted_limit")}
                >
                  {POSTED_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
          </div>
        </div>

        {/* ==================================================================
            VISUAL BRAND MATCH: the existing shared upload controls collect the
            same two reference images used by the standalone visual audit.
            ================================================================== */}
        <div
          className="form-section-header clickable"
          role="button"
          tabIndex={0}
          aria-expanded={openSections.visual}
          aria-controls="full-visual-section"
          onClick={() => toggleSection("visual")}
          onKeyDown={(event) => handleSectionKey(event, "visual")}
        >
          <div className="section-icon-chip">
            <Palette size={16} strokeWidth={2.5} />
          </div>
          <div className="form-section-title">
            Visual Brand Match<span className="optional-badge">Optional</span>
          </div>
          <ChevronDown
            size={18}
            className="accordion-chevron"
            style={{
              transform: openSections.visual ? "rotate(180deg)" : "none",
            }}
          />
        </div>
        <div
          id="full-visual-section"
          className={`accordion-content ${openSections.visual ? "open" : ""}`}
        >
          <fieldset
            className="form-grid"
            disabled={loading || preparingImages}
            style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}
          >
            <p className="form-panel-subtitle">
              Compare a website screenshot with an Instagram moodboard. Upload
              both images to include this section. PNG, JPG or WEBP, up to 8 MB
              each.
            </p>
            <FileUploadZone
              key={`website-${uploadKey}`}
              label="Website Screenshot"
              id="full-visual-website"
              accept="image/png,image/jpeg,image/webp"
              onFileSelect={selectVisualFile("website")}
            />
            <FileUploadZone
              key={`instagram-${uploadKey}`}
              label="Instagram Moodboard"
              id="full-visual-instagram"
              accept="image/png,image/jpeg,image/webp"
              onFileSelect={selectVisualFile("instagram")}
            />
            {(visualFiles.website || visualFiles.instagram) && (
              <button
                type="button"
                className="form-input"
                onClick={clearVisualFiles}
              >
                Clear images
              </button>
            )}
          </fieldset>
        </div>

        {/* ── GMB ── */}
        <div
          className="form-section-header clickable"
          data-analytics-control="section_gmb"
          aria-expanded={openSections.gmb}
          onClick={() => toggleSection("gmb")}
        >
          <div className="section-icon-chip">
            <MapPin size={16} strokeWidth={2.5} />
          </div>
          <div className="form-section-title">
            Google Business Profile
            <span className="optional-badge">Optional</span>
          </div>
          <ChevronDown
            size={18}
            className="accordion-chevron"
            style={{
              transform: openSections.gmb ? "rotate(180deg)" : "none",
              transition: "transform 0.3s",
            }}
          />
        </div>

        <div className={`accordion-content ${openSections.gmb ? "open" : ""}`}>
          <div className="form-grid">
            <FormField label="Business Name" htmlFor="full-gmb-company-name">
              <input
                id="full-gmb-company-name"
                className="form-input"
                type="text"
                placeholder='e.g. "Evolve Chiropractic"'
                value={fields.gmb_company_name || ""}
                onChange={set("gmb_company_name")}
              />
            </FormField>

            <FormField
              label="Google Maps URL"
              htmlFor="full-gmb-target-url"
              tooltip="Paste the full Google Maps link for the business"
            >
              <input
                id="full-gmb-target-url"
                className="form-input"
                type="url"
                placeholder="https://www.google.com/maps/place/..."
                value={fields.gmb_target_url || ""}
                onChange={set("gmb_target_url")}
              />
            </FormField>

            <FormField
              label="Location/Neighborhood"
              htmlFor="full-gmb-location-query"
              tooltip="Used for local pack ranking comparison"
            >
              <input
                id="full-gmb-location-query"
                className="form-input"
                type="text"
                placeholder='e.g. "Minneapolis, MN"'
                value={fields.gmb_location_query || ""}
                onChange={set("gmb_location_query")}
              />
            </FormField>
          </div>
        </div>

        {/* ── UI/UX Audit ── */}
        <div
          className="form-section-header clickable"
          data-analytics-control="section_ui_ux"
          aria-expanded={openSections.ui_ux}
          onClick={() => toggleSection("ui_ux")}
        >
          <div className="section-icon-chip">
            <Sparkles size={16} strokeWidth={2.5} />
          </div>
          <div className="form-section-title">
            UI/UX Audit
            <span className="optional-badge">Optional</span>
          </div>
          <ChevronDown
            size={18}
            className="accordion-chevron"
            style={{
              transform: openSections.ui_ux ? "rotate(180deg)" : "none",
              transition: "transform 0.3s",
            }}
          />
        </div>

        <div
          className={`accordion-content ${openSections.ui_ux ? "open" : ""}`}
        >
          <div className="form-grid">
            <FormField
              label="Target Website URL"
              htmlFor="full-ui-ux-url"
              tooltip="The exact page URL to audit"
            >
              <input
                id="full-ui-ux-url"
                className="form-input"
                type="url"
                placeholder="https://example.com/landing-page"
                value={fields.ui_ux_url || ""}
                onChange={set("ui_ux_url")}
              />
            </FormField>
          </div>
        </div>

        {/* ── Ads Library ── */}
        <div
          className="form-section-header clickable"
          data-analytics-control="section_ads"
          aria-expanded={openSections.ads}
          onClick={() => toggleSection("ads")}
        >
          <div className="section-icon-chip">
            <Globe size={16} strokeWidth={2.5} />
          </div>
          <div className="form-section-title">
            Ads Library Audit
            <span className="optional-badge">Optional</span>
          </div>
          <ChevronDown
            size={18}
            className="accordion-chevron"
            style={{
              transform: openSections.ads ? "rotate(180deg)" : "none",
              transition: "transform 0.3s",
            }}
          />
        </div>

        <div className={`accordion-content ${openSections.ads ? "open" : ""}`}>
          <div className="form-grid">
            <FormField label="Platform" htmlFor="full-ads-platform">
              <select
                id="full-ads-platform"
                data-analytics-setting="ads_platform"
                className="form-select"
                value={fields.ads_platform || "google"}
                onChange={set("ads_platform")}
              >
                <option value="google">Google Ads Transparency</option>
                <option value="meta">Meta Ads Library</option>
              </select>
            </FormField>

            <FormField label="Results Limit" htmlFor="full-ads-limit">
              <input
                id="full-ads-limit"
                data-analytics-setting="ads_limit"
                className="form-input"
                type="number"
                min={1}
                max={100}
                value={fields.ads_limit}
                onChange={set("ads_limit")}
              />
            </FormField>

            {(fields.ads_platform || "google") === "google" ? (
              <>
                <FormField
                  label="Google Domain / Keyword"
                  htmlFor="full-ads-google"
                >
                  <input
                    id="full-ads-google"
                    className="form-input"
                    type="text"
                    placeholder="nike.com or Nike"
                    value={fields.ads_google_domain || ""}
                    onChange={set("ads_google_domain")}
                  />
                </FormField>

                <div className="form-grid-2">
                  <FormField label="Target Region" htmlFor="full-ads-g-region">
                    <select
                      id="full-ads-g-region"
                      data-analytics-setting="google_region"
                      className="form-select"
                      value={fields.ads_google_region}
                      onChange={set("ads_google_region")}
                    >
                      {googleRegions.length > 0 ? (
                        googleRegions.map((r, i) => (
                          <option
                            key={`gr_${i}`}
                            value={
                              r.region ||
                              r.code ||
                              (typeof r === "string" ? r : "")
                            }
                          >
                            {r.name || r}
                          </option>
                        ))
                      ) : (
                        <option value="anywhere">Anywhere</option>
                      )}
                    </select>
                  </FormField>
                  <FormField label="Time Period" htmlFor="full-ads-g-time">
                    <select
                      id="full-ads-g-time"
                      data-analytics-setting="google_time_period"
                      className="form-select"
                      value={fields.ads_google_time_period}
                      onChange={set("ads_google_time_period")}
                    >
                      <option value="last_30_days">Last 30 days</option>
                      <option value="last_3_months">Last 3 months</option>
                      <option value="last_6_months">Last 6 months</option>
                      <option value="any">Any time</option>
                    </select>
                  </FormField>
                </div>

                <div className="form-grid-2">
                  <FormField label="Ad Format" htmlFor="full-ads-g-format">
                    <select
                      id="full-ads-g-format"
                      data-analytics-setting="google_ad_format"
                      className="form-select"
                      value={fields.ads_google_ad_format}
                      onChange={set("ads_google_ad_format")}
                    >
                      <option value="all">All Formats</option>
                      <option value="text">Text</option>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </FormField>
                  <FormField
                    label="Google Platform"
                    htmlFor="full-ads-g-platform"
                  >
                    <select
                      id="full-ads-g-platform"
                      data-analytics-setting="google_platform"
                      className="form-select"
                      value={fields.ads_google_platform}
                      onChange={set("ads_google_platform")}
                    >
                      <option value="all">All Platforms</option>
                      <option value="google_search">Google Search</option>
                      <option value="youtube">YouTube</option>
                      <option value="google_play">Google Play</option>
                      <option value="google_maps">Google Maps</option>
                    </select>
                  </FormField>
                </div>
              </>
            ) : (
              <>
                <FormField label="Meta Page Name" htmlFor="full-ads-meta">
                  <input
                    id="full-ads-meta"
                    className="form-input"
                    type="text"
                    placeholder="e.g. Nike"
                    value={fields.ads_meta_query || ""}
                    onChange={set("ads_meta_query")}
                  />
                </FormField>

                <div className="form-grid-2">
                  <FormField
                    label="Target Country"
                    htmlFor="full-ads-m-country"
                  >
                    <select
                      id="full-ads-m-country"
                      data-analytics-setting="meta_country"
                      className="form-select"
                      value={fields.ads_meta_country}
                      onChange={set("ads_meta_country")}
                    >
                      {metaCountries.length > 0 ? (
                        metaCountries.map((c, i) => (
                          <option
                            key={`mc_${i}`}
                            value={c.code || (typeof c === "string" ? c : "")}
                          >
                            {c.name || c}
                          </option>
                        ))
                      ) : (
                        <option value="US">United States (US)</option>
                      )}
                    </select>
                  </FormField>
                  <FormField label="Media Type" htmlFor="full-ads-m-media">
                    <select
                      id="full-ads-m-media"
                      data-analytics-setting="meta_media_type"
                      className="form-select"
                      value={fields.ads_meta_media_type}
                      onChange={set("ads_meta_media_type")}
                    >
                      <option value="all">All Media</option>
                      <option value="video">Video</option>
                      <option value="image">Image</option>
                      <option value="meme">Meme</option>
                      <option value="image_and_meme">Image & Meme</option>
                      <option value="none">No Media</option>
                    </select>
                  </FormField>
                </div>

                <FormField label="Active Status" htmlFor="full-ads-m-status">
                  <select
                    id="full-ads-m-status"
                    data-analytics-setting="meta_active_status"
                    className="form-select"
                    value={fields.ads_meta_active_status}
                    onChange={set("ads_meta_active_status")}
                  >
                    <option value="all">All</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                  </select>
                </FormField>
              </>
            )}
          </div>
        </div>

        {/* Display-only estimate includes exactly the submitted audit selections. */}
        <AnimatedSubmitButton
          pricingModule="full"
          pricingInput={pricingInput}
          loading={loading || preparingImages}
          defaultText="Generate Report"
        />
      </div>
    </form>
  );
}
