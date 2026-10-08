// @thewhatmatters/wmds@0.4.7 · Pattern — action menu
// Storybook: Components/MoreMenu → Pattern — action menu (?path=/story/components-moremenu--action-menu)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Download, Share2 } from "lucide-react";
import { ButtonIcon, MoreMenu } from "@thewhatmatters/wmds";

export function MarketActions() {
  return (
    <MoreMenu
      aria-label="More market actions"
      size="sm"
      items={[
        {
          id: "export",
          label: "Export",
          start: (
            <ButtonIcon size="sm">
              <Download strokeWidth={2} />
            </ButtonIcon>
          ),
        },
        {
          id: "share",
          label: "Share",
          start: (
            <ButtonIcon size="sm">
              <Share2 strokeWidth={2} />
            </ButtonIcon>
          ),
        },
      ]}
      onAction={(id) => console.log(id)}
    />
  );
}
