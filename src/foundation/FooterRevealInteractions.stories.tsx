import { MotionConfig } from "motion/react";
import { expect, waitFor } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FooterReveal } from "../components/organisms/FooterReveal/FooterReveal";
import { footerRevealFieldClasses } from "../components/organisms/FooterReveal/footerRevealStyles";

/**
 * Browser interaction tests — `npm run test:interactions`.
 * Opacity is read from the fade layer: near 0 before the reveal, 1 after
 * scrolling one footer-height past the cover's bottom edge.
 */
const meta = {
  title: "Internal/Interactions/FooterReveal",
  tags: ["test", "!dev", "!autodocs"],
  parameters: {
    docs: { disable: true },
    wmdsLayout: "padded",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function RevealFixture() {
  return (
    <FooterReveal>
      <FooterReveal.Content>
        <p className="type-body text-fg">Page cover</p>
      </FooterReveal.Content>
      <FooterReveal.Footer className={footerRevealFieldClasses}>
        <p className="type-body px-[var(--grid-margin)] py-16 text-primary-foreground">Footer</p>
      </FooterReveal.Footer>
    </FooterReveal>
  );
}

function fadeLayer(root: HTMLElement): HTMLElement {
  const fade = root.querySelector<HTMLElement>("[data-footer-reveal='fade']");
  if (!fade) throw new Error("Footer reveal fade layer is missing");
  return fade;
}

function scaleLayer(root: HTMLElement): HTMLElement {
  const scale = root.querySelector<HTMLElement>("[data-footer-reveal='scale']");
  if (!scale) throw new Error("Footer reveal scale layer is missing");
  return scale;
}

function readOpacity(root: HTMLElement): number {
  return Number(getComputedStyle(fadeLayer(root)).opacity);
}

function readScale(root: HTMLElement): number {
  const scale = scaleLayer(root);
  if (scale.style.scale) return Number(scale.style.scale);
  const transform = getComputedStyle(scale).transform;
  if (transform === "none") return 1;
  const match = /matrix\(([^,]+)/.exec(transform);
  return match ? Number(match[1]) : Number.NaN;
}

function readBlur(root: HTMLElement): number {
  const filter = scaleLayer(root).style.filter || getComputedStyle(scaleLayer(root)).filter;
  if (filter === "none" || filter === "") return 0;
  const match = /blur\(([-\d.]+)px\)/.exec(filter);
  return match ? Number(match[1]) : Number.NaN;
}

function scrollToY(top: number) {
  const scrolling = document.scrollingElement ?? document.documentElement;
  scrolling.scrollTop = top;
  window.scrollTo(0, top);
  window.dispatchEvent(new Event("scroll"));
}

function revealStart(root: HTMLElement): number {
  const content = root.querySelector<HTMLElement>("[data-footer-reveal='content']");
  if (!content) throw new Error("Footer reveal content is missing");
  return window.scrollY + content.getBoundingClientRect().bottom - window.innerHeight;
}

export const RevealOnScroll: Story = {
  name: "reveal on scroll",
  render: () => <RevealFixture />,
  play: async ({ canvasElement }) => {
    await waitFor(() => {
      expect(readOpacity(canvasElement)).toBeLessThan(0.15);
    });
    expect(readScale(canvasElement)).toBeGreaterThan(0.85);
    expect(readScale(canvasElement)).toBeLessThan(0.95);
    expect(readBlur(canvasElement)).toBeGreaterThan(5);

    const footer = canvasElement.querySelector<HTMLElement>("[data-footer-reveal='sticky']");
    if (!footer) throw new Error("Footer reveal sticky shell is missing");
    const footerHeight = footer.offsetHeight;
    const start = Math.max(0, revealStart(canvasElement));

    scrollToY(start + footerHeight / 2);
    await waitFor(() => {
      const opacity = readOpacity(canvasElement);
      expect(opacity).toBeGreaterThan(0.2);
      expect(opacity).toBeLessThan(0.85);
    });

    scrollToY(start + footerHeight + 32);
    await waitFor(() => {
      expect(readOpacity(canvasElement)).toBeGreaterThan(0.95);
    });
    expect(readScale(canvasElement)).toBeGreaterThan(0.98);
    expect(readBlur(canvasElement)).toBeLessThan(0.5);
    expect(fadeLayer(canvasElement).style.willChange === "auto" || fadeLayer(canvasElement).style.willChange === "").toBe(true);
  },
};

export const ReducedMotion: Story = {
  name: "reduced motion",
  render: () => (
    <MotionConfig reducedMotion="always">
      <RevealFixture />
    </MotionConfig>
  ),
  play: async ({ canvasElement }) => {
    await waitFor(() => {
      expect(readOpacity(canvasElement)).toBeGreaterThan(0.99);
    });
    expect(readScale(canvasElement)).toBeGreaterThan(0.98);
    expect(readBlur(canvasElement)).toBeLessThan(0.5);
    expect(fadeLayer(canvasElement).style.willChange === "auto" || fadeLayer(canvasElement).style.willChange === "").toBe(true);
    expect(scaleLayer(canvasElement).style.willChange === "auto" || scaleLayer(canvasElement).style.willChange === "").toBe(true);
  },
};
