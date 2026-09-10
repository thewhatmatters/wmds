import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { GridOverlay } from "../../../lib/GridOverlay";
import { storyCopySource, storyMetaDocsDefaults } from "../../../lib/storyCopySource";
import {
  DisplayControls,
  displayControlThemeModes,
  type DisplayControlThemeMode,
} from "./DisplayControls";

const meta = {
  title: "Components/Layout/DisplayControls",
  component: DisplayControls,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  argTypes: {
    theme: { control: "select", options: [...displayControlThemeModes] },
    gridVisible: { control: "boolean" },
    keyboardShortcuts: { control: "boolean" },
  },
  parameters: {
    wmdsLayout: "centered",
    docs: {
      description: {
        component: `
## Usage

**DisplayControls** is a compact page-utility cluster for toggling WMDS grid guides and cycling the app theme. It composes **Button** + **Kbd** and exposes controlled state so the consuming app owns persistence.

Press **G** to toggle the grid and **T** to cycle Auto → Light → Dark. When paired with **GridOverlay**, set \`keyboardShortcut={false}\` on the overlay so only the cluster owns the grid shortcut.

## Anatomy

\`\`\`
DisplayControls (group)
├── Button secondary — Kbd G + Grid
└── Button secondary — Kbd T + current theme
\`\`\`

## Best practices

- **Do** place the cluster at one stable viewport edge.
- **Do** keep grid and theme state controlled by the app.
- **Do** disable **GridOverlay**'s own shortcut when this cluster owns keyboard input.
- **Don't** show it when grid guides are not useful to the audience.
- **Don't** add unrelated preferences to this compact cluster.
        `.trim(),
      },
    },
  },
  args: {
    gridVisible: false,
    theme: "auto",
    keyboardShortcuts: true,
    onGridVisibleChange: () => undefined,
    onThemeChange: () => undefined,
  },
} satisfies Meta<typeof DisplayControls>;

export default meta;
type Story = StoryObj<typeof meta>;

function PageDisplayControlsDemo() {
  const [gridVisible, setGridVisible] = useState(false);
  const [theme, setTheme] = useState<DisplayControlThemeMode>("auto");

  return (
    <div
      data-theme={theme === "auto" ? undefined : theme}
      className="relative h-[420px] w-[680px] max-w-full overflow-hidden rounded-2xl border border-border bg-body"
    >
      <div className="grid-page h-full">
        <GridOverlay
          visible={gridVisible}
          onVisibleChange={setGridVisible}
          keyboardShortcut={false}
        />
        <div className="band">
          <div className="col-span-full min-h-52 rounded-xl bg-surface shadow-raised" />
        </div>
      </div>

      <DisplayControls
        className="absolute bottom-4 right-4"
        gridVisible={gridVisible}
        onGridVisibleChange={setGridVisible}
        theme={theme}
        onThemeChange={setTheme}
      />
    </div>
  );
}

export const PageUtilities: Story = {
  name: "Pattern — page display controls",
  render: () => <PageDisplayControlsDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Bottom-end placement keeps the cluster available without making it part of page content. The app applies and persists the emitted theme mode.",
      },
    },
    ...storyCopySource(`
import { useState } from "react";
import {
  DisplayControls,
  GridOverlay,
  type DisplayControlThemeMode,
} from "@whatmatters/wmds";

export function Page() {
  const [gridVisible, setGridVisible] = useState(false);
  const [theme, setTheme] = useState<DisplayControlThemeMode>("auto");

  return (
    <div data-theme={theme === "auto" ? undefined : theme} className="relative">
      <main className="grid-page">
        <GridOverlay
          visible={gridVisible}
          onVisibleChange={setGridVisible}
          keyboardShortcut={false}
        />
        <div className="band">{/* page content */}</div>
      </main>

      <DisplayControls
        className="fixed bottom-4 right-4"
        gridVisible={gridVisible}
        onGridVisibleChange={setGridVisible}
        theme={theme}
        onThemeChange={setTheme}
      />
    </div>
  );
}
`),
  },
};
