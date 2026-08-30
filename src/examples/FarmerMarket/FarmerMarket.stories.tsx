import { useState, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MapPin, X } from "lucide-react";
import { IconButton } from "../../components/atoms/IconButton/IconButton";
import { Input } from "../../components/atoms/Input/Input";
import { Chip, ChipFilterGroup } from "../../components/molecules/Chip/Chip";
import { ContentRail } from "../../components/molecules/ContentRail/ContentRail";
import { List } from "../../components/molecules/List/List";
import { cn } from "../../lib/cn";
import { typographyClass } from "../../lib/typography";
import { lockedViewportStory } from "../../lib/viewports";
import { FindMorph } from "./FindMorph";
import { MarketDetailCard, type FarmerMarketDetail } from "./MarketDetailCard";

const meta = {
  title: "Examples/FarmerMarket",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      story: {
        inline: false,
      },
      description: {
        component: `
## Usage

Page-level composition for [farmermarket.us](https://farmermarket.us) — **Examples** tier (Storybook only, not exported).

| Region | Components |
|--------|------------|
| **Page chrome** | App-owned layout (header, nav) — plain viewport flex in the FM app |
| **Map** | Main canvas (placeholder) — flex-1 beside content rail on \`md:\`+ |
| **Map overlay** | \`MarketDetailCard\` — mount in map library overlay slot (engineers own placement) |
| **List rail** | \`ContentRail width="sm"\` — pill \`Input\` (ZIP) + \`ChipFilterGroup\` header, \`List\` body |
| **Rows** | \`List.Item\` stacked — name, street, miles, optional SNAP \`Chip\` |

\`ContentRail\` is the WMDS primitive for map + list. App nav (bottom bar, sidebar) stays in the consuming app.

## Tier note

Example wiring only — ADR-0005. A shippable \`MarketBrowse\` organism may wrap this later.
        `.trim(),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type Market = FarmerMarketDetail & {
  id: string;
  hours: string;
};

const MARKETS: Market[] = [
  {
    id: "mueller",
    name: "Texas Farmers' Market at Mueller",
    street: "2006 Philomena St.",
    cityLine: "Austin, TX 78723",
    miles: 0.1,
    snap: true,
    openToday: true,
    dogsAllowed: true,
    hours: "Sundays · 10am – 2pm",
  },
  {
    id: "sfc-downtown",
    name: "SFC Farmers' Market Downtown",
    street: "422 Guadalupe St",
    cityLine: "Austin, TX 78701",
    miles: 2.4,
    snap: true,
    openToday: true,
    dogsAllowed: false,
    hours: "Saturdays · 9am – 1pm",
  },
  {
    id: "barton-creek",
    name: "Barton Creek Farmers Market",
    street: "2901 S Capital of Texas Hwy",
    cityLine: "Austin, TX 78746",
    miles: 5.1,
    snap: false,
    openToday: true,
    dogsAllowed: true,
    hours: "Saturdays · 9am – 1pm",
  },
  {
    id: "pdx-saturday",
    name: "Portland Farmers Market",
    street: "1831 SW Jefferson St",
    cityLine: "Portland, OR 97201",
    miles: 1.2,
    snap: true,
    openToday: true,
    dogsAllowed: false,
    hours: "Saturdays · 8:30am – 2pm",
  },
];

function MapCanvas({
  className,
  overlay,
}: {
  className?: string;
  overlay?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative flex min-h-[40vh] shrink-0 flex-col bg-accent-muted md:min-h-0 md:min-w-0 md:flex-1",
        className,
      )}
      aria-label="Map"
    >
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="size-48 rounded-full border border-border-emphasized md:size-72" />
      </div>
      {overlay ? (
        <div className="pointer-events-none absolute top-0 right-0 z-10 flex justify-end p-4">
          <div className="pointer-events-auto w-max max-w-full">{overlay}</div>
        </div>
      ) : (
        <p className="m-auto px-6 text-center type-supporting text-muted">
          Map canvas — production embeds the FM map here
        </p>
      )}
    </div>
  );
}

function MarketListRail({
  query,
  onQueryChange,
  filters,
  onFiltersChange,
  selectedId,
  onSelect,
  markets,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  filters: string[];
  onFiltersChange: (value: string[]) => void;
  selectedId: string;
  onSelect: (id: string) => void;
  markets: Market[];
}) {
  return (
    <ContentRail
      aria-label="Market results"
      position="end"
      width="sm"
      header={
        <>
          <Input
            shape="pill"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="ZIP or city"
            aria-label="Location"
            icon={<MapPin strokeWidth={2} />}
            endBadge={
              query.length > 0 ? (
                <IconButton
                  icon={<X strokeWidth={2} />}
                  aria-label="Clear location"
                  role="ghost"
                  size="sm"
                  onClick={() => onQueryChange("")}
                />
              ) : undefined
            }
          />
          <ChipFilterGroup
            aria-label="Market filters"
            value={filters}
            onValueChange={onFiltersChange}
          >
            <Chip value="snap">SNAP</Chip>
            <Chip value="open-today">Open today</Chip>
          </ChipFilterGroup>
        </>
      }
    >
      {markets.length > 0 ? (
        <List variant="ghost" hasDividers>
          {markets.map((market) => (
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
              onPress={() => onSelect(market.id)}
            />
          ))}
        </List>
      ) : (
        <p className={cn(typographyClass("body"), "px-4 py-8 text-center text-muted")}>
          No markets match your filters.
        </p>
      )}
    </ContentRail>
  );
}

function FarmerMarketBrowse() {
  const [query, setQuery] = useState("78723");
  const [filters, setFilters] = useState<string[]>(["open-today"]);
  const [selectedId, setSelectedId] = useState(MARKETS[0].id);

  const selectedMarket = MARKETS.find((m) => m.id === selectedId) ?? MARKETS[0];

  const logoMark = (
    <span
      className="inline-flex h-8 min-w-[4.5rem] items-center justify-center rounded border border-border bg-surface px-3 type-supporting font-medium text-muted"
      aria-hidden
    >
      LOGO
    </span>
  );

  const visibleMarkets = MARKETS.filter((market) => {
    if (filters.includes("snap") && !market.snap) return false;
    if (filters.includes("open-today") && !market.openToday) return false;
    if (query.trim().length > 0) {
      const q = query.toLowerCase();
      return (
        market.name.toLowerCase().includes(q) ||
        market.street.toLowerCase().includes(q) ||
        q.includes("787") ||
        q.includes("972")
      );
    }
    return true;
  });

  return (
    <div className="flex h-[100dvh] w-full flex-col bg-body font-sans text-fg">
      <header className="sticky top-0 z-20 shrink-0 border-b border-border bg-surface px-4 py-3 md:px-6">
        {logoMark}
      </header>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
        <MapCanvas
          overlay={
            selectedId ? (
              <MarketDetailCard
                market={selectedMarket}
                onClose={() => setSelectedId("")}
              />
            ) : undefined
          }
        />
        <MarketListRail
          query={query}
          onQueryChange={setQuery}
          filters={filters}
          onFiltersChange={setFilters}
          selectedId={selectedId}
          onSelect={setSelectedId}
          markets={visibleMarkets}
        />
      </div>
    </div>
  );
}

export const DetailOnly: Story = {
  name: "Detail — map overlay content",
  parameters: {
    docs: {
      description: {
        story:
          "Canonical **map overlay** content — engineers mount `MarketDetailCard` in the map library overlay slot. Pattern matches **Molecules/TaskRows → Pattern — FM market detail**.",
      },
    },
  },
  render: () => (
    <div className="w-max bg-body p-4">
      <MarketDetailCard market={MARKETS[0]} />
    </div>
  ),
};

const desktopLocked = lockedViewportStory("desktop");

export const Browse: Story = {
  name: "Browse — map + list rail",
  ...desktopLocked,
  parameters: {
    ...desktopLocked.parameters,
    docs: {
      ...desktopLocked.parameters.docs,
      description: {
        story:
          "FM browse — map overlay slot shows **MarketDetailCard** when a list row is selected; **ContentRail** for ZIP search, filters, and **List** rows.",
      },
    },
  },
  render: () => <FarmerMarketBrowse />,
};

const mobileLocked = lockedViewportStory("mobile");

export const BrowseMobile: Story = {
  name: "Browse — mobile",
  ...mobileLocked,
  parameters: {
    ...mobileLocked.parameters,
    docs: {
      ...mobileLocked.parameters.docs,
      description: {
        story:
          "Mobile — **ContentRail** stacks above the map. App-owned bottom nav (if any) wraps this layout in the FM app.",
      },
    },
  },
  render: () => <FarmerMarketBrowse />,
};

export const FindPill: Story = {
  name: "Find — layoutId morph",
  parameters: {
    docs: {
      description: {
        story:
          "Find grows into ZIP + Use my location — [Create Button](https://motion.dev/examples/react-create-button) shared-shell `layoutId`, clip-path reveal. No inner fade. Find does not smear. Hover rolls the label.",
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
      <FindMorph
        expanded={expanded}
        onExpand={() => setExpanded(true)}
        query={query}
        onQueryChange={setQuery}
      />
    </div>
  );
}
