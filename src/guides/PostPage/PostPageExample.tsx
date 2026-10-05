/**
 * Storybook-only — the live **Guides/Post page** pattern and its sample post. Apps copy the Show
 * code in PostPage.stories.tsx, not this file.
 */
import { useEffect, useId, useState, type CSSProperties, type ReactNode } from "react";
import { Copy, FileText } from "lucide-react";
import { Badge } from "../../components/atoms/Badge/Badge";
import { Button, buttonStatusHoldMs, type ButtonStatus } from "../../components/atoms/Button/Button";
import { Prose } from "../../components/atoms/Prose/Prose";
import { SectionCaption } from "../../components/atoms/SectionCaption/SectionCaption";
import { Breadcrumb, type BreadcrumbItemDef } from "../../components/molecules/Breadcrumb/Breadcrumb";
import { DescriptionList } from "../../components/molecules/DescriptionList/DescriptionList";
import type { DisplayControlThemeMode } from "../../components/molecules/DisplayControls/DisplayControls";
import { GridOverlay } from "../../lib/GridOverlay";
import { ExampleGridControls } from "../../storybook/ExampleGridControls/ExampleGridControls";

// ── The pattern — mirrors Show code in PostPage.stories.tsx line for line ────────────────

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

// ── Sample data and the Storybook-only grid inspector ─────────────────────────────────────

export const samplePost: PostPageData = {
  breadcrumb: [
    { label: "Home", href: "#home" },
    { label: "Blog", href: "#blog" },
    { label: "Guides", href: "#guides" },
    { label: "How we scope a brand sprint" },
  ],
  title: "How we scope a brand sprint",
  description: "Two weeks, one decision a day: the questions we ask before a sprint starts and what we hand over at the end.",
  date: "2026-09-14",
  dateLabel: "Sep 14, 2026",
  author: "Randy Lee",
  readingTime: "6 min",
  categories: [
    { label: "Guides", href: "#guides" },
    { label: "Brand", href: "#brand" },
  ],
  url: "https://whatmatters.so/blog/brand-sprint",
  markdown: "# How we scope a brand sprint\n\nA brand sprint is two weeks with one decision a day.",
  markdownHref: "#brand-sprint.md",
};

/** What a markdown renderer outputs: plain elements, no classes. */
export function SamplePostBody() {
  return (
    <>
      <p>
        A brand sprint is two weeks with one decision a day. It works when the questions are set before the first
        meeting and the answers are written down the day they are made.
      </p>
      <h2>Before the sprint</h2>
      <p>
        We ask for three things: who the work is for, what has to be true in a year, and what is already decided. The
        last one matters most — <strong>a sprint cannot reopen a settled question</strong> without losing a day.
      </p>
      <ul>
        <li>The audience, in one sentence.</li>
        <li>The outcome, as something you could measure.</li>
        <li>The constraints: budget, dates, and what cannot change.</li>
      </ul>
      <h3>The brief</h3>
      <p>
        The brief is one page. It names the decision for each day and who makes it. We keep it next to the work as{" "}
        <code>brief.md</code>, and we link it from every <a href="#calendar">calendar invite</a>.
      </p>
      <blockquote>
        <p>A decision a day keeps the sprint honest: nothing waits for a meeting that is not on the calendar.</p>
      </blockquote>
      <pre>
        <code>{`day 1  audience and outcome
day 2  positioning
day 3  name and voice`}</code>
      </pre>
      <h2>What we hand over</h2>
      <p>
        At the end there is a positioning line, a name, a voice, and a first pass at the identity — each with the
        decision that made it, so the next team can pick it up without us.
      </p>
      <table>
        <thead>
          <tr>
            <th>Day</th>
            <th>Decision</th>
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Audience and outcome</td>
            <td>Client lead</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Positioning</td>
            <td>Strategy</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Name and voice</td>
            <td>Writing</td>
          </tr>
        </tbody>
      </table>
      <p>If a question needs more than a day, it was two questions. Split it before the sprint starts.</p>
    </>
  );
}

const defaultGridMax = 1280;
const defaultColumnGap = 24;

/** The pattern on the page, with the Storybook-only grid inspector. */
export function PostPageGuide({
  metadataSide,
  metadataColumns,
}: { metadataSide?: PostMetadataSide; metadataColumns?: PostMetadataColumns } = {}) {
  const [gridVisible, setGridVisible] = useState(false);
  const [theme, setTheme] = useState<DisplayControlThemeMode>("auto");
  const [gridMax, setGridMax] = useState(defaultGridMax);
  const [columnGap, setColumnGap] = useState(defaultColumnGap);
  const tuned = gridMax !== defaultGridMax || columnGap !== defaultColumnGap;

  useEffect(() => {
    const root = document.documentElement;
    const previousTheme = root.getAttribute("data-theme");
    if (theme === "auto") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", theme);
    return () => {
      if (previousTheme == null) root.removeAttribute("data-theme");
      else root.setAttribute("data-theme", previousTheme);
    };
  }, [theme]);

  return (
    <div
      className="relative min-h-screen bg-body"
      style={
        tuned
          ? ({ "--grid-max": `${gridMax}px`, "--grid-column-gap": `${columnGap}px` } as CSSProperties)
          : undefined
      }
    >
      <PostPage post={samplePost} metadataSide={metadataSide} metadataColumns={metadataColumns}>
        <SamplePostBody />
      </PostPage>
      {/* Guides on a second page grid with the same tokens, laid over the pattern. */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="grid-page h-full">
          <GridOverlay visible={gridVisible} onVisibleChange={setGridVisible} keyboardShortcut={false} />
        </div>
      </div>
      <ExampleGridControls
        gridVisible={gridVisible}
        onGridVisibleChange={setGridVisible}
        theme={theme}
        onThemeChange={setTheme}
        maxWidth={gridMax}
        onMaxWidthChange={setGridMax}
        columnGap={columnGap}
        onColumnGapChange={setColumnGap}
        defaultMaxWidth={defaultGridMax}
        defaultColumnGap={defaultColumnGap}
      />
    </div>
  );
}
