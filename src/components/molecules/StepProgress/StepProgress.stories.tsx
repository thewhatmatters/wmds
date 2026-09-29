import type { Meta, StoryObj } from "@storybook/react-vite";
import { storyCopySource, storyMetaDocsDefaults } from "../../../lib/storyCopySource";
import { StepProgress } from "./StepProgress";

const meta = {
  title: "Components/Feedback/StepProgress",
  component: StepProgress,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        component: `
## Usage

Segmented progress for a fixed intake. The pill reads **Step N of 4**. Filled segments use brand navy (\`--color-brand\`, #011272).

## Anatomy

\`\`\`
StepProgress
├── Badge — Step N of 4 (neutral, muted)
└── track — N rounded segments
\`\`\`

## Best practices

- **Do** pass a 1-based \`step\` and the total \`steps\`.
- **Do** keep the label as the default pill. Override \`label\` only when the spoken text must differ.
- **Don't** draw a custom bar with utilities. This is the progress pattern.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof StepProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StepProgressPattern: Story = {
  name: "Pattern — step progress",
  args: {
    step: 2,
    steps: 4,
  },
  render: () => (
    <div className="w-full max-w-xl">
      <StepProgress step={2} steps={4} />
    </div>
  ),
  parameters: storyCopySource(`
import { StepProgress } from "@whatmatters/wmds";

export function IntakeStep() {
  return <StepProgress step={2} steps={4} />;
}
`),
};
