import type { Meta, StoryObj } from "@storybook/react-vite";

const shadows: Array<{ name: string; className: string }> = [
  { name: "shadow-soft-sm", className: "shadow-soft-sm" },
  { name: "shadow-soft-card", className: "shadow-soft-card" },
  { name: "shadow-sm", className: "shadow-sm" },
  { name: "shadow-md", className: "shadow-md" },
  { name: "shadow-lg", className: "shadow-lg" },
  { name: "shadow-hairline", className: "shadow-hairline" },
  { name: "shadow-raised", className: "shadow-raised" },
  { name: "shadow-inset-highlight", className: "shadow-inset-highlight" },
];

const meta = {
  title: "Foundations/Shadows",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Semantic shadow names in **`src/theme/theme.css`** (ADR-0029). **`shadow-soft-sm`** is the floating pill and menu stack: diffuse drop plus a 4% inset ring. **`shadow-soft-card`** is the card elevation (no stroke). **`shadow-md`** aliases **`shadow-soft-card`**. **`shadow-sm`** is the tight veil. **`shadow-lg`** is the wider toast lift. **`shadow-hairline`** is a 1px edge. **`shadow-raised`** is that edge plus the tight veil. Values swap with **`[data-theme=\"dark\"]`**.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Semantic: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6">
      {shadows.map(({ name, className }) => (
        <div key={name} className="flex flex-col items-center gap-2">
          <div className={`size-24 rounded-lg bg-surface ${className}`} />
          <span className="font-mono text-xs text-muted">{name}</span>
        </div>
      ))}
    </div>
  ),
};
