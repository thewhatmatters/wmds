import type { Meta, StoryObj } from "@storybook/react-vite";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import { Media, mediaFits, mediaFocuses, mediaRadii, mediaRatios } from "./Media";

const meta = {
  title: "Components/Media",
  component: Media,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  argTypes: {
    ratio: { control: "select", options: [...mediaRatios] },
    focus: { control: "select", options: [...mediaFocuses] },
    fit: { control: "inline-radio", options: [...mediaFits] },
    radius: { control: "inline-radio", options: [...mediaRadii] },
    fallback: { control: false },
    render: { control: false },
  },
  args: {
    src: "/sample/media-dish.svg",
    alt: "A plate of roasted vegetables",
    ratio: "4/3",
    focus: "center",
    fit: "cover",
    radius: "sm",
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-xl">
        <Story />
      </div>
    ),
  ],
  parameters: {
    wmdsLayout: "centered",
    docs: {
      description: {
        component: `
## Usage

A picture in a frame of a set shape. The frame holds its box before the picture loads, so the page never jumps; it crops to a point you choose, and shows a tinted box if the picture is missing or fails.

| Pattern | Props |
|---------|--------|
| **Shape** | \`ratio\` — \`4/3\` (default), \`16/9\`, \`1/1\`, \`3/2\`, \`4/5\`, \`3/4\`, \`21/9\` |
| **Crop point** | \`focus\` — a name (\`top\`, \`bottom-left\`…) or \`{ x: 50, y: 20 }\`, percentages of the picture |
| **Whole picture, no crop** | \`fit="contain"\` — a logo, a diagram |
| **Corner** | \`radius\` — \`sm\` (default, a Card's corner), \`md\`, \`lg\`, \`none\`; all follow the surface radius knob |
| **Words under it** | \`caption\`, and \`tag\` for the source label: "Stock photo" |
| **Another image component** | \`render={<Image fill sizes="50vw" />}\` — \`next/image\` |

## Anatomy

\`\`\`
Media (figure, when it has a caption or a tag)
├── frame — the set shape, a tinted well, clipped to the radius
│   ├── img — fills the frame, cropped to the focus
│   └── fallback — a quiet glyph when the picture is missing
└── figcaption
    ├── caption — muted, at the start
    └── tag — small capitals, at the end
\`\`\`

## Best practices

- **Do** write \`alt\` as what the picture shows. Pass \`alt=""\` only when it is decoration.
- **Do** set \`focus\` when the subject isn't in the middle: a face near the top, a dish at one side.
- **Do** label stock pictures with \`tag="Stock photo"\`, so nobody takes them for the business's own.
- **Do** give the first picture on a page \`loading="eager"\`; the rest load as they come near (the default).
- **Don't** put text over the picture — a caption goes under it. For a card's edge-to-edge picture — **Card.Media**; for a person — **Avatar**.
- **Don't** restyle it with \`className\` — it is layout only (width, grid placement).
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof Media>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Photo: Story = {
  name: "Pattern — photo with a source tag",
  args: {
    caption: "Roasted vegetables, from the autumn menu",
    tag: "Stock photo",
  },
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "A photo held at 4:3, with a caption and the visible source tag a stock picture carries. The frame keeps its shape while the picture loads.",
        },
      },
    },
    `
import { Media, type MediaFocus, type MediaRatio } from "@thewhatmatters/wmds";

export interface PhotoProps {
  src: string;
  /** What the picture shows. */
  alt: string;
  ratio?: MediaRatio;
  /** The part of the picture to keep when it is cropped. */
  focus?: MediaFocus;
  caption?: string;
  /** True for a stock picture: it gets a visible "Stock photo" label. */
  stock?: boolean;
}

export function Photo({ src, alt, ratio = "4/3", focus, caption, stock = false }: PhotoProps) {
  return (
    <Media
      src={src}
      alt={alt}
      ratio={ratio}
      focus={focus}
      caption={caption}
      tag={stock ? "Stock photo" : undefined}
    />
  );
}
`,
  ),
};

export const Ratios: Story = {
  name: "Reference — ratios",
  decorators: [
    (Story) => (
      <div className="w-full max-w-4xl">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <div className="grid grid-cols-2 items-start gap-6 md:grid-cols-3">
      {(["4/3", "16/9", "1/1", "3/2", "4/5", "21/9"] as const).map((ratio) => (
        <Media key={ratio} {...args} ratio={ratio} caption={ratio.replace("/", ":")} />
      ))}
    </div>
  ),
};

export const Focus: Story = {
  name: "Reference — crop point",
  decorators: [
    (Story) => (
      <div className="w-full max-w-4xl">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
      <Media {...args} src="/sample/media-room.svg" alt="A dining room" ratio="21/9" focus="top" caption='focus="top"' />
      <Media {...args} src="/sample/media-room.svg" alt="A dining room" ratio="21/9" caption='focus="center"' />
      <Media
        {...args}
        src="/sample/media-room.svg"
        alt="A dining room"
        ratio="21/9"
        focus={{ x: 50, y: 85 }}
        caption="focus={{ x: 50, y: 85 }}"
      />
    </div>
  ),
};

export const Missing: Story = {
  name: "Reference — missing picture",
  decorators: [
    (Story) => (
      <div className="w-full max-w-3xl">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
      <Media {...args} src={undefined} alt="The patio in summer" caption="No picture yet" />
      <Media {...args} src="/sample/does-not-exist.jpg" alt="The kitchen" caption="The file failed to load" tag="Stock photo" />
    </div>
  ),
};

export const Radii: Story = {
  name: "Reference — corners",
  decorators: [
    (Story) => (
      <div className="w-full max-w-4xl">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <div className="grid grid-cols-2 items-start gap-6 md:grid-cols-4">
      {mediaRadii.map((radius) => (
        <Media key={radius} {...args} src="/sample/media-patio.svg" alt="A patio" ratio="1/1" radius={radius} caption={`radius="${radius}"`} />
      ))}
    </div>
  ),
};
