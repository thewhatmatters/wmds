import type { Meta, StoryObj } from "@storybook/react-vite";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import { Steps, stepsLayouts, stepsTitleTags } from "./Steps";

const meta = {
  title: "Components/Steps",
  component: Steps,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  argTypes: {
    layout: { control: "inline-radio", options: [...stepsLayouts] },
    titleAs: { control: "inline-radio", options: [...stepsTitleTags] },
    start: { control: { type: "number", min: 1 } },
    children: { control: false },
  },
  args: {
    layout: "rows",
    start: 1,
    titleAs: "h3",
    "aria-label": "How it works",
    children: [
      <Steps.Item key="call" title="Call or text">
        Tell us what's wrong. We answer the same day.
      </Steps.Item>,
      <Steps.Item key="visit" title="We come and look">
        A free visit, and a written price before any work starts.
      </Steps.Item>,
      <Steps.Item key="work" title="We do the work">
        On the day we said, by the people you met.
      </Steps.Item>,
      <Steps.Item key="check" title="You check it">
        Nothing is owed until you're happy with it.
      </Steps.Item>,
    ],
  },
  decorators: [
    (Story, context) => (
      <div className={context.parameters.stepsWide ? "w-full max-w-5xl" : "w-full max-w-xl"}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        component: `
## Usage

What happens, in order: "How it works", "What to expect". A short numbered list, each step a title and one line, with a rule above each step. The numbers are counted for you, so a step can be added or moved without renumbering.

| Pattern | Props |
|---------|--------|
| **A list down the page** | \`layout="rows"\` (default) — the number sits in a column beside the words, at every width |
| **Side by side on a wide page** | \`layout="columns"\` — one column per step from \`md\`; one column on a phone |
| **Under an \`h3\`, or with no heading above** | \`titleAs\` — \`h2\`, \`h3\` (default), \`h4\` or \`p\` |
| **A list carried on from an earlier one** | \`start\` |

## Anatomy

\`\`\`
Steps — an ordered list
└── Steps.Item
    ├── number — "01", counted by Steps
    ├── title
    └── text — one line
\`\`\`

## Best practices

- **Do** keep it to three to five steps. More than five is a page, not a list.
- **Do** start each title with what happens: "Call or text", "We come and look".
- **Do** name the list with \`aria-label\` when no heading sits above it.
- **Don't** write the number into the title. It is drawn for you.
- **Don't** use it to show where someone is in a form or a checkout — **StepProgress**. For a list of features with no order — **Card**s or **DescriptionList**.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof Steps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HowItWorks: Story = {
  name: "Pattern — how it works",
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "A service business's \"How it works\": four steps down the page, the number in mono beside each, a rule above each.",
        },
      },
    },
    `
import { Steps } from "@thewhatmatters/wmds";

export interface HowItWorksStep {
  /** What happens, in a few words. */
  title: string;
  /** One line more. */
  text?: string;
}

export interface HowItWorksProps {
  /** Three to five steps, in order. */
  steps: readonly HowItWorksStep[];
  /** Names the list for screen readers when no heading sits above it. */
  label?: string;
}

export function HowItWorks({ steps, label = "How it works" }: HowItWorksProps) {
  return (
    <Steps aria-label={label}>
      {steps.map((step) => (
        <Steps.Item key={step.title} title={step.title}>
          {step.text}
        </Steps.Item>
      ))}
    </Steps>
  );
}
`,
  ),
};

export const Columns: Story = {
  name: "Reference — side by side",
  args: {
    layout: "columns",
    children: [
      <Steps.Item key="call" title="Call or text">
        Tell us what's wrong. We answer the same day.
      </Steps.Item>,
      <Steps.Item key="visit" title="We come and look">
        A free visit, and a written price before any work starts.
      </Steps.Item>,
      <Steps.Item key="work" title="We do the work">
        On the day we said, by the people you met.
      </Steps.Item>,
    ],
  },
  parameters: {
    stepsWide: true,
    docs: {
      description: {
        story:
          "`layout=\"columns\"` sets the steps side by side from `md`, the number above the words. On a phone it is the same single column as rows.",
      },
    },
  },
};

export const TitlesOnly: Story = {
  name: "Reference — titles only, counted from 3",
  args: {
    start: 3,
    titleAs: "p",
    children: [
      <Steps.Item key="a" title="We do the work" />,
      <Steps.Item key="b" title="You check it" />,
      <Steps.Item key="c" title="We tidy up and go" />,
    ],
  },
  parameters: {
    docs: {
      description: {
        story: "A step needs only its title. `start` carries the count on from an earlier list; `titleAs=\"p\"` keeps the titles out of the page's headings.",
      },
    },
  },
};
