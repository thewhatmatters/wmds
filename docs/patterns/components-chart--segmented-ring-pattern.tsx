// @thewhatmatters/wmds@0.4.37 · Pattern — segmented ring
// Storybook: Components/Chart → Pattern — segmented ring (?path=/story/components-chart--segmented-ring-pattern)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Card, Chart, cardLayoutBodyOccupantInsetXClasses, cardLayoutBodyOccupantPadYClasses, cardTitleClasses, chartSeriesColor, type ChartSeriesConfig } from "@thewhatmatters/wmds";

const channelLegend: ChartSeriesConfig = {
  widget: {
    label: "Chat widget",
    color: chartSeriesColor(0),
    value: "1,569",
    percent: "46%",
    delta: { label: "+8%", direction: "up" },
  },
  email: {
    label: "Email",
    color: chartSeriesColor(1),
    value: "921",
    percent: "27%",
    delta: { label: "-3%", direction: "down" },
  },
  whatsapp: {
    label: "WhatsApp",
    color: chartSeriesColor(2),
    value: "580",
    percent: "17%",
    delta: { label: "+21%", direction: "up" },
  },
  slack: {
    label: "Slack Connect",
    color: chartSeriesColor(3),
    value: "342",
    percent: "10%",
    delta: { label: "+2%", direction: "up" },
  },
};

const ringWellClasses = [
  "flex w-full flex-col items-center gap-6",
  cardLayoutBodyOccupantPadYClasses,
  cardLayoutBodyOccupantInsetXClasses,
].join(" ");

export function SegmentedRingExamples() {
  return (
    <div className="grid w-full gap-6 lg:grid-cols-2">
      <section>
        <Card shape="rounded">
        <Card.Header start={<h2 className={cardTitleClasses}>Channels</h2>} />
        <Card.Body>
          <div className={ringWellClasses}>
            <Chart.SegmentedRing
              value={2842}
              max={3412}
              tone="primary"
              size="lg"
              centerValue="3,412"
              centerLabel="conversations"
              label="3,412 conversations"
              animate="none"
            />
            <Chart.Legend variant="tabular" config={channelLegend} className="w-full" />
          </div>
        </Card.Body>
      </Card>
      </section>
      <section>
        <Card shape="rounded">
        <Card.Header start={<h2 className={cardTitleClasses}>Weekly goals</h2>} />
        <Card.Body>
          <div className={ringWellClasses}>
            <Chart.SegmentedRing
              value={38}
              max={100}
              tone="primary"
              size="md"
              centerValue="38%"
              centerLabel="of weekly goals"
              label="Weekly goals 38%"
              animate="none"
            />
          </div>
        </Card.Body>
      </Card>
      </section>
      <section>
        <Card shape="rounded">
        <Card.Header start={<h2 className={cardTitleClasses}>Over capacity</h2>} />
        <Card.Body>
          <div className={ringWellClasses}>
            <Chart.SegmentedRing
              value={128}
              max={100}
              tone="primary"
              size="md"
              centerValue="128%"
              centerLabel="of goal"
              label="Goal 128%"
              animate="none"
            />
          </div>
        </Card.Body>
      </Card>
      </section>
      <section>
        <Card shape="rounded">
        <Card.Header start={<h2 className={cardTitleClasses}>Empty</h2>} />
        <Card.Body>
          <div className={ringWellClasses}>
            <Chart.SegmentedRing
              value={0}
              max={3412}
              tone="primary"
              size="md"
              centerValue="0"
              centerLabel="conversations"
              label="0 conversations"
              animate="none"
            />
          </div>
        </Card.Body>
      </Card>
      </section>
      <section>
        <Card shape="rounded">
        <Card.Header start={<h2 className={cardTitleClasses}>Not connected</h2>} />
        <Card.Body>
          <div className={ringWellClasses}>
            <Chart.SegmentedRing
              value={0}
              max={100}
              tone="primary"
              size="md"
              unavailable={{ reason: "Source is not connected" }}
              label="Conversations"
              animate="none"
            />
          </div>
        </Card.Body>
      </Card>
      </section>
    </div>
  );
}
