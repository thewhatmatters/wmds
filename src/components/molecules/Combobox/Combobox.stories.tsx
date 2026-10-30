import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Combobox, type ComboboxOption } from "./Combobox";

const fontOptions: ComboboxOption[] = [
  ["Inter", "Sans"],
  ["Inter Tight", "Sans"],
  ["IBM Plex Sans", "Sans"],
  ["IBM Plex Mono", "Mono"],
  ["Instrument Serif", "Serif"],
  ["JetBrains Mono", "Mono"],
  ["Libre Baskerville", "Serif"],
  ["Manrope", "Sans"],
  ["Merriweather", "Serif"],
  ["Open Sans", "Sans"],
  ["Playfair Display", "Serif"],
  ["Roboto", "Sans"],
  ["Roboto Mono", "Mono"],
  ["Source Serif 4", "Serif"],
  ["Space Grotesk", "Sans"],
  ["Space Mono", "Mono"],
  ["Work Sans", "Sans"],
].map(([label, category]) => ({
  value: label,
  label,
  end: category,
  keywords: [category.toLowerCase()],
}));

const syllables = ["Ar", "Bel", "Cor", "Dun", "El", "Fen", "Gal", "Hav", "Ir", "Jun", "Kel", "Lum"];
const kinds = ["Sans", "Serif", "Mono", "Display", "Grotesk"];

/** 1,800 made-up family names, about the size of the Google Fonts list. */
const longFontOptions: ComboboxOption[] = Array.from({ length: 1800 }, (_, index) => {
  const label = `${syllables[index % 12]}${syllables[Math.floor(index / 12) % 12].toLowerCase()} ${kinds[Math.floor(index / 144) % 5]} ${Math.floor(index / 720) + 1}`;
  return { value: `${label}-${index}`, label };
});

const meta = {
  title: "Components/Combobox",
  component: Combobox,
  tags: ["autodocs"],
  argTypes: {
    options: { control: false },
    onValueChange: { control: false },
    value: { control: false },
    filter: { control: false },
  },
  args: {
    label: "Headings font",
    options: fontOptions,
    placeholder: "Search fonts",
    emptyText: "No fonts match",
  },
  parameters: {
    wmdsLayout: "centered",
    docs: {
      description: {
        component: `
## Usage

A **searchable select**: the **Input** pill with a search icon over a **Dropdown** listbox that narrows as people type. Use it for lists of 16 or more (Dropdowns C7); under that, use **Select**.

| Pattern | Props |
|---------|--------|
| **Controlled** | \`value\` + \`onValueChange\` (the option's \`value\`) |
| **Rich rows** | \`options[].start\` / \`end\` (**Dropdown.Item** slots); \`keywords\` match without showing |
| **Long lists** | \`maxResults\` (default 50) rows render; the rest are a keystroke away |
| **Free text** | \`allowCustom\` keeps typed text that matches no option |
| **Forms** | \`name\` (hidden input), \`required\`, \`status\` + \`message\` as on **Input** |

## Keyboard

↓ / ↑ open the list and move; Enter picks; Escape closes, a second Escape clears; Tab leaves. Focus stays in the field the whole time, and a polite live region says how many results there are.
        `,
      },
    },
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value ?? "Inter");
    return (
      <div className="w-80">
        <Combobox {...args} value={value} onValueChange={setValue} />
      </div>
    );
  },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongList: Story = {
  name: "Long list (1,800 options)",
  args: { options: longFontOptions, label: "Body font", value: "" },
};

export const Validation: Story = {
  args: {
    label: "Industry",
    placeholder: "Search industries",
    value: "",
    required: true,
    status: "error",
    message: "Pick an industry",
    options: ["Food and drink", "Finance", "Health", "Hospitality", "Legal", "Real estate", "Retail", "Software"].map(
      (label) => ({ value: label, label }),
    ),
  },
};
