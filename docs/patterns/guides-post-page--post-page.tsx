// @thewhatmatters/wmds@0.4.7 · Pattern — post page
// Storybook: Guides/Post page → Pattern — post page (?path=/story/guides-post-page--post-page)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useEffect, useId, useState, type ReactNode } from "react";
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
  /** Where the panel sits from lg. Below lg it stacks above the article either way. Default: "start". */
  metadataSide?: PostMetadataSide;
  /** The panel's width from lg, in columns. Default: 4. */
  metadataColumns?: PostMetadataColumns;
}

/** A blog post: the title, a metadata panel, and the article, which is the rendered markdown. */
export function PostPage({ post, children, metadataSide = "start", metadataColumns = 4 }: PostPageProps) {
  const metadataHeadingId = useId();
  const encodedUrl = encodeURIComponent(post.url);
  const encodedTitle = encodeURIComponent(post.title);

  return (
    <main className="grid-page bg-body">
      <article className="band py-6 sm:py-10 lg:py-14">
        <header className="col-span-full mb-4 flex flex-col gap-3 sm:mb-8 lg:col-span-10">
          <Breadcrumb items={post.breadcrumb} variant="mono" separator="slash" className="mb-3" />
          <h1 className="type-display-2 text-balance text-fg">{post.title}</h1>
          <p className="type-reading max-w-[40rem] text-muted">{post.description}</p>
        </header>

        <aside
          aria-labelledby={metadataHeadingId}
          className={
            "col-span-full lg:sticky lg:top-[calc(var(--site-nav-height)+1rem)] " +
            metadataColumnClasses[metadataColumns] +
            (metadataSide === "end" ? " lg:order-last" : "")
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
                <Badge key={category.href} emphasis="outline" mono render={<a href={category.href} />}>
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

        <div className={"col-span-full mt-6 lg:mt-0 " + articleColumnClasses[metadataColumns]}>
          <SectionCaption as="p">Article</SectionCaption>
          <Prose className="mt-6">{children}</Prose>
        </div>
      </article>
    </main>
  );
}
