import ResourceCollection from "../components/resources/ResourceCollection";
import {
  BLOG_ARTICLES,
  RESOURCE_PAGES,
  resourceMetadata,
} from "../data/resources";

export const metadata = resourceMetadata({
  title: "Blogs & Insights | Flawdits",
  description:
    "The Flawdits journal. Articles and perspectives on websites, search, social, and digital presence.",
  path: "/blogs",
});

// # Empty collection is intentional until approved articles are available.
export default function BlogsPage() {
  return (
    <ResourceCollection
      kind="blogs"
      content={RESOURCE_PAGES.blogs}
      entries={BLOG_ARTICLES}
    />
  );
}
