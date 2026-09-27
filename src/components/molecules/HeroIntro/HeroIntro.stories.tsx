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

Centered intro under a marketing headline. Pass the first sentence as \`lead\` and the rest as children. **HeroIntro** owns the line break, the \`type-large\` step, and the page-grid span.

From \`md\`, \`lead\` stays on one line. Below \`md\` it may wrap. Children always start on the next line. Both lines use the type-large leading and stay centered.

Paste it inside **Components/Layout/HeroTileStack → Pattern — marketing hero**.

## Anatomy

\`\`\`
HeroIntro — grid-page, page block pad removed
└── p — type-large, font-normal, text-muted, centered
    ├── lead — one line from md; may wrap below md
    └── children — always the next line
        columns 4–9 from lg; full width of the page grid below lg
\`\`\`

## Best practices

- Pass the first sentence, including its period, as \`lead\`. Do not insert a line break in the copy.
- Keep children on the same sentence rhythm. The marketing hero puts one inline **Badge** in that line.
- \`className\` is layout only (width, margin). The column span and the nowrap lead are part of the component.
- Do not restyle the two lines to different type steps. They share \`type-large\`.
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
            "lead is the Austin sentence and stays on one line from md. Below md that sentence may wrap. The rest, including the inline online Badge, always starts on the next line. Same type-large step, regular weight, and type-large leading. Centered on grid-page, columns 4–9 from lg.",
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
