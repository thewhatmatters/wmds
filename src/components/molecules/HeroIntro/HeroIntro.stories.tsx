import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../../atoms/Badge/Badge";
import { Button } from "../../atoms/Button/Button";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import { HeroIntro } from "./HeroIntro";

const lead = "A design studio in Austin.";

const meta = {
  title: "Components/HeroIntro",
  component: HeroIntro,
  tags: ["autodocs"],
  args: {
    lead,
    children: "We help brands stand out online.",
  },
  ...storyMetaDocsDefaults(),
  parameters: {
    wmdsLayout: "fullscreen",
    docs: {
      description: {
        component: `
## Usage

Intro under a marketing headline: left on phones, centred from \`md\` (Headings H8), on columns 2–11 from \`lg\` so a 12-word intro holds 2 lines. Pass the first sentence as \`firstLine\` and the rest as children. **HeroIntro** owns the line break and the page-grid span.

Both steps are an \`h1\` on \`type-display-2\` at normal weight, the same font-size and line-height as **ScrollHorizontal.Intro**. \`step="large"\` (default) is columns 4–9 from \`lg\`. \`step="display"\` is full width of the page grid — the sequenced hero.

\`lead\` wraps when the measure is shorter than the line, including from \`md\`. Children always start on the next line. Both lines use \`text-wrap: balance\`, so a wrapped line is not a single word.

Paste it inside **Components/HeroTileStack → Pattern — marketing hero**.

## Anatomy

\`\`\`
HeroIntro — grid-page, page block pad removed
└── h1 — type-display-2, normal weight, text-balance, text-muted, left on phones, centred from md
    ├── lead — wraps, including from md
    └── children — always the next line
        large: columns 4–9 from lg; full width of the page grid below lg
        display: full width of the page grid
\`\`\`

## Best practices

- Pass the first sentence, including its period, as \`lead\`. Do not insert a line break in the copy.
- Keep children on the same sentence rhythm. The marketing hero puts one inline **Badge** in that line.
- \`className\` is layout only (width, margin). The column span is part of the component.
- Do not restyle the two lines to different type steps. They share \`type-display-2\`.
- Use \`step="display"\` for the sequenced marketing hero, where the line is full width. The default hero stays on \`large\` and the same size.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof HeroIntro>;

export default meta;
type Story = StoryObj<typeof meta>;

const twoLineCopySource = `
import { Badge, HeroIntro } from "@thewhatmatters/wmds";

export function MarketingHeroIntro() {
  return (
    <HeroIntro firstLine="A design studio in Austin.">
      We help brands stand out{" "}
      <Badge variant="info" size="md" emphasis="muted" className="align-middle" avatar={{ src: "/hero-badges/globe.svg", alt: "" }}>online</Badge>
      .
    </HeroIntro>
  );
}
`.trim();

export const TwoLineIntro: Story = {
  name: "Pattern — two-line intro",
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "firstLine is the Austin sentence and wraps inside the measure, including from md. The rest, including the inline online Badge, always starts on the next line. type-display-2 at normal weight, the same font-size as the gallery statement, with text-wrap balance. Left on phones, centred from md; columns 2–11 from lg.",
        },
      },
    },
    twoLineCopySource,
  ),
  render: () => (
    <HeroIntro firstLine={lead}>
      We help brands stand out{" "}
      <Badge
        variant="info"
        size="md"
        emphasis="muted"
        className="align-middle"
        avatar={{ src: "/hero-badges/globe.svg", alt: "" }}
      >
        online
      </Badge>
      .
    </HeroIntro>
  ),
};

export const WithActions: Story = {
  name: "Pattern — with description and actions",
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "The hero's job in one place (Hero rule R2): the heading, a one-sentence lead, and one primary action with an optional secondary. The actions row is left on phones and centred from md, like the heading.",
        },
      },
    },
    `
import { Button, HeroIntro } from "@thewhatmatters/wmds";

export function MarketingHeroWithActions() {
  return (
    <HeroIntro
      firstLine="A design studio in Austin."
      description="Websites, video and social for small businesses, live in two weeks."
      actions={
        <>
          <Button role="primary" size="lg" render={<a href="/start" />}>Get my free sketch</Button>
          <Button role="outline" size="lg" render={<a href="/work" />}>See our work</Button>
        </>
      }
    >
      We help brands stand out online.
    </HeroIntro>
  );
}
`.trim(),
  ),
  render: () => (
    <HeroIntro
      firstLine={lead}
      description="Websites, video and social for small businesses, live in two weeks."
      actions={
        <>
          <Button role="primary" size="lg" render={<a href="/start" />}>
            Get my free sketch
          </Button>
          <Button role="outline" size="lg" render={<a href="/work" />}>
            See our work
          </Button>
        </>
      }
    >
      We help brands stand out online.
    </HeroIntro>
  ),
};
