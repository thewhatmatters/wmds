// @thewhatmatters/wmds@0.4.43 · Pattern — needs you
// Storybook: Components/TaskRows → Pattern — needs you (?path=/story/components-taskrows--needs-you-table)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Card, TaskRows, cardLayoutBodyOccupantInsetXClasses, cardLayoutBodyOccupantPadYClasses, cardTitleClasses, type TaskRowsColumn } from "@thewhatmatters/wmds";

const columns: TaskRowsColumn[] = [
  { id: "title", header: "Campaign" },
  { id: "waiting", header: "Waiting on you" },
  { id: "metric", header: "Live posts", align: "end" },
];

const wellClasses = [
  "flex flex-col",
  cardLayoutBodyOccupantPadYClasses,
  cardLayoutBodyOccupantInsetXClasses,
].join(" ");

export function CampaignsThatNeedYou() {
  return (
    <div className="grid w-full gap-6">
      <section>
        <Card shape="rounded">
        <Card.Header start={<h2 className={cardTitleClasses}>Campaigns that need you</h2>} />
        <Card.Body>
          <div className={wellClasses}>
            <TaskRows variant="table" columns={columns} empty="Nothing waiting">
              <TaskRows.Row
                title="Stir in strength"
                href="/campaigns/stir"
                status={{ tone: "success", label: "Active · day 41" }}
                waiting={{ label: "22 creators", detail: "4 waiting over 5 days" }}
                metric={{ value: "49", detail: "12 this week" }}
              />
              <TaskRows.Row
                title="Healthier every day"
                href="/campaigns/healthier"
                status={{ tone: "warning", label: "Open · 2d" }}
                waiting={{ label: "4 creators", detail: "all within 48h target" }}
                metric={{ value: "10", detail: "2 this week" }}
              />
              <TaskRows.Row title="Outreach" source="unwired" note="Outreach is not connected" />
              <TaskRows.Row title="Matching" source="loading" />
              <TaskRows.Row title="Brand settings" source="error" note="Could not load this source" />
            </TaskRows>
          </div>
        </Card.Body>
      </Card>
      </section>
      <section>
        <Card shape="rounded">
        <Card.Header start={<h2 className={cardTitleClasses}>Caught up</h2>} />
        <Card.Body>
          <div className={wellClasses}>
            <TaskRows variant="table" columns={columns} empty="Nothing waiting" />
          </div>
        </Card.Body>
      </Card>
      </section>
    </div>
  );
}
