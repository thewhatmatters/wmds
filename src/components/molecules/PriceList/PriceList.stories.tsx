import type { Meta, StoryObj } from "@storybook/react-vite";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import { PriceList, priceListLayouts, priceListRules, priceListSizes } from "./PriceList";

const meta = {
  title: "Components/PriceList",
  component: PriceList,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  argTypes: {
    layout: { control: "inline-radio", options: [...priceListLayouts] },
    rule: { control: "inline-radio", options: [...priceListRules] },
    size: { control: "inline-radio", options: [...priceListSizes] },
    children: { control: false },
  },
  args: {
    layout: "inline",
    rule: "solid",
    size: "md",
    children: null,
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-3xl">
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

A priced list: a menu, a rate card, a ticket list. Each row is a name, an optional note and a price, under one rule. Renders a list (\`ul\`, \`li\`), read in order: name, note, price. It wraps to fit a phone and never scrolls sideways.

| Pattern | Props |
|---------|--------|
| **Menu section** | \`size="lg"\` — names and prices a step up, in the heading face |
| **Rate card** | \`size="md"\` (default) — label-size names |
| **Note beside the name** | \`layout="inline"\` (default) — one line from \`md\`; on phones the note drops under the name |
| **Note under the name** | \`layout="stacked"\` — at every width (a narrow column, long notes) |
| **Rule** | \`rule\` — \`solid\` (default), \`dotted\` (quieter), or \`none\` |

## Anatomy

\`\`\`
PriceList (ul — the grid; prices share one column)
└── PriceList.Item (li — a subgrid row, rule under it)
    ├── name — what is priced
    ├── note — optional, muted; beside the name from md (inline) or under it
    └── price — end-aligned, tabular figures; a long price wraps
\`\`\`

## Best practices

- **Do** name the list with \`aria-labelledby\` pointing at the section's heading ("Pizzas"), or \`aria-label\`.
- **Do** write the price as it is said: "$18", "$4.50 a slice", "Market price".
- **Do** keep the note to one short line: what's in the dish, what the rate covers.
- **Don't** use it to compare plans across columns — **Table**; for facts without a price — **DescriptionList**; for a headline figure — **Stat**.
- **Don't** restyle names or prices with \`className\` — it is layout only. The heading face comes from the brand kit.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof PriceList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Menu: Story = {
  name: "Pattern — menu section",
  args: { size: "lg" },
  render: (args) => (
    <section className="flex flex-col gap-4">
      <h2 id="menu-pizzas" className="type-heading-2 text-fg">
        Pizzas
      </h2>
      <PriceList {...args} aria-labelledby="menu-pizzas">
        <PriceList.Item name="Margherita" note="Tomato, fresh mozzarella, basil" price="$18" />
        <PriceList.Item name="White clam" note="Chopped clams, garlic, oregano, pecorino, lemon" price="$24" />
        <PriceList.Item name="Sausage and peppers" note="House fennel sausage, roasted peppers, red onion" price="$22" />
        <PriceList.Item name="Cheese slice" price="$4.50" />
      </PriceList>
    </section>
  ),
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "A menu section: the dish, what's in it, and the price on one ruled line. On a phone the note drops under the dish; the price stays at the row's end.",
        },
      },
    },
    `
import { PriceList } from "@thewhatmatters/wmds";

export interface MenuDish {
  name: string;
  /** What's in it. */
  note?: string;
  /** As written on the menu: "$18", "Market price". */
  price: string;
}

export interface MenuSectionProps {
  /** Unique on the page: it links the list to its heading. */
  id: string;
  title: string;
  dishes: MenuDish[];
}

export function MenuSection({ id, title, dishes }: MenuSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <h2 id={id} className="type-heading-2 text-fg">
        {title}
      </h2>
      <PriceList size="lg" aria-labelledby={id}>
        {dishes.map((dish) => (
          <PriceList.Item key={dish.name} name={dish.name} note={dish.note} price={dish.price} />
        ))}
      </PriceList>
    </section>
  );
}
`,
  ),
};

export const RateCard: Story = {
  name: "Reference — rate card",
  render: (args) => (
    <PriceList {...args} aria-label="Rates">
      <PriceList.Item name="Brand sprint" note="Two weeks: name, mark, colour and type" price="$5,000" />
      <PriceList.Item name="Site" note="Design and build, up to eight pages" price="$10,000" />
      <PriceList.Item name="Care plan" note="Hosting, updates and one change a week" price="$400 a month" />
    </PriceList>
  ),
};

export const Stacked: Story = {
  name: "Reference — stacked notes",
  render: () => (
    <div className="w-full max-w-sm">
      <PriceList layout="stacked" rule="dotted" aria-label="Sides">
        <PriceList.Item name="Garlic knots" note="Six, with marinara" price="$7" />
        <PriceList.Item name="House salad" note="Romaine, olives, pepperoncini, red wine vinaigrette" price="$9" />
        <PriceList.Item name="Oysters" note="Half dozen, on ice" price="Market price" />
      </PriceList>
    </div>
  ),
};

export const Sizes: Story = {
  name: "Reference — sizes",
  render: () => (
    <div className="flex flex-col gap-10">
      {priceListSizes.map((size) => (
        <section key={size} className="flex flex-col gap-2">
          <h2 className="type-eyebrow text-muted">size=&quot;{size}&quot;</h2>
          <PriceList size={size} aria-label={`Size ${size}`}>
            <PriceList.Item name="Margherita" note="Tomato, fresh mozzarella, basil" price="$18" />
            <PriceList.Item name="White clam" note="Chopped clams, garlic, pecorino" price="$24" />
          </PriceList>
        </section>
      ))}
    </div>
  ),
};
