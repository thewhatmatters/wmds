import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { storyCopySource, storyMetaDocsDefaults } from "../../../lib/storyCopySource";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../Table/Table";
import { Meter, meterSizes, meterTones } from "./Meter";

const meta = {
  title: "Components/Meter",
  component: Meter,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  argTypes: {
    size: { control: "select", options: [...meterSizes] },
    tone: { control: "select", options: [...meterTones] },
    value: { control: { type: "number" } },
  },
  args: {
    value: 62,
    label: "Storage used",
    size: "sm",
    tone: "primary",
  },
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        component: `
## Usage

One thin bar for **a static measure in a known range**: a share of a total, a score, a level, capacity used. It has no label or figure of its own, so it fits wherever the words already are: a table cell, a list row, a card, a **Stat** \`detail\`.

| Need | Use |
|------|-----|
| A share or level beside its figure (table column, ranked rows) | **Meter** with \`aria-hidden\`: the written figure carries it |
| A level with no figure beside it | **Meter** with \`label\` or \`aria-labelledby\`, and \`valueText\` for the unit |
| Work in flight (upload, export) | **Progress** |
| A ticked capacity bar, a ring, ranked bars with labels | **Chart** |

## Anatomy

\`\`\`
Meter (span, role="meter")   — the track: full width of its box, 2 / 4 / 6px tall
└── fill                     — value's place in min–max
\`\`\`

Brand knobs, set in a brand stylesheet for every meter in scope: \`--meter-fill\` (a colour or a gradient) and \`--meter-track\`.

## Best practices

- **Do** give every meter a name (\`label\` or \`aria-labelledby\`), or hide it with \`aria-hidden\` when the same figure is written beside it. A bar alone never carries the number.
- **Do** pass \`valueText\` when the range isn't a percentage ("48 mg/l", "3 of 12 seats").
- **Do** set the width with a layout \`className\` or let the cell decide. The bar fills its box.
- **Do** use \`size="xs"\` in dense tables and \`tone="neutral"\` in editorial ones.
- **Don't** use it for work in progress. That's **Progress**, with a label, a way out and announcements.
- **Don't** colour single meters by hand. Use \`tone\`, or the brand knobs for a whole scope.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof Meter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="w-full max-w-xs">
      <Meter {...args} />
    </div>
  ),
  play: async ({ canvas }) => {
    const meter = canvas.getByRole("meter", { name: "Storage used" });
    await expect(meter).toHaveAttribute("aria-valuenow", "62");
    await expect(meter).toHaveAttribute("aria-valuetext", "62%");
  },
};

const sources = [
  { name: "Search", visits: "18,240", share: 48 },
  { name: "Direct", visits: "9,120", share: 24 },
  { name: "Referral", visits: "6,460", share: 17 },
  { name: "Social", visits: "4,180", share: 11 },
];

export const TableColumn: Story = {
  name: "Pattern — share column in a table",
  render: () => (
    <div className="mx-auto w-full max-w-2xl">
      <Table aria-label="Visits by source">
        <TableHeader>
          <TableRow>
            <TableHead>Source</TableHead>
            <TableHead align="end">Visits</TableHead>
            <TableHead align="end">Share</TableHead>
            <TableHead>
              <span className="sr-only">Share, drawn</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sources.map((source) => (
            <TableRow key={source.name}>
              <TableCell>{source.name}</TableCell>
              <TableCell align="end">{source.visits}</TableCell>
              <TableCell align="end">{source.share}%</TableCell>
              <TableCell>
                <Meter value={source.share} size="xs" tone="neutral" aria-hidden className="w-32" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const meters = [...canvasElement.querySelectorAll<HTMLElement>("[data-meter]")];
    await expect(meters).toHaveLength(4);
    // The figure is written in the row, so the bars stay out of the accessibility tree.
    await expect(canvasElement.querySelectorAll("[role='meter']")).toHaveLength(0);
    const widths = meters.map((meter) => meter.querySelector<HTMLElement>("[data-meter-fill]")!.offsetWidth);
    await expect(widths[0]).toBeGreaterThan(widths[1]);
    await expect(widths[1]).toBeGreaterThan(widths[3]);
    await expect(meters[0].offsetHeight).toBe(2);
  },
  parameters: storyCopySource(`
import { Meter, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@thewhatmatters/wmds";

const sources = [
  { name: "Search", visits: "18,240", share: 48 },
  { name: "Direct", visits: "9,120", share: 24 },
  { name: "Referral", visits: "6,460", share: 17 },
  { name: "Social", visits: "4,180", share: 11 },
];

export function VisitsBySource() {
  return (
    <Table aria-label="Visits by source">
      <TableHeader>
        <TableRow>
          <TableHead>Source</TableHead>
          <TableHead align="end">Visits</TableHead>
          <TableHead align="end">Share</TableHead>
          <TableHead>
            <span className="sr-only">Share, drawn</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sources.map((source) => (
          <TableRow key={source.name}>
            <TableCell>{source.name}</TableCell>
            <TableCell align="end">{source.visits}</TableCell>
            <TableCell align="end">{source.share}%</TableCell>
            <TableCell>
              <Meter value={source.share} size="xs" tone="neutral" aria-hidden className="w-32" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
`),
};

const levels = [
  { id: "meter-level-seats", name: "Seats", value: 9, max: 12, text: "9 of 12 seats" },
  { id: "meter-level-storage", name: "Storage", value: 31, max: 50, text: "31 of 50 GB" },
  { id: "meter-level-builds", name: "Build minutes", value: 120, max: 400, text: "120 of 400 minutes" },
];

export const NamedLevels: Story = {
  name: "Pattern — named levels",
  render: () => (
    <ul className="mx-auto flex w-full max-w-sm flex-col gap-4">
      {levels.map((level) => (
        <li key={level.id} className="flex flex-col gap-2">
          <span className="flex items-baseline justify-between gap-3">
            <span id={level.id} className="type-label text-fg">
              {level.name}
            </span>
            <span className="type-supporting tabular-nums text-muted" aria-hidden>
              {level.text}
            </span>
          </span>
          <Meter value={level.value} max={level.max} aria-labelledby={level.id} valueText={level.text} />
        </li>
      ))}
    </ul>
  ),
  play: async ({ canvas }) => {
    const seats = canvas.getByRole("meter", { name: "Seats" });
    await expect(seats).toHaveAttribute("aria-valuemax", "12");
    await expect(seats).toHaveAttribute("aria-valuenow", "9");
    await expect(seats).toHaveAttribute("aria-valuetext", "9 of 12 seats");
    await expect(canvas.getAllByRole("meter")).toHaveLength(3);
  },
  parameters: storyCopySource(`
import { Meter } from "@thewhatmatters/wmds";

const levels = [
  { id: "level-seats", name: "Seats", value: 9, max: 12, text: "9 of 12 seats" },
  { id: "level-storage", name: "Storage", value: 31, max: 50, text: "31 of 50 GB" },
  { id: "level-builds", name: "Build minutes", value: 120, max: 400, text: "120 of 400 minutes" },
];

export function PlanUsage() {
  return (
    <ul className="flex flex-col gap-4">
      {levels.map((level) => (
        <li key={level.id} className="flex flex-col gap-2">
          <span className="flex items-baseline justify-between gap-3">
            <span id={level.id} className="type-label text-fg">
              {level.name}
            </span>
            <span className="type-supporting tabular-nums text-muted" aria-hidden>
              {level.text}
            </span>
          </span>
          <Meter value={level.value} max={level.max} aria-labelledby={level.id} valueText={level.text} />
        </li>
      ))}
    </ul>
  );
}
`),
};

export const SizesAndTones: Story = {
  name: "Reference — sizes, tones and brand knobs",
  parameters: {
    docs: {
      description: {
        story:
          "`xs` 2px, `sm` 4px, `md` 6px. `primary` is the action colour and `neutral` the text colour. The last row sets `--meter-fill` on a wrapper, the way a brand stylesheet would for a whole page.",
      },
    },
  },
  render: () => (
    <div className="mx-auto grid w-full max-w-md gap-5">
      {meterSizes.map((size) => (
        <div key={size} className="grid grid-cols-[3rem_1fr_1fr] items-center gap-4">
          <span className="type-supporting text-muted">{size}</span>
          <Meter value={64} size={size} label={`Primary, ${size}`} />
          <Meter value={64} size={size} tone="neutral" label={`Neutral, ${size}`} />
        </div>
      ))}
      <div
        className="grid grid-cols-[3rem_1fr] items-center gap-4"
        style={{ ["--meter-fill" as string]: "linear-gradient(90deg, var(--color-chart-categorical-2), var(--color-chart-categorical-4))" }}
      >
        <span className="type-supporting text-muted">knob</span>
        <Meter value={64} size="md" label="Brand fill" />
      </div>
    </div>
  ),
};
