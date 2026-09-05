import type { Meta, StoryObj } from "@storybook/react-vite";
import { MapPin } from "lucide-react";
import { Input } from "../components/atoms/Input/Input";
import { inputSizes } from "../components/atoms/Input/inputShellStyles";
import { Search } from "../components/molecules/Search/Search";
import { Select } from "../components/molecules/Select/Select";
import { cn } from "../lib/cn";
import { typographyClass } from "../lib/typography";

const labelClasses = typographyClass("ui-label");
const bodyClasses = typographyClass("body");
const captionClasses = typographyClass("caption");

const periodOptions = [
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
  { value: "quarter", label: "This quarter" },
];

const meta = {
  title: "Foundation/Form controls",
  tags: ["autodocs"],
  parameters: {
    wmdsLayout: "centered",
    docs: {
      description: {
        component: `
## Form controls (ADR-0006)

WMDS ships **discrete components** — not a monolithic \`TextField\` or \`Input type="select"\`. Atoms own text entry; molecules own selection, search rows, and shared menu chrome.

### Public API

| Export | Tier | Role | Storybook |
|--------|------|------|-----------|
| **Input** | Atom | Single-line text — pill shell, optional label/status | **Atoms/Input** |
| **TextArea** | Atom | Multiline — same optional chrome as Input | *(planned)* |
| **Select** | Molecule | Pill trigger + floating listbox | **Molecules/Select** |
| **Search** | Molecule | Hero search — inset button in one shell | **Molecules/Search** |
| **Dropdown** | Molecule | Shared menu panel + three-slot rows | **Molecules/Dropdown** |
| **Field** | Molecule | Label/layout wrapper — never required | *(planned)* |

### Shared internals (not exported)

- **\`inputShellStyles.ts\`** — border, radius, focus ring, sizes (\`sm\` | \`md\` | \`lg\`), disabled, validation
- **Select** reuses Input shell tokens; **Search** uses a compound pill with inset **Button**
- **Dropdown** owns floating menu + row anatomy; **Select** composes it for listbox options

### Labeling — ShadCN-style optional chrome

Bare controls are valid. Pass \`label\` / \`description\` on **Input** or **Select** for vertical stacks — or wrap with **Field** when orientation or multi-control layout is clearer (horizontal rows, one label for several controls).

When \`label\` is omitted, **\`aria-label\` is required** (dev warn in Storybook).

### When to use which

| Need | Use |
|------|-----|
| ZIP, email, plain text | **Input** |
| Multiline copy | **TextArea** *(planned)* |
| Pick one of N discrete values | **Select** |
| ZIP/city + "Use my location" / GO | **Search** |
| Action menu, context menu, multi-select rows | **Dropdown** *(Select uses it today)* |
| Label beside control, multi-control row | **Field** *(planned)* |

**Anti-patterns:** \`Input type="select"\`, requiring **Field** for every labeled input, raw utility styling in apps — extend WMDS patterns instead.

See **Foundation → Cluster** for \`sm\` / \`md\` / \`lg\` heights in header rows.
        `.trim(),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ComponentMap: Story = {
  name: "Reference — component map",
  render: () => (
    <div className="mx-auto w-full max-w-2xl px-8 py-6">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-border">
            <th className={cn(captionClasses, "py-2 pr-4 font-medium")}>Export</th>
            <th className={cn(captionClasses, "py-2 pr-4 font-medium")}>Tier</th>
            <th className={cn(captionClasses, "py-2 pr-4 font-medium")}>Shell</th>
            <th className={cn(captionClasses, "py-2 font-medium")}>Menu / affordances</th>
          </tr>
        </thead>
        <tbody className={bodyClasses}>
          <tr className="border-b border-border">
            <td className="py-2 pr-4 font-medium">Input</td>
            <td className="py-2 pr-4 text-muted">Atom</td>
            <td className="py-2 pr-4 text-muted">Pill, solo focus ring</td>
            <td className="py-2 text-muted">Leading icon, trailing status / badge / loading</td>
          </tr>
          <tr className="border-b border-border">
            <td className="py-2 pr-4 font-medium">Select</td>
            <td className="py-2 pr-4 text-muted">Molecule</td>
            <td className="py-2 pr-4 text-muted">Input-matched pill, inset focus ring</td>
            <td className="py-2 text-muted">Dropdown.Menu — fixed below trigger</td>
          </tr>
          <tr className="border-b border-border">
            <td className="py-2 pr-4 font-medium">Search</td>
            <td className="py-2 pr-4 text-muted">Molecule</td>
            <td className="py-2 pr-4 text-muted">Compound pill + inset track</td>
            <td className="py-2 text-muted">Embedded Button action</td>
          </tr>
          <tr className="border-b border-border">
            <td className="py-2 pr-4 font-medium">Dropdown</td>
            <td className="py-2 pr-4 text-muted">Molecule</td>
            <td className="py-2 pr-4 text-muted">Floating panel (\`p-0.5\` inset)</td>
            <td className="py-2 text-muted">Item rows — start | label | end</td>
          </tr>
          <tr>
            <td className="py-2 pr-4 font-medium text-muted">TextArea</td>
            <td className="py-2 pr-4 text-muted">Atom</td>
            <td className="py-2 pr-4 text-muted">Planned — Input shell</td>
            <td className="py-2 text-muted">—</td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};

export const SharedShell: Story = {
  name: "Specimen — shared pill shell",
  parameters: {
    docs: {
      description: {
        story:
          "Input and Select share `inputShellStyles` — same border, shadow, radius, and size scale. Select uses an inset focus ring on the shell (Search pattern).",
      },
    },
  },
  render: () => (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-6 px-8 py-6">
      <div className="flex flex-col gap-1.5">
        <span className={labelClasses}>Input — bare</span>
        <Input placeholder="Enter text" aria-label="Example text" />
      </div>
      <div className="flex flex-col gap-1.5">
        <span className={labelClasses}>Select — bare</span>
        <Select
          aria-label="Period"
          placeholder="Select period"
          defaultValue="week"
          options={periodOptions}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <span className={labelClasses}>Search — compound shell</span>
        <Search
          placeholder="ZIP or city"
          aria-label="Location"
          actionLabel="Use my location"
          icon={<MapPin strokeWidth={2} />}
        />
      </div>
    </div>
  ),
};

export const SizeScale: Story = {
  name: "Reference — size scale",
  parameters: {
    docs: {
      description: {
        story: "Input and Select both expose `sm` | `md` | `lg` from `inputShellStyles`. Pair `sm` with **Foundation → Cluster** in Card headers.",
      },
    },
  },
  render: () => (
    <div className="mx-auto w-full max-w-sm px-8 py-6">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-border">
            <th className={cn(captionClasses, "py-2 pr-4 font-medium")}>Size</th>
            <th className={cn(captionClasses, "py-2 pr-4 font-medium")}>Input</th>
            <th className={cn(captionClasses, "py-2 font-medium")}>Select</th>
          </tr>
        </thead>
        <tbody>
          {inputSizes.map((size) => (
            <tr key={size} className="border-b border-border last:border-b-0">
              <td className={cn(captionClasses, "py-3 pr-4 align-top font-mono")}>{size}</td>
              <td className="py-3 pr-4 align-top">
                <Input size={size} placeholder="Text" aria-label={`Input ${size}`} />
              </td>
              <td className="py-3 align-top">
                <Select
                  size={size}
                  aria-label={`Select ${size}`}
                  defaultValue="week"
                  options={periodOptions}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

export const OptionalLabel: Story = {
  name: "Specimen — optional label stack",
  parameters: {
    docs: {
      description: {
        story:
          "Vertical label + description on the control itself — no Field wrapper required. Same props on Input and Select.",
      },
    },
  },
  render: () => (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-6 px-8 py-6">
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        description="We'll never share this."
      />
      <Select
        label="Reporting period"
        description="Filters the KPI card below."
        defaultValue="month"
        options={periodOptions}
      />
    </div>
  ),
};
