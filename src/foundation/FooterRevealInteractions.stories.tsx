import { MotionConfig } from "motion/react";
import { expect, waitFor } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FooterReveal } from "../components/organisms/FooterReveal/FooterReveal";
import { footerRevealWordmarkFillsFrame } from "../components/organisms/FooterReveal/footerRevealWordmark";
import { footerRevealBrandSample } from "../storybook/footerRevealSample";
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
        <p className="type-body px-[var(--grid-margin)] py-16">Footer</p>
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
    expect(readBlur(canvasElement)).toBeGreaterThan(10);
    expect(readBlur(canvasElement)).toBeLessThan(12.5);

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

export const BrandFooter: Story = {
  name: "brand footer",
  render: () => (
    <FooterReveal>
      <FooterReveal.Content>
        <p className="type-body text-fg">Page cover</p>
      </FooterReveal.Content>
      <FooterReveal.Footer className={footerRevealFieldClasses}>
        <FooterReveal.Brand {...footerRevealBrandSample} />
      </FooterReveal.Footer>
    </FooterReveal>
  ),
  play: async ({ canvasElement }) => {
    const headline = canvasElement.querySelector("h2");
    expect(headline?.textContent).toBe("We Build WhatMatters");
    const cta = [...canvasElement.querySelectorAll("button")].find(
      (node) => node.textContent === "Start a project",
    );
    expect(cta?.getAttribute("type")).toBe("button");
    expect(cta?.getAttribute("data-role")).toBe("inverse");
    expect(canvasElement.querySelector("a[href='/start']")).toBeNull();

    const wordmark = canvasElement.querySelector<HTMLElement>("[data-footer-reveal='wordmark']");
    const frame = canvasElement.querySelector<HTMLElement>("[data-footer-reveal='wordmark-frame']");
    expect(wordmark?.textContent).toBe("WHATMATTERS");
    expect(wordmark?.getAttribute("aria-hidden")).toBe("true");
    await waitFor(() => {
      if (!wordmark || !frame) throw new Error("brand wordmark missing");
      const frameWidth = frame.clientWidth;
      const textWidth = wordmark.scrollWidth;
      expect(frameWidth).toBeGreaterThan(0);
      expect(footerRevealWordmarkFillsFrame(wordmark, frame)).toBe(true);
      expect(textWidth).toBeLessThanOrEqual(frameWidth + 1);
      expect(frameWidth - textWidth).toBeLessThanOrEqual(Math.max(8, frameWidth * 0.02));
      const em = Number.parseFloat(frame.style.getPropertyValue("--footer-wordmark-em") ?? "");
      expect(em).toBeGreaterThan(1);
      const fontSize = Number.parseFloat(getComputedStyle(wordmark).fontSize);
      expect(Math.abs(fontSize * em - frameWidth)).toBeLessThanOrEqual(2);
      expect(wordmark.offsetLeft).toBeGreaterThanOrEqual(-1);
      expect(wordmark.offsetLeft + wordmark.offsetWidth).toBeLessThanOrEqual(frameWidth + 1);
    });
    expect(wordmark?.className).toContain("text-brand-soft");
    expect(wordmark?.className).toContain("translate-y-[16%]");
    expect(wordmark?.className).not.toContain("-12vw");

    const instagram = canvasElement.querySelector("a[href='https://www.instagram.com/thewhatmatters']");
    expect(instagram?.getAttribute("target")).toBe("_blank");
    expect(instagram?.getAttribute("rel")).toBe("noopener");
    const linkedin = canvasElement.querySelector("a[href='https://www.linkedin.com/in/randymdaniel']");
    expect(linkedin?.getAttribute("target")).toBe("_blank");
    expect(linkedin?.getAttribute("rel")).toBe("noopener");

    const contra = canvasElement.querySelector("a[href='#contra-TODO']");
    const x = canvasElement.querySelector("a[href='#x-TODO']");
    expect(contra?.textContent).toBe("Contra");
    expect(contra?.hasAttribute("target")).toBe(false);
    expect(x?.textContent).toBe("X");
    expect(x?.hasAttribute("target")).toBe(false);

    const root = canvasElement.querySelector<HTMLElement>("[data-footer-reveal='root']");
    if (!root) throw new Error("Footer reveal root is missing");
    expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + 1);
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(document.documentElement.clientWidth + 1);
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
