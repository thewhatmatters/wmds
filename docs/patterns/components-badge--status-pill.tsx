// @thewhatmatters/wmds@0.4.13 · Pattern — status pill
// Storybook: Components/Badge → Pattern — status pill (?path=/story/components-badge--status-pill)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Badge } from "@thewhatmatters/wmds";
import { Calendar, CircleCheck } from "lucide-react";

export function RoutineStatus() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge status="active" dot>
        Active
      </Badge>
      <Badge status="idle" icon={<Calendar strokeWidth={2} />}>
        Every 2 days
      </Badge>
      <Badge status="idle" icon={<CircleCheck strokeWidth={2} />}>
        Last checked 1d ago
      </Badge>
      <Badge status="success" dot>
        Succeeded
      </Badge>
      <Badge status="failed" dot>
        Failed
      </Badge>
      <Badge status="warning" dot>
        Needs a look
      </Badge>
    </div>
  );
}
