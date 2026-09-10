import type { Meta, StoryObj } from "@storybook/react-vite";
import { Chip } from "../components/molecules/Chip/Chip";
import {
  storyCopySource,
  storyMetaDocsDefaults,
} from "../lib/storyCopySource";
import { typographyClass } from "../lib/typography";

const listItems = [
  "Align quarterly priorities",
  "Review audience fit",
  "Confirm launch narrative",
  "Prepare sales enablement",
  "Publish customer proof",
  "Schedule partner briefing",
  "Finalize release notes",
  "Measure first-week adoption",
];

const categories = [
  "Strategy",
  "Research",
  "Design",
  "Engineering",
  "Marketing",
  "Operations",
  "Finance",
];

const meta = {
  title: "Foundation/Scroll fade",
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  parameters: {
    docs: {
      description: {
        component: `
Scroll fade is the canonical overflow hint for lists and horizontal rails. It masks the content itself, so it adapts to every WMDS surface without a color token or overlay.

- Apply \`scroll-fade\` or \`scroll-fade-y\` to the element with \`overflow-y-auto\`.
- Apply \`scroll-fade-x\` to the element with \`overflow-x-auto\`; logical start/end follow RTL.
- Use \`scroll-fade-t\`, \`-b\`, \`-s\`, or \`-e\` when only one edge should fade.
- The default depth is 12% capped at 40px. Override it with \`scroll-fade-8\` or \`[--scroll-fade-size:32px]\`.
- Keep a card's fill, border, and radius on an outer wrapper so those surfaces remain crisp.
        `.trim(),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const OverflowingList: Story = {
  name: "Pattern — overflowing list",
  parameters: storyCopySource(`
const items = [
  "Align quarterly priorities",
  "Review audience fit",
  "Confirm launch narrative",
  "Prepare sales enablement",
  "Publish customer proof",
  "Schedule partner briefing",
];

<div className="overflow-hidden rounded-lg border border-border bg-card">
  <ul
    aria-label="Launch checklist"
    className="scroll-fade-y h-56 overflow-y-auto"
  >
    {items.map((item) => (
      <li className="border-b border-border px-4 py-3 last:border-b-0" key={item}>
        {item}
      </li>
    ))}
  </ul>
</div>
  `),
  render: () => (
    <div className="w-full max-w-sm overflow-hidden rounded-lg border border-border bg-card">
      <ul
        aria-label="Launch checklist"
        className="scroll-fade-y h-56 overflow-y-auto"
      >
        {listItems.map((item) => (
          <li
            className={`${typographyClass("body")} border-b border-border px-4 py-3 text-fg last:border-b-0`}
            key={item}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  ),
};

export const HorizontalRail: Story = {
  name: "Pattern — horizontal rail",
  parameters: storyCopySource(`
import { Chip } from "@whatmatters/wmds";

const categories = [
  "Strategy",
  "Research",
  "Design",
  "Engineering",
  "Marketing",
];

<div
  aria-label="Categories"
  className="scroll-fade-x flex gap-2 overflow-x-auto py-1"
>
  {categories.map((category) => (
    <Chip key={category} readOnly size="sm">
      {category}
    </Chip>
  ))}
</div>
  `),
  render: () => (
    <div className="w-72 overflow-hidden rounded-lg border border-border bg-card px-3 py-4">
      <div
        aria-label="Categories"
        className="scroll-fade-x flex gap-2 overflow-x-auto py-1"
      >
        {categories.map((category) => (
          <Chip key={category} readOnly size="sm">
            {category}
          </Chip>
        ))}
      </div>
    </div>
  ),
};

export const EdgeAndSizeControls: Story = {
  name: "Reference — edge and size controls",
  render: () => (
    <div className="grid w-full max-w-2xl gap-6 sm:grid-cols-2">
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <p className={`${typographyClass("label")} border-b border-border px-4 py-3 text-fg`}>
          End edge only
        </p>
        <ul className="scroll-fade-b h-40 overflow-y-auto [--scroll-fade-size:24px]">
          {listItems.map((item) => (
            <li
              className={`${typographyClass("supporting")} border-b border-border px-4 py-3 text-muted last:border-b-0`}
              key={item}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <p className={`${typographyClass("label")} border-b border-border px-4 py-3 text-fg`}>
          No overflow
        </p>
        <ul className="scroll-fade-y h-40 overflow-y-auto">
          {listItems.slice(0, 2).map((item) => (
            <li
              className={`${typographyClass("supporting")} border-b border-border px-4 py-3 text-muted last:border-b-0`}
              key={item}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  ),
};
