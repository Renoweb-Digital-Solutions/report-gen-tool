import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Navbar } from "../layout/Navbar";
import { Footer } from "../layout/Footer";
import styles from "./resources.module.css";

// # All Resources routes reserve the full 112px public header and share the same
// reading width. Server-rendered page content needs no database or client state.
export default function ResourceLayout({ label, children }) {
  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <div className={styles.shell}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{label}</span>
          </nav>
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}

// # Reuse real destinations in the empty states instead of inactive controls.
export function ResourceLink({ href, children, primary = false }) {
  return (
    <Link
      className={primary ? styles.primaryLink : styles.textLink}
      href={href}
    >
      {children}
      <ArrowUpRight size={17} aria-hidden="true" />
    </Link>
  );
}
