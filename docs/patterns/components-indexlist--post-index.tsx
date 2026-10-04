// @thewhatmatters/wmds@0.4.1 · Pattern — post index
// Storybook: Components/IndexList → Pattern — post index (?path=/story/components-indexlist--post-index)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { IndexList } from "@thewhatmatters/wmds";

export interface IndexPost {
  slug: string;
  title: string;
  href: string;
  /** ISO date, for the time element. */
  date: string;
  /** The date as readers see it, for example "Sep 14, 2026". */
  dateLabel: string;
  description: string;
}

export function PostIndex({ posts }: { posts: IndexPost[] }) {
  return (
    <IndexList
      aria-label="Posts"
      captions={{ meta: "/ Date", title: "/ Name" }}
      empty={<p className="type-body text-muted">No posts yet.</p>}
    >
      {posts.map((post) => (
        <IndexList.Item
          key={post.slug}
          title={post.title}
          href={post.href}
          meta={<time dateTime={post.date}>{post.dateLabel}</time>}
          preview={<p>{post.description}</p>}
        />
      ))}
    </IndexList>
  );
}
