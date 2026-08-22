import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  fontFamilies,
  typeScale,
  typographyStyles,
} from "./typography";

function TypographyReference() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-12 font-sans">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-fg">Typography</h1>
        <p className="text-sm leading-[var(--line-height-sm)] text-muted">
          WMDS type scale and semantic roles. Sizes map to{" "}
          <code className="rounded bg-surface px-1 py-0.5 text-xs">--font-size-*</code> tokens;
          roles combine size, weight, tracking, and color for common UI patterns.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted">Type scale</h2>
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="grid grid-cols-[4rem_4rem_4rem_1fr] gap-x-4 border-b border-border bg-surface px-4 py-2 text-xs font-medium tracking-wider text-muted uppercase">
            <span>Token</span>
            <span>Size</span>
            <span>Line</span>
            <span>Sample</span>
          </div>
          {typeScale.map((step) => (
            <div
              key={step.token}
              className="grid grid-cols-[4rem_4rem_4rem_1fr] items-baseline gap-x-4 border-b border-border px-4 py-3 last:border-b-0"
            >
              <span className="font-mono text-xs text-muted">{step.token}</span>
              <span className="text-xs text-muted">{step.size}</span>
              <span className="text-xs text-muted">{step.lineHeight}</span>
              <span
                className="text-fg"
                style={{
                  fontSize: `var(--font-size-${step.token})`,
                  lineHeight: `var(--line-height-${step.token})`,
                }}
              >
                {step.sample}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted">
          Semantic roles
        </h2>
        <div className="flex flex-col gap-6">
          {typographyStyles.map((style) => (
            <article
              key={style.role}
              className="flex flex-col gap-2 border-b border-border pb-6 last:border-b-0"
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className={style.className}>{style.label}</span>
                <span className="font-mono text-xs text-muted">{style.role}</span>
              </div>
              <p className="text-xs leading-[var(--line-height-xs)] text-muted">
                {style.description}
              </p>
              <p className="font-mono text-xs leading-[var(--line-height-xs)] text-muted/80">
                {style.className}
              </p>
              <p className="text-xs text-muted">
                <span className="font-medium text-fg">Used in:</span> {style.usedIn.join(", ")}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted">Font families</h2>
        <div className="flex flex-col gap-4">
          {fontFamilies.map((family) => (
            <div key={family.token} className="rounded-lg border border-border p-4">
              <p
                className="text-lg font-medium text-fg"
                style={{ fontFamily: family.css }}
              >
                {family.name}
              </p>
              <p className="mt-1 text-xs text-muted">{family.usage}</p>
              <p className="mt-2 font-mono text-xs text-muted">{family.css}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const meta = {
  title: "Foundation/Typography",
  component: TypographyReference,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Reference for the WMDS type scale (`--font-size-*` / `--line-height-*`) and semantic text roles. " +
          "Roles are Tailwind compositions — not separate tokens — so components stay token-bound while usage stays readable.",
      },
    },
  },
} satisfies Meta<typeof TypographyReference>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Reference: Story = {};
