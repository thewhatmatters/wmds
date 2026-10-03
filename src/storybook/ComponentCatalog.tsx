import type { MouseEvent } from "react";
import { NAVIGATE_URL } from "storybook/internal/core-events";
import { addons } from "storybook/preview-api";
import { Badge } from "../components/atoms/Badge/Badge";
import { TextLink } from "../components/atoms/TextLink/TextLink";
import { Card } from "../components/molecules/Card/Card";
import { typographyClass } from "../lib/typography";
import {
  componentCatalog,
  componentCategories,
  storybookDocsPath,
  type ComponentCatalogEntry,
} from "./componentCatalog";

/**
 * Docs render inside the preview iframe. A plain `?path=` link would load the manager
 * inside that iframe, so a left click asks the manager to navigate instead. The `href`
 * still points at the manager for middle-click and copy-link.
 */
function navigateToDocs(event: MouseEvent<HTMLAnchorElement>, path: string) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  addons.getChannel().emit(NAVIGATE_URL, `?path=${path}`);
}

function CatalogCard({ entry }: { entry: ComponentCatalogEntry }) {
  const path = entry.title ? storybookDocsPath(entry.title) : null;
  return (
    <Card padding="md" className="flex h-full flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <h3 className={typographyClass("subheading")}>
          {path ? (
            <TextLink href={`./?path=${path}`} onClick={(event) => navigateToDocs(event, path)}>
              {entry.name}
            </TextLink>
          ) : (
            entry.name
          )}
        </h3>
        {entry.planned ? (
          <Badge variant="neutral" emphasis="muted" size="sm">
            Planned
          </Badge>
        ) : null}
      </div>
      <p className={`${typographyClass("body")} text-muted`}>{entry.description}</p>
    </Card>
  );
}

/** Components → Overview: every export grouped by category, linking to its docs page. */
export function ComponentCatalog() {
  return (
    <div className="flex flex-col gap-12">
      {componentCategories.map((category) => {
        const entries = componentCatalog.filter((entry) => entry.category === category);
        const headingId = `catalog-${category.toLowerCase().replace(/[^a-z]+/g, "-")}`;
        return (
          <section key={category} aria-labelledby={headingId} className="flex flex-col gap-4">
            <h2 id={headingId} className={typographyClass("section-heading")}>
              {category}
            </h2>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {entries.map((entry) => (
                <li key={entry.name}>
                  <CatalogCard entry={entry} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
