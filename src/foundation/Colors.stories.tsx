import type { Meta, StoryObj } from "@storybook/react-vite";
import { cn } from "../lib/cn";
import { typographyClass } from "../lib/typography";
import { FoundationSpecimen } from "./FoundationSpecimen";

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
    layout: "padded",
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
  sample = "fill",
}: {
  tokens: ReadonlyArray<{ name: string; className: string }>;
  sample?: "fill" | "text";
}) {
  return (
    <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3">
      {tokens.map(({ name, className }) => (
        <div key={name} className="flex min-w-0 flex-col gap-2">
          <div
            className={cn(
              "flex h-14 w-full items-center rounded-lg border border-border px-3",
              className,
            )}
          >
            {sample === "text" ? <span className="font-mono text-xs">Aa</span> : null}
          </div>
          <span className="truncate font-mono text-xs text-muted">{name}</span>
        </div>
      ))}
    </div>
  );
}

export const SurfaceHierarchy: Story = {
  name: "Surface hierarchy",
  render: () => (
    <FoundationSpecimen className="flex flex-col gap-6">
      <p className={cn(typographyClass("caption"), "text-muted")}>
        Page floor → raised surface → card well. Light mode: gray body, white surface/card.
      </p>
      <div className="rounded-2xl border border-border bg-body p-5">
        <div className="rounded-xl border border-border bg-surface p-5 shadow-raised">
          <div className="rounded-lg border border-border-emphasized bg-card px-4 py-5">
            <span className="font-mono text-xs text-muted">card on surface on body</span>
          </div>
        </div>
      </div>
      <SwatchGrid tokens={surfaceTokens} />
    </FoundationSpecimen>
  ),
};

export const TextRoles: Story = {
  name: "Text roles",
  render: () => (
    <FoundationSpecimen>
      <SwatchGrid tokens={textTokens} sample="text" />
    </FoundationSpecimen>
  ),
};

export const ActionRoles: Story = {
  name: "Action & accent",
  render: () => (
    <FoundationSpecimen>
      <SwatchGrid tokens={actionTokens} />
    </FoundationSpecimen>
  ),
};

export const StatusRoles: Story = {
  name: "Status roles",
  render: () => (
    <FoundationSpecimen>
      <SwatchGrid tokens={statusTokens} />
    </FoundationSpecimen>
  ),
};

export const StateColors: Story = {
  name: "Interaction states",
  render: () => (
    <FoundationSpecimen className="flex flex-col gap-4">
      <p className={cn(typographyClass("caption"), "text-muted")}>
        Hover each swatch — ghost/secondary use Astryx overlay tints; primary/error use color-mix.
      </p>
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
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
            className={cn(
              "min-h-11 rounded-lg border border-border px-4 py-3 text-left transition-colors",
              className,
            )}
          >
            <span className="font-mono text-xs">{name}</span>
          </button>
        ))}
      </div>
    </FoundationSpecimen>
  ),
};

export const Borders: Story = {
  name: "Borders",
  render: () => (
    <FoundationSpecimen className="flex flex-col gap-3">
      <div className="rounded-lg border border-border bg-surface px-4 py-3">
        <p className={cn(typographyClass("caption"), "text-fg")}>
          <span className="font-mono text-xs text-muted">border-border</span> — default hairline
          (alpha)
        </p>
      </div>
      <div className="rounded-lg border border-border-emphasized bg-surface px-4 py-3">
        <p className={cn(typographyClass("caption"), "text-fg")}>
          <span className="font-mono text-xs text-muted">border-border-emphasized</span> — section
          dividers
        </p>
      </div>
    </FoundationSpecimen>
  ),
};
