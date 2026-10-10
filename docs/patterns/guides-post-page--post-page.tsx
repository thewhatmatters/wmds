// @thewhatmatters/wmds@0.4.9 · Pattern — post page
// Storybook: Guides/Post page → Pattern — post page (?path=/story/guides-post-page--post-page)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useEffect, useId, useState, type ReactElement, type ReactNode } from "react";
import { Copy, FileText } from "lucide-react";
import {
  Badge,
  Breadcrumb,
  Button,
  DescriptionList,
  Prose,
  SectionCaption,
  buttonStatusHoldMs,
  type BreadcrumbItemDef,
  type ButtonStatus,
} from "@thewhatmatters/wmds";

export interface PostCategory {
  label: string;
  href: string;
}

export interface PostPageData {
  /** The path to this post, ending with it — for example Home, Blog, Guides, this post. */
  breadcrumb: BreadcrumbItemDef[];
  title: string;
  description: string;
  /** ISO date, for the time element. */
  date: string;
  /** The date as readers see it, for example "Sep 14, 2026". */
  dateLabel: string;
  author: string;
  /** For example "6 min". */
  readingTime: string;
  categories: PostCategory[];
  /** The post's own address, for the share links. */
  url: string;
  /** The post's markdown source, for Copy for LLM. */
  markdown: string;
  /** The post as plain markdown, for View as Markdown. */
  markdownHref: string;
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [status, setStatus] = useState<ButtonStatus>("idle");

  useEffect(() => {
    if (status !== "success" && status !== "error") return;
    const timer = window.setTimeout(() => setStatus("idle"), buttonStatusHoldMs);
    return () => window.clearTimeout(timer);
  }, [status]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <Button
      role="secondary"
      size="sm"
      icon={<Copy />}
      status={status}
      statusLabels={{ success: "Copied", error: "Couldn't copy" }}
      onClick={copy}
    >
      {label}
    </Button>
  );
}

/** Where the metadata panel sits from lg: before the article (start) or after it (end). */
export type PostMetadataSide = "start" | "end";

/** Where the panel sits below lg, where it stacks: before the article or after it (default). */
export type PostMetadataStack = "before" | "after";

/** How many of the page's 12 columns the panel takes from lg; the article takes the rest. */
export type PostMetadataColumns = 3 | 4;

const metadataColumnClasses: Record<PostMetadataColumns, string> = {
  3: "lg:col-span-3",
  4: "lg:col-span-4",
};

const articleColumnClasses: Record<PostMetadataColumns, string> = {
  3: "lg:col-span-9",
  4: "lg:col-span-8",
};

export interface PostPageProps {
  post: PostPageData;
  /** The post's rendered markdown. */
  children: ReactNode;
  /** Where the panel sits from lg, beside the article. Default: "start". */
  metadataSide?: PostMetadataSide;
  /** The panel's width from lg, in columns. Default: 4. */
  metadataColumns?: PostMetadataColumns;
  /**
   * Where the panel sits below lg, where it stacks. "after" (default) puts the article first, with
   * the date and reading time in a line under the title. It is also the panel's place in reading
   * and tab order at every width, so pair "after" with metadataSide="end" and "before" with "start".
   */
  metadataStack?: PostMetadataStack;
  /**
   * The router's link for the breadcrumb and the category tags, in place of a plain anchor —
   * (link) => <Link href={link.href} />.
   */
  renderLink?: (link: { label: string; href: string }) => ReactElement;
  /** Page-level layers inside the page grid — for example a GridOverlay. */
  overlay?: ReactNode;
}

/** A blog post: the title, a metadata panel, and the article, which is the rendered markdown. */
export function PostPage({
  post,
  children,
  metadataSide = "start",
  metadataColumns = 4,
  metadataStack = "after",
  renderLink,
  overlay,
}: PostPageProps) {
  const metadataHeadingId = useId();
  const encodedUrl = encodeURIComponent(post.url);
  const encodedTitle = encodeURIComponent(post.title);
  const stackedAfter = metadataStack === "after";
  // From lg the panel's side wins; the order utility moves it only when its side and its place
  // in the markup disagree.
  const panelOrder =
    metadataSide === "end" && !stackedAfter ? " lg:order-last" : metadataSide === "start" && stackedAfter ? " lg:order-1" : "";
  const articleOrder = metadataSide === "start" && stackedAfter ? " lg:order-2" : "";

  const panel = (
    <aside
      aria-labelledby={metadataHeadingId}
      className={
        "col-span-full lg:sticky lg:top-[calc(var(--site-nav-height)+1rem)] lg:mt-0 " +
        (stackedAfter ? "mt-10 " : "") +
        metadataColumnClasses[metadataColumns] +
        panelOrder
      }
    >
      <SectionCaption id={metadataHeadingId}>Metadata</SectionCaption>
      <DescriptionList variant="mono" rule="dotted">
        <DescriptionList.Item name="Date">
          <time dateTime={post.date}>{post.dateLabel}</time>
        </DescriptionList.Item>
        <DescriptionList.Item name="Author">
          <Badge emphasis="outline" mono>
            {post.author}
          </Badge>
        </DescriptionList.Item>
        <DescriptionList.Item name="Reading time">{post.readingTime}</DescriptionList.Item>
        <DescriptionList.Item name="Categories">
          {post.categories.map((category) => (
            <Badge
              key={category.href}
              emphasis="outline"
              mono
              render={renderLink != null ? renderLink(category) : <a href={category.href} />}
            >
              {category.label}
            </Badge>
          ))}
        </DescriptionList.Item>
        <DescriptionList.Item name="Agents" layout="stacked">
          <CopyButton text={post.markdown} label="Copy for LLM" />
          <Button role="secondary" size="sm" icon={<FileText />} render={<a href={post.markdownHref} />}>
            View as Markdown
          </Button>
        </DescriptionList.Item>
        <DescriptionList.Item name="Share" layout="stacked">
          <Button
            role="secondary"
            size="sm"
            external
            render={<a href={"https://x.com/intent/post?url=" + encodedUrl + "&text=" + encodedTitle} />}
          >
            Twitter/X
          </Button>
          <Button
            role="secondary"
            size="sm"
            external
            render={<a href={"https://www.linkedin.com/sharing/share-offsite/?url=" + encodedUrl} />}
          >
            LinkedIn
          </Button>
        </DescriptionList.Item>
      </DescriptionList>
    </aside>
  );

  return (
    <main className="grid-page bg-body">
      {overlay}
      <article className="band py-6 sm:py-10 lg:py-14">
        <header className="col-span-full mb-4 flex flex-col gap-3 sm:mb-8 lg:col-span-10">
          <Breadcrumb
            items={post.breadcrumb}
            variant="mono"
            separator="slash"
            renderLink={renderLink}
            className="mb-3"
          />
          <h1 className="type-display-2 text-balance text-fg">{post.title}</h1>
          <p className="type-reading max-w-[40rem] text-muted">{post.description}</p>
          {stackedAfter ? (
            <p className="type-eyebrow text-muted lg:hidden">
              <time dateTime={post.date}>{post.dateLabel}</time>
              <span aria-hidden="true"> / </span>
              <span className="sr-only">, </span>
              {post.readingTime} read
            </p>
          ) : null}
        </header>

        {stackedAfter ? null : panel}

        <div
          className={
            "col-span-full lg:mt-0 " + (stackedAfter ? "" : "mt-6 ") + articleColumnClasses[metadataColumns] + articleOrder
          }
        >
          <SectionCaption as="p">Article</SectionCaption>
          <Prose className="mt-6">{children}</Prose>
        </div>

        {stackedAfter ? panel : null}
      </article>
    </main>
  );
}
