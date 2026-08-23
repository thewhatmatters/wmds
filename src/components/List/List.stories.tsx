import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Badge } from "../Badge/Badge";
import { Card } from "../Card/Card";
import { StatusDot } from "../StatusDot/StatusDot";
import { List } from "./List";

const meta = {
  title: "Components/List",
  component: List,
  tags: ["autodocs"],
  args: {
    variant: "contained",
    children: "List rows",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Stacked row layout — **not** a semantic `<ul>`/`<ol>`. Use **`variant=\"contained\"`** inside **`Card padding=\"none\"`** for grouped dividers, or **`separated`** for raised row chips. " +
          "Compose **`List.ItemButton`** + **`List.ItemPanel`** for disclosure rows; **`List.ItemRow`** for static ledger lines.",
      },
    },
  },
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ContainedLedger: Story = {
  name: "Contained · static rows",
  render: () => (
    <Card variant="outlined" elevation="raised" padding="none" className="max-w-md">
      <List variant="contained">
        <List.Item>
          <List.ItemRow>
            <List.ItemLabel>Realized · 17 trips</List.ItemLabel>
            <List.ItemMeta className="font-medium text-success">+$12.37</List.ItemMeta>
          </List.ItemRow>
        </List.Item>
        <List.Item>
          <List.ItemRow>
            <List.ItemLabel>Open</List.ItemLabel>
            <List.ItemMeta className="font-medium text-success">+$2.38</List.ItemMeta>
          </List.ItemRow>
        </List.Item>
        <List.Item>
          <List.ItemRow>
            <List.ItemLabel>Cash</List.ItemLabel>
            <List.ItemMeta className="font-medium text-fg">$369.49</List.ItemMeta>
          </List.ItemRow>
        </List.Item>
        <List.Item>
          <List.ItemRow>
            <List.ItemLabel>
              Buying power · <span className="text-muted">$94.23 unsettled</span>
            </List.ItemLabel>
            <List.ItemMeta className="font-medium text-fg">$275.26</List.ItemMeta>
          </List.ItemRow>
        </List.Item>
      </List>
    </Card>
  ),
};

function ExpandableListDemo({ variant }: { variant: "contained" | "separated" }) {
  const [openKey, setOpenKey] = useState<string | null>("index");

  const rows = [
    {
      key: "verify",
      label: "Verified vendor records",
      meta: "12 suppliers",
      pill: <Badge variant="success">Completed</Badge>,
      details: [
        { label: "Matched tax and contact IDs", meta: "12/12" },
        { label: "Flagged stale records", meta: "0" },
      ],
    },
    {
      key: "index",
      label: "Build reorder task list",
      meta: "7 SKUs",
      pill: null,
      details: [
        { label: "Reading POS export", meta: "3 files" },
        { label: "Scoring stockout risk", meta: "68%" },
      ],
    },
    {
      key: "draft",
      label: "Draft supplier emails",
      meta: "2 messages",
      pill: <Badge variant="success">Completed</Badge>,
      details: [
        { label: "Cone supplier follow-up", meta: "draft" },
        { label: "Pistachio reorder note", meta: "draft" },
      ],
    },
  ] as const;

  const list = (
    <List variant={variant}>
      {rows.map((row) => {
        const open = openKey === row.key;
        return (
          <List.Item key={row.key}>
            <List.ItemButton
              aria-expanded={open}
              onClick={() => setOpenKey(open ? null : row.key)}
            >
              <List.ItemMedia>
                <StatusDot variant="success" decorative />
              </List.ItemMedia>
              <List.ItemLabel>{row.label}</List.ItemLabel>
              <List.ItemMeta>{row.meta}</List.ItemMeta>
              {row.pill ? <List.ItemTrailing>{row.pill}</List.ItemTrailing> : null}
              <List.ItemChevron open={open} />
            </List.ItemButton>
            <List.ItemPanel open={open}>
              <List.ItemDetailRail />
              <List.ItemDetailGroup>
                {row.details.map((detail) => (
                  <List.ItemDetail key={detail.label} label={detail.label} meta={detail.meta} />
                ))}
              </List.ItemDetailGroup>
            </List.ItemPanel>
          </List.Item>
        );
      })}
    </List>
  );

  if (variant === "contained") {
    return (
      <Card variant="outlined" elevation="raised" padding="none" className="max-w-md">
        {list}
      </Card>
    );
  }

  return <div className="max-w-md">{list}</div>;
}

export const ContainedExpandable: Story = {
  name: "Contained · expandable",
  render: () => <ExpandableListDemo variant="contained" />,
};

export const Separated: Story = {
  name: "Separated · expandable",
  render: () => <ExpandableListDemo variant="separated" />,
};
