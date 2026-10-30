import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor } from "storybook/test";
import { storyMetaDocsDefaults } from "../../../lib/storyCopySource";
import { InlinePill, useInlinePillsPopIn } from "./InlinePill";

/** Small glossy stand-in pictures in WMDS chart colours. */
function Icon({ shape, color }: { shape: "window" | "play" | "bubble"; color: string }) {
  return (
    <svg viewBox="0 0 48 48">
      {shape === "window" ? <rect x="4" y="8" width="40" height="32" rx="9" fill={color} /> : null}
      {shape === "play" ? (
        <>
          <rect x="6" y="6" width="36" height="36" rx="12" fill={color} />
          <path d="M20 16.5v15l13-7.5z" fill="#fff" />
        </>
      ) : null}
      {shape === "bubble" ? <path d="M24 6c10.5 0 19 7.2 19 16.5S34.5 39 24 39c-2.4 0-4.6-.4-6.7-1L9 42l2-7.5C7.3 31.5 5 27.2 5 22.5 5 13.2 13.5 6 24 6z" fill={color} /> : null}
    </svg>
  );
}

const web = <Icon shape="window" color="var(--color-chart-categorical-1)" />;
const video = <Icon shape="play" color="var(--color-chart-categorical-2)" />;
const social = <Icon shape="bubble" color="var(--color-chart-categorical-4)" />;

function HeadlineFrame({ animate = true, children }: { animate?: boolean; children: ReactNode }) {
  const popIn = useInlinePillsPopIn<HTMLHeadingElement>(animate);
  return (
    <h2 {...popIn} className="max-w-[18em] text-balance text-left type-display-2 md:text-center font-normal leading-[1.4] tracking-tight [overflow-wrap:anywhere] md:leading-[1.35]">
      {children}
    </h2>
  );
}

const meta = {
  title: "Components/InlinePill",
  component: InlinePill,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  args: { children: "websites", media: web },
  argTypes: { media: { control: false } },
  parameters: {
    docs: {
      description: {
        component: `
## Usage

A pill that sits **inside running text** and scales with it: a key word in a headline or a sentence, with an optional small picture on its left. Sized in em, so the same pill works in a display headline, a lead paragraph or body copy.

It isn't a control. For a filter or a removable token use \`Chip\`; for a status or category label use \`Badge\`; both are UI-sized.

## Anatomy

\`\`\`
InlinePill (span, inline, data-inline-pill)
├── media (span, aria-hidden, absolute in the left padding) — optional
└── children — the word(s), part of the sentence
\`\`\`

- **Baseline:** an inline run, not inline-flex, so it sits on the text's baseline and punctuation right after it never wraps away.
- **The picture never parts from its word:** it's held in the pill's left padding, out of the text flow, anchored to the first line.
- **Fill:** the text colour at 4% (8% in dark).

## Pop-in (optional)

\`useInlinePillsPopIn()\` returns props for the element that holds the pills. The first time it's 40% in view, each picture pops in one after another (scale from 0 with a tilt, past full size, settle) on the WMDS motion tokens: \`--duration-medium-max\`, one \`--motion-beat\` apart (closer past 4 pills, so the run stays under about half a second), \`--ease-standard\`. Transform and opacity only, once, nothing under reduced motion or without IntersectionObserver; pictures stay visible in print.

\`\`\`tsx
const popIn = useInlinePillsPopIn<HTMLHeadingElement>();
<h2 {...popIn}>We build <InlinePill media={<img src="/web.png" alt="" />}>websites</InlinePill>, …</h2>
\`\`\`

## Best practices

- **Do** keep a pill to one or two short words, and a sentence to 2–3 pills; at 4 or more it reads as a list.
- **Do** keep punctuation outside the pill, right after it with no space.
- **Do** let the heading break long words (\`[overflow-wrap:anywhere]\`) so a long word can't push a phone sideways.
- **Don't** put a link or a button inside; the pill is text.
- **Don't** give the picture meaning the word doesn't carry: it's hidden from screen readers.
`,
      },
    },
  },
} satisfies Meta<typeof InlinePill>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One pill on its own, at body size. */
export const Default: Story = {
  render: (args) => (
    <p className="type-large">
      We build <InlinePill {...args} /> for Austin businesses.
    </p>
  ),
};

/** The intended use: key words in a display headline, popping in when it scrolls into view. */
export const Headline: Story = {
  render: () => (
    <HeadlineFrame>
      We build <InlinePill media={web}>websites</InlinePill>, shoot <InlinePill media={video}>video</InlinePill>, and run{" "}
      <InlinePill media={social}>social</InlinePill> for Austin businesses.
    </HeadlineFrame>
  ),
  play: async ({ canvasElement }) => {
    const heading = canvasElement.querySelector("h2")!;
    // The pop-in runs (or is skipped under reduced motion) and leaves every picture visible.
    await waitFor(() => expect(heading.dataset.inlinePills).not.toBe("pending"), { timeout: 3000 });
    await waitFor(() => expect(document.getAnimations().length).toBe(0), { timeout: 3000 });
    for (const media of heading.querySelectorAll<HTMLElement>("[data-inline-pill-media]")) {
      await expect(getComputedStyle(media).opacity).toBe("1");
      await expect(media).toHaveAttribute("aria-hidden", "true");
    }
  },
};

/** Text only: no picture, even padding. */
export const TextOnly: Story = {
  render: () => (
    <HeadlineFrame animate={false}>
      Plans from <InlinePill>$750</InlinePill>, live in <InlinePill>two weeks</InlinePill>.
    </HeadlineFrame>
  ),
};

/** Worst case at phone width: a long word breaks inside the pill instead of pushing the page sideways, and each picture stays with its word. */
export const LongWordOnPhone: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
  render: () => (
    <div className="w-[358px]">
      <HeadlineFrame animate={false}>
        We <InlinePill media={web}>Donaudampfschifffahrtsgesellschaft</InlinePill>, re<InlinePill media={video}>built</InlinePill> and run{" "}
        <InlinePill media={social}>social</InlinePill>.
      </HeadlineFrame>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const heading = canvasElement.querySelector("h2")!;
    await expect(heading.scrollWidth).toBeLessThanOrEqual(heading.clientWidth);
    for (const pill of heading.querySelectorAll<HTMLElement>("[data-inline-pill]")) {
      const media = pill.querySelector<HTMLElement>("[data-inline-pill-media]")!;
      const first = pill.getClientRects()[0]!;
      const box = media.getBoundingClientRect();
      // The picture sits inside the pill's first line, in its left padding (1.3em).
      const padding = parseFloat(getComputedStyle(pill).paddingLeft);
      await expect(box.left).toBeGreaterThanOrEqual(first.left - 1);
      await expect(box.right).toBeLessThanOrEqual(first.left + padding + 1);
      await expect(box.top).toBeGreaterThanOrEqual(first.top - 2);
      await expect(box.bottom).toBeLessThanOrEqual(first.bottom + 2);
    }
  },
};
