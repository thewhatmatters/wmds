import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useRef, type ReactNode } from "react";
import { expect, waitFor } from "storybook/test";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import { TextSequence, textSequenceShapeVariants } from "./TextSequence";

const samplePlain = "We design brands people cannot ignore";

function SampleSequence() {
  return (
    <p className="type-display-2 text-center text-fg">
      <TextSequence stagger={0.07} trigger="mount" idle>
        We design <TextSequence.Shape variant="asterisk" /> brands people{" "}
        <TextSequence.Shape variant="pill" tone="brand-soft" /> cannot ignore
      </TextSequence>
    </p>
  );
}

const sampleCopySource = `
import { TextSequence } from "@whatmatters/wmds";

export function HeroLine() {
  return (
    <p className="type-display-2 text-center text-fg">
      <TextSequence stagger={0.07} trigger="mount" idle>
        We design <TextSequence.Shape variant="asterisk" /> brands people{" "}
        <TextSequence.Shape variant="pill" tone="brand-soft" /> cannot ignore
      </TextSequence>
    </p>
  );
}
`.trim();

function ShapesGallery() {
  return (
    <p className="type-large text-center text-fg">
      <TextSequence emphasis="none" idle stagger={0.05}>
        <TextSequence.Shape variant="asterisk" /> asterisk{" "}
        <TextSequence.Shape variant="pill" tone="brand-soft" /> pill{" "}
        <TextSequence.Shape variant="diamond" tone="accent" /> diamond{" "}
        <TextSequence.Shape variant="dots" tone="primary" /> dots{" "}
        <TextSequence.Shape variant="double-pill" /> double-pill{" "}
        <TextSequence.Shape variant="circle" tone="info" /> circle{" "}
        <TextSequence.Shape variant="smiley" /> smiley
      </TextSequence>
    </p>
  );
}

const galleryCopySource = `
import { TextSequence } from "@whatmatters/wmds";

export function ShapeGallery() {
  return (
    <p className="type-large text-center text-fg">
      <TextSequence emphasis="none" idle stagger={0.05}>
        <TextSequence.Shape variant="asterisk" /> asterisk{" "}
        <TextSequence.Shape variant="pill" tone="brand-soft" /> pill{" "}
        <TextSequence.Shape variant="diamond" tone="accent" /> diamond{" "}
        <TextSequence.Shape variant="dots" tone="primary" /> dots{" "}
        <TextSequence.Shape variant="double-pill" /> double-pill{" "}
        <TextSequence.Shape variant="circle" tone="info" /> circle{" "}
        <TextSequence.Shape variant="smiley" /> smiley
      </TextSequence>
    </p>
  );
}
`.trim();

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

function collapsedText(root: ParentNode): string {
  return (root.textContent ?? "").replace(/\s+/g, " ").trim();
}

function expectShapesHidden(root: ParentNode) {
  const shapes = [...root.querySelectorAll("[data-text-sequence-shape]")];
  expect(shapes.length).toBeGreaterThan(0);
  for (const shape of shapes) {
    expect(shape.getAttribute("aria-hidden")).toBe("true");
  }
  return shapes;
}

function expectInsideViewport(root: ParentNode) {
  const nodes = root.querySelectorAll("[data-text-sequence-word], [data-text-sequence-shape]");
  expect(nodes.length).toBeGreaterThan(0);
  for (const node of nodes) {
    const box = node.getBoundingClientRect();
    if (box.width < 1 && box.height < 1) continue;
    expect(box.left).toBeGreaterThanOrEqual(-1);
    expect(box.right).toBeLessThanOrEqual(window.innerWidth + 1);
  }
}

const meta = {
  title: "Components/Layout/TextSequence",
  component: TextSequence,
  tags: ["autodocs"],
  args: {
    children: "We design brands people cannot ignore",
    stagger: 0.07,
    delay: 0,
    trigger: "mount",
    idle: false,
    lines: true,
    emphasis: "alternate",
  },
  ...storyMetaDocsDefaults(),
  parameters: {
    docs: {
      description: {
        component: `
## Usage

Animated line of text. Write the sentence as children and drop **TextSequence.Shape** between words. The parent owns the type step (\`type-display-*\`, \`type-large\`, and so on). \`className\` is layout only.

Words slide up from behind a mask, staggered. Shapes pop (scale and rotate) halfway between the neighboring words on that same timeline. \`idle\` then spins asterisks and stretches pills. \`trigger="mount"\` runs before first paint. \`trigger="inView"\` waits until the block intersects the viewport, then runs once.

\`emphasis="alternate"\` (default) sets even words regular and odd words bold. Shapes do not take a turn. \`lines\` (default) re-splits when the block wraps.

\`prefers-reduced-motion\`: no split, no pop, no idle. The sentence stays at rest. The server render matches that rest state, so hydration does not hide the text and no-JS keeps it visible.

Screen readers get the plain sentence once. Shapes are \`aria-hidden\`. Split words are hidden from the tree and the block's \`aria-label\` is the sentence.

Install \`gsap\` and \`@gsap/react\` with WMDS. Only this component imports them. See **ADR-0037**.

## Anatomy

\`\`\`
TextSequence — block, width of the parent
├── word — regular or bold, masked, slides up
└── TextSequence.Shape — inline SVG, cap-height em box, aria-hidden
    tones: brand, brand-soft, accent, primary, info
    variants: asterisk, pill, diamond, dots, double-pill, circle, smiley
\`\`\`

## Best practices

- Put the type step on the parent. Do not recolor words with utilities at the call site.
- Keep shapes few. They read as extra words, not as icons on every token.
- Leave the headline's letter spans alone when those letters anchor **RiveHand**. Sequence the intro instead (**HeroTileStack → Pattern — marketing hero text sequence**).
- \`idle\` defaults off. Turn it on for a hero that should keep moving after the entrance.
- Do not set a reduced-motion prop. The OS query is the switch.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof TextSequence>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Default",
  tags: ["test"],
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "A display line. Even words stay regular, odd words are bold. The asterisk and the ribbed pill sit inline and pop between their neighbors. idle spins the asterisk and stretches the pill after the entrance. trigger is mount, so the split runs before first paint.",
        },
      },
    },
    sampleCopySource,
  ),
  render: () => <SampleSequence />,
  play: async ({ canvasElement }) => {
    await waitFor(() => {
      expect(canvasElement.querySelector("[data-text-sequence]")?.getAttribute("data-text-sequence-state")).toBe(
        "playing",
      );
    });
    const sequence = canvasElement.querySelector("[data-text-sequence]");
    expect(sequence?.getAttribute("aria-label")).toBe(samplePlain);
    expect(sequence?.getAttribute("data-plain")).toBe(samplePlain);
    expect(collapsedText(canvasElement)).toContain(samplePlain);
    expectShapesHidden(canvasElement);
    const words = [...canvasElement.querySelectorAll("[data-text-sequence-word]")];
    expect(words.map((word) => word.textContent)).toEqual(["We", "design", "brands", "people", "cannot", "ignore"]);
    expect(words[0]?.className).toContain("font-normal");
    expect(words[1]?.className).toContain("font-bold");
  },
};

export const Shapes: Story = {
  name: "Shapes",
  tags: ["test"],
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Every mark, inline, at cap height. Tones are brand, brand-soft, accent, primary, and info. emphasis is none so the labels keep the parent weight. Each shape is aria-hidden.",
        },
      },
    },
    galleryCopySource,
  ),
  render: () => <ShapesGallery />,
  play: async ({ canvasElement }) => {
    const shapes = expectShapesHidden(canvasElement);
    expect(shapes.map((shape) => shape.getAttribute("data-variant"))).toEqual([...textSequenceShapeVariants]);
    expect(collapsedText(canvasElement)).toContain("asterisk");
    expect(collapsedText(canvasElement)).toContain("double-pill");
    expect(collapsedText(canvasElement)).toContain("smiley");
  },
};

export const ReducedMotion: Story = {
  name: "Reduced motion",
  tags: ["test"],
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "The canvas forces prefers-reduced-motion. There is no prop for it. Words stay put, shapes stay at scale 1 with no spin or stretch, and the sentence is the text itself (no aria-label stand-in). The same markup is what the server and no-JS render.",
        },
      },
    },
    sampleCopySource,
  ),
  render: () => (
    <ReducedMotionFrame>
      <SampleSequence />
    </ReducedMotionFrame>
  ),
  play: async ({ canvasElement }) => {
    const sequence = canvasElement.querySelector("[data-text-sequence]");
    expect(sequence).not.toBeNull();
    await waitFor(() => {
      expect(sequence?.getAttribute("data-text-sequence-state")).toBe("rest");
    });
    expect(sequence?.getAttribute("aria-label")).toBeNull();
    expect(sequence?.querySelector("[style*='overflow']")).toBeNull();
    const word = canvasElement.querySelector("[data-text-sequence-word]");
    expect(word).not.toBeNull();
    expect(getComputedStyle(word!).transform).toBe("none");
    const shape = canvasElement.querySelector("[data-text-sequence-shape]");
    expect(shape).not.toBeNull();
    const shapeTransform = getComputedStyle(shape!).transform;
    expect(shapeTransform === "none" || shapeTransform === "matrix(1, 0, 0, 1, 0, 0)").toBe(true);
    expect(collapsedText(canvasElement)).toContain(samplePlain);
    expectShapesHidden(canvasElement);
  },
};

export const Narrow: Story = {
  name: "No overflow at 390",
  tags: ["test", "!dev", "!autodocs"],
  globals: {
    viewport: { value: "review390", isRotated: false },
  },
  parameters: {
    docs: { disable: true },
    viewport: {
      options: {
        review390: {
          name: "Review 390",
          styles: { width: "390px", height: "844px" },
          type: "mobile" as const,
        },
      },
    },
  },
  render: () => <SampleSequence />,
  play: async ({ canvasElement }) => {
    expect(window.innerWidth).toBeLessThanOrEqual(400);
    await waitFor(() => {
      expect(canvasElement.querySelector("[data-text-sequence-word]")).not.toBeNull();
    });
    expect(collapsedText(canvasElement)).toContain(samplePlain);
    expectShapesHidden(canvasElement);
    expectInsideViewport(canvasElement);
  },
};
