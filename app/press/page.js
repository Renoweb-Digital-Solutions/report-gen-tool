import ResourceCollection from "../components/resources/ResourceCollection";
import {
  PRESS_RELEASES,
  RESOURCE_PAGES,
  resourceMetadata,
} from "../data/resources";

export const metadata = resourceMetadata({
  title: "Press & Media | Flawdits",
  description:
    "Flawdits company news, announcements, and press updates in one place.",
  path: "/press",
});

// # Render real announcements when added; otherwise show the newsroom empty state.
export default function PressPage() {
  return (
    <ResourceCollection
      kind="press"
      content={RESOURCE_PAGES.press}
      entries={PRESS_RELEASES}
    />
  );
}
