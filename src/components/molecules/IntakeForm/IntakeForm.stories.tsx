import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { storyCopySource, storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
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

\`company={false}\` and \`link={false}\` leave the optional fields out — the short form: name, email, and project details. The form closes up with no gap where they were. A left-out field keeps its value in \`IntakeAboutValues\` (empty), so \`isIntakeAboutValid\` and the app's submit code don't change.

## Anatomy

\`\`\`
IntakeForm
├── Field — Name / Input
├── Field — Email / Input
├── Field — Company / Input (optional; company={false} leaves it out)
├── Field — Link / Input (optional URL; link={false} leaves it out)
└── Field — Project details / TextArea + counter
\`\`\`

## Best practices

- **Do** keep validation on **Input** / **TextArea** (\`status\` + \`message\`). **Field** does not own error state.
- **Do** leave **TextArea** as it ships. The counter is the description.
- **Do** use the short form (\`company={false}\` \`link={false}\`) where every row counts — in the chat, visitors put a company or a link in project details anyway.
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
import { IntakeForm, intakeAboutEmpty } from "@thewhatmatters/wmds";

export function AboutYou() {
  const [values, setValues] = useState(intakeAboutEmpty);

  return <IntakeForm values={values} onChange={setValues} />;
}
`),
};

export const ShortFormPattern: Story = {
  name: "Pattern — short form",
  args: {
    values: intakeAboutEmpty,
    onChange: () => undefined,
  },
  render: function ShortFormPatternRender() {
    const [values, setValues] = useState<IntakeAboutValues>(intakeAboutEmpty);

    return (
      <div className="w-full max-w-xl">
        <IntakeForm values={values} onChange={setValues} company={false} link={false} />
      </div>
    );
  },
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Name, email, and project details only. `company={false}` and `link={false}` leave the optional fields out; their values stay empty in `IntakeAboutValues`.",
        },
      },
    },
    `
import { useState } from "react";
import { IntakeForm, intakeAboutEmpty } from "@thewhatmatters/wmds";

export function AboutYouShort() {
  const [values, setValues] = useState(intakeAboutEmpty);

  return <IntakeForm values={values} onChange={setValues} company={false} link={false} />;
}
`,
  ),
};

