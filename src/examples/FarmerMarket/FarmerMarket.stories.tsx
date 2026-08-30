import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MapPin } from "lucide-react";
import { Button } from "../../components/atoms/Button/Button";
import {
  Card,
  cardBodyTextClasses,
  cardTitleClasses,
} from "../../components/molecules/Card/Card";
import { Chip, ChipFilterGroup } from "../../components/molecules/Chip/Chip";
import { List } from "../../components/molecules/List/List";
import { cn } from "../../lib/cn";
import { typographyClass } from "../../lib/typography";
import { FindMorph } from "./FindMorph";

const meta = {
  title: "Examples/FarmerMarket",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
## Usage

Page-level composition for [farmermarket.us](https://farmermarket.us) — **Examples** tier (Storybook only, not exported).

Shipped atoms and molecules wired together the way FM consumes them:

| Region | Components |
|--------|------------|
| **Find** | \`FindMorph\` — \`layoutId\` spring morph ([Motion Create Button](https://motion.dev/examples/react-create-button)) |
| **Filters** | \`ChipFilterGroup\` + \`Chip\` |
| **Results** | \`List\` + \`List.Item\` — stacked rows, selectable |
| **Detail** | Flush \`Card\` inset in a panel + read-only \`Chip\` + \`Button\` |

## Tier note

This is an **Example**, not an organism. Organisms are reusable page *regions* with typed props (e.g. a shippable \`MarketList\`). Here we show copy-paste flow wiring — ADR-0005.
        `.trim(),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type Market = {
  id: string;
  name: string;
  street: string;
  miles: number;
  snap: boolean;
  openToday: boolean;
  hours: string;
};

const MARKETS: Market[] = [
  {
    id: "pdx-saturday",
    name: "Portland Farmers Market",
    street: "1831 SW Jefferson St",
    miles: 1.2,
    snap: true,
    openToday: true,
    hours: "Open Saturdays · 8:30am – 2pm",
  },
  {
    id: "beaverton",
    name: "Beaverton Farmers Market",
    street: "SW Hall Blvd & 3rd St",
    miles: 4.8,
    snap: true,
    openToday: false,
    hours: "Saturdays · 8:30am – 1:30pm",
  },
  {
    id: "hillsdale",
    name: "Hillsdale Farmers Market",
    street: "SW Capitol Hwy & Sunset Blvd",
    miles: 2.1,
    snap: false,
    openToday: true,
    hours: "Sundays · 10am – 2pm",
  },
];

function mutedText(className: string) {
  return cn(className, "text-muted");
}

function MarketDetailPanel({ market }: { market: Market }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-raised">
      <div className="border-b border-border-emphasized px-4 py-3">
        <p className={typographyClass("ui-label")}>Market detail</p>
      </div>
      <Card variant="surface" shape="flush">
        <Card.Header>
          <h2 className={cardTitleClasses}>{market.name}</h2>
          <p className={mutedText(cardBodyTextClasses)}>{market.street}</p>
        </Card.Header>
        <Card.Body className="flex flex-col gap-3">
          <p className={cardBodyTextClasses}>{market.hours}</p>
          <div className="flex flex-wrap gap-2">
            {market.snap ? (
              <Chip readOnly size="sm">
                SNAP
              </Chip>
            ) : null}
            <Chip readOnly size="sm" icon={<MapPin strokeWidth={2} />}>
              {market.miles} mi
            </Chip>
            {market.openToday ? (
              <Chip readOnly size="sm">
                Open today
              </Chip>
            ) : null}
          </div>
        </Card.Body>
        <Card.Footer>
          <Button role="ghost" size="sm">
            Share
          </Button>
          <Button role="primary" size="sm" icon={<MapPin strokeWidth={2} />}>
            Get directions
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
}

function FindHero({
  query,
  onQueryChange,
  expanded,
  onExpand,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  expanded: boolean;
  onExpand: () => void;
}) {
  return (
    <FindMorph
      expanded={expanded}
      onExpand={onExpand}
      query={query}
      onQueryChange={onQueryChange}
    />
  );
}

function FarmerMarketBrowse() {
  const [findExpanded, setFindExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<string[]>(["open-today"]);
  const [selectedId, setSelectedId] = useState(MARKETS[0].id);

  const selectedMarket = MARKETS.find((m) => m.id === selectedId) ?? MARKETS[0];

  const visibleMarkets = MARKETS.filter((market) => {
    if (filters.includes("snap") && !market.snap) return false;
    if (filters.includes("open-today") && !market.openToday) return false;
    if (query.trim().length > 0) {
      const q = query.toLowerCase();
      return (
        market.name.toLowerCase().includes(q) ||
        market.street.toLowerCase().includes(q) ||
        q.includes("972")
      );
    }
    return true;
  });

  return (
    <div className="min-h-[100dvh] bg-body">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 p-4 md:gap-6 md:p-6">
        <header className="flex flex-col gap-1">
          <h1 className={typographyClass("section-heading")}>Find a market</h1>
          <p className={mutedText(typographyClass("caption"))}>
            WhatMatters design system — FM browse specimen
          </p>
        </header>

        <div className="flex flex-col gap-3">
          <FindHero
            query={query}
            onQueryChange={setQuery}
            expanded={findExpanded}
            onExpand={() => setFindExpanded(true)}
          />

          <ChipFilterGroup
            aria-label="Market filters"
            value={filters}
            onValueChange={setFilters}
          >
            <Chip value="open-today">Open today</Chip>
            <Chip value="snap">SNAP</Chip>
            <Chip value="saturday">Saturday</Chip>
            <Chip value="dogs">Dogs welcome</Chip>
          </ChipFilterGroup>
        </div>

        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] md:items-start md:gap-6">
          <section
            aria-label="Market results"
            className="overflow-hidden rounded-lg border border-border bg-surface"
          >
            {visibleMarkets.length > 0 ? (
              <List variant="ghost" hasDividers>
                {visibleMarkets.map((market) => (
                  <List.Item
                    key={market.id}
                    layout="stacked"
                    primary={market.name}
                    secondary={market.street}
                    meta={`${market.miles} mi`}
                    trailing={
                      market.snap ? (
                        <Chip readOnly size="sm">
                          SNAP
                        </Chip>
                      ) : undefined
                    }
                    selected={market.id === selectedId}
                    onPress={() => setSelectedId(market.id)}
                  />
                ))}
              </List>
            ) : (
              <p className={cn(typographyClass("body"), "px-4 py-8 text-center text-muted")}>
                No markets match your filters.
              </p>
            )}
          </section>

          <aside aria-label="Selected market detail">
            <MarketDetailPanel market={selectedMarket} />
          </aside>
        </div>
      </div>
    </div>
  );
}

export const Browse: Story = {
  name: "Browse — list + detail",
  render: () => <FarmerMarketBrowse />,
};

export const FindPill: Story = {
  name: "Find — layoutId morph",
  parameters: {
    docs: {
      description: {
        story:
          "Shared `layoutId=\"fm-find-shell\"` morphs the primary **Find** pill into the **Search** shell — same pattern as [Motion Create Button](https://motion.dev/examples/react-create-button). Inner field fades in on a staggered spring.",
      },
    },
  },
  render: () => <FindPillSpecimen />,
};

function FindPillSpecimen() {
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState("");
  return (
    <div className="max-w-lg bg-body p-6">
      <FindHero
        query={query}
        onQueryChange={setQuery}
        expanded={expanded}
        onExpand={() => setExpanded(true)}
      />
    </div>
  );
}

export const DetailOnly: Story = {
  name: "Detail panel",
  render: () => (
    <div className="max-w-sm p-4">
      <MarketDetailPanel market={MARKETS[0]} />
    </div>
  ),
};
