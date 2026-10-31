// @thewhatmatters/wmds@0.4.43 · Pattern — detail pane
// Storybook: Components/LogView → Pattern — detail pane (?path=/story/components-logview--detail-pane)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge, IconButton, LogView, Stat } from "@thewhatmatters/wmds";

const scans = [
  {
    title: "Scan 1842",
    tags: ["API", "Nightly"],
    lines: [
      "09:14:02 connected to etheris",
      "09:14:08 walking /api/orders",
      "09:14:21 12 findings",
      "09:14:22 coverage 76%",
      "09:16:14 delta +8 vs last scan",
      "09:18:02 session closed",
    ],
  },
  {
    title: "Scan 1841",
    tags: ["API", "Nightly"],
    lines: ["08:02:11 connected to etheris", "08:06:40 4 findings", "08:07:01 session closed"],
  },
];

export function DetailPane() {
  const [index, setIndex] = useState(0);
  const [follow, setFollow] = useState(true);
  const scan = scans[index] ?? scans[0];

  return (
    <section
      data-theme="dark"
      className="flex w-full max-w-3xl flex-col gap-4 bg-body p-4 text-fg"
      aria-label="Scan detail"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="type-heading-2">{scan.title}</h2>
        <div className="flex gap-2">
          <IconButton
            aria-label="Previous scan"
            icon={<ChevronLeft />}
            size="sm"
            disabled={index === 0}
            onClick={() => setIndex(index - 1)}
          />
          <IconButton
            aria-label="Next scan"
            icon={<ChevronRight />}
            size="sm"
            disabled={index === scans.length - 1}
            onClick={() => setIndex(index + 1)}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {scan.tags.map((tag) => (
          <Badge key={tag} size="sm" emphasis="outline" mono>
            {tag}
          </Badge>
        ))}
      </div>
      <Stat.Group columns={2} aria-label="Scan metrics">
        <Stat label="Findings" value="12" detail="3 new" />
        <Stat label="Coverage" value="76%" detail="of 1,000 paths" />
        <Stat label="Duration" value="4m 12s" detail="started 09:14" />
        <Stat
          label="Delta"
          value="+8"
          trend={{ value: "+8", direction: "up" }}
          detail="vs last scan"
        />
      </Stat.Group>
      <LogView label="Scan log" lines={scan.lines} follow={follow} onFollowChange={setFollow} />
    </section>
  );
}
