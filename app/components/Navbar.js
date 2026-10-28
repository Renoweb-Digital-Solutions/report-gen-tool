"use client";

import Image from "next/image";
import { Menu } from "lucide-react";
import ApiHealthBadge from "./ApiHealthBadge";
import ThemeToggle from "./ThemeToggle";

/** Dashboard callers may supply an account control without adding form columns. */
export default function Navbar({ onMenuClick, accountControls }) {
  return (
    <>
      <div className="beta-banner">
        <span className="truncate max-w-full block px-4 w-full text-center">
          The application is in beta. If anything breaks please let us know
          through support.
        </span>
      </div>
      <nav
        className="navbar"
        role="navigation"
        aria-label="Main navigation"
        data-has-account-controls={accountControls ? "true" : undefined}
      >
        <div className="flex items-center gap-2 md:gap-6 navbar-left">
          {onMenuClick && (
            <button
              className="mobile-menu-btn"
              onClick={onMenuClick}
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
          )}
          {/* Dashboard brand: match the public navigation's square Flawdits asset;
            explicit dimensions reserve its layout space before image loading. */}
          <Image
            src="/flawdits_logo.png"
            alt="Flawdits logo"
            height={32}
            width={32}
            className="navbar-logo"
            priority
            style={{ width: "auto", height: "32px", objectFit: "contain" }}
          />
          <span className="navbar-title hidden sm:block">
            Digital Presence Report Suite
          </span>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Account controls live in navigation; their expanded views use portals
            so neither fixed navbar clipping nor the audit grid affects them. */}
          {accountControls}
          <ApiHealthBadge />
          <div
            className="session-pill hidden md:flex items-center gap-[6px] text-[11.5px] text-brandInk/50 bg-brandInk/5 px-3 py-1.5 rounded-2xl border border-brandInk/10 select-none"
            title="Your inputs and reports persist across page refreshes but clear when this tab is closed."
          >
            <span aria-hidden="true">🔒</span>
            Session data clears on tab close
          </div>
          <ThemeToggle />
        </div>
      </nav>
    </>
  );
}
