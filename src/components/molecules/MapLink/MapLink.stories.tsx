import type { Meta, StoryObj } from "@storybook/react-vite";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import { Button } from "../../atoms/Button/Button";
import { MapLink, mapLinkModes, mapLinkProviders } from "./MapLink";

const meta = {
  title: "Components/MapLink",
  component: MapLink,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  argTypes: {
    mode: { control: "inline-radio", options: [...mapLinkModes] },
    provider: { control: "inline-radio", options: [...mapLinkProviders] },
    role: { control: "inline-radio", options: ["primary", "secondary", "outline"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    actions: { control: false },
  },
  args: {
    address: "1201 S Lamar Blvd, Austin, TX 78704",
    mode: "directions",
    provider: "google",
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md">
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

Where a business is, and a way there. The address is text a visitor can read and copy; the link opens the maps site, or the maps app on a phone, with the route. There is no embedded map: an embed is slow, tracks visitors, and a phone already has a better one.

| Pattern | Props |
|---------|--------|
| **A place to visit** | \`address\` |
| **The pin on the business, not the building** | \`place\` — the name with the address ("Busby's, 1201 S Lamar Blvd, Austin") |
| **A business that comes to you** | \`areas\` (the towns), \`areasLabel\`, and \`place\` (the home town) with \`mode="search"\` |
| **Call, book** | \`actions\` — more **Button**s beside the link |
| **Apple Maps** | \`provider="apple"\` |

## Anatomy

\`\`\`
MapLink
├── address — the street address, as written
├── areas — a named list of the towns served
└── actions
    ├── the link — "Get directions", or "See it on the map"
    └── more buttons
\`\`\`

## Best practices

- **Do** write the address the way the post office would, town and postcode included. It is what the map is asked for.
- **Do** give \`place\` the business's name with its address when the building holds more than one business.
- **Do** keep the link's words about the map: "Get directions", "See it on the map".
- **Don't** embed a map. Link to it.
- **Don't** use it for a link that isn't a place — **TextLink** or **Button**. For opening hours beside it — **DescriptionList**.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof MapLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Visit: Story = {
  name: "Pattern — visit us",
  args: {
    address: "1201 S Lamar Blvd\nAustin, TX 78704",
    place: "Busby's, 1201 S Lamar Blvd, Austin, TX 78704",
    actions: (
      <Button role="outline" render={<a href="tel:+15125550100" />}>
        Call (512) 555-0100
      </Button>
    ),
  },
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "A restaurant's Visit section: the address on two lines, directions to the business by name, and a call button beside it.",
        },
      },
    },
    `
import { Button, MapLink } from "@thewhatmatters/wmds";

export interface VisitProps {
  /** The business's name: with the address, it drops the pin on the business. */
  name: string;
  /** The street address. A line break stays a line break. */
  address: string;
  /** The phone number as people read it, and as a tel: link dials it. */
  phone?: { label: string; href: string };
}

export function Visit({ name, address, phone }: VisitProps) {
  return (
    <MapLink
      address={address}
      place={name + ", " + address}
      actions={
        phone ? (
          <Button role="outline" render={<a href={phone.href} />}>
            Call {phone.label}
          </Button>
        ) : undefined
      }
    />
  );
}
`,
  ),
};

export const ServiceArea: Story = {
  name: "Reference — the towns we serve",
  args: {
    address: undefined,
    place: "Round Rock, TX",
    mode: "search",
    role: "outline",
    areas: ["Round Rock", "Cedar Park", "Leander", "Georgetown", "Pflugerville", "Hutto", "Taylor"],
    areasLabel: "Towns we serve",
  },
  parameters: {
    docs: {
      description: {
        story:
          "A business with no storefront lists the towns it serves; the link shows its home town on the map. The list wraps on a phone.",
      },
    },
  },
};

export const AddressAndAreas: Story = {
  name: "Reference — a shop that also delivers",
  args: {
    address: "88 Main St, Round Rock, TX 78664",
    areas: ["Round Rock", "Cedar Park", "Leander"],
    areasLabel: "We deliver to",
    provider: "apple",
    newTab: true,
  },
  parameters: {
    docs: {
      description: {
        story: "An address and a list together. `provider=\"apple\"` asks Apple Maps; `newTab` opens it in a new tab and says so.",
      },
    },
  },
};
