import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Card,
  cardLayoutBodyOccupantInsetXClasses,
  cardLayoutBodyOccupantPadYClasses,
  cardLayoutBodyOccupantWellClasses,
  cardTitleClasses,
} from "../components/molecules/Card/Card";
import { Button } from "../components/atoms/Button/Button";
import { Badge } from "../components/atoms/Badge/Badge";
import { IconButton } from "../components/atoms/IconButton/IconButton";
import { Input } from "../components/atoms/Input/Input";
import { Select } from "../components/molecules/Select/Select";
import { Plus } from "lucide-react";
import { storyMetaDocsDefaults } from "../lib/storyCopySource";
import { typographyClass } from "../lib/typography";

const meta = {
  title: "Foundations/Shape",
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  parameters: {
    docs: {
      description: {
        component: `
WMDS shape tokens keep repeated component geometry consistent.

**Design knobs** (an app may set these; see CONSUMING.md → Design knobs):

- \`--radius-control\` (default pill): buttons, icon buttons, inputs, search, select, chips, pills, badges, segmented controls, tabs, the compact SiteNav bar.
- \`--radius-surface\` (default **16px**): cards, menus, toasts, and other raised surfaces.

Set them on \`:root\` in the app's theme stylesheet, or on a page or section wrapper with Tailwind: \`<main className="[--radius-control:4px]">\`. Every component inside follows. Avatars, status dots, spinners, radios, switches and progress bars stay round.

**Derived** (don't set directly): \`--radius-control-inner\` (2px inside a control), \`--radius-control-box\` (multi-line controls: 12px, or the control radius if smaller), \`--radius-surface-md\` / \`--radius-surface-sm\` (¾ and ½ of the surface: 12px and 8px), \`--radius-card-shell\` (= surface) and \`--radius-card-body\` (2px inside, after Card's 2px gutter).

Component recipes consume these variables; experiences should not repeat raw radius values.
        `.trim(),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const CardConcentricRadii: Story = {
  name: "Reference — Card concentric radii",
  render: () => (
    <Card shape="rounded" bodyTerminal className="max-w-lg">
      <Card.Header
        start={<h2 className={cardTitleClasses}>Card shell · 16px</h2>}
      />
      <Card.Body>
        <div
          className={`flex min-h-48 items-center justify-center ${cardLayoutBodyOccupantPadYClasses} ${cardLayoutBodyOccupantWellClasses} ${cardLayoutBodyOccupantInsetXClasses}`}
        >
          <p className={`${typographyClass("body")} text-muted`}>
            Body occupant · 14px
          </p>
        </div>
      </Card.Body>
    </Card>
  ),
};

/** The same controls and card under the default knobs and under rectangular ones. */
export function ShapeKnobsSpecimen() {
  const controls = (label: string) => (
    <Card shape="rounded" padding="md" className="flex min-w-0 flex-col gap-4">
      <p className={`${typographyClass("ui-label")} text-muted`}>{label}</p>
      <div className="flex flex-wrap items-center gap-2">
        <Button role="primary">Get a quote</Button>
        <Button role="secondary">See the menu</Button>
        <IconButton aria-label="Add" icon={<Plus />} role="secondary" />
        <Badge>New</Badge>
      </div>
      <Input label="Email" placeholder="you@example.com" />
      <Select
        label="Party size"
        options={[
          { value: "2", label: "2 guests" },
          { value: "4", label: "4 guests" },
        ]}
        defaultValue="2"
      />
    </Card>
  );
  return (
    <div className="grid w-full max-w-4xl gap-6 md:grid-cols-2">
      <div data-testid="knobs-default">{controls("Default knobs")}</div>
      <div data-testid="knobs-rect" className="[--radius-control:4px] [--radius-surface:6px]">
        {controls("[--radius-control:4px] [--radius-surface:6px]")}
      </div>
    </div>
  );
}

export const DesignKnobs: Story = {
  name: "Design knobs — rectangular controls",
  render: () => <ShapeKnobsSpecimen />,
};
