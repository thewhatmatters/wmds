import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  astryxTypeScale,
  fontFamilies,
  fontWeights,
  geometricScale,
  resolveTypographyTokenValues,
  trackingRules,
  typographyClass,
  typographyStyles,
} from "../lib/typography";

const meta = {
  title: "Foundation/Typography",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Astryx-aligned typography in **`src/theme/typography.css`**: geometric **`--font-size-*`** ramp (14px × 1.2) + semantic **`type-*`** utilities. " +
          "Components use **`typographyClass(role)`** from **`src/lib/typography.ts`** — not raw **`text-sm`** / **`font-medium`**. " +
          "Reference: [Astryx Typography](https://astryx.atmeta.com/docs/typography). See **ADR-0009**.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const GeometricScale: Story = {
  name: "Geometric scale",
  render: () => {
    const steps = resolveTypographyTokenValues();
    return (
      <div className="flex max-w-2xl flex-col gap-3 font-sans">
        <p className="type-supporting text-muted">
          Raw size ramp — adjust <code className="font-mono text-xs">--type-scale-base</code> and{" "}
          <code className="font-mono text-xs">--type-scale-ratio</code> holistically (Astryx pattern).
        </p>
        {steps.map(({ token, value, sample }) => (
          <div key={token} className="flex items-baseline justify-between gap-4 border-b border-border pb-2">
            <span className="font-mono text-xs text-muted">{token}</span>
            <span className="font-mono text-xs text-fg">{value}</span>
            <span className="type-supporting text-muted">{sample}</span>
          </div>
        ))}
      </div>
    );
  },
};

export const Weights: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {fontWeights.map(({ token, value, role }) => (
        <p key={token} className="type-body text-fg" style={{ fontWeight: value }}>
          {token} ({value}) — {role}
        </p>
      ))}
    </div>
  ),
};

export const AstryxTypeScale: Story = {
  name: "Astryx type scale",
  render: () => (
    <div className="flex max-w-2xl flex-col gap-6 font-sans">
      <p className="type-supporting text-muted">
        Semantic triplets — size + weight + line-height composed in <code className="font-mono text-xs">type-*</code> utilities.
      </p>
      {astryxTypeScale.map(({ type, utility, size, weight, leading }) => (
        <div key={type} className="flex flex-col gap-1 border-b border-border-emphasized pb-4">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-mono text-xs text-muted">{type}</span>
            <span className="font-mono text-xs text-muted">{utility}</span>
            <span className="font-mono text-xs text-muted">
              {size} · {weight} · {leading}
            </span>
          </div>
          <p className={`${utility} text-fg`}>The quick brown fox jumps over the lazy dog</p>
        </div>
      ))}
    </div>
  ),
};

export const Roles: Story = {
  name: "WMDS roles",
  render: () => (
    <div className="flex max-w-2xl flex-col gap-8 font-sans">
      <p className="type-supporting text-muted">
        WMDS roles map to Astryx types — import via{" "}
        <code className="font-mono text-xs text-fg">typographyClass(&quot;body&quot;)</code>.
      </p>
      {typographyStyles.map(({ role, label, description, astryxType, className, trackingClass, sample }) => (
        <div key={role} className="flex flex-col gap-1.5 border-b border-border pb-6 last:border-0">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-mono text-xs text-muted">{role}</span>
            <span className="type-label text-fg">{label}</span>
            <span className="font-mono text-xs text-muted">→ {astryxType}</span>
            <span className="font-mono text-xs text-muted">{trackingClass}</span>
          </div>
          <p className="type-supporting text-muted">{description}</p>
          <p className={className}>{sample}</p>
          <p className="font-mono text-[11px] text-muted">
            typographyClass(&quot;{role}&quot;)
          </p>
        </div>
      ))}
    </div>
  ),
};

export const LetterSpacing: Story = {
  name: "Letter spacing",
  render: () => (
    <div className="flex max-w-2xl flex-col gap-6 font-sans">
      <p className="type-supporting text-muted">
        Three tracking values — assigned only through typography roles (WMDS extension on Astryx).
      </p>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-muted">
            <th className="py-2 pr-4 font-medium">Rule</th>
            <th className="py-2 pr-4 font-medium">Utility</th>
            <th className="py-2 font-medium">When</th>
          </tr>
        </thead>
        <tbody>
          {trackingRules.map(({ tracking, utility, rule }) => (
            <tr key={tracking} className="border-b border-border-emphasized align-top">
              <td className="py-2 pr-4 font-mono text-xs">{tracking}</td>
              <td className="py-2 pr-4 font-mono text-xs text-muted">{utility}</td>
              <td className="py-2 type-body text-fg">{rule}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex flex-col gap-4">
        <p className={typographyClass("page-heading")}>Page heading — tracking-tight</p>
        <p className={typographyClass("body")}>Body — tracking-normal</p>
        <p className={typographyClass("overline")}>Overline — tracking-wider</p>
        <p className="type-code text-muted">type-code — Geist Mono (0123456789)</p>
      </div>
    </div>
  ),
};

export const FontFamilies: Story = {
  name: "Font families",
  render: () => (
    <div className="flex max-w-xl flex-col gap-4">
      {fontFamilies.map(({ name, tailwind, css, usage }) => (
        <div key={name} className="flex flex-col gap-1 border-b border-border pb-4 last:border-0">
          <span className="type-label text-fg">{name}</span>
          <span className="font-mono text-xs text-muted">
            {tailwind} · {css}
          </span>
          <span className="type-supporting text-muted">{usage}</span>
        </div>
      ))}
    </div>
  ),
};

/** @deprecated Use GeometricScale — kept as alias for bookmarks. */
export const Scale = GeometricScale;
