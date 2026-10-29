import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../Badge/Badge";
import { Select } from "../../molecules/Select/Select";
import { usStateOptions } from "../../molecules/Select/usStateOptions";
import { Input, inputStatuses } from "./Input";
import { InputValidationMorphDemo } from "./InputValidationMorph";

/** Keeps docs canvases from stretching the pill edge-to-edge. */
function InputSpecimen({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-sm px-8 py-6">{children}</div>;
}

const meta = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <InputSpecimen>
        <Story />
      </InputSpecimen>
    ),
  ],
  argTypes: {
    status: { control: "select", options: [undefined, ...inputStatuses] },
    icon: { control: false },
    label: { control: "text" },
    description: { control: "text" },
    message: { control: "text" },
    endBadge: { control: false },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
    size: { control: false },
  },
  args: {
    size: "md",
    disabled: false,
    loading: false,
  },
  parameters: {
    wmdsLayout: "centered",
    docs: {
      description: {
        component: `
## Usage

**Pill** single-line text field. Optional label, **status validation** (not required asterisks). See **ADR-0006**.

| Pattern | Props |
|---------|--------|
| **With label** | \`label\`, optional \`description\` (the hint, above the field, kept with a status message) |
| **Hidden label** | \`aria-label\` — only for a field alone with its button (search, a one-field newsletter) |
| **Rich label** | \`label\` with inline markup (\`<strong>\`) — still the field's accessible name |
| **Validation** | \`status\` + \`message\` — tinted status band (\`messagePosition\` top or bottom) |
| **Status only** | \`status\` without \`message\` — border + trailing icon |
| **Loading** | \`loading\` — trailing spinner |
| **End badge** | \`endBadge={<Badge size="sm">Optional</Badge>}\` — the form's exception, inside the pill; read with the field; never on autofill fields |
| **Monospace** | \`mono\` — \`type-code\` face for a read-only key or id |

## Best practices

- **Do** use \`status\` + \`message\` for validation feedback — not label asterisks.
- **Do** mark the exception: in a mostly-required form badge the optional fields "Optional"; in a mostly-optional form badge the required ones "Required". Required fields also carry \`required\` or \`aria-required\`.
- **Don't** put a badge on an autofill field (name, email, tel, password, address, organization): autofill paints over it. Say it in the label: "Company (optional)". \`npx wmds-check\` fails it (\`badge-on-autofill\`).
- **Do** give every field a visible \`label\`. Hide it (\`aria-label\`) only when the field sits alone with its button.
- **Do** put examples and formats in \`description\`, not a placeholder. Placeholders belong to search fields only.
- **Don't** restyle the shell with \`className\` — hero search with inset button → **Search** molecule.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Bare: Story = {
  name: "Pattern — bare",
  args: {
    "aria-label": "Location",
  },
};

export const WithLabel: Story = {
  name: "Pattern — with label",
  args: {
    label: "Email",
    type: "email",
    autoComplete: "email",
    description: "We'll never share your email.",
  },
};

export const RichLabel: Story = {
  name: "Pattern — rich label",
  args: {
    label: (
      <>
        Type <strong>@sarah-lee</strong> to confirm
      </>
    ),
    autoComplete: "off",
  },
  parameters: {
    docs: {
      description: {
        story:
          "`label` takes inline markup. The whole label is the field's accessible name (\"Type @sarah-lee to confirm\"). Keep it to text, `<strong>`, and `<code>`.",
      },
    },
  },
};

export const ErrorMessage: Story = {
  name: "Pattern — error message",
  args: {
    label: "Email",
    defaultValue: "sarah@",
    status: "error",
    message: "Enter an email address like name@example.com.",
  },
};

export const HintWithError: Story = {
  name: "Pattern — hint with an error",
  args: {
    label: "Phone",
    type: "tel",
    autoComplete: "tel",
    description: "Include the area code, like 512 555 0134.",
    defaultValue: "555 0134",
    status: "error",
    message: "Enter a phone number with its area code.",
  },
  parameters: {
    docs: {
      description: {
        story:
          "The hint sits between the label and the field and stays when a message shows, so the example is still there while someone fixes the error. Examples and formats go here, never in a placeholder.",
      },
    },
  },
};

export const WarningMessage: Story = {
  name: "Pattern — warning message",
  args: {
    label: "Username",
    defaultValue: "sarah_chen",
    status: "warning",
    message: "This username is already taken — try adding a number.",
  },
};

export const SuccessMessage: Story = {
  name: "Pattern — success message",
  args: {
    label: "Website",
    defaultValue: "https://sarahchen.dev",
    status: "success",
    message: "URL is valid and reachable.",
  },
};

export const StatusWithoutMessage: Story = {
  name: "Pattern — status without message",
  args: {
    label: "ZIP",
    defaultValue: "test",
    status: "error",
  },
};

export const Loading: Story = {
  name: "Pattern — loading",
  args: {
    label: "Username",
    defaultValue: "sarahc",
    loading: true,
  },
};

export const RequiredEndBadge: Story = {
  name: "Pattern — optional (end badge)",
  args: {
    label: "Your website",
    type: "url",
    autoComplete: "url",
    description: "So we can see what you have now.",
    endBadge: <Badge size="sm">Optional</Badge>,
  },
};

export const EndBadgeLongValue: Story = {
  name: "Pattern — end badge with a long value",
  args: {
    label: "Your website",
    type: "url",
    autoComplete: "url",
    defaultValue: "https://www.northwind-bakery-and-coffee-roasters.example/locations/east-austin",
    endBadge: <Badge size="sm">Optional</Badge>,
  },
  parameters: {
    docs: {
      description: {
        story: "The field keeps room for the badge, so a long value stops before it instead of running under it.",
      },
    },
  },
};

export const EndBadgeWithError: Story = {
  name: "Pattern — end badge + validation",
  args: {
    label: "Your website",
    type: "url",
    autoComplete: "url",
    defaultValue: "northwind",
    endBadge: <Badge size="sm">Optional</Badge>,
    status: "error",
    message: "Enter a website address like example.com.",
  },
};

export const EndBadgeWithStatusIcon: Story = {
  name: "Pattern — end badge + status icon",
  args: {
    label: "Your website",
    type: "url",
    autoComplete: "url",
    defaultValue: "https://northwind.example",
    endBadge: <Badge size="sm">Optional</Badge>,
    status: "success",
  },
  parameters: {
    docs: {
      description: {
        story: "The status icon comes first, then the badge.",
      },
    },
  },
};

export const Monospace: Story = {
  name: "Reference — monospace",
  args: {
    mono: true,
    readOnly: true,
    label: "API key",
    defaultValue: "wm_test_4f8c2a91e0b7",
  },
};

export const Disabled: Story = {
  name: "Pattern — disabled",
  args: {
    label: "Disabled field",
    disabled: true,
  },
};

export const ValidationMotion: Story = {
  name: "Pattern — validation motion",
  parameters: {
    docs: {
      description: {
        story:
          "Interactive morph — neutral pill → error status band springs in underneath. Blur with invalid email, or use **Show error** / **Clear validation**.",
      },
    },
  },
  render: () => <InputValidationMorphDemo />,
};

export const FieldWidths: Story = {
  name: "Pattern — field widths",
  parameters: {
    docs: {
      description: {
        story:
          "A field's width hints at the answer (Form layout L7). `width` in characters for fixed-length answers only: ZIP `5ch`, year `4ch`, phone `10ch`, a US state `2ch` on **Select**. Free-form answers (names, emails, addresses) stay full width. Short related fields share one row, like city, state and ZIP (L1).",
      },
    },
  },
  render: () => (
    <div className="flex w-full max-w-xl flex-col gap-6">
      <Input label="Street address" autoComplete="street-address" />
      <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-start gap-3">
        <Input label="City" autoComplete="address-level2" />
        <Select label="State" options={usStateOptions} width="2ch" name="state" autoComplete="address-level1" placeholder="—" />
        <Input label="ZIP code" width="5ch" inputMode="numeric" autoComplete="postal-code" />
      </div>
      <Input label="Phone" width="10ch" type="tel" autoComplete="tel-national" description="Include the area code." />
      <Input label="Year founded" width="4ch" inputMode="numeric" />
      <Input label="ZIP code" width="5ch" inputMode="numeric" defaultValue="7870" status="error" message="Enter a 5-digit ZIP code." />
    </div>
  ),
};
