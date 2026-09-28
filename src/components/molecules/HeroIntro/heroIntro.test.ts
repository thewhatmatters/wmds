/** @vitest-environment happy-dom */
import { createElement } from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { HeroIntro } from "./HeroIntro";
import { heroIntroLeadClasses, heroIntroRestClasses } from "./heroIntroStyles";

const leadCopy = "We're a design and product studio based in Austin, Texas.";

describe("HeroIntro", () => {
  it("puts the lead on its own line and the rest on the next line", async () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () => {
      root.render(
        createElement(
          HeroIntro,
          { lead: leadCopy },
          "We help brands stand out ",
          "online",
          " with bold ideas.",
        ),
      );
    });

    const page = container.firstElementChild;
    const intro = container.querySelector("h1");
    const spans = intro?.querySelectorAll(":scope > span");
    expect(page?.className).toContain("grid-page");
    expect(page?.className).toContain("!py-0");
    expect(intro?.className).toContain("lg:col-start-4");
    expect(intro?.className).toContain("lg:col-end-10");
    expect(intro?.className).toContain("type-display-2");
    expect(intro?.className).toContain("!font-normal");
    expect(intro?.className).toContain("text-pretty");
    expect(intro?.className).not.toContain("type-large");
    expect(spans?.[0]?.className).not.toContain("whitespace-nowrap");
    expect(spans).toHaveLength(2);
    expect(spans?.[0]?.className).toBe(heroIntroLeadClasses);
    expect(spans?.[0]?.textContent).toBe(leadCopy);
    expect(spans?.[1]?.className).toBe(heroIntroRestClasses);
    expect(spans?.[1]?.textContent).toContain("We help brands stand out");
    expect(container.querySelector("br")).toBeNull();

    root.unmount();
    container.remove();
  });

  it("uses type-display-2 at normal weight for the sequenced hero step", async () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () => {
      root.render(
        createElement(HeroIntro, { lead: "Your brand is already online", step: "display" }, "Make it impossible to ignore"),
      );
    });

    const intro = container.querySelector("h1");
    expect(intro?.className).toContain("type-display-2");
    expect(intro?.className).toContain("!font-normal");
    expect(intro?.className).toContain("text-pretty");
    expect(intro?.className).toContain("col-span-full");
    expect(intro?.className).not.toContain("lg:col-start-4");
    const lead = intro?.querySelector(":scope > span");
    expect(lead?.className).not.toContain("whitespace-nowrap");

    root.unmount();
    container.remove();
  });
});

describe("marketing hero intro show code", () => {
  it("demonstrates HeroIntro lead in the hero pattern, without a consumer break", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/organisms/HeroTileStack/HeroTileStack.stories.tsx"),
      "utf8",
    );
    const copyStart = source.indexOf("const marketingHeroCopySource = `");
    const copyEnd = source.indexOf("`.trim();", copyStart);
    const copy = source.slice(copyStart, copyEnd);
    const liveStart = source.indexOf("\nfunction MarketingHero()");
    const liveEnd = source.indexOf("export const MarketingHeroPattern");
    const live = source.slice(liveStart, liveEnd);
    const leadProp = `<HeroIntro lead="${leadCopy}">`;

    expect(copy).toContain(leadProp);
    expect(live).toContain(leadProp);
    expect(copy).not.toContain("<br");
    expect(live).not.toContain("<br");
    expect(copy).not.toContain("grid-page w-full !py-0");
    expect(live).not.toContain("grid-page w-full !py-0");
  });
});
