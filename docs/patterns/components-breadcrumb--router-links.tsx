// @thewhatmatters/wmds@0.4.8 · Pattern — router links
// Storybook: Components/Breadcrumb → Pattern — router links (?path=/story/components-breadcrumb--router-links)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import Link from "next/link";
import { Breadcrumb, type BreadcrumbItemDef } from "@thewhatmatters/wmds";

export function RoutedBreadcrumb({ items }: { items: BreadcrumbItemDef[] }) {
  return <Breadcrumb items={items} renderLink={(item) => <Link href={item.href} />} />;
}
