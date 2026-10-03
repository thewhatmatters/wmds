// @whatmatters/wmds@0.2.0 · Pattern — action details
// Storybook: Components/TaskRows → Pattern — action details (?path=/story/components-taskrows--action-details)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Apple, MapPin, Map as MapIcon } from "lucide-react";
import { TaskRows } from "@whatmatters/wmds";

<TaskRows variant="list">
  <TaskRows.Item
    label="Cone supplier"
    meta="0.4 mi"
    icon={<MapPin strokeWidth={2} />}
    defaultOpen
    detailsLabel="Open in"
    detailsLayout="actions"
  >
    <TaskRows.Detail
      variant="button"
      label="Apple Maps"
      icon={<Apple strokeWidth={2} />}
      onPress={() => openAppleMaps()}
    />
    <TaskRows.Detail
      variant="button"
      label="Google Maps"
      icon={<MapIcon strokeWidth={2} />}
      onPress={() => openGoogleMaps()}
    />
  </TaskRows.Item>
</TaskRows>
