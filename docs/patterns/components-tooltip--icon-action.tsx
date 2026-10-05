// @thewhatmatters/wmds@0.4.6 · Pattern — icon-only action
// Storybook: Components/Tooltip → Pattern — icon-only action (?path=/story/components-tooltip--icon-action)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { IconButton, Tooltip } from "@thewhatmatters/wmds";
import { Settings } from "lucide-react";

<Tooltip.Provider>
  <Tooltip>
    <Tooltip.Trigger
      render={
        <IconButton
          icon={<Settings />}
          aria-label="Workspace settings"
          title=""
        />
      }
    />
    <Tooltip.Content>Workspace settings</Tooltip.Content>
  </Tooltip>
</Tooltip.Provider>
