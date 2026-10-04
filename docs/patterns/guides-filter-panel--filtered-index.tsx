// @thewhatmatters/wmds@0.4.1 · Pattern — filtered index
// Storybook: Guides/Filter panel → Pattern — filtered index (?path=/story/guides-filter-panel--filtered-index)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useId, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Accordion, Button, CheckboxGroup, IndexList, Sheet } from "@thewhatmatters/wmds";

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
