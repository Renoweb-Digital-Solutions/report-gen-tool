// # Shared public plan catalog
// Pricing and Full Report must show the same prices and daily allowances.
// This is marketing information; live checkout remains owned by the billing API.
export const PRICING_PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    trial: "Up to 14 days free trial",
    allowance: "1 report daily (full or part report)",
    description:
      "Ideal for trying out the audit format and testing single site checks.",
    popular: false,
    cta: "Get Started Free",
    features: [
      "1 report daily limit",
      "Website & Social basic scanning",
      "Standard PDF exports",
      "Community support",
      "No credit card required",
    ],
  },
  {
    name: "Pro",
    price: "$59",
    period: "/month",
    trial: "Instant access",
    allowance: "Up to 3 part reports + 1 full report daily",
    description:
      "Built for solo consultants & freelancers with steady client audit needs.",
    popular: false,
    cta: "Start Pro Plan",
    features: [
      "3 part reports daily",
      "1 full report daily",
      "All 6 audit modules unlocked",
      "Priority PDF generation",
      "Email support",
    ],
  },
  {
    name: "Advanced",
    price: "$79",
    period: "/month",
    trial: "Instant access",
    allowance: "Up to 6 part reports + 4 full reports daily",
    description:
      "For growing operators needing higher volume & daily client audits.",
    popular: true,
    cta: "Start Advanced Plan",
    features: [
      "6 part reports daily",
      "4 full reports daily",
      "AI visibility scoring",
      "Visual Brand Match module",
      "Faster PDF rendering engine",
      "Priority support",
    ],
  },
  {
    name: "Custom (Agency)",
    price: "Custom",
    period: "",
    trial: "Dedicated onboarding",
    allowance: "Unlimited part/full reports daily",
    description:
      "For agencies & enterprises requiring white label branding & custom scale.",
    popular: false,
    cta: "Contact Sales",
    features: [
      "Unlimited daily reports",
      "Full White Label branding (Your Logo & Colors)",
      "Custom domain PDF exports",
      "Multi-user team workspace",
      "Dedicated account manager",
    ],
  },
];
