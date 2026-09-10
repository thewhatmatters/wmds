import type { Meta, StoryObj } from "@storybook/react-vite";
import { storyCopySource, storyMetaDocsDefaults } from "../../../lib/storyCopySource";
import { typographyClass } from "../../../lib/typography";
import { TextLink } from "./TextLink";

const meta = {
  title: "Components/Navigation/TextLink",
  component: TextLink,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  parameters: {
    docs: {
      description: {
        component: `
## Usage

Use **TextLink** for inline navigation inside prose. Its dotted underline keeps links visible without overpowering the surrounding copy; hover strengthens the underline and keyboard focus adds the WMDS focus ring.

Set \`external\` when the destination opens in a new tab. WMDS appends Lucide **SquareArrowOutUpRight**, adds spoken new-tab context, and supplies a safe \`rel\`.

## Anatomy

\`\`\`
TextLink (\`a\`)
└── link label
\`\`\`

## Best practices

- **Do** write destination-oriented labels that make sense in context.
- **Do** use **TextLink** inside body copy and supporting text.
- **Do** use \`external\` only when a new tab is genuinely useful.
- **Don't** use it for actions—use **Button**.
- **Don't** override its color or underline treatment with \`className\`.
        `.trim(),
      },
    },
  },
  args: {
    href: "#writing",
    children: "writing",
    external: false,
  },
} satisfies Meta<typeof TextLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InlineProse: Story = {
  name: "Pattern — inline prose link",
  render: (args) => (
    <p className={typographyClass("body")}>
      Read my <TextLink {...args} />, or browse the projects I’ve built.
    </p>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "The dotted underline remains identifiable at rest and strengthens on hover without changing the paragraph’s line height.",
      },
    },
    ...storyCopySource(`
import { TextLink } from "@whatmatters/wmds";

<p className="type-body text-fg">
  Read my <TextLink href="/writing">writing</TextLink>, or browse the projects I’ve built.
</p>
`),
  },
};

export const SupportingCopy: Story = {
  name: "Pattern — supporting copy link",
  render: () => (
    <p className={typographyClass("caption")}>
      By continuing, you agree to the{" "}
      <TextLink href="#terms">terms of service</TextLink>.
    </p>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "TextLink inherits the surrounding type size while retaining its canonical weight and underline.",
      },
    },
    ...storyCopySource(`
import { TextLink } from "@whatmatters/wmds";

<p className="type-supporting text-muted">
  By continuing, you agree to the <TextLink href="/terms">terms of service</TextLink>.
</p>
`),
  },
};

export const ExternalDestination: Story = {
  name: "Pattern — external destination",
  render: () => (
    <p className={typographyClass("body")}>
      View the project on{" "}
      <TextLink href="https://github.com/" external>
        GitHub
      </TextLink>
      .
    </p>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "SquareArrowOutUpRight visually reinforces that the destination opens in a new tab; assistive technology receives the same context.",
      },
    },
    ...storyCopySource(`
import { TextLink } from "@whatmatters/wmds";

<p className="type-body text-fg">
  View the project on <TextLink href="https://github.com/" external>GitHub</TextLink>.
</p>
`),
  },
};
