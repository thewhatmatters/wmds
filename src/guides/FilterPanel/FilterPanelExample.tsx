/**
 * Storybook-only — the live **Guides/Filter panel** pattern and its sample data. Apps copy the
 * Show code in FilterPanel.stories.tsx, not this file.
 */
import { useEffect, useId, useState, type CSSProperties } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "../../components/atoms/Button/Button";
import { Accordion } from "../../components/molecules/Accordion/Accordion";
import { CheckboxGroup } from "../../components/molecules/CheckboxGroup/CheckboxGroup";
import type { DisplayControlThemeMode } from "../../components/molecules/DisplayControls/DisplayControls";
import { IndexList } from "../../components/molecules/IndexList/IndexList";
import { Sheet } from "../../components/organisms/Sheet/Sheet";
import { GridOverlay } from "../../lib/GridOverlay";
import { ExampleGridControls } from "../../storybook/ExampleGridControls/ExampleGridControls";

// ── The pattern — mirrors Show code in FilterPanel.stories.tsx line for line ──────────────

export interface FilterGroupDef {
  id: string;
  label: string;
  options: { value: string; label: string }[];
}

export interface FilteredPost {
  slug: string;
  title: string;
  href: string;
  /** ISO date, for the time element. */
  date: string;
  /** The date as readers see it, for example "Sep 14, 2026". */
  dateLabel: string;
  description: string;
  /** The post's option in each filter group, by group id — for example { topic: "guides" }. */
  facets: Record<string, string>;
}

type Selection = Record<string, string[]>;

function postsLabel(count: number) {
  return count === 1 ? "1 post" : `${count} posts`;
}

function matches(post: FilteredPost, groups: FilterGroupDef[], selection: Selection) {
  return groups.every((group) => {
    const values = selection[group.id] ?? [];
    return values.length === 0 || values.includes(post.facets[group.id] ?? "");
  });
}

function FilterGroups({
  groups,
  posts,
  selection,
  onGroupChange,
}: {
  groups: FilterGroupDef[];
  posts: FilteredPost[];
  selection: Selection;
  onGroupChange: (groupId: string, values: string[]) => void;
}) {
  return (
    <Accordion variant="plain" flush>
      {groups.map((group) => (
        <Accordion.Item key={group.id} label={group.label} defaultOpen>
          <CheckboxGroup
            label={group.label}
            labelHidden
            size="sm"
            values={selection[group.id] ?? []}
            onValuesChange={(values) => onGroupChange(group.id, values)}
          >
            {group.options.map((option) => {
              const count = posts.filter((post) => post.facets[group.id] === option.value).length;
              return (
                <CheckboxGroup.Item
                  key={option.value}
                  value={option.value}
                  label={option.label}
                  count={count}
                  countLabel={postsLabel(count)}
                />
              );
            })}
          </CheckboxGroup>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}

export function FilteredIndex({
  title,
  posts,
  groups,
}: {
  title: string;
  posts: FilteredPost[];
  groups: FilterGroupDef[];
}) {
  const filtersHeadingId = useId();
  const [selection, setSelection] = useState<Selection>({});
  const [sheetOpen, setSheetOpen] = useState(false);
  const activeCount = Object.values(selection).reduce((total, values) => total + values.length, 0);
  const shown = posts.filter((post) => matches(post, groups, selection));

  function setGroup(groupId: string, values: string[]) {
    setSelection((current) => ({ ...current, [groupId]: values }));
  }

  return (
    <main className="grid-page bg-body">
      <div className="band py-6 sm:py-10 lg:py-14">
        <header className="col-span-full mb-4 flex items-end justify-between gap-4 sm:mb-8">
          <h1 className="type-display-2 text-fg">
            {title} <span className="tabular-nums text-muted">{shown.length}</span>
          </h1>
          <Button
            role="secondary"
            icon={<SlidersHorizontal />}
            count={activeCount > 0 ? activeCount : undefined}
            className="md:hidden"
            onClick={() => setSheetOpen(true)}
          >
            Filters
          </Button>
        </header>
        <p role="status" className="sr-only">
          {postsLabel(shown.length)}
        </p>

        <aside aria-labelledby={filtersHeadingId} className="hidden md:col-span-3 md:block">
          <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
            <h2 id={filtersHeadingId} className="type-eyebrow text-muted">
              <span aria-hidden="true">/ </span>Filters
            </h2>
            <Button
              role="ghost"
              size="xs"
              className="-my-1.5"
              disabled={activeCount === 0}
              onClick={() => setSelection({})}
            >
              Clear all
            </Button>
          </div>
          <FilterGroups groups={groups} posts={posts} selection={selection} onGroupChange={setGroup} />
        </aside>

        <div className="col-span-full md:col-span-5 lg:col-span-9">
          <IndexList
            aria-label="Posts"
            captions={{ meta: "/ Date", title: "/ Name" }}
            empty={<p className="type-body text-muted">No posts match these filters.</p>}
          >
            {shown.map((post) => (
              <IndexList.Item
                key={post.slug}
                title={post.title}
                href={post.href}
                meta={<time dateTime={post.date}>{post.dateLabel}</time>}
                preview={<p>{post.description}</p>}
              />
            ))}
          </IndexList>
        </div>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <Sheet.Content
          title="Filters"
          footer={
            <div className="flex items-center justify-end gap-2">
              <Button role="secondary" size="sm" disabled={activeCount === 0} onClick={() => setSelection({})}>
                Clear all
              </Button>
              <Button role="primary" size="sm" onClick={() => setSheetOpen(false)}>
                Show {postsLabel(shown.length)}
              </Button>
            </div>
          }
        >
          <FilterGroups groups={groups} posts={posts} selection={selection} onGroupChange={setGroup} />
        </Sheet.Content>
      </Sheet>
    </main>
  );
}

// ── Sample data and the Storybook-only grid inspector ─────────────────────────────────────

export const sampleGroups: FilterGroupDef[] = [
  {
    id: "topic",
    label: "Topic",
    options: [
      { value: "guides", label: "Guides" },
      { value: "notes", label: "Notes" },
      { value: "news", label: "News" },
    ],
  },
  {
    id: "year",
    label: "Year",
    options: [
      { value: "2026", label: "2026" },
      { value: "2025", label: "2025" },
    ],
  },
];

export const samplePosts: FilteredPost[] = [
  {
    slug: "brand-sprint",
    title: "How we scope a brand sprint",
    href: "#brand-sprint",
    date: "2026-09-14",
    dateLabel: "Sep 14, 2026",
    description: "Two weeks, one decision a day: the questions we ask before a sprint starts and what we hand over at the end.",
    facets: { topic: "guides", year: "2026" },
  },
  {
    slug: "design-system",
    title: "A design system that ships with the site",
    href: "#design-system",
    date: "2026-08-02",
    dateLabel: "Aug 2, 2026",
    description: "Why the components, the patterns, and the marketing site live in one release train.",
    facets: { topic: "notes", year: "2026" },
  },
  {
    slug: "writing-briefs",
    title: "Writing briefs people finish reading",
    href: "#writing-briefs",
    date: "2026-06-21",
    dateLabel: "Jun 21, 2026",
    description: "Short sentences, one ask per paragraph, and a done-when list.",
    facets: { topic: "guides", year: "2026" },
  },
  {
    slug: "studio-notes",
    title: "Studio notes: the first year",
    href: "#studio-notes",
    date: "2025-12-09",
    dateLabel: "Dec 9, 2025",
    description: "What changed in how we price, plan, and pick projects.",
    facets: { topic: "news", year: "2025" },
  },
];

const defaultGridMax = 1280;
const defaultColumnGap = 24;

/** The pattern on the page, with the Storybook-only grid inspector. */
export function FilterPanelPage() {
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
      <FilteredIndex title="Blog" posts={samplePosts} groups={sampleGroups} />
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
