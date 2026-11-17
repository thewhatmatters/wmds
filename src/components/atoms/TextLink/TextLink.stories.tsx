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

Set \`tone="brand"\` for a large link in the brand ink, such as a footer's nav: the underline, weight and focus ring stay the variant's. Keep it to text of 24px and up. In the dark theme the brand ink is 3.58:1 on the page, which is enough for large text and too little for body copy.

Set \`external\` when the destination is another site. WMDS appends Lucide **SquareArrowOutUpRight**, and the link opens in the same tab (Links K9). Add \`newTab\` only when leaving would lose the reader's work: it opens a new tab with a safe \`rel\` and adds spoken new-tab context.

## Anatomy

\`\`\`
TextLink (\`a\`)
└── link label
\`\`\`

## Best practices

- **Do** write destination-oriented labels that make sense in context.
- **Do** use **TextLink** inside body copy and supporting text.
- **Do** use \`variant="quiet"\` for a linked title inside a heading — never inside running prose, where links must stay underlined.
- **Do** use \`external\` for another site, and \`newTab\` only when a new tab is genuinely useful.
- **Do** pass \`render={<Link href="/blog/post" />}\` in place of \`href\` for a link the app's router should handle; the treatment and the focus ring stay the same.
- **Don't** use it for actions—use **Button**.
- **Do** use \`tone="brand"\` when a large link takes the brand ink.
- **Don't** override its color or underline treatment with \`className\`.
        `.trim(),
      },
    },
  },
  argTypes: {
    variant: { control: "inline-radio", options: ["prose", "quiet"] },
    tone: { control: "inline-radio", options: ["default", "brand"] },
  },
  args: {
    href: "#writing",
    children: "writing",
    variant: "prose",
    tone: "default",
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
            "`external` marks another site with SquareArrowOutUpRight and opens it in the same tab (Links K9). Add `newTab` only when leaving would lose the reader's work; it sets `target=\"_blank\"`, a safe `rel`, and adds \"(opens in a new tab)\" to the accessible name.",
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

export const BrandNav: Story = {
  name: "Pattern — brand nav links",
  render: () => (
    <nav aria-label="Footer">
      <ul className="type-display-3 m-0 flex list-none flex-col gap-2 p-0">
        <li>
          <TextLink href="#services" tone="brand">
            Services
          </TextLink>
        </li>
        <li>
          <TextLink href="#resources" tone="brand">
            Resources
          </TextLink>
        </li>
        <li>
          <TextLink href="#about" tone="brand">
            About
          </TextLink>
        </li>
      </ul>
    </nav>
  ),
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "`tone=\"brand\"` sets the link's ink to `--color-brand`; the underline, the weight and the focus ring stay the variant's, and the hover underline takes the same ink. For large links only (24px and up), such as a footer's nav: in the dark theme the brand ink is 3.58:1 on the page. Never reach for `className=\"!text-brand\"`; `wmds-check` fails it.",
        },
      },
    },
    `
import { TextLink } from "@thewhatmatters/wmds";

export function FooterNav() {
  return (
    <nav aria-label="Footer">
      <ul className="type-display-3 m-0 flex list-none flex-col gap-2 p-0">
        <li>
          <TextLink href="/services" tone="brand">Services</TextLink>
        </li>
        <li>
          <TextLink href="/resources" tone="brand">Resources</TextLink>
        </li>
        <li>
          <TextLink href="/about" tone="brand">About</TextLink>
        </li>
      </ul>
    </nav>
  );
}
`,
  ),
};
