import ContactPage from "../components/resources/ContactPage";
import { resourceMetadata } from "../data/resources";

export const metadata = resourceMetadata({
  title: "Contact Us | Flawdits",
  description:
    "Find your starting point with Flawdits. Explore help, agency information, and press resources.",
  path: "/contact",
});

export default function ContactRoute() {
  return <ContactPage />;
}
