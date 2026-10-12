/** @vitest-environment happy-dom */
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { TaskRows } from "./TaskRows";

const columns = [
  { id: "title" as const, header: "Campaign" },
  { id: "waiting" as const, header: "Waiting on you" },
  { id: "metric" as const, header: "Live posts", align: "end" as const },
];

describe("TaskRows variant=table", () => {
  it("renders a linked title, status, waiting pill, and tabular metric", () => {
    const html = renderToString(
      createElement(
        TaskRows,
        { variant: "table", columns, empty: "Nothing waiting" },
        createElement(TaskRows.Row, {
          title: "Stir in strength",
          href: "/campaigns/stir",
          status: { tone: "success", label: "Active · day 41" },
          waiting: { label: "22 creators", detail: "4 waiting over 5 days" },
          metric: { value: "49", detail: "12 this week" },
        }),
      ),
    );
    expect(html).toContain('href="/campaigns/stir"');
    expect(html).toContain("Stir in strength");
    expect(html).toContain("Active · day 41");
    expect(html).toContain("22 creators");
    expect(html).toContain("49");
    expect(html).toContain("tabular-nums");
    expect(html).toContain("Waiting on you");
    expect(html).toContain("md:hidden");
  });

  it("says nothing is waiting when there are no rows", () => {
    const html = renderToString(
      createElement(TaskRows, { variant: "table", columns, empty: "Nothing waiting" }),
    );
    expect(html).toContain("Nothing waiting");
    expect(html).toContain('role="status"');
  });

  it("shows a note for an unwired source and an error, and a busy row while loading", () => {
    const html = renderToString(
      createElement(
        TaskRows,
        { variant: "table", columns },
        createElement(TaskRows.Row, {
          title: "Outreach",
          source: "unwired",
          note: "Outreach is not connected",
        }),
        createElement(TaskRows.Row, {
          title: "Brand settings",
          source: "error",
          note: "Could not load this source",
        }),
        createElement(TaskRows.Row, { title: "Matching", source: "loading" }),
      ),
    );
    expect(html).toContain("Outreach is not connected");
    expect(html).toContain("Could not load this source");
    expect(html).toContain('aria-busy="true"');
    expect(html).not.toContain("22 creators");
  });

  it("lets render win over href", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const html = renderToString(
      createElement(
        TaskRows,
        { variant: "table", columns },
        createElement(TaskRows.Row, {
          title: "Stir in strength",
          href: "/campaigns/stir",
          render: createElement("a", { href: "/app/stir" }),
        }),
      ),
    );
    expect(html).toContain('href="/app/stir"');
    expect(html).not.toContain('href="/campaigns/stir"');
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
