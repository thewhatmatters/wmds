// @thewhatmatters/wmds@0.4.26 · Pattern — log viewer
// Storybook: Components/LogView → Pattern — log viewer (?path=/story/components-logview--log-viewer)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState } from "react";
import { LogView } from "@thewhatmatters/wmds";

const lines = [
  "09:14:02 connected to etheris",
  "09:14:08 walking /api/orders",
  "09:14:21 12 findings",
  "09:14:22 coverage 76%",
  "09:16:14 delta +8 vs last scan",
  "09:18:02 session closed",
];

export function LogViewer() {
  const [follow, setFollow] = useState(true);
  return <LogView label="Scan log" lines={lines} follow={follow} onFollowChange={setFollow} />;
}
