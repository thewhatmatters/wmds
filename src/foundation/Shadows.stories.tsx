import type { Meta, StoryObj } from "@storybook/react-vite";
import { shadowElevations, shadowPrimitives } from "./shadows";

function ShadowsReference() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-12 font-sans">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-fg">Shadows</h1>
        <p className="text-sm leading-[var(--line-height-sm)] text-muted">
          Elevation tokens for depth and control surfaces. In code, use Tailwind{" "}
          <code className="rounded bg-surface px-1 py-0.5 text-xs">shadow-*</code> utilities.
          Hairlines reference{" "}
          <code className="rounded bg-surface px-1 py-0.5 text-xs">--color-border</code>.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted">Elevations</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {shadowElevations.map((shadow) => (
            <div key={shadow.token} className="flex flex-col gap-2">
              <div
                className="h-20 rounded-md bg-surface"
                style={{ boxShadow: `var(${shadow.token})` }}
              />
              <p className="font-mono text-xs text-fg">{shadow.token}</p>
              <p className="text-xs text-muted">{shadow.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted">In context</h2>
        <div className="flex flex-wrap items-start gap-6">
          <div className="w-64 rounded-lg bg-surface p-4 shadow-md">
            <p className="text-sm font-semibold text-fg">Card · shadow-md</p>
            <p className="mt-1 text-sm text-muted">Default card elevation</p>
          </div>
          <button
            type="button"
            className="rounded-md bg-secondary px-4 py-2.5 text-sm font-medium text-secondary-foreground shadow-raised"
          >
            Secondary · shadow-raised
          </button>
          <button
            type="button"
            className="rounded-md bg-success px-4 py-2.5 text-sm font-medium text-success-foreground shadow-inset-highlight"
          >
            Success · inset highlight
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted">Token table</h2>
        <div className="overflow-hidden rounded-lg border border-border">
          {[...shadowElevations, ...shadowPrimitives].map((shadow) => (
            <div
              key={shadow.token}
              className="border-b border-border px-4 py-3 last:border-b-0"
            >
              <p className="font-mono text-xs text-fg">{shadow.token}</p>
              <p className="mt-1 text-xs text-muted">{shadow.role}</p>
              <p className="mt-1 font-mono text-xs leading-relaxed text-muted/90">
                {shadow.value}
              </p>
              {shadow.tailwind ? (
                <p className="mt-1 text-xs text-muted">
                  Tailwind: <span className="font-mono">{shadow.tailwind}</span>
                </p>
              ) : null}
              <p className="mt-1 text-xs text-muted">
                Used in: {shadow.usedIn.join(", ")}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const meta = {
  title: "Foundation/Shadows",
  component: ShadowsReference,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Shadow / elevation tokens. Semantic tokens (`--shadow-md`, etc.) map to Tailwind utilities. " +
          "Primitives (`--shadow-drop-*`) are the canonical drop-layer values — Paper copies drop literals and uses `var(--color-border)` for hairlines.",
      },
    },
  },
} satisfies Meta<typeof ShadowsReference>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Reference: Story = {};
