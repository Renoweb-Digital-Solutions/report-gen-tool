import { DM_Sans, Oswald } from "next/font/google";
import "./globals.css";
import { AnalyticsProvider } from "./components/AnalyticsProvider";
import CookieBanner from "./components/CookieBanner";
import { ThemeProvider } from "./context/ThemeContext";

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

// ============================================================================
// SITE ICONS
// All routes inherit the supplied Flawdits mark for PNG-capable browsers and
// Apple home-screen bookmarks. app/favicon.ico contains resized copies of this
// same artwork for legacy browser requests; keep it aligned if the logo changes.
// ============================================================================
export const metadata = {
  title: "Flawdits",
  description:
    "Generate comprehensive digital presence audit reports — SEO, Instagram, LinkedIn, and visual brand match analysis — powered by Renoweb.",
  icons: {
    icon: { url: "/flawdits_logo.png", type: "image/png", sizes: "1000x1000" },
    apple: { url: "/flawdits_logo.png", sizes: "1000x1000" },
  },
  verification: {
    google: "Q2BUcYgqtAlhXgvX3FrTcZQvIUNqRHzVSo3-UgNl3X8",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${oswald.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('flawdits_theme');
                  var theme = saved;
                  if (!theme) {
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  var path = window.location.pathname;
                  var inScope = path.startsWith('/dashboard') || (path.startsWith('/admin') && path !== '/admin/login');
                  if (theme === 'dark' && inScope) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.removeAttribute('data-theme');
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <AnalyticsProvider>
            {children}
            <CookieBanner />
          </AnalyticsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
