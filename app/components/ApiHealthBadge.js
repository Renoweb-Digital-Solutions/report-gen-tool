"use client";

/**
 * Navbar's development-only backend health indicator. next.config.mjs derives
 * its public build-time flag from MODE=DEV without publishing private env values.
 * Production/unknown modes render nothing and never start health polling. This
 * display switch does not affect application API calls or backend availability.
 */
import { useEffect, useState } from "react";

// Only an explicit enabled build may show operational status to the browser.
const SHOW_API_HEALTH = process.env.NEXT_PUBLIC_SHOW_API_HEALTH === "true";

export default function ApiHealthBadge() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    // Guard the effect as well as rendering: hiding only the JSX would leave
    // unnecessary background /health requests running on customer deployments.
    if (!SHOW_API_HEALTH) return;
    const checkHealth = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/health`,
          {
            cache: "no-store",
          },
        );
        if (res.ok) {
          setStatus("online");
        } else {
          setStatus("offline");
        }
      } catch (err) {
        setStatus("offline");
      }
    };

    checkHealth();
    // Re-check every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  // Keep hooks unconditional across renders; the build flag is identical in
  // server-rendered output and hydration, preventing a production badge flash.
  if (!SHOW_API_HEALTH) return null;

  const getStatusColor = () => {
    if (status === "online") return "#22c55e"; // Green
    if (status === "offline") return "#ef4444"; // Red
    return "#94a3b8"; // Gray
  };

  const getStatusText = () => {
    if (status === "online") return "API Online";
    if (status === "offline") return "API Offline";
    return "Checking API...";
  };

  return (
    <div
      className={`api-health-badge ${status}`}
      title={`Backend Status: ${getStatusText()}`}
    >
      <div className="api-health-dot" />
      <span className="api-health-text">{getStatusText()}</span>
    </div>
  );
}
