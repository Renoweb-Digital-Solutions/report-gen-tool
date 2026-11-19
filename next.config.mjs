/** @type {import('next').NextConfig} */
const nextConfig = {
  // ========================================================================
  // DEVELOPMENT-ONLY BACKEND STATUS DISPLAY
  // ApiHealthBadge is a client component, so private MODE cannot be read there.
  // Publish only this derived, nonsecret build-time boolean. Explicit DEV opts
  // in; PROD, missing and unknown modes hide the badge and its polling requests.
  // Rebuild/redeploy after changing MODE because this flag is bundled by Next.
  // ========================================================================
  env: {
    NEXT_PUBLIC_SHOW_API_HEALTH: String(
      (process.env.MODE || "").trim().toLowerCase() === "dev",
    ),
  },
};

export default nextConfig;
