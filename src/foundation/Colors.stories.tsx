import type { Meta, StoryObj } from "@storybook/react-vite";

const surfaceTokens = [
  { name: "body", className: "bg-body text-fg" },
  { name: "surface", className: "bg-surface text-fg" },
  { name: "card", className: "bg-card text-fg" },
  { name: "popover", className: "bg-popover text-fg" },
  { name: "muted-surface", className: "bg-muted-surface text-fg" },
] as const;

const textTokens = [
  { name: "fg (primary)", className: "bg-surface text-fg" },
  { name: "muted (secondary)", className: "bg-surface text-muted" },
  { name: "disabled", className: "bg-surface text-disabled" },
  { name: "fg-accent", className: "bg-surface text-fg-accent" },
] as const;

const actionTokens = [
  { name: "primary", className: "bg-primary text-primary-foreground" },
  { name: "secondary", className: "bg-secondary text-secondary-foreground" },
  { name: "accent", className: "bg-accent text-on-accent" },
  { name: "accent-muted", className: "bg-accent-muted text-fg" },
] as const;

const statusTokens = [
  { name: "error", className: "bg-error text-on-error" },
  { name: "error-muted", className: "bg-error-muted text-error" },
  { name: "success", className: "bg-success text-on-success" },
  { name: "success-muted", className: "bg-success-muted text-success" },
  { name: "warning", className: "bg-warning text-on-warning" },
  { name: "warning-muted", className: "bg-warning-muted text-warning" },
  { name: "info", className: "bg-info text-on-info" },
  { name: "info-muted", className: "bg-info-muted text-info" },
] as const;

const meta = {
  title: "Foundation/Colors",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Astryx-aligned semantic roles from **`src/theme/colors.css`**. Surface hierarchy: **body → surface → card → popover**. " +
          "Status roles use solid + **`*-muted`** tints — not Tailwind opacity modifiers. " +
          "Interaction states derive in **`src/theme/stateColors.css`**. Dark mode swaps values under **`[data-theme=\"dark\"]`** — same utility names. " +
          "Reference: [Astryx Color](https://astryx.atmeta.com/docs/color).",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function SwatchGrid({
  tokens,
}: {
  tokens: ReadonlyArray<{ name: string; className: string }>;
}) {
  return (
    <div className="grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3">
      {tokens.map(({ name, className }) => (
        <div
          key={name}
          className={`flex h-20 flex-col justify-end rounded-lg border border-border p-2 ${className}`}
        >
          <span className="font-mono text-xs">{name}</span>
        </div>
      ))}
    </div>
  );
}

export const SurfaceHierarchy: Story = {
  name: "Surface hierarchy",
  render: () => (
    <div className="flex max-w-md flex-col gap-3">
      <p className="text-sm text-muted">
        Page floor → raised surface → card well. Light mode: gray body, white surface/card.
      </p>
      <div className="rounded-lg border border-border bg-body p-4">
        <div className="rounded-lg border border-border bg-surface p-4 shadow-raised">
          <div className="rounded-lg border border-border-emphasized bg-card p-4">
            <span className="font-mono text-xs text-muted">card on surface on body</span>
          </div>
        </div>
      </div>
      <SwatchGrid tokens={surfaceTokens} />
    </div>
  ),
};

export const TextRoles: Story = {
  name: "Text roles",
  render: () => <SwatchGrid tokens={textTokens} />,
};

export const ActionRoles: Story = {
  name: "Action & accent",
  render: () => <SwatchGrid tokens={actionTokens} />,
};

export const StatusRoles: Story = {
  name: "Status roles",
  render: () => <SwatchGrid tokens={statusTokens} />,
};

export const StateColors: Story = {
  name: "Interaction states",
  render: () => (
    <div className="flex max-w-md flex-col gap-3">
      <p className="text-sm text-muted">
        Hover each swatch — ghost/secondary use Astryx overlay tints; primary/error use color-mix.
      </p>
      {(
        [
          ["primary", "bg-primary hover:bg-primary-hover active:bg-primary-active text-primary-foreground"],
          ["secondary", "bg-secondary hover:bg-secondary-hover active:bg-secondary-active text-secondary-foreground shadow-raised"],
          ["ghost", "bg-transparent text-ghost-foreground hover:bg-ghost-hover active:bg-ghost-active"],
          ["error", "bg-error hover:bg-error-hover active:bg-error-active text-on-error"],
        ] as const
      ).map(([name, className]) => (
        <button
          key={name}
          type="button"
          className={`rounded-lg border border-border px-4 py-3 text-left text-sm transition-colors ${className}`}
        >
          <span className="font-mono text-xs">{name}</span>
        </button>
      ))}
    </div>
  ),
};

export const Borders: Story = {
  name: "Borders",
  render: () => (
    <div className="flex max-w-md flex-col gap-3">
      <div className="rounded-lg border border-border bg-surface p-4 text-sm text-fg">
        <span className="font-mono text-xs text-muted">border-border</span> — default hairline (alpha)
      </div>
      <div className="rounded-lg border border-border-emphasized bg-surface p-4 text-sm text-fg">
        <span className="font-mono text-xs text-muted">border-border-emphasized</span> — section dividers
      </div>
    </div>
  ),
};
