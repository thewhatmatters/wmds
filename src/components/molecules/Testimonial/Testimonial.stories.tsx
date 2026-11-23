import type { Meta, StoryObj } from "@storybook/react-vite";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import { Testimonial, testimonialSizes, testimonialVariants } from "./Testimonial";

const longQuote =
  "We called on a Sunday night with water coming through the kitchen ceiling. They were at the door within the hour, found the leak behind the upstairs bath, and had it stopped before midnight. The next morning they came back to patch the ceiling and wouldn't take a cent more than the quote.";

const meta = {
  title: "Components/Testimonial",
  component: Testimonial,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  argTypes: {
    size: { control: "inline-radio", options: [...testimonialSizes] },
    variant: { control: "inline-radio", options: [...testimonialVariants] },
    tone: { control: "inline-radio", options: [undefined, "inverse", "field", "light"] },
    rating: { control: { type: "number", min: 1, max: 5, step: 1 } },
  },
  args: {
    quote: "They fixed in an afternoon what two other crews couldn't find in a month.",
    name: "Dana Whitfield",
    detail: "Round Rock",
    size: "auto",
    variant: "outlined",
  },
  decorators: [
    (Story, { parameters }) => (
      <div className={parameters.testimonialRow ? "w-full max-w-6xl" : "w-full max-w-md"}>
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

One person's words on a card: what they said, who they are, where they're from. Add the stars and the source when the words came from a public review.

| Pattern | Props |
|---------|--------|
| **A customer's words** | \`quote\`, \`name\`, \`detail\` (their role or their place) |
| **A public review** | \`rating\` (stars out of five) and \`source\` ("Google review") |
| **A long quote** | nothing to set: over 200 characters it drops a size (\`size="auto"\`) |
| **A row at one size** | \`size="md"\` or \`size="lg"\` on every card |
| **A card that stands apart** | \`tone="inverse"\`, or \`variant="surface"\` / \`"muted"\` |

## Anatomy

\`\`\`
Testimonial (Card)
└── figure
    ├── rating — five stars, read as "Rated 5 out of 5"
    ├── blockquote — the quote
    └── figcaption
        ├── name, with the detail under it
        └── source — small capitals, at the end
\`\`\`

## Best practices

- **Do** quote real people word for word, with their leave. Trim with care; never rewrite.
- **Do** leave the quote marks out. The card is the quotation, and screen readers hear a blockquote.
- **Do** give every card in a row the same parts, so the stars and names line up.
- **Do** show a \`rating\` only when the review had one, and name its \`source\`.
- **Don't** mark a made-up quote as a review. A sample page says its quotes are examples.
- **Don't** put a button or a link in the card. For many quotes in a moving row — **Carousel**; for a figure — **Stat**.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof Testimonial>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Review: Story = {
  name: "Pattern — review card",
  args: {
    rating: 5,
    source: "Google review",
  },
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "A public review: the stars it came with, the words, the person and their town, and where it was published.",
        },
      },
    },
    `
import { Testimonial } from "@thewhatmatters/wmds";

export interface Review {
  quote: string;
  name: string;
  /** Their town, or their role. */
  detail?: string;
  /** Stars out of five, when the review had them. */
  rating?: number;
  /** Where it was published: "Google review". */
  source?: string;
}

export function ReviewCard({ quote, name, detail, rating, source }: Review) {
  return <Testimonial quote={quote} name={name} detail={detail} rating={rating} source={source} />;
}

/** Three reviews side by side; one column on phones. The names line up along the bottom. */
export function ReviewRow({ reviews }: { reviews: Review[] }) {
  return (
    <ul role="list" className="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-3">
      {reviews.map((review) => (
        <li key={review.name} className="flex">
          <ReviewCard {...review} />
        </li>
      ))}
    </ul>
  );
}
`,
  ),
};

export const LongQuote: Story = {
  name: "Reference — a long quote",
  args: {
    quote: longQuote,
    name: "Marcus Oyelaran",
    detail: "Cedar Park",
  },
  parameters: {
    docs: {
      description: {
        story: "Over 200 characters, the quote is set a step smaller. Nothing to pass.",
      },
    },
  },
};

export const Row: Story = {
  name: "Reference — a row of three",
  parameters: {
    wmdsLayout: "padded",
    testimonialRow: true,
    docs: {
      description: {
        story:
          "Cards in a row stretch to one height and hold their people at the bottom. The long quote is smaller; the row is one column on phones.",
      },
    },
  },
  render: (args) => (
    <ul role="list" className="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-3">
      <li className="flex">
        <Testimonial {...args} rating={5} source="Google review" />
      </li>
      <li className="flex">
        <Testimonial {...args} quote={longQuote} name="Marcus Oyelaran" detail="Cedar Park" rating={5} source="Google review" />
      </li>
      <li className="flex">
        <Testimonial
          {...args}
          quote="On time, tidy, and the price they quoted is the price we paid."
          name="Priya Raman"
          detail="Leander"
          rating={4}
          source="Google review"
        />
      </li>
    </ul>
  ),
};

export const Surfaces: Story = {
  name: "Reference — surfaces and tone",
  parameters: {
    wmdsLayout: "padded",
    testimonialRow: true,
    docs: {
      description: {
        story: "`outlined` (default), `muted`, and `tone=\"inverse\"` for the one card that should stand apart.",
      },
    },
  },
  render: (args) => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <Testimonial {...args} detail="Owner, Corner Bakery" />
      <Testimonial {...args} variant="muted" detail="Owner, Corner Bakery" />
      <Testimonial {...args} variant="surface" tone="inverse" detail="Owner, Corner Bakery" />
    </div>
  ),
};
