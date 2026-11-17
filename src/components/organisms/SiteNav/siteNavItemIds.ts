/**
 * One id per nav item, unique within the row. An item's id is its `value`, else its `href`
 * (or a menu's label), so two links to one page share a base id; a repeat gets a counter,
 * and each link keeps its own label, order and place in the More menu.
 */
export function uniqueSiteNavItemIds(baseIds: readonly string[]): string[] {
  const used = new Set<string>();
  return baseIds.map((base) => {
    let id = base;
    for (let n = 2; used.has(id); n += 1) id = `${base} (${n})`;
    used.add(id);
    return id;
  });
}
