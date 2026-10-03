import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { storyCopySource, storyMetaDocsDefaults } from "../../../lib/storyCopySource";
import { IntakeForm, intakeAboutEmpty, type IntakeAboutValues } from "./IntakeForm";

const meta = {
  title: "Components/IntakeForm",
  component: IntakeForm,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        component: `
## Usage

About-you step. **Field** wraps **Input** and **TextArea**. Project details shows a character counter in the field description (\`12 / 400\`). The counter is not a **TextArea** prop.

\`isIntakeAboutValid\` is true when name, email, and details are present, details stay within the counter, and an optional link is empty or a valid http(s) URL. Company and link are optional.

Required fields show **Input** / **TextArea** \`status\` + \`message\` on blur when invalid. Company never requires a value.

## Anatomy

\`\`\`
IntakeForm
├── Field — Name / Input
├── Field — Email / Input
├── Field — Company / Input (optional)
├── Field — Link / Input (optional URL)
└── Field — Project details / TextArea + counter
\`\`\`

## Best practices

- **Do** keep validation on **Input** / **TextArea** (\`status\` + \`message\`). **Field** does not own error state.
- **Do** leave **TextArea** as it ships. The counter is the description.
- **Don't** require company or invent a required-asterisk pattern.
- **Don't** add a counter variant to **TextArea**.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof IntakeForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AboutYouPattern: Story = {
  name: "Pattern — about you",
  args: {
    values: intakeAboutEmpty,
    onChange: () => undefined,
  },
  render: function AboutYouPatternRender() {
    const [values, setValues] = useState<IntakeAboutValues>({
      name: "Jordan Lee",
      email: "jordan@northwind.com",
      company: "Northwind",
      url: "https://northwind.example",
      details: "We need a calmer site and a brand that can stretch past the launch.",
    });

    return (
      <div className="w-full max-w-xl">
        <IntakeForm values={values} onChange={setValues} />
      </div>
    );
  },
  parameters: storyCopySource(`
import { useState } from "react";
import { IntakeForm, intakeAboutEmpty } from "@whatmatters/wmds";

export function AboutYou() {
  const [values, setValues] = useState(intakeAboutEmpty);

  return <IntakeForm values={values} onChange={setValues} />;
}
`),
};
