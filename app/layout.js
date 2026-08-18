import { DM_Sans, Oswald } from "next/font/google";
import "./globals.css";

// Self-hosted via next/font — no @import needed in CSS, zero layout shift
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-dm-sans",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-big-shoulders", // Keeping the CSS variable name identical to prevent breaking globals.css
  display: "swap",
});

export const metadata = {
  title: "Flawdits",
  description:
    "Generate comprehensive digital presence audit reports — SEO, Instagram, LinkedIn, and visual brand match analysis — powered by Renoweb.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${oswald.variable}`}>
      <body>{children}</body>
    </html>
  );
}
