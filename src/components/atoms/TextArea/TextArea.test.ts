import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { TextArea } from "./TextArea";

function html(props: Parameters<typeof TextArea>[0]) {
  return renderToStaticMarkup(createElement(TextArea, props));
}

function idsOf(markup: string, attr: string) {
  return (new RegExp(`${attr}="([^"]*)"`).exec(markup)?.[1] ?? "").split(" ").filter(Boolean);
}

describe("TextArea accessible description", () => {
  it("points aria-describedby at the description", () => {
    const markup = html({ id: "notes", label: "Notes", description: "Visible to admins." });
    expect(idsOf(markup, "aria-describedby")).toEqual(["notes-description"]);
    expect(markup).toContain('<p id="notes-description"');
  });

  it("points aria-describedby at the validation message instead of the description", () => {
    const markup = html({ id: "notes", label: "Notes", description: "Hint", status: "error", message: "Too short" });
    expect(idsOf(markup, "aria-describedby")).toEqual(["notes-message"]);
    expect(markup).toContain('id="notes-message"');
  });

  it("keeps a caller aria-describedby and adds the description", () => {
    const markup = html({ id: "notes", label: "Notes", description: "Hint", "aria-describedby": "extra" });
    expect(idsOf(markup, "aria-describedby")).toEqual(["extra", "notes-description"]);
  });
});

describe("TextArea liveStatus", () => {
  it("renders a polite live region with the text", () => {
    const markup = html({ id: "notes", label: "Notes", liveStatus: "Saving…" });
    expect(markup).toMatch(/<p role="status" aria-live="polite" id="notes-live-status"[^>]*>Saving…<\/p>/);
  });

  it("keeps the region mounted when the text is empty", () => {
    const markup = html({ id: "notes", label: "Notes", liveStatus: "" });
    expect(markup).toContain('role="status"');
  });

  it("renders no region when liveStatus is omitted", () => {
    expect(html({ id: "notes", label: "Notes" })).not.toContain('role="status"');
  });

  it("works on a bare control with an aria-label", () => {
    const markup = html({ "aria-label": "Notes", liveStatus: "Saved" });
    expect(markup).toContain(">Saved</p>");
  });
});
