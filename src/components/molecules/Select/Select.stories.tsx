import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Apple, Banana, Citrus, ChevronDown } from "lucide-react";
import { ButtonIcon } from "../../atoms/Button/ButtonIcon";
import { Dropdown } from "../Dropdown/Dropdown";
import { Select, selectSizes, type SelectOption } from "./Select";

const fruitOptions: SelectOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "orange", label: "Orange" },
  { value: "mango", label: "Mango" },
  { value: "pineapple", label: "Pineapple" },
];

const periodOptions: SelectOption[] = [
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
  { value: "quarter", label: "This quarter" },
  { value: "year", label: "This year" },
];

const meta = {
  title: "Molecules/Select",
  component: Select,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: [...selectSizes] },
    options: { control: false },
    onValueChange: { control: false },
    value: { control: false },
    defaultValue: { control: false },
  },
  args: {
    size: "md",
    disabled: false,
    placeholder: "Select…",
    options: fruitOptions,
  },
  parameters: {
    wmdsLayout: "centered",
    docs: {
      description: {
        component: `
## Usage

Input-matched **pill trigger** + floating **listbox** panel — rounded menu, inset option highlights.

| Pattern | Props |
|---------|--------|
| **Bare** | \`options\` + \`aria-label\` or \`placeholder\` — Card header period filter |
| **With label** | \`label\`, optional \`description\` — forms |
| **Controlled** | \`value\` + \`onValueChange\` |
| **Uncontrolled** | \`defaultValue\` |
| **Rich options** | \`options[].start\` / \`options[].end\` — **Dropdown.Item** slots (icons, shortcuts) |

**Sizes:** \`sm\` | \`md\` (default) | \`lg\` — align with **Input** and **Foundation → Cluster**.

## Anatomy

- **Trigger** — outer **shell** (border, shadow, fixed height) + inner transparent button; trailing **caret** (\`ChevronDown\` in fixed slot); **inset** focus ring on shell
- **Menu** — **Dropdown.Menu** — \`rounded-2xl\` surface, **2px** inset (\`p-0.5\`)
- **Option** — **Dropdown.Item** — \`start\` | label | \`end\`; **selected** → check in end; **active** → hover/keyboard fill only

## Best practices

- **Do** use \`size="sm"\` beside **Chip sm** / **IconButton xs** in Card headers.
- **Do** pass stable \`value\` strings — \`label\` is trigger copy; \`start\` / \`end\` are menu-only.
- **Do** read **Molecules/Dropdown** for row anatomy before custom menus.
- **Don't** restyle the menu with \`className\` — layout width/margin only on the root.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DropdownOpen: Story = {
  name: "Reference — dropdown open",
  parameters: {
    docs: {
      description: {
        story: "Static open panel — matches the reference menu (16px shell, 8px option highlight).",
      },
    },
  },
  render: () => (
    <div className="mx-auto w-full max-w-xs px-8 py-6">
      <div className="relative w-full">
        <div className="flex h-11 w-full items-center justify-between gap-2 rounded-full border border-border bg-surface px-3 text-sm shadow-raised">
          <span>Apple</span>
          <span className="flex size-4 shrink-0 items-center justify-center text-muted" aria-hidden>
            <ChevronDown className="size-full stroke-current" strokeWidth={2} />
          </span>
        </div>
        <Dropdown.Menu role="listbox" aria-label="Fruit examples" className="relative mt-1.5 w-full">
          {fruitOptions.map((option, index) => (
            <li key={option.value} role="presentation">
              <Dropdown.Item role="option" aria-selected={index === 0} selected={index === 0}>
                {option.label}
              </Dropdown.Item>
            </li>
          ))}
        </Dropdown.Menu>
      </div>
    </div>
  ),
};

const fruitOptionsRich: SelectOption[] = [
  {
    value: "apple",
    label: "Apple",
    start: (
      <ButtonIcon size="sm">
        <Apple strokeWidth={2} />
      </ButtonIcon>
    ),
  },
  {
    value: "banana",
    label: "Banana",
    start: (
      <ButtonIcon size="sm">
        <Banana strokeWidth={2} />
      </ButtonIcon>
    ),
    end: "12",
  },
  {
    value: "orange",
    label: "Orange",
    start: (
      <ButtonIcon size="sm">
        <Citrus strokeWidth={2} />
      </ButtonIcon>
    ),
    end: "⌘O",
  },
];

export const RichOptions: Story = {
  name: "Pattern — options with start and end",
  parameters: {
    docs: {
      description: {
        story:
          "**`options[].start`** / **`options[].end`** map to **Dropdown.Item** slots — icons, counts, keyboard shortcuts. Trigger shows **`label`** only.",
      },
    },
  },
  render: () => {
    const [value, setValue] = useState("apple");

    return (
      <div className="mx-auto w-full max-w-xs px-8 py-6">
        <Select
          aria-label="Favorite fruit"
          options={fruitOptionsRich}
          value={value}
          onValueChange={setValue}
        />
      </div>
    );
  },
};

export const Bare: Story = {
  name: "Pattern — bare",
  render: () => {
    const [value, setValue] = useState("apple");

    return (
      <div className="mx-auto w-full max-w-xs px-8 py-6">
        <Select
          aria-label="Favorite fruit"
          options={fruitOptions}
          value={value}
          onValueChange={setValue}
        />
      </div>
    );
  },
};

export const WithLabel: Story = {
  name: "Pattern — with label",
  render: () => {
    const [value, setValue] = useState("banana");

    return (
      <div className="mx-auto w-full max-w-xs px-8 py-6">
        <Select
          label="Favorite fruit"
          description="Choose one from the list."
          options={fruitOptions}
          value={value}
          onValueChange={setValue}
        />
      </div>
    );
  },
};

export const PeriodFilter: Story = {
  name: "Pattern — period filter (Card header)",
  parameters: {
    docs: {
      description: {
        story: "**`size=\"sm\"`** — pairs with **Chip sm** / cluster **sm** in Card headers and filter rails.",
      },
    },
  },
  render: () => {
    const [value, setValue] = useState("month");

    return (
      <div className="mx-auto w-full max-w-xs px-8 py-6">
        <Select
          aria-label="Reporting period"
          size="sm"
          options={periodOptions}
          value={value}
          onValueChange={setValue}
        />
      </div>
    );
  },
};

export const Sizes: Story = {
  name: "Reference — sizes",
  render: () => {
    const [sm, setSm] = useState("week");
    const [md, setMd] = useState("apple");
    const [lg, setLg] = useState("orange");

    return (
      <div className="mx-auto flex w-full max-w-sm flex-col gap-4 px-8 py-6">
        <Select aria-label="Small" size="sm" options={periodOptions} value={sm} onValueChange={setSm} />
        <Select aria-label="Medium" size="md" options={fruitOptions} value={md} onValueChange={setMd} />
        <Select aria-label="Large" size="lg" options={fruitOptions} value={lg} onValueChange={setLg} />
      </div>
    );
  },
};
