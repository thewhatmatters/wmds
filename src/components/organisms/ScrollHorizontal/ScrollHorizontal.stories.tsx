import type { Meta, StoryObj } from "@storybook/react-vite";
import { MotionConfig } from "motion/react";
import { expect, waitFor } from "storybook/test";
import { useEffect, useRef, type ReactNode } from "react";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import { lockedViewportGlobals } from "../../../lib/viewports";
import { ScrollHorizontal } from "./ScrollHorizontal";
import { scrollHorizontalIntroStatement, scrollHorizontalMarketingItems } from "./scrollHorizontalExamples";
import {
  scrollHorizontalIntroStatementMarkup,
  scrollHorizontalIntroStatementNodes,
} from "./scrollHorizontalIntroStatement";

const meta = {
  title: "Components/Layout/ScrollHorizontal",
  component: ScrollHorizontal,
  tags: ["autodocs"],
  args: {
    items: scrollHorizontalMarketingItems,
  },
  ...storyMetaDocsDefaults(),
  parameters: {
    docs: {
      description: {
        component: `
## Usage

Marketing gallery that sits under the hero. Pass \`items\` (\`id\`, \`label\`, optional \`color\`), an optional \`heading\`, and an optional \`intro\` (**ScrollHorizontal.Intro**). \`className\` is layout only, on the root.

Vertical scroll drives the row. The track is \`300svh\`. A sticky \`h-svh\` window, one card wide and centered, shows the first card at the start and the last card at the end. The travel is \`(items.length - 1) * (item width + gap)\`, measured from the row.

\`expandLast\` (default false) lengthens the track to \`400svh\`. The horizontal travel keeps that same scroll distance. The window stays pinned for one more viewport while the last tile grows, via \`clip-path\`, until it fills the \`h-svh\` window edge to edge and the radius reaches 0. Earlier tiles fade out. The window then releases and that full-bleed tile scrolls away. The section box ends on that tile. Pass \`expanded\` for content in that section. A padded block after the section, including default \`grid-page\` block padding, paints the page background between the tile and a following footer.

From \`sm\` each card is **400×500** with \`gap-8\` (32px). Below \`sm\` each card is **280×350** with \`gap-4\` (16px). Radius is \`rounded-xl\` (\`--radius-xl\`, 12px). Each card is a solid fill from \`color\`. The label is the accessible name (\`sr-only\`).

Omit \`color\` to cycle \`--color-brand\`, \`--color-brand-soft\`, \`--color-primary\`, \`--color-info-muted\`, and \`--color-accent\`. Pass a token (\`var(--color-*)\`) when you set \`color\`.

\`heading\` names the section. It is \`sr-only\` while the window is pinned, so it does not sit under the site nav, and visible above the row when motion is reduced.

\`intro\` replaces \`heading\`. **ScrollHorizontal.Intro** is the first panel: an eyebrow **Badge**, a \`type-display-2\` statement (normal weight, display-2 leading, the same line-height as **HeroIntro**) run through **TextSequence** (\`emphasis="none"\`, \`trigger="inView"\`), and a secondary **Button** (\`role="secondary"\`, label Start a project, \`onClick\` or \`href\`). The panel sits in the left columns of the page grid, with top padding \`--site-nav-height\` plus the compact nav's 1rem offset, so it clears the pinned site nav. Tiles follow to the right and scroll in as the panel leaves to the left. The eyebrow is the section name. The statement is the \`h2\`. Words slide up once when that heading scrolls into view. **TextSequence.Shape** marks between words pop on that same timeline (about 1.15em, token fills). Reduced motion stacks that panel above the native row and leaves the sentence and shapes at rest.

\`prefers-reduced-motion\`, and \`MotionConfig\` \`reducedMotion="always"\`, skip the transform. The track height is auto, the window is not sticky, and the row is a native horizontal scroller with vertical padding (\`py-12\`). The heading is visible on that branch. The server render matches the motion shell. The OS preference is applied before paint.

## Anatomy

\`\`\`
ScrollHorizontal — 300svh track, or 400svh with expandLast (auto when reduced)
└── sticky svh viewport (relative, full width, overflow-x auto when reduced)
    ├── heading (optional) — sr-only while pinned; visible when reduced; omitted when intro is set
    ├── intro (optional) — first panel; eyebrow names the section; above the row when reduced
    ├── window — 400px, centered (280px below sm; full-width scroller when reduced)
    │   └── row — translateX, or no transform when reduced
    │       └── card — solid token color; label is sr-only
    ├── expand layer — full window, clip-path from the last card to inset 0 (expandLast, motion)
    └── expanded slot (optional; on the full-bleed tile)
└── reduced section — last tile, h-svh, radius 0 (expandLast, reduced motion only)
\`\`\`

## Best practices

- Place **ScrollHorizontal** directly under the marketing hero, full width. Do not nest it in a clipping page column.
- Give every item an \`id\` and a \`label\`. The label is the accessible name, not visible copy.
- Pass \`color\` as a semantic token to override the default cycle. The marketing placeholders set all five.
- Leave \`expandLast\` off when the track should release on the last centered card.
- Turn \`expandLast\` on when the last tile should fill the viewport and scroll away as its own section. Pass \`expanded\` for content there. The slot is mounted twice; the motion layer and the reduced-motion section each hide the other. The section ends on the tile, including the reduced-motion \`h-svh\` section. Do not follow it with block padding when the next region is a footer. **FooterReveal → Pattern — marketing hero** sets \`!py-0\` on the guide \`grid-page\`.
- Pass a real heading element. It names the section. It is \`sr-only\` while the window is pinned, and visible above the scroller when motion is reduced.
- Pass \`intro={<ScrollHorizontal.Intro />}\` when the gallery opens on a statement. Put **TextSequence.Shape** marks in \`statement\`. Do not wrap \`statement\` in another **TextSequence** — Intro owns the sequence (\`emphasis="none"\`, once, when the heading scrolls into view). Do not also pass \`heading\` — the eyebrow replaces it. The arrow square is part of Intro.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof ScrollHorizontal>;

export default meta;
type Story = StoryObj<typeof meta>;

const projectGalleryCopySource = `
import { ScrollHorizontal } from "@whatmatters/wmds";

const projects = [
  { id: "project-one", label: "Project One", color: "var(--color-brand)" },
  { id: "project-two", label: "Project Two", color: "var(--color-brand-soft)" },
  { id: "project-three", label: "Project Three", color: "var(--color-primary)" },
  { id: "project-four", label: "Project Four", color: "var(--color-info-muted)" },
  { id: "project-five", label: "Project Five", color: "var(--color-accent)" },
];

export function ProjectGallery() {
  return (
    <ScrollHorizontal
      items={projects}
      heading={<h2 className="type-heading-2 text-fg">Selected work</h2>}
    />
  );
}
`.trim();

export const Default: Story = {
  parameters: {
    wmdsLayout: "fullscreen",
    docs: {
      description: {
        story:
          "Scroll the page. The row moves from the first card centered to the last card centered. The heading is sr-only on that pinned window. prefers-reduced-motion turns the track off: height auto, no sticky window, no transform, and a native horizontal swipe with vertical padding. The heading is visible above that scroller. The same branch runs when MotionConfig reducedMotion is always. The server render stays on the motion shell so hydration matches; the OS preference is applied before paint.",
      },
    },
  },
  render: () => (
    <div className="bg-body">
      <div className="flex h-[40svh] items-end justify-center px-[var(--grid-margin)] pb-8">
        <p className="type-heading-2 text-fg">Scroll into the gallery</p>
      </div>
      <ScrollHorizontal
        items={scrollHorizontalMarketingItems}
        heading={<h2 className="type-heading-2 text-fg">Selected work</h2>}
      />
      <div className="flex h-svh items-center justify-center px-[var(--grid-margin)]">
        <p className="type-heading-2 text-fg">After the gallery</p>
      </div>
    </div>
  ),
};

export const ReducedMotion: Story = {
  name: "Reduced motion",
  parameters: {
    wmdsLayout: "fullscreen",
    docs: {
      description: {
        story:
          "MotionConfig reducedMotion always uses the same branch as prefers-reduced-motion. The section is only as tall as the cards. The heading is visible above the row. Swipe or scroll the row sideways. Nothing translates with page scroll.",
      },
    },
  },
  render: () => (
    <MotionConfig reducedMotion="always">
      <div className="bg-body py-8">
        <ScrollHorizontal
          items={scrollHorizontalMarketingItems}
          heading={<h2 className="type-heading-2 text-fg">Selected work</h2>}
        />
      </div>
    </MotionConfig>
  ),
};

export const ExpandLast: Story = {
  name: "Expand last",
  parameters: {
    wmdsLayout: "fullscreen",
    docs: {
      description: {
        story:
          "expandLast keeps the horizontal travel on the same scroll distance as the default gallery, then holds the window while the last tile grows to the viewport and the radius reaches 0. The heading stays sr-only on that pinned window. The full-bleed tile then scrolls away. The section ends on that tile. prefers-reduced-motion keeps the horizontal scroller, shows the heading above it, and follows it with that tile as a static full-viewport section.",
      },
    },
  },
  render: () => (
    <div className="bg-body">
      <div className="flex h-[40svh] items-end justify-center px-[var(--grid-margin)] pb-8">
        <p className="type-heading-2 text-fg">Scroll into the gallery</p>
      </div>
      <ScrollHorizontal
        items={scrollHorizontalMarketingItems}
        heading={<h2 className="type-heading-2 text-fg">Selected work</h2>}
        expandLast
      />
      <div className="flex h-svh items-center justify-center px-[var(--grid-margin)]">
        <p className="type-heading-2 text-fg">After the gallery</p>
      </div>
    </div>
  ),
};

export const ExpandLastContract: Story = {
  tags: ["test", "!dev", "!autodocs"],
  parameters: {
    docs: { disable: true },
  },
  render: () => (
    <div>
      <ScrollHorizontal
        items={scrollHorizontalMarketingItems.slice(0, 3)}
        heading={<h2 className="type-heading-2 text-fg">Selected work</h2>}
      />
      <ScrollHorizontal
        items={scrollHorizontalMarketingItems}
        expandLast
        expanded={<p>Expanded slot</p>}
      />
      <MotionConfig reducedMotion="always">
        <ScrollHorizontal
          items={scrollHorizontalMarketingItems}
          heading={<h2 className="type-heading-2 text-fg">Selected work</h2>}
          expandLast
          expanded={<p>Reduced slot</p>}
        />
      </MotionConfig>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const sections = [...canvasElement.querySelectorAll("[data-scroll-horizontal]")];
    expect(sections).toHaveLength(3);
    expect(sections[0]?.getAttribute("data-expand-last")).toBe("false");
    expect(sections[0]?.className).toContain("h-[300svh]");
    expect(sections[0]?.querySelector("[data-scroll-horizontal-expanded]")).toBeNull();
    const motionHeading = sections[0]?.querySelector("h2")?.parentElement;
    expect(motionHeading?.className).toContain("sr-only");
    expect(sections[0]?.getAttribute("aria-labelledby")).toBe(motionHeading?.id);
    expect(getComputedStyle(motionHeading as Element).position).toBe("absolute");
    expect(getComputedStyle(motionHeading as Element).width).toBe("1px");

    expect(sections[1]?.getAttribute("data-expand-last")).toBe("true");
    expect(sections[1]?.className).toContain("h-[400svh]");
    expect(sections[1]?.querySelectorAll("[data-scroll-horizontal-expanded]")).toHaveLength(2);
    expect(sections[1]?.textContent).toContain("Expanded slot");

    await waitFor(() => {
      expect(sections[2]?.getAttribute("data-reduce")).toBe("true");
    });
    expect(sections[2]?.getAttribute("data-expand-last")).toBe("true");
    const reduced = [...(sections[2]?.querySelectorAll("[data-scroll-horizontal-expanded]") ?? [])].find(
      (host) => host.className.includes("h-svh"),
    );
    expect(reduced).toBeTruthy();
    await waitFor(() => {
      expect(reduced ? getComputedStyle(reduced).display : "").toBe("block");
    });
    expect(reduced?.textContent).toContain("Project Five");
    expect(reduced?.textContent).toContain("Reduced slot");
    const layer = [...(sections[2]?.querySelectorAll("[data-scroll-horizontal-expanded]") ?? [])].find(
      (host) => host.className.includes("will-change-[clip-path]"),
    );
    expect(layer ? getComputedStyle(layer).display : "").toBe("none");
    expect(sections[2]?.querySelectorAll("li")).toHaveLength(5);
    const reducedHeading = sections[2]?.querySelector("h2")?.parentElement;
    expect(reducedHeading?.className).toContain("not-sr-only");
    expect(sections[2]?.getAttribute("aria-labelledby")).toBe(reducedHeading?.id);
    await waitFor(() => {
      expect(getComputedStyle(reducedHeading as Element).position).toBe("static");
    });
    expect(reducedHeading?.getBoundingClientRect().width ?? 0).toBeGreaterThan(40);
  },
};

export const ProjectGalleryPattern: Story = {
  name: "Pattern — project gallery",
  parameters: withStoryCopySource(
    {
      wmdsLayout: "fullscreen",
      docs: {
        description: {
          story:
            "Paste this under the marketing hero. Five solid token-color placeholders. The label is the accessible name. The heading names the section: sr-only while the window is pinned, visible above the row when motion is reduced. Scroll to move from Project One centered to Project Five centered. Reduced motion keeps a horizontal scroller.",
        },
      },
    },
    projectGalleryCopySource,
  ),
  render: () => (
    <div className="bg-body">
      <ScrollHorizontal
        items={scrollHorizontalMarketingItems}
        heading={<h2 className="type-heading-2 text-fg">Selected work</h2>}
      />
    </div>
  ),
};

const galleryIntroCopySource = `
import { ScrollHorizontal, TextSequence } from "@whatmatters/wmds";

// Opens the multi-step project form. There is no /start route.
function openProjectModal() {}

const projects = [
  { id: "project-one", label: "Project One", color: "var(--color-brand)" },
  { id: "project-two", label: "Project Two", color: "var(--color-brand-soft)" },
  { id: "project-three", label: "Project Three", color: "var(--color-primary)" },
  { id: "project-four", label: "Project Four", color: "var(--color-info-muted)" },
  { id: "project-five", label: "Project Five", color: "var(--color-accent)" },
];

export function ProjectGalleryIntro() {
  return (
    <ScrollHorizontal
      items={projects}
      expandLast
      intro={
        <ScrollHorizontal.Intro
          eyebrow="SELECTED WORK"
          statement=${scrollHorizontalIntroStatementMarkup}
          action={{ label: "Start a project", onClick: openProjectModal }}
        />
      }
    />
  );
}
`.trim();

function pageGridContentStart(): number {
  const probe = document.createElement("div");
  probe.className = "grid-page";
  document.body.appendChild(probe);
  const start =
    probe.getBoundingClientRect().left + Number.parseFloat(getComputedStyle(probe).paddingLeft);
  probe.remove();
  return start;
}

function expectIntroOnPageGrid(root: ParentNode) {
  const intro = root.querySelector("[data-scroll-horizontal-intro]");
  if (!(intro instanceof HTMLElement)) throw new Error("intro missing");
  expect(Math.abs(intro.getBoundingClientRect().left - pageGridContentStart())).toBeLessThanOrEqual(1);
}

function openProjectModal() {}

function GalleryIntro() {
  return (
    <ScrollHorizontal
      items={scrollHorizontalMarketingItems}
      expandLast
      intro={
        <ScrollHorizontal.Intro
          eyebrow="SELECTED WORK"
          statement={scrollHorizontalIntroStatementNodes()}
          action={{ label: "Start a project", onClick: openProjectModal }}
        />
      }
    />
  );
}

export const WithIntro: Story = {
  name: "Pattern — gallery intro",
  parameters: withStoryCopySource(
    {
      wmdsLayout: "fullscreen",
      docs: {
        description: {
          story:
            "The intro is the first panel. At rest its left edge is the page-grid content start, the same inset as grid-page. Scroll translates the panel off to the left with the tiles. The eyebrow names the section. The statement is the h2 on type-display-2 at normal weight and display-2 leading, with text-wrap pretty, the same line-height as HeroIntro. TextSequence runs once when that heading scrolls into view: words slide up, and an asterisk and an accent diamond pop between words at about 1.15em. A point RiveHand with inline sits after “is a first impression”, drawn at about 1.15em, aria-hidden. The zero-height slot keeps the line box. Tiles sit to the right and scroll in as the panel leaves left. expandLast still grows the last tile. Reduced motion stacks the same intro above the native row, with the same inset, and the sentence and shapes at rest. Do not pass heading — the eyebrow replaces it.",
        },
      },
    },
    galleryIntroCopySource,
  ),
  render: () => (
    <div className="bg-body">
      <div className="flex h-[40svh] items-end justify-center px-[var(--grid-margin)] pb-8">
        <p className="type-heading-2 text-fg">Scroll into the gallery</p>
      </div>
      <GalleryIntro />
      <div className="flex h-svh items-center justify-center px-[var(--grid-margin)]">
        <p className="type-heading-2 text-fg">After the gallery</p>
      </div>
    </div>
  ),
};

export const IntroContract: Story = {
  tags: ["test", "!dev", "!autodocs"],
  parameters: {
    wmdsLayout: "fullscreen",
    docs: { disable: true },
  },
  render: () => <GalleryIntro />,
  play: async ({ canvasElement }) => {
    const section = canvasElement.querySelector("[data-scroll-horizontal]");
    if (!(section instanceof HTMLElement)) throw new Error("gallery missing");
    expect(section.getAttribute("data-has-intro")).toBe("true");
    expect(section.getAttribute("data-expand-last")).toBe("true");
    const track = section.querySelector("[data-scroll-horizontal-track]");
    const intro = section.querySelector("[data-scroll-horizontal-intro]");
    if (!(track instanceof HTMLElement) || !(intro instanceof HTMLElement)) {
      throw new Error("intro track missing");
    }
    expect(track.firstElementChild).toBe(intro);
    const eyebrow = section.querySelector("[data-pattern='eyebrow']");
    if (!(eyebrow instanceof HTMLElement)) throw new Error("eyebrow missing");
    expect(eyebrow.textContent).toBe("SELECTED WORK");
    expect(section.getAttribute("aria-labelledby")).toBe(eyebrow.id);
    expect(section.getAttribute("aria-label")).toBeNull();
    expect(section.textContent).not.toContain("Selected work");
    const statement = section.querySelector("h2");
    expect(statement?.tagName).toBe("H2");
    expect(statement?.getAttribute("role")).toBeNull();
    expect(statement?.textContent?.replace(/\s+/g, " ").trim()).toBe(scrollHorizontalIntroStatement);
    const shapes = [...(statement?.querySelectorAll("[data-text-sequence-shape]") ?? [])];
    expect(shapes.map((shape) => shape.getAttribute("data-variant"))).toEqual([
      "asterisk",
      "diamond",
    ]);
    expect(statement?.querySelector("[data-rive-hand='point']")?.getAttribute("aria-hidden")).toBe("true");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    await waitFor(() => {
      expect(statement?.getAttribute("aria-label")).toBe(reduced ? null : scrollHorizontalIntroStatement);
      expect(statement?.querySelector("[data-text-sequence]")?.getAttribute("data-text-sequence-state")).toBe(
        reduced ? "rest" : "playing",
      );
    });
    const card = section.querySelector("li");
    if (!(card instanceof HTMLElement)) throw new Error("card missing");
    expect(card.getBoundingClientRect().left).toBeGreaterThanOrEqual(intro.getBoundingClientRect().right - 1);
    const action = [...section.querySelectorAll("button")].find((node) =>
      node.textContent?.includes("Start a project"),
    );
    expect(action?.getAttribute("data-role")).toBe("secondary");
    expect(action?.getAttribute("data-mono")).toBeNull();
    expect(action?.querySelector("svg")).toBeNull();
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      document.documentElement.clientWidth + 1,
    );
    expectIntroOnPageGrid(section);
  },
};

const review1440Viewport = {
  review1440: {
    name: "Review 1440",
    styles: { width: "1440px", height: "900px" },
    type: "desktop" as const,
  },
};

export const IntroAlignedAt1440: Story = {
  tags: ["test", "!dev", "!autodocs"],
  globals: {
    viewport: { value: "review1440", isRotated: false },
  },
  parameters: {
    wmdsLayout: "fullscreen",
    docs: { disable: true },
    viewport: { options: review1440Viewport },
  },
  render: () => <GalleryIntro />,
  play: async ({ canvasElement }) => {
    expect(window.innerWidth).toBeGreaterThanOrEqual(1440);
    expectIntroOnPageGrid(canvasElement);
  },
};

export const IntroAt390: Story = {
  tags: ["test", "!dev", "!autodocs"],
  globals: lockedViewportGlobals("mobile"),
  parameters: {
    wmdsLayout: "fullscreen",
    docs: { disable: true },
  },
  render: () => <GalleryIntro />,
  play: async ({ canvasElement }) => {
    expect(window.innerWidth).toBeLessThanOrEqual(400);
    const intro = canvasElement.querySelector("[data-scroll-horizontal-intro]");
    const statement = canvasElement.querySelector("h2");
    if (!(intro instanceof HTMLElement) || !(statement instanceof HTMLElement)) {
      throw new Error("intro missing");
    }
    expect(intro.scrollWidth).toBeLessThanOrEqual(intro.clientWidth + 1);
    expect(statement.scrollWidth).toBeLessThanOrEqual(intro.clientWidth + 1);
    expect(statement.getBoundingClientRect().right).toBeLessThanOrEqual(window.innerWidth + 1);
    expect(statement.getBoundingClientRect().left).toBeGreaterThanOrEqual(-1);
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      document.documentElement.clientWidth + 1,
    );
    expectIntroOnPageGrid(canvasElement);
  },
};

export const IntroReduced: Story = {
  tags: ["test", "!dev", "!autodocs"],
  parameters: {
    wmdsLayout: "fullscreen",
    docs: { disable: true },
  },
  render: () => (
    <MotionConfig reducedMotion="always">
      <GalleryIntro />
    </MotionConfig>
  ),
  play: async ({ canvasElement }) => {
    const section = canvasElement.querySelector("[data-scroll-horizontal]");
    if (!(section instanceof HTMLElement)) throw new Error("gallery missing");
    await waitFor(() => {
      expect(section.getAttribute("data-reduce")).toBe("true");
    });
    const track = section.querySelector("[data-scroll-horizontal-track]");
    const intro = section.querySelector("[data-scroll-horizontal-intro]");
    const row = section.querySelector("ul");
    if (!(track instanceof HTMLElement) || !(intro instanceof HTMLElement) || !(row instanceof HTMLElement)) {
      throw new Error("reduced intro missing");
    }
    expect(track.firstElementChild).toBe(intro);
    await waitFor(() => {
      expect(getComputedStyle(track).flexDirection).toBe("column");
    });
    const sticky = track.parentElement;
    if (!(sticky instanceof HTMLElement)) throw new Error("sticky missing");
    expect(getComputedStyle(sticky).position).toBe("relative");
    expect(intro.getBoundingClientRect().bottom).toBeLessThanOrEqual(row.getBoundingClientRect().top + 1);
    expect(section.querySelector("[data-pattern='eyebrow']")?.textContent).toBe("SELECTED WORK");
    expectIntroOnPageGrid(section);
    const reducedTile = [...section.querySelectorAll("[data-scroll-horizontal-expanded]")].find((host) =>
      host.className.includes("h-svh"),
    );
    expect(reducedTile?.textContent).toContain("Project Five");
  },
};

export const IntroReducedAt390: Story = {
  tags: ["test", "!dev", "!autodocs"],
  globals: lockedViewportGlobals("mobile"),
  parameters: {
    wmdsLayout: "fullscreen",
    docs: { disable: true },
  },
  render: () => (
    <MotionConfig reducedMotion="always">
      <GalleryIntro />
    </MotionConfig>
  ),
  play: async ({ canvasElement }) => {
    expect(window.innerWidth).toBeLessThanOrEqual(400);
    const section = canvasElement.querySelector("[data-scroll-horizontal]");
    if (!(section instanceof HTMLElement)) throw new Error("gallery missing");
    await waitFor(() => {
      expect(section.getAttribute("data-reduce")).toBe("true");
    });
    expectIntroOnPageGrid(section);
  },
};

function reducedMotionList(query: string): MediaQueryList {
  return {
    matches: true,
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {
      return false;
    },
  };
}

function ReducedMotionFrame({ children }: { children: ReactNode }) {
  const restore = useRef<typeof window.matchMedia | null>(null);
  if (typeof window !== "undefined") {
    if (!restore.current) restore.current = window.matchMedia.bind(window);
    const original = restore.current;
    window.matchMedia = (query: string) =>
      query.includes("prefers-reduced-motion") ? reducedMotionList(query) : original(query);
  }
  useEffect(() => {
    const original = restore.current;
    return () => {
      if (original) window.matchMedia = original;
    };
  }, []);
  return children;
}

export const IntroSequenceReduced: Story = {
  tags: ["test", "!dev", "!autodocs"],
  parameters: {
    wmdsLayout: "fullscreen",
    docs: { disable: true },
  },
  render: () => (
    <ReducedMotionFrame>
      <GalleryIntro />
    </ReducedMotionFrame>
  ),
  play: async ({ canvasElement }) => {
    const section = canvasElement.querySelector("[data-scroll-horizontal]");
    if (!(section instanceof HTMLElement)) throw new Error("gallery missing");
    const statement = section.querySelector("h2");
    if (!(statement instanceof HTMLElement)) throw new Error("statement missing");
    await waitFor(() => {
      expect(section.getAttribute("data-reduce")).toBe("true");
      expect(statement.querySelector("[data-text-sequence]")?.getAttribute("data-text-sequence-state")).toBe("rest");
    });
    expect(statement.getAttribute("role")).toBeNull();
    expect(statement.getAttribute("aria-label")).toBeNull();
    expect(statement.textContent?.replace(/\s+/g, " ").trim()).toBe(scrollHorizontalIntroStatement);
    const shapes = [...statement.querySelectorAll("[data-text-sequence-shape]")];
    expect(shapes).toHaveLength(2);
    expect(statement.querySelector("[data-rive-hand='point']")?.getAttribute("aria-hidden")).toBe("true");
    for (const shape of shapes) expect(shape.getAttribute("aria-hidden")).toBe("true");
    const word = statement.querySelector("[data-text-sequence-word]");
    expect(word).not.toBeNull();
    expect(getComputedStyle(word!).transform).toBe("none");
  },
};
