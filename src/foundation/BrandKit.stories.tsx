import type { Meta, StoryObj } from "@storybook/react-vite";
import { Band } from "../components/atoms/Band/Band";
import { Button } from "../components/atoms/Button/Button";
import { Badge } from "../components/atoms/Badge/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/atoms/Table/Table";
import { contrastRatio, textContrastMinimum } from "../lib/contrast";
import { brandKitClient, scopedBrandCss } from "./brandKitClient";

const meta = {
  title: "Foundations/Brand kit",
  tags: ["autodocs"],
  parameters: {
    wmdsLayout: "fullscreen",
    docs: {
      description: {
        component: `
A **brand kit** is the small set of allow-listed variables an app sets in \`brand.css\` to carry a client's brand on WMDS. Everything else stays the shared contract, so contrast and layout stay guaranteed. Full rules: **CONSUMING.md → Brand kit**.

| Knob | Default | Reads it |
|------|---------|----------|
| \`--font-family-heading\` | Geist | \`type-heading-*\`, and display when \`--font-display\` is unset |
| \`--font-display\` | unset (the heading face) | every \`type-display-*\` step |
| \`--font-display-weight\` / \`-tracking\` / \`-case\` | each step's own | every display step: a one-weight or all-caps face |
| \`--font-serif\` | system serif | a slot to point the two faces at |
| \`--text-display-hero-size\` | \`clamp(3.5rem, 16vw, 16rem)\` | \`type-display-hero\` |
| \`--color-primary\` / \`--color-on-primary\` | slate | primary controls, focus ring |
| \`--color-brand-surface\` / \`--color-on-brand-surface\` (+ \`-muted\`) | navy / white | **Band** \`tone="inverse"\` |
| \`--color-field\` / \`--color-on-field\` (+ \`-muted\`) | the primary pair | **Band** \`tone="field"\` |
| \`--radius-control\` / \`--radius-surface\` | pill / 16px | **Foundations/Shape** |

**Display steps:** \`type-display-hero\` (the one oversized moment: fluid to 16vw, 0.92 leading) and \`type-display-xl\` (statement rows: 44px → 136px, 0.9 leading) sit above \`type-display-1\`. Every display step breaks a long word instead of overflowing a phone.

**Contrast:** every on-colour (and its muted step) needs **4.5:1** on its colour. \`npx wmds-check\` fails a \`brand.css\` pair under that (\`brand-contrast\`), and the story's accessibility check runs on the rendered page.
        `.trim(),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const scope = "wmds-brand-kit-client";

function ContrastTable() {
  return (
    <Table aria-label="Brand kit contrast">
      <TableHeader>
        <TableRow>
          <TableHead>Pair</TableHead>
          <TableHead>Ink</TableHead>
          <TableHead>Colour</TableHead>
          <TableHead align="end">Ratio</TableHead>
          <TableHead>AA text</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {brandKitClient.pairs.map((pair) => {
          const ratio = contrastRatio(pair.ink, pair.background);
          const passes = ratio >= textContrastMinimum;
          return (
            <TableRow key={pair.label}>
              <TableCell>{pair.label}</TableCell>
              <TableCell>
                <code className="type-code">{pair.ink}</code>
              </TableCell>
              <TableCell>
                <code className="type-code">{pair.background}</code>
              </TableCell>
              <TableCell align="end">
                <span className="tabular-nums">{ratio.toFixed(2)}:1</span>
              </TableCell>
              <TableCell>
                <Badge variant={passes ? "success" : "destructive"}>{passes ? "Pass" : "Fail"}</Badge>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

/** The offer sheet on Band and the brand kit, with no workaround CSS. */
export function ThemeAClientExample() {
  return (
    <div className={`${scope} bg-body text-fg`}>
      <style>{scopedBrandCss(`.${scope}`)}</style>
      <main className="grid-page !py-0">
        <Band tone="inverse" spacing="lg" aria-labelledby="client-hero">
          <p className="type-eyebrow col-span-full text-muted">Catering offer · Austin</p>
          <h1 id="client-hero" className="type-display-hero col-span-full text-fg" data-testid="client-hero">
            Tacos for forty
          </h1>
          <div className="col-span-full flex flex-col items-start gap-6 md:col-span-5">
            <p className="type-reading text-muted">
              Wood-fired tacos, two salsas and a mezcal bar, served at your place. Staff included.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button role="primary">Book a date</Button>
              <Button role="secondary">See the menu</Button>
            </div>
          </div>
        </Band>
        <Band aria-labelledby="client-packages">
          <h2 id="client-packages" className="type-eyebrow col-span-full text-muted">
            Packages
          </h2>
          {[
            ["01", "Taqueria", "$1,500"],
            ["02", "Fiesta", "$2,400"],
          ].map(([number, name, price]) => (
            <div key={number} className="col-span-full flex items-baseline justify-between gap-6 border-t border-border pt-4">
              <p className="type-display-xl text-fg">
                {number} {name}
              </p>
              <p className="type-display-2 shrink-0 tabular-nums text-fg">{price}</p>
            </div>
          ))}
        </Band>
        <Band tone="field" aria-labelledby="client-field">
          <h2 id="client-field" className="type-display-1 col-span-full text-fg md:col-span-5">
            Booking October
          </h2>
          <div className="col-span-full flex flex-col items-start gap-4 md:col-span-3">
            <p className="type-body text-fg">Four Saturdays left. Deposit holds the date.</p>
            <Button role="outline">Hold a Saturday</Button>
          </div>
        </Band>
        <Band aria-labelledby="client-contrast">
          <h2 id="client-contrast" className="type-heading-2 col-span-full text-fg">
            Contrast check
          </h2>
          <div className="col-span-full lg:col-span-8">
            <ContrastTable />
          </div>
        </Band>
      </main>
    </div>
  );
}

export const ThemeAClient: Story = {
  name: "Theme a client",
  render: () => <ThemeAClientExample />,
  parameters: {
    docs: {
      description: {
        story: `Product Designer's "Bold and loud" offer sheet rebuilt on **Band** and the brand kit alone: an inverse hero on the warm dark, statement rows on \`type-display-xl\`, one chili field, and Anton set in capitals at weight 400 (this story falls back to Impact, since Anton isn't bundled; an app loads its own face). The table checks every pair at 4.5:1. The app's whole \`brand.css\`:

\`\`\`css
${brandKitClient.brandCss}
\`\`\``,
      },
    },
  },
};
