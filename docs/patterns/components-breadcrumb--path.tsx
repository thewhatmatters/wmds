// @thewhatmatters/wmds@0.4.9 · Pattern — path
// Storybook: Components/Breadcrumb → Pattern — path (?path=/story/components-breadcrumb--path)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Breadcrumb, type BreadcrumbItemDef } from "@thewhatmatters/wmds";

export function PageBreadcrumb({ items }: { items: BreadcrumbItemDef[] }) {
  return <Breadcrumb items={items} />;
}
