import type { Meta, StoryObj } from "@storybook/react-vite";

const shadows: Array<{ name: string; className: string }> = [
  { name: "shadow-sm", className: "shadow-sm" },
  { name: "shadow-raised", className: "shadow-raised" },
  { name: "shadow-inset-highlight", className: "shadow-inset-highlight" },
];

const meta = {
  title: "Foundation/Shadows",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Semantic shadow names in **`src/theme/theme.css`**. **`shadow-raised`** = 1px **`border-border`** hairline + drop — use for chips and icon buttons.",
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
