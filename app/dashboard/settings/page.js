/**
 * Settings route within the existing dashboard theme scope. The client feature
 * owns billing state and provider checkout; this page defines route metadata.
 * No database or payment mutation executes while rendering this server entry.
 */
import BillingSettings from "@/app/features/billing/BillingSettings";

export const metadata = {
  title: "Billing & settings | Flawdits",
  description:
    "Manage your Flawdits membership, credits, and payment activity.",
  robots: { index: false, follow: false },
};

/** Mount the account-scoped settings experience inside the dashboard URL space. */
export default function SettingsPage() {
  return <BillingSettings />;
}
