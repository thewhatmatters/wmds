// @thewhatmatters/wmds@0.4.6 · Pattern — column caption
// Storybook: Components/SectionCaption → Pattern — column caption (?path=/story/components-sectioncaption--column-caption)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useId, type ReactNode } from "react";
import { SectionCaption } from "@thewhatmatters/wmds";

export function MetadataColumn({ children }: { children: ReactNode }) {
  const headingId = useId();
  return (
    <aside aria-labelledby={headingId} className="flex flex-col">
      <SectionCaption id={headingId}>Metadata</SectionCaption>
      {children}
    </aside>
  );
}
