// @thewhatmatters/wmds@0.4.5 · Pattern — long path
// Storybook: Components/Breadcrumb → Pattern — long path (?path=/story/components-breadcrumb--long-path)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Breadcrumb, type BreadcrumbItemDef } from "@thewhatmatters/wmds";

export function DeepBreadcrumb({ items }: { items: BreadcrumbItemDef[] }) {
  return <Breadcrumb items={items} maxItems={4} />;
}
