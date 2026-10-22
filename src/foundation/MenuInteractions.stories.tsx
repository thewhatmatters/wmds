import { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sparkles } from "lucide-react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "../components/atoms/Button/Button";
import { Breadcrumb } from "../components/molecules/Breadcrumb/Breadcrumb";
import { Dropdown } from "../components/molecules/Dropdown/Dropdown";
import { measureDropdownMenuStyle } from "../components/molecules/Dropdown/dropdownMenuPosition";
import { useDropdownMenu } from "../components/molecules/Dropdown/useDropdownMenu";
import { Select } from "../components/molecules/Select/Select";
import { Dialog } from "../components/organisms/Dialog/Dialog";
import { MoreMenu } from "../components/organisms/MoreMenu/MoreMenu";
import { Sheet } from "../components/organisms/Sheet/Sheet";
import { SiteNav } from "../components/organisms/SiteNav/SiteNav";
import { Tab } from "../components/organisms/Tab/Tab";

/**
 * Browser interaction tests for **useDropdownMenu** (Dropdown folder), the behaviour every WMDS menu
 * shares, and for each menu through it: Select, MoreMenu, Breadcrumb, Tab More, SiteNav More.
 * Run via `npm run test:interactions`.
 */
const meta = {
  title: "Internal/Interactions/Menus",
  tags: ["test", "!dev", "!autodocs"],
  parameters: {
    docs: { disable: true },
    wmdsLayout: "padded",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const body = () => within(document.body);
const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date" },
];

/** A bare action menu on the shared behaviour: rows, one disabled, roving focus. */
function BareMenu({ onChoose }: { onChoose: (label: string) => void }) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const rows = [{ label: "Rename" }, { label: "Archive", disabled: true }, { label: "Delete" }, { label: "Duplicate" }];
  const menu = useDropdownMenu({
    rows,
    triggerRef,
    focus: "items",
    measure: () =>
      triggerRef.current == null ? null : measureDropdownMenuStyle(triggerRef.current, rows, { widthMode: "content" }),
  });
  return (
    <div {...menu.rootProps} className="inline-flex">
      <Button ref={triggerRef} role="secondary" aria-haspopup="menu" {...menu.triggerProps} onClick={menu.toggle}>
        Actions
      </Button>
      {menu.open && menu.menuStyle != null ? (
        <Dropdown.Menu {...menu.menuProps} role="menu" aria-label="Actions">
          {rows.map((row, index) => (
            <li key={row.label} role="presentation">
              <Dropdown.Item
                {...menu.rowProps(index)}
                role="menuitem"
                disabled={row.disabled}
                onClick={() => {
                  menu.close({ returnFocus: true });
                  onChoose(row.label);
                }}
              >
                {row.label}
              </Dropdown.Item>
            </li>
          ))}
        </Dropdown.Menu>
      ) : null}
    </div>
  );
}

function ChoiceLog() {
  const [chosen, setChosen] = useState("none");
  return (
    <div className="flex flex-col items-start gap-4">
      <BareMenu onChoose={setChosen} />
      <p data-testid="chosen">{chosen}</p>
      <a href="#after">After</a>
    </div>
  );
}

export const ModuleKeyboard: Story = {
  name: "module — arrows skip disabled rows, Home/End, type-ahead, Space chooses",
  render: () => <ChoiceLog />,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Actions" });
    trigger.focus();
    await userEvent.keyboard("{ArrowDown}");
    const menu = await waitFor(() => canvas.getByRole("menu", { name: "Actions" }));
    await waitFor(() => expect(within(menu).getByRole("menuitem", { name: "Rename" })).toHaveFocus());

    await userEvent.keyboard("{ArrowDown}");
    expect(within(menu).getByRole("menuitem", { name: "Delete" })).toHaveFocus();
    await userEvent.keyboard("{End}");
    expect(within(menu).getByRole("menuitem", { name: "Duplicate" })).toHaveFocus();
    await userEvent.keyboard("{Home}");
    expect(within(menu).getByRole("menuitem", { name: "Rename" })).toHaveFocus();
    await userEvent.keyboard("{ArrowUp}");
    expect(within(menu).getByRole("menuitem", { name: "Duplicate" })).toHaveFocus();
    await userEvent.keyboard("de");
    expect(within(menu).getByRole("menuitem", { name: "Delete" })).toHaveFocus();

    await userEvent.keyboard(" ");
    await waitFor(() => expect(canvas.getByTestId("chosen")).toHaveTextContent("Delete"));
    expect(canvas.queryByRole("menu")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  },
};

export const ModuleDismissal: Story = {
  name: "module — Escape returns focus; Tab and an outside press close",
  render: () => <ChoiceLog />,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Actions" });
    await userEvent.click(trigger);
    await waitFor(() => expect(canvas.getByRole("menuitem", { name: "Rename" })).toHaveFocus());
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await userEvent.keyboard("{Escape}");
    expect(canvas.queryByRole("menu")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(trigger);
    await waitFor(() => expect(canvas.getByRole("menuitem", { name: "Rename" })).toHaveFocus());
    await userEvent.tab();
    await waitFor(() => expect(canvas.queryByRole("menu")).not.toBeInTheDocument());

    await userEvent.click(trigger);
    await waitFor(() => expect(canvas.getByRole("menu")).toBeInTheDocument());
    await userEvent.click(canvas.getByTestId("chosen"));
    await waitFor(() => expect(canvas.queryByRole("menu")).not.toBeInTheDocument());
    expect(canvas.getByTestId("chosen")).toHaveTextContent("none");
  },
};

function FruitSelect() {
  const [value, setValue] = useState("banana");
  return (
    <div className="flex w-64 flex-col gap-4">
      <Select label="Fruit" options={fruits} value={value} onValueChange={setValue} />
      <a href="#after-select">After select</a>
    </div>
  );
}

export const SelectCombobox: Story = {
  name: "Select — combobox names the active option; Home/End, type-ahead, Tab closes",
  render: () => <FruitSelect />,
  play: async ({ canvas }) => {
    const combobox = canvas.getByRole("combobox", { name: "Fruit" });
    expect(combobox).toHaveTextContent("Banana");
    combobox.focus();

    await userEvent.keyboard("{ArrowDown}");
    const listbox = await waitFor(() => canvas.getByRole("listbox"));
    const active = () => document.getElementById(combobox.getAttribute("aria-activedescendant") ?? "");
    expect(combobox).toHaveAttribute("aria-expanded", "true");
    expect(active()).toHaveTextContent("Banana");
    expect(listbox).toContainElement(active());
    expect(combobox).toHaveFocus();

    await userEvent.keyboard("{End}");
    expect(active()).toHaveTextContent("Date");
    await userEvent.keyboard("{Home}");
    expect(active()).toHaveTextContent("Apple");
    await userEvent.keyboard("bl");
    expect(active()).toHaveTextContent("Blueberry");
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(combobox).toHaveTextContent("Blueberry"));
    expect(canvas.queryByRole("listbox")).not.toBeInTheDocument();
    expect(combobox).not.toHaveAttribute("aria-activedescendant");

    // Type-ahead on the closed trigger opens on the match.
    await userEvent.keyboard("c");
    await waitFor(() => expect(active()).toHaveTextContent("Cherry"));

    await userEvent.tab();
    await waitFor(() => expect(canvas.queryByRole("listbox")).not.toBeInTheDocument());
    expect(canvas.getByRole("link", { name: "After select" })).toHaveFocus();
    expect(combobox).toHaveTextContent("Blueberry");
  },
};

function DialogWithSelect() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("apple");
  return (
    <>
      <Button role="primary" onClick={() => setOpen(true)}>
        Open settings
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Content title="Settings" description="Pick a fruit.">
          <Select label="Fruit" options={fruits} value={value} onValueChange={setValue} />
          <MoreMenu aria-label="More settings" items={[{ id: "reset", label: "Reset" }]} />
        </Dialog.Content>
      </Dialog>
    </>
  );
}

export const MenuInsideDialog: Story = {
  name: "inside a Dialog — Escape closes the menu only, then the Dialog",
  render: () => <DialogWithSelect />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open settings" }));
    const dialog = await waitFor(() => body().getByRole("dialog", { name: "Settings" }));

    const combobox = within(dialog).getByRole("combobox", { name: "Fruit" });
    await userEvent.click(combobox);
    await waitFor(() => expect(within(dialog).getByRole("listbox")).toBeInTheDocument());
    await userEvent.keyboard("{Escape}");
    expect(within(dialog).queryByRole("listbox")).not.toBeInTheDocument();
    expect(body().getByRole("dialog", { name: "Settings" })).toBeInTheDocument();
    expect(combobox).toHaveFocus();

    const more = within(dialog).getByRole("button", { name: "More settings" });
    await userEvent.click(more);
    await waitFor(() => expect(within(dialog).getByRole("menuitem", { name: "Reset" })).toHaveFocus());
    await userEvent.keyboard("{Escape}");
    expect(within(dialog).queryByRole("menu")).not.toBeInTheDocument();
    expect(body().getByRole("dialog", { name: "Settings" })).toBeInTheDocument();
    expect(more).toHaveFocus();

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body().queryByRole("dialog", { name: "Settings" })).not.toBeInTheDocument());
  },
};

function SheetWithBreadcrumb() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button role="primary" onClick={() => setOpen(true)}>
        Open path
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <Sheet.Content side="end" title="Path" description="Where this lives.">
          <Breadcrumb
            items={[
              { label: "Home", href: "#home" },
              { label: "Work", href: "#work" },
              { label: "Northwind", href: "#northwind" },
              { label: "Design", href: "#design" },
              { label: "Components", href: "#components" },
              { label: "Breadcrumb" },
            ]}
          />
        </Sheet.Content>
      </Sheet>
    </>
  );
}

export const BreadcrumbInsideSheet: Story = {
  name: "Breadcrumb inside a Sheet — Escape closes the menu only; Tab closes it",
  render: () => <SheetWithBreadcrumb />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open path" }));
    const sheet = await waitFor(() => body().getByRole("dialog", { name: "Path" }));
    const more = within(sheet).getByRole("button", { name: /show 3 more pages/i });

    more.focus();
    await userEvent.keyboard("{ArrowDown}");
    await waitFor(() => expect(within(sheet).getByRole("link", { name: "Work" })).toHaveFocus());
    await userEvent.keyboard("{Escape}");
    expect(within(sheet).queryByRole("link", { name: "Work" })).not.toBeInTheDocument();
    expect(body().getByRole("dialog", { name: "Path" })).toBeInTheDocument();
    expect(more).toHaveFocus();

    await userEvent.keyboard("{ArrowDown}");
    await waitFor(() => expect(within(sheet).getByRole("link", { name: "Work" })).toHaveFocus());
    await userEvent.tab();
    await waitFor(() => expect(within(sheet).queryByRole("link", { name: "Work" })).not.toBeInTheDocument());

    // With the menu closed, Escape reaches the Sheet.
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body().queryByRole("dialog", { name: "Path" })).not.toBeInTheDocument());
  },
};

function NarrowTabs() {
  const [value, setValue] = useState("profile");
  return (
    <div className="w-[360px]">
      <Tab.Group aria-label="Settings pages" value={value} onValueChange={setValue}>
        <Tab value="profile">Profile</Tab>
        <Tab value="notifications">Notifications</Tab>
        <Tab value="security">Security</Tab>
        <Tab value="general">General</Tab>
        <Tab value="members" count={8}>
          Members
        </Tab>
        <Tab value="billing">Billing</Tab>
        <Tab value="connected">Connected apps</Tab>
        <Tab value="api">API keys</Tab>
      </Tab.Group>
    </div>
  );
}

export const TabMore: Story = {
  name: "Tab More — roving focus, type-ahead, choosing focuses the promoted tab",
  render: () => <NarrowTabs />,
  play: async ({ canvas }) => {
    const more = await waitFor(() => canvas.getByRole("button", { name: "More" }));
    more.focus();
    await userEvent.keyboard("{ArrowDown}");
    const menu = await waitFor(() => canvas.getByRole("menu", { name: "Settings pages overflow" }));
    const items = within(menu).getAllByRole("menuitem");
    await waitFor(() => expect(items[0]).toHaveFocus());

    await userEvent.keyboard("a");
    expect(within(menu).getByRole("menuitem", { name: "API keys" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(canvas.getByRole("tab", { name: "API keys" })).toHaveFocus());
    expect(canvas.getByRole("tab", { name: "API keys" })).toHaveAttribute("aria-selected", "true");
    expect(canvas.queryByRole("menu")).not.toBeInTheDocument();
  },
};

export const SiteNavMore: Story = {
  name: "SiteNav More — rows are links; Escape returns focus to More",
  render: () => (
    <div className="w-[420px]">
      <SiteNav
        placement="inline"
        state="expanded"
        start={<SiteNav.Brand href="#home" aria-label="WhatMatters" icon={<Sparkles />} />}
        middle={
          <SiteNav.Links>
            <SiteNav.Link href="#product" current>
              Product
            </SiteNav.Link>
            <SiteNav.Link href="#pricing">Pricing</SiteNav.Link>
            <SiteNav.Link href="#customers">Customers</SiteNav.Link>
            <SiteNav.Link href="#changelog">Changelog</SiteNav.Link>
            <SiteNav.Link href="#careers">Careers</SiteNav.Link>
            <SiteNav.Link href="#documentation">Documentation</SiteNav.Link>
          </SiteNav.Links>
        }
      />
    </div>
  ),
  play: async ({ canvas }) => {
    const more = await waitFor(() => canvas.getByRole("button", { name: "More" }));
    await userEvent.click(more);
    const menu = await waitFor(() => body().getByRole("menu", { name: "Primary overflow" }));
    const first = within(menu).getAllByRole("menuitem")[0];
    await waitFor(() => expect(first).toHaveFocus());
    expect(first.tagName).toBe("A");
    expect(first).toHaveAttribute("href");

    await userEvent.keyboard("{Escape}");
    expect(body().queryByRole("menu", { name: "Primary overflow" })).not.toBeInTheDocument();
    expect(more).toHaveFocus();
  },
};
