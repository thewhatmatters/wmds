import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Input } from "../../atoms/Input/Input";
import { Field } from "./Field";

describe("Field hint and counter (Labels and placeholders F8)", () => {
  const html = renderToString(
    createElement(Field, { label: "Details", description: "A sentence or two.", counter: "0 / 400", children: createElement(Input, {}) }),
  );

  it("puts the hint between the label and the control, and the counter below the control", () => {
    const label = html.indexOf("<label");
    const hint = html.indexOf("A sentence or two.");
    const control = html.indexOf("<input");
    const counter = html.indexOf("0 / 400");
    expect(label).toBeLessThan(hint);
    expect(hint).toBeLessThan(control);
    expect(control).toBeLessThan(counter);
  });

  it("reads the hint, then the counter, with the control", () => {
    const describedBy = html.match(/<input[^>]*aria-describedby="([^"]+)"/)?.[1].split(" ") ?? [];
    const textOf = (id: string) => html.match(new RegExp(`id="${id}"[^>]*>([^<]*)`))?.[1];
    expect(describedBy.map(textOf)).toEqual(expect.arrayContaining(["A sentence or two.", "0 / 400"]));
    expect(describedBy.indexOf(describedBy.find((id) => textOf(id) === "A sentence or two.")!)).toBeLessThan(
      describedBy.indexOf(describedBy.find((id) => textOf(id) === "0 / 400")!),
    );
  });
});

describe("Field side labels (Form layout L8)", () => {
  it("stacks below lg and sets the label beside the control only from lg", async () => {
    const { fieldHorizontalStackClasses, fieldHorizontalLabelColumnClasses } = await import("./fieldStyles");
    const stack = fieldHorizontalStackClasses.split(" ");
    expect(stack).toContain("flex-col");
    expect(stack).toContain("lg:flex-row");
    expect(stack.filter((token) => /^(?:sm|md):/.test(token))).toEqual([]);
    expect(fieldHorizontalLabelColumnClasses.split(" ").every((token) => token.startsWith("lg:"))).toBe(true);
  });
});
