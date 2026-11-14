import {
  ArrowUpRight,
  AtSign,
  Phone,
  MapPin,
  MessageSquare,
  LifeBuoy,
  Handshake,
  Newspaper,
} from "lucide-react";
import Link from "next/link";
import ResourceLayout, { ResourceLink } from "./ResourceLayout";
import { CONTACT_DETAILS } from "../../data/resources";
import styles from "./resources.module.css";

const CONVERSATIONS = [
  {
    title: "A little help with Flawdits",
    description:
      "Questions about audits, reports, or finding your way around? Start with the answers we’ve gathered.",
    href: "/faq",
    link: "Explore the FAQs",
    icon: LifeBuoy,
  },
  {
    title: "A bigger idea to explore",
    description:
      "Discover how Flawdits fits into agency work, client conversations, and your next collaboration.",
    href: "/for-agencies",
    link: "Flawdits for agencies",
    icon: Handshake,
  },
  {
    title: "A story worth sharing",
    description:
      "Looking for company news or announcements? Our press and media page is the place to start.",
    href: "/press",
    link: "Visit the newsroom",
    icon: Newspaper,
  },
];

// # Render only approved contact fields. Until details are supplied, one clear
// placeholder replaces a non-functional form. No submission or delivery is faked.
function ContactDetails() {
  const hasDetails = Object.values(CONTACT_DETAILS).some(Boolean);
  return (
    <aside
      className={styles.contactCard}
      aria-labelledby="contact-details-title"
    >
      <div className={styles.contactOrbit} aria-hidden="true">
        <MessageSquare size={42} strokeWidth={1.1} />
        <span />
        <span />
      </div>
      <p className={styles.contactCardLabel}>A direct line to Flawdits</p>
      <h2 id="contact-details-title">
        Good conversations
        <br />
        start with a hello.
      </h2>
      {hasDetails ? (
        <div className={styles.contactDetails}>
          {CONTACT_DETAILS.email && (
            <a href={`mailto:${CONTACT_DETAILS.email}`}>
              <AtSign size={18} aria-hidden="true" />
              {CONTACT_DETAILS.email}
            </a>
          )}
          {CONTACT_DETAILS.phone && (
            <a href={`tel:${CONTACT_DETAILS.phone.replace(/[^\d+]/g, "")}`}>
              <Phone size={18} aria-hidden="true" />
              {CONTACT_DETAILS.phone}
            </a>
          )}
          {CONTACT_DETAILS.address && (
            <address>
              <MapPin size={18} aria-hidden="true" />
              {CONTACT_DETAILS.address}
            </address>
          )}
        </div>
      ) : (
        <div className={styles.contactPlaceholder}>
          <span className={styles.contactStatus}>
            Contact details coming soon
          </span>
          <p>
            We’re updating our contact information. Direct ways to reach the
            team will appear here once they’re ready.
          </p>
        </div>
      )}
    </aside>
  );
}

export default function ContactPage() {
  return (
    <ResourceLayout label="Contact us">
      <header className={styles.contactHero}>
        <div className={styles.contactIntro}>
          <p className={styles.eyebrow}>
            <MessageSquare size={16} aria-hidden="true" />
            Contact us
          </p>
          <h1>
            Let’s make
            <br />
            the next move.
          </h1>
          <p>
            Have a question, a possibility, or something you’d like us to hear?
            You’re in the right place.
          </p>
          <div className={styles.contactSignature}>
            <span aria-hidden="true" />
            <strong>The Flawdits team</strong>
          </div>
        </div>
        <ContactDetails />
      </header>
      <section
        className={styles.conversations}
        aria-labelledby="conversation-title"
      >
        <div className={styles.conversationHeading}>
          <p className={styles.eyebrow}>Find your starting point</p>
          <h2 id="conversation-title">What brings you here?</h2>
        </div>
        <div className={styles.conversationList}>
          {CONVERSATIONS.map((item, index) => {
            const Icon = item.icon;
            return (
              <article key={item.href}>
                <span className={styles.rowNumber}>0{index + 1}</span>
                <div className={styles.conversationIcon}>
                  <Icon size={23} strokeWidth={1.5} aria-hidden="true" />
                </div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <Link href={item.href}>
                    {item.link}
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
      <section className={styles.contactClosing}>
        <div>
          <p className={styles.eyebrow}>Get to know us</p>
          <h2>A clearer picture of Flawdits.</h2>
        </div>
        <ResourceLink href="/about" primary>
          Meet Flawdits
        </ResourceLink>
      </section>
    </ResourceLayout>
  );
}
