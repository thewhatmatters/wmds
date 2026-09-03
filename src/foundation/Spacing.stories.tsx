import type { Meta, StoryObj } from "@storybook/react-vite";
import { FoundationSpecimen } from "./FoundationSpecimen";

const widths: Array<{ step: string; className: string }> = [
  { step: "1", className: "w-1" },
  { step: "1.5", className: "w-1.5" },
  { step: "2", className: "w-2" },
  { step: "2.5", className: "w-2.5" },
  { step: "3", className: "w-3" },
  { step: "4", className: "w-4" },
  { step: "6", className: "w-6" },
  { step: "8", className: "w-8" },
];

const radii: Array<{ step: string; className: string }> = [
  { step: "sm", className: "rounded-sm" },
  { step: "md", className: "rounded-md" },
  { step: "lg", className: "rounded-lg" },
  { step: "xl", className: "rounded-xl" },
  { step: "full", className: "rounded-full" },
];

const meta = {
  title: "Foundation/Spacing",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Tailwind spacing scale (`--spacing: 0.25rem` / 4px base — **do not re-scale**). Even multiples = 8px grid baseline (`--grid-baseline`). Use **`p-*`**, **`gap-*`**, **`m-*`** in components; page spine is **Foundation → Grid**.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scale: Story = {
  render: () => (
    <FoundationSpecimen className="flex flex-col gap-3">
      {widths.map(({ step, className }) => (
        <div key={step} className="flex items-center gap-3">
          <span className="w-8 shrink-0 font-mono text-xs text-muted">{step}</span>
          <div className={`h-4 rounded-sm bg-primary ${className}`} />
        </div>
      ))}
    </FoundationSpecimen>
  ),
};

export const Gap: Story = {
  render: () => (
    <FoundationSpecimen className="flex gap-4">
      {[1, 2, 3, 4].map((n) => (
        <div key={n} className="size-10 rounded-md bg-surface shadow-raised" />
      ))}
    </FoundationSpecimen>
  ),
};

export const Radius: Story = {
  render: () => (
    <FoundationSpecimen className="flex flex-wrap gap-4">
      {radii.map(({ step, className }) => (
        <div
          key={step}
          className={`flex size-16 items-center justify-center border border-border bg-surface text-xs text-muted ${className}`}
        >
          {step}
        </div>
      ))}
    </FoundationSpecimen>
  ),
};
