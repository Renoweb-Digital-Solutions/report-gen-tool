import { DM_Sans, Big_Shoulders } from "next/font/google";
import "./globals.css";

// Self-hosted via next/font — no @import needed in CSS, zero layout shift
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-dm-sans",
  display: "swap",
});

// "Big Shoulders Display" → exported as Big_Shoulders in this Next.js version
const bigShoulders = Big_Shoulders({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-big-shoulders",
  display: "swap",
});

export const metadata = {
  title: "Flawdits",
  description:
    "Generate comprehensive digital presence audit reports — SEO, Instagram, LinkedIn, and visual brand match analysis — powered by Renoweb.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${bigShoulders.variable}`}>
      <body>{children}</body>
    </html>
  );
}
