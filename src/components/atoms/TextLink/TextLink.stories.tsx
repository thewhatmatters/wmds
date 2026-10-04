import type { Meta, StoryObj } from "@storybook/react-vite";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import { typographyClass } from "../../../lib/typography";
import { TextLink } from "./TextLink";

const meta = {
  title: "Components/TextLink",
  component: TextLink,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  parameters: {
    docs: {
      description: {
        component: `
## Usage

Use **TextLink** for inline navigation inside prose. Its solid underline keeps links visible without overpowering the surrounding copy; hover strengthens the underline and keyboard focus adds the WMDS focus ring.

Set \`variant="quiet"\` for headline-size text and list titles: no underline at rest, an underline scaled to the text on hover and keyboard focus, and the same focus ring. A quiet link inherits the surrounding size and weight, so the heading around it owns the type step.

Set \`external\` when the destination opens in a new tab. WMDS appends Lucide **SquareArrowOutUpRight**, adds spoken new-tab context, and supplies a safe \`rel\`.

## Anatomy

\`\`\`
TextLink (\`a\`)
└── link label
\`\`\`

## Best practices

- **Do** write destination-oriented labels that make sense in context.
- **Do** use **TextLink** inside body copy and supporting text.
- **Do** use \`variant="quiet"\` for a linked title inside a heading — never inside running prose, where links must stay underlined.
- **Do** use \`external\` only when a new tab is genuinely useful.
- **Don't** use it for actions—use **Button**.
- **Don't** override its color or underline treatment with \`className\`.
        `.trim(),
      },
    },
  },
  argTypes: {
    variant: { control: "inline-radio", options: ["prose", "quiet"] },
  },
  args: {
    href: "#writing",
    children: "writing",
    variant: "prose",
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
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "The solid underline remains identifiable at rest and strengthens on hover without changing the paragraph’s line height.",
        },
      },
    },
    `
import { TextLink } from "@thewhatmatters/wmds";

<p className="type-body text-fg">
  Read my <TextLink href="/writing">writing</TextLink>, or browse the projects I’ve built.
</p>
`,
  ),
};

export const SupportingCopy: Story = {
  name: "Pattern — supporting copy link",
  render: () => (
    <p className={typographyClass("caption")}>
      By continuing, you agree to the{" "}
      <TextLink href="#terms">terms of service</TextLink>.
    </p>
  ),
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "TextLink inherits the surrounding type size while retaining its canonical weight and underline.",
        },
      },
    },
    `
import { TextLink } from "@thewhatmatters/wmds";

<p className="type-supporting text-muted">
  By continuing, you agree to the <TextLink href="/terms">terms of service</TextLink>.
</p>
`,
  ),
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
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "SquareArrowOutUpRight visually reinforces that the destination opens in a new tab; assistive technology receives the same context.",
        },
      },
    },
    `
import { TextLink } from "@thewhatmatters/wmds";

<p className="type-body text-fg">
  View the project on <TextLink href="https://github.com/" external>GitHub</TextLink>.
</p>
`,
  ),
};

export const QuietTitle: Story = {
  name: "Pattern — quiet title link",
  render: () => (
    <h2 className="type-display-3 text-fg">
      <TextLink variant="quiet" href="#post">
        How we scope a brand sprint
      </TextLink>
    </h2>
  ),
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "A linked title at display size. Hover or Tab to it: the underline appears at the text's scale and the focus ring stays. The heading sets the type step; the link inherits it.",
        },
      },
    },
    `
import { TextLink } from "@thewhatmatters/wmds";

export function PostTitle({ title, href }: { title: string; href: string }) {
  return (
    <h2 className="type-display-3 text-fg">
      <TextLink variant="quiet" href={href}>
        {title}
      </TextLink>
    </h2>
  );
}
`,
  ),
};
