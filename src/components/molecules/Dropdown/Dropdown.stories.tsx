import type { Meta, StoryObj } from "@storybook/react-vite";
import { Apple, Banana, Citrus, Keyboard } from "lucide-react";
import { ButtonIcon } from "../../atoms/Button/ButtonIcon";
import { Dropdown } from "./Dropdown";

const meta = {
  title: "Molecules/Dropdown",
  component: Dropdown.Menu,
  tags: ["autodocs"],
  parameters: {
    wmdsLayout: "centered",
    docs: {
      description: {
        component: `
## Usage

Shared **floating menu** + **three-slot rows** — used by **Select** today; future action menus and multi-select reuse the same anatomy.

| Part | Role |
|------|------|
| **Dropdown.Menu** | Rounded surface panel (\`p-0.5\` / 2px inset) |
| **Dropdown.Item** | Interactive row — \`start\` \\| label \\| \`end\`. **Selection** → check in \`end\` (\`selected\`); **hover/focus** → row fill (\`active\`) — not both. |

## Anatomy

\`\`\`
Dropdown.Menu
└── li
    └── Dropdown.Item
        ├── start — optional leading icon, checkbox, swatch
        ├── children — primary label (truncates)
        └── end — shortcut, count, or **check** when \`selected\`
\`\`\`

## Best practices

- **Do** pass Lucide icons into \`start\` from the app — not inside the molecule.
- **Do** use \`end\` for keyboard shortcuts (\`font-mono\` caption tier) or selection meta.
- **Do** compose **Dropdown.Item** inside **Select** \`options\` via \`start\` / \`end\` props — or copy **Dropdown** stories for custom menus.
- **Don't** invent one-off menu padding — panel inset is **2px** (\`p-0.5\`).
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof Dropdown.Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ItemAnatomy: Story = {
  name: "Reference — item anatomy",
  parameters: {
    docs: {
      description: {
        story: "Three-slot rows — label only, leading icon, trailing shortcut, and full start + end.",
      },
    },
  },
  render: () => (
    <div className="mx-auto w-full max-w-xs px-8 py-6">
      <Dropdown.Menu role="listbox" aria-label="Fruit examples" className="relative w-full">
        <li role="presentation">
          <Dropdown.Item role="option" aria-selected={false}>
            Label only
          </Dropdown.Item>
        </li>
        <li role="presentation">
          <Dropdown.Item
            role="option"
            aria-selected
            selected
            start={
              <ButtonIcon size="sm">
                <Apple strokeWidth={2} />
              </ButtonIcon>
            }
          >
            Apple
          </Dropdown.Item>
        </li>
        <li role="presentation">
          <Dropdown.Item role="option" aria-selected={false} active>
            Keyboard highlight (active)
          </Dropdown.Item>
        </li>
        <li role="presentation">
          <Dropdown.Item
            role="option"
            aria-selected={false}
            start={
              <ButtonIcon size="sm">
                <Banana strokeWidth={2} />
              </ButtonIcon>
            }
            end="12"
          >
            Banana
          </Dropdown.Item>
        </li>
      </Dropdown.Menu>
    </div>
  ),
};

export const MenuSpecimen: Story = {
  name: "Reference — menu panel",
  render: () => (
    <div className="mx-auto w-full max-w-xs px-8 py-6">
      <Dropdown.Menu role="menu" aria-label="Actions" className="relative w-full">
        <li role="presentation">
          <Dropdown.Item
            role="menuitem"
            start={
              <ButtonIcon size="sm">
                <Citrus strokeWidth={2} />
              </ButtonIcon>
            }
          >
            Orange
          </Dropdown.Item>
        </li>
        <li role="presentation">
          <Dropdown.Item
            role="menuitem"
            start={
              <ButtonIcon size="sm">
                <Keyboard strokeWidth={2} />
              </ButtonIcon>
            }
            end="⇧⌘P"
          >
            Command palette
          </Dropdown.Item>
        </li>
      </Dropdown.Menu>
    </div>
  ),
};
