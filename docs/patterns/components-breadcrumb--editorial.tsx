// @thewhatmatters/wmds@0.4.7 · Pattern — editorial
// Storybook: Components/Breadcrumb → Pattern — editorial (?path=/story/components-breadcrumb--editorial)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Breadcrumb, type BreadcrumbItemDef } from "@thewhatmatters/wmds";

export function PostBreadcrumb({ items }: { items: BreadcrumbItemDef[] }) {
  return <Breadcrumb items={items} variant="mono" separator="slash" />;
}
