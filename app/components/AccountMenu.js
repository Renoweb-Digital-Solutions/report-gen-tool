/**
 * Shared navbar account dropdown for dashboard, profile, and billing pages.
 * Hover opens it for mouse users; click/Enter/Space opens it on touch/keyboards.
 * Native links/buttons keep normal Tab navigation. Outside clicks, Escape, and
 * focus leaving dismiss it; all listeners, hover timers, and late profile reads
 * are cleaned up. Existing cookie-auth APIs own logout/device revocation.
 */
"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronRight,
  CreditCard,
  Fingerprint,
  Loader2,
  LogOut,
  MonitorOff,
  UserCircle,
} from "lucide-react";
import { getUserProfile } from "@/app/lib/api";
import { logoutSession, revokeAllDevices } from "@/app/features/auth/api";
import styles from "./AccountMenu.module.css";

// ============================================================================
// ACCOUNT DISCLOSURE AND INTERACTION LIFECYCLE
// Fetch display identity only when opened; cached names are never authorization.
// Keep mouse-hover dismissal separate from keyboard focus so moving the pointer
// cannot close a panel while a keyboard user is interacting with its controls.
// ============================================================================
export default function AccountMenu() {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const root = useRef(null);
  const trigger = useRef(null);
  const dismissTimer = useRef(null);
  const signingOut = useRef(false);
  const mounted = useRef(false);
  const panelId = useId();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      clearTimeout(dismissTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!open || profile) return;
    let active = true;
    getUserProfile()
      .then((account) => {
        if (active) setProfile(account);
      })
      .catch(() => {
        // A failed display read does not manufacture a username or authorize an
        // action. Logout APIs still validate the live session independently.
      });
    return () => {
      active = false;
    };
  }, [open, profile]);

  useEffect(() => {
    if (!open) return;
    /** Dismiss pointer interactions outside both the trigger and its dropdown. */
    function outside(event) {
      if (!root.current?.contains(event.target)) setOpen(false);
    }
    /** Restore focus to the disclosure button when Escape closes the panel. */
    function escape(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        trigger.current?.focus();
      }
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  /** Allow a short pointer gap while moving from the round icon into the panel. */
  function leave() {
    clearTimeout(dismissTimer.current);
    dismissTimer.current = setTimeout(() => {
      if (!root.current?.contains(document.activeElement)) setOpen(false);
    }, 160);
  }

  /** Clear a pending hover dismissal before opening with pointer or keyboard. */
  function reveal() {
    clearTimeout(dismissTimer.current);
    setOpen(true);
  }

  // ========================================================================
  // SERVER-CONFIRMED SIGNOUT
  // Serialize clicks before React renders disabled state. Navigate only after
  // successful server revocation; failures stay visible in the open dropdown.
  // ========================================================================
  async function signOut(mode = "normal") {
    if (signingOut.current) return;
    signingOut.current = true;
    setBusy(true);
    setError("");
    try {
      if (mode === "all") await revokeAllDevices();
      else await logoutSession("user", mode === "forget");
      if (mounted.current) {
        setOpen(false);
        router.push("/?login=true");
      }
    } catch (failure) {
      if (mounted.current) {
        setError(failure.message || "Could not sign out. Please try again.");
        setOpen(true);
      }
    } finally {
      signingOut.current = false;
      if (mounted.current) setBusy(false);
    }
  }

  return (
    <div
      ref={root}
      className={styles.root}
      onPointerEnter={(event) => {
        // Touch-generated mouse events must not open then immediately toggle
        // the disclosure closed. Hover behavior is exclusively for a mouse.
        if (event.pointerType === "mouse") reveal();
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") leave();
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        ref={trigger}
        type="button"
        className={styles.trigger}
        aria-label="Open account options"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          clearTimeout(dismissTimer.current);
          setOpen((previous) => !previous);
        }}
        onKeyDown={(event) => {
          // ArrowDown opens the disclosure and focuses its first action. Enter
          // and Space use the button's native click behavior instead.
          if (event.key === "ArrowDown") {
            event.preventDefault();
            reveal();
            requestAnimationFrame(() =>
              root.current?.querySelector("a")?.focus(),
            );
          }
        }}
      >
        <UserCircle size={22} strokeWidth={1.8} aria-hidden="true" />
      </button>
      {open && (
        <div
          id={panelId}
          className={styles.panel}
          role="region"
          aria-label="Account options"
        >
          <div className={styles.identity}>
            <span className={styles.avatar}>
              <UserCircle size={25} />
            </span>
            <div>
              <strong>{profile?.username || "Your account"}</strong>
              {profile?.email ? (
                <p>{profile.email}</p>
              ) : (
                <p>Flawdits workspace</p>
              )}
            </div>
          </div>
          <nav className={styles.links} aria-label="Account navigation">
            <Link
              href="/dashboard/settings"
              aria-current={
                pathname === "/dashboard/settings" ? "page" : undefined
              }
              onClick={() => setOpen(false)}
            >
              <CreditCard size={17} />
              <span>Settings & billing</span>
              <ChevronRight size={14} />
            </Link>
            <Link
              href="/dashboard/profile"
              aria-current={
                pathname === "/dashboard/profile" ? "page" : undefined
              }
              onClick={() => setOpen(false)}
            >
              <UserCircle size={17} />
              <span>Profile</span>
              <ChevronRight size={14} />
            </Link>
          </nav>
          <div className={styles.actions} aria-label="Sign-out options">
            <button
              type="button"
              disabled={busy}
              onClick={() => signOut()}
              className={styles.logout}
            >
              {busy ? (
                <Loader2 size={17} className={styles.spinner} />
              ) : (
                <LogOut size={17} />
              )}
              <span>{busy ? "Signing out…" : "Log out"}</span>
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => signOut("forget")}
            >
              <Fingerprint size={16} />
              <span>Forget this device & sign out</span>
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => signOut("all")}
            >
              <MonitorOff size={16} />
              <span>Sign out & forget all devices</span>
            </button>
          </div>
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
