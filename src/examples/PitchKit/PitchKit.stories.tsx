import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  storyCopySource,
  storyMetaDocsDefaults,
} from "../../lib/storyCopySource";
import {
  PitchKitInsightsExample,
  type PitchKitDataState,
} from "./PitchKitExample";

const dataStates = ["resolved", "unavailable"] as const satisfies readonly PitchKitDataState[];

const meta = {
  title: "Examples/PitchKit",
  component: PitchKitInsightsExample,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  argTypes: {
    dataState: {
      control: "select",
      options: dataStates,
    },
  },
  args: {
    dataState: "resolved",
  },
  parameters: {
    wmdsLayout: "fullscreen",
    docs: {
      description: {
        component: `
## Usage

Authenticated PitchKit **Insights** at a frozen 1140px grid maximum. The single top-level **SegmentedControl** switches between Insights and the future public PitchKit view; the second destination is intentionally a placeholder in this pass.

The dashboard answers four questions in order:

1. **Scale and response** — **Stat** tiles on the page subgrid for followers, labeled engagement rate, typical reach, and saves.
2. **Consistency** — one 30-day **Chart.Cartesian** comparing typical and daily reach, including visible spikes.
3. **Audience fit** — **Chart.RankedBars** for Graph-supplied country, city, age, and gender percentages.
4. **Proof** — six recent **Card** items with secondary **Tab** ranking by reach, engagement (likes + comments), or saves, plus persistent **MoreMenu** hide/swap controls.

## Data contract

- Engagement rate is exactly **(likes + comments) ÷ followers**.
- Missing values render as em dashes, never zero.
- Optional chart, audience, and post sections are omitted when Graph did not provide them.
- Creator-entered contact and past-brand content belongs on the public PitchKit, not Insights.
- No rates, Stories, logo scraping, marquees, donuts, or second Instagram connection path.

## Component map

- Page layout — \`grid-page\`, \`band\`, \`--grid-max:1140px\`, \`--grid-column-gap:8px\`
- Primary navigation — **SegmentedControl**
- Page and card chrome — **PageHeader**, **Card**, **Badge**, **Avatar**, **Button**
- Metrics and charts — **Stat**, **Chart.Cartesian**, **Chart.Legend**, **Chart.RankedBars**
- Proof ranking — **Tab.Group** + **Tab**; one selected metric reorders the same supplied posts
- Post management — **MoreMenu** with **ButtonIcon**; **AlertDialog** confirms hiding a post
- Outcome feedback — **Toaster** + **toast**; Undo restores the hidden post
- Storybook development only — **ExampleGridControls** + **GridOverlay**

## Best practices

- **Do** preserve the visual difference between typical performance and a spike.
- **Do** keep all edit controls in owner-only Insights.
- **Do** confirm post visibility changes with **AlertDialog** before mutating the ranked set.
- **Do** pair the completed hide mutation with an actionable Undo toast.
- **Do** use **Tab** for proof ranking because the page already uses one primary **SegmentedControl**.
- **Do** freeze approved grid values into implementation code.
- **Don't** copy **ExampleGridControls** into PitchKit production UI.
- **Don't** expose owner edit state or management controls on the public kit.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof PitchKitInsightsExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CreatorInsights: Story = {
  name: "Pattern — creator Insights",
  render: (args) => <PitchKitInsightsExample {...args} />,
  parameters: storyCopySource(`
import { useState } from "react";
import {
  AlertDialog,
  Avatar,
  Badge,
  Button,
  Card,
  Chart,
  MoreMenu,
  PageHeader,
  SegmentedControl,
  Stat,
  Tab,
  Toaster,
  cardLayoutBodyOccupantInsetXClasses,
  cardLayoutBodyOccupantPadYClasses,
  cardLayoutBodyOccupantWellClasses,
  cardTitleClasses,
  chartSeriesConfigFromKeys,
  toast,
} from "@whatmatters/wmds";
import { Share2 } from "lucide-react";

const reachConfig = chartSeriesConfigFromKeys([
  { key: "typical", label: "Typical reach" },
  { key: "reach", label: "Daily reach" },
]);

export function PitchKitInsightsPage({ reachData, audience, posts }) {
  const [view, setView] = useState("insights");
  const [proofMetric, setProofMetric] = useState("reach");
  const [visiblePosts, setVisiblePosts] = useState(posts);
  const [pendingHidePostId, setPendingHidePostId] = useState<string | null>(null);
  const rankedPosts = [...visiblePosts].sort((a, b) => {
    const value = (post) =>
      proofMetric === "engagement"
        ? post.likes + post.comments
        : post[proofMetric];
    return value(b) - value(a);
  });

  function hidePendingPost() {
    const hiddenPost = visiblePosts.find(
      (post) => post.id === pendingHidePostId,
    );
    if (!hiddenPost) return;

    setVisiblePosts((current) =>
      current.filter((post) => post.id !== hiddenPost.id),
    );
    setPendingHidePostId(null);
    toast.add({
      title: "Post hidden from kit",
      description: "It no longer appears in the shareable PitchKit.",
      action: {
        label: "Undo",
        onClick: () =>
          setVisiblePosts((current) => [...current, hiddenPost]),
      },
    });
  }

  return (
    <main className="grid-page min-h-screen bg-body [--grid-column-gap:8px] [--grid-max:1140px] [padding-bottom:44px]">
      <div className="band pb-4">
        <header className="col-span-full grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <span className="type-ui-label text-fg">PitchKit</span>
          <SegmentedControl
            aria-label="PitchKit primary navigation"
            size="sm"
            value={view}
            onValueChange={setView}
          >
            <SegmentedControl.Item value="insights">Insights</SegmentedControl.Item>
            <SegmentedControl.Item value="pitchkit">PitchKit</SegmentedControl.Item>
          </SegmentedControl>
          <Avatar name="Avery Morgan" size="sm" className="justify-self-end" />
        </header>
      </div>

      <div className="band pt-8">
        <div className="band min-w-0 gap-y-8">
          <section className="col-span-full">
            <PageHeader
              variant="page"
              title="Insights"
              end={<Button role="secondary" size="sm" icon={<Share2 />}>Share kit</Button>}
            />
            <p className="type-caption text-muted">
              Engagement rate = (likes + comments) ÷ followers.
            </p>
          </section>

          <div className="band gap-y-2">
            <div
              role="group"
              aria-label="Instagram performance summary"
              className="band gap-y-4"
            >
              <Stat className="col-span-2 md:col-span-4 lg:col-span-3" label="Followers" value="84.2K" />
              <Stat className="col-span-2 md:col-span-4 lg:col-span-3" label="Engagement rate" value="5.8%" />
              <Stat className="col-span-2 md:col-span-4 lg:col-span-3" label="Typical reach" value="9.3K" />
              <Stat className="col-span-2 md:col-span-4 lg:col-span-3" label="Saves" value="6.1K" />
            </div>

            <div className="band min-w-0 gap-y-6 [align-items:stretch]">
            <Card variant="outlined" shape="rounded" bodyTerminal className="col-span-full min-w-0 lg:col-span-6">
              <Card.Header start={<h2 className={cardTitleClasses}>Reach over 30 days</h2>} />
              <Card.Body>
                <div className={\`flex flex-col gap-4 \${cardLayoutBodyOccupantPadYClasses} \${cardLayoutBodyOccupantWellClasses} \${cardLayoutBodyOccupantInsetXClasses}\`}>
                  <Chart.Cartesian data={reachData} config={reachConfig} periodKind="month" minHeight={344} />
                  <Chart.Legend config={reachConfig} />
                </div>
              </Card.Body>
            </Card>

            <Card variant="outlined" shape="rounded" bodyTerminal className="col-span-full min-w-0 lg:col-span-6">
              <Card.Header start={<h2 className={cardTitleClasses}>Audience fit</h2>} />
              <Card.Body>
                <div className={\`\${cardLayoutBodyOccupantPadYClasses} \${cardLayoutBodyOccupantWellClasses} \${cardLayoutBodyOccupantInsetXClasses}\`}>
                  <Chart.RankedBars aria-label="Audience by country" items={audience.countries} animate="initial" />
                </div>
              </Card.Body>
            </Card>
            </div>
          </div>

          <section className="band gap-y-4">
            <h2 className={\`\${cardTitleClasses} col-span-full\`}>Recent proof</h2>
            <Tab.Group
              aria-label="Rank recent proof posts by"
              value={proofMetric}
              onValueChange={setProofMetric}
              className="col-span-full"
            >
              <Tab value="reach" panelId="recent-proof-panel">Reach</Tab>
              <Tab value="engagement" panelId="recent-proof-panel">Engagement</Tab>
              <Tab value="saves" panelId="recent-proof-panel">Saves</Tab>
            </Tab.Group>

            <div id="recent-proof-panel" role="tabpanel" className="band col-span-full gap-y-4">
              {rankedPosts.map((post, index) => (
                <Card key={post.id} variant="outlined" shape="rounded" className="col-span-full min-w-0 md:col-span-4 lg:col-span-4">
                  <Card.Header
                    start={<Badge size="sm">#{index + 1}</Badge>}
                    end={
                      <MoreMenu
                        aria-label={\`Manage post \${index + 1}\`}
                        size="xs"
                        items={post.actions}
                        onAction={(actionId) => {
                          if (actionId === "hide") setPendingHidePostId(post.id);
                        }}
                      />
                    }
                  />
                  <Card.Body><img src={post.imageUrl} alt={post.imageAlt} className="aspect-[4/3] w-full object-cover" /></Card.Body>
                </Card>
              ))}
            </div>
          </section>
          <AlertDialog
            open={pendingHidePostId != null}
            onOpenChange={(open) => {
              if (!open) setPendingHidePostId(null);
            }}
            title="Hide this post from PitchKit?"
            description="It will no longer appear in the shareable PitchKit. You can add it back later."
            cancelLabel="Keep post"
            confirmLabel="Hide from kit"
            onConfirm={hidePendingPost}
          />
        </div>
      </div>
      <Toaster position="bottom-right" />
    </main>
  );
}
`),
};

export const GraphDataUnavailable: Story = {
  name: "State — Graph data unavailable",
  args: {
    dataState: "unavailable",
  },
  render: (args) => <PitchKitInsightsExample {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          "Required metrics remain explicitly empty. Optional chart, audience, and post regions are absent because Graph did not return them.",
      },
    },
  },
};
