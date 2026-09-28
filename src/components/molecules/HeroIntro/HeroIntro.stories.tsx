import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../../atoms/Badge/Badge";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import { HeroIntro } from "./HeroIntro";

const lead = "We're a design and product studio based in Austin, Texas.";

const meta = {
  title: "Components/Layout/HeroIntro",
  component: HeroIntro,
  tags: ["autodocs"],
  args: {
    lead,
    children: "We help brands stand out online with bold ideas, fresh approaches, and products people actually love to use.",
  },
  ...storyMetaDocsDefaults(),
  parameters: {
    wmdsLayout: "fullscreen",
    docs: {
      description: {
        component: `
## Usage

Centered intro under a marketing headline. Pass the first sentence as \`lead\` and the rest as children. **HeroIntro** owns the line break and the page-grid span.

Both steps are \`type-display-2\` at normal weight, the same font-size as **ScrollHorizontal.Intro**. \`step="large"\` (default) is columns 4–9 from \`lg\`. \`step="display"\` is full width of the page grid — the sequenced hero.

\`lead\` wraps when the measure is shorter than the line, including from \`md\`. Children always start on the next line. Both lines stay centered, with \`text-wrap: pretty\`.

Paste it inside **Components/Layout/HeroTileStack → Pattern — marketing hero**.

## Anatomy

\`\`\`
HeroIntro — grid-page, page block pad removed
└── p — type-display-2, normal weight, text-pretty, text-muted, centered
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
import { Badge, HeroIntro } from "@whatmatters/wmds";

export function MarketingHeroIntro() {
  return (
    <HeroIntro lead="We're a design and product studio based in Austin, Texas.">
      We help brands stand out{" "}
      <Badge variant="info" size="md" emphasis="muted" className="align-middle" avatar={{ src: "/hero-badges/globe.svg", alt: "" }}>online</Badge>
      {" "}with bold ideas, fresh approaches, and products people actually love to use.
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
            "lead is the Austin sentence and wraps inside the measure, including from md. The rest, including the inline online Badge, always starts on the next line. type-display-2 at normal weight, the same font-size as the gallery statement, with text-wrap pretty. Centered on grid-page, columns 4–9 from lg.",
        },
      },
    },
    twoLineCopySource,
  ),
  render: () => (
    <HeroIntro lead={lead}>
      We help brands stand out{" "}
      <Badge
        variant="info"
        size="md"
        emphasis="muted"
        className="align-middle"
        avatar={{ src: "/hero-badges/globe.svg", alt: "" }}
      >
        online
      </Badge>{" "}
      with bold ideas, fresh approaches, and products people actually love to use.
    </HeroIntro>
  ),
};
