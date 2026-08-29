import type { Meta, StoryObj } from "@storybook/react-vite";

const colorTokens = [
  { name: "bg", className: "bg-bg text-fg" },
  { name: "surface", className: "bg-surface text-fg" },
  { name: "primary", className: "bg-primary text-primary-foreground" },
  { name: "secondary", className: "bg-secondary text-secondary-foreground" },
  { name: "destructive", className: "bg-destructive text-destructive-foreground" },
  { name: "success", className: "bg-success text-success-foreground" },
  { name: "warning", className: "bg-warning text-warning-foreground" },
  { name: "info", className: "bg-info text-info-foreground" },
  { name: "muted", className: "bg-muted text-bg" },
  { name: "border", className: "bg-border text-fg" },
] as const;

const meta = {
  title: "Foundation/Colors",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Semantic color roles from **`src/theme/colors.css`**. Interaction states (hover/active) derive in **`src/theme/stateColors.css`** via **`color-mix`**. Dark mode swaps values under **`[data-theme=\"dark\"]`** — same utility names. " +
          "Ad-hoc tints: **`color-mix(in oklch, var(--color-primary) 12%, var(--color-bg))`**.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Roles: Story = {
  render: () => (
    <div className="grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3">
      {colorTokens.map(({ name, className }) => (
        <div
          key={name}
          className={`flex h-20 flex-col justify-end rounded-lg border border-border p-2 ${className}`}
        >
          <span className="font-mono text-xs">{name}</span>
        </div>
      ))}
    </div>
  ),
};

export const StateColors: Story = {
  name: "Interaction states",
  render: () => (
    <div className="flex max-w-md flex-col gap-3">
      <p className="text-sm text-muted">
        Hover each swatch — states come from <code className="font-mono text-xs">stateColors.css</code>.
      </p>
      {(
        [
          ["primary", "bg-primary hover:bg-primary-hover active:bg-primary-active"],
          ["secondary", "bg-secondary hover:bg-secondary-hover active:bg-secondary-active"],
          ["ghost", "bg-transparent text-ghost-foreground hover:bg-ghost-hover active:bg-ghost-active"],
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

export const ColorMix: Story = {
  name: "color-mix tint",
  render: () => (
    <div
      className="flex h-24 max-w-md items-center justify-center rounded-lg border border-border font-mono text-sm text-fg"
      style={{
        background: "color-mix(in oklch, var(--color-primary) 12%, var(--color-bg))",
      }}
    >
      primary @ 12% on bg
    </div>
  ),
};
