export interface TabOverflowItem {
  value: string;
  width: number;
}

export interface TabOverflowResult {
  visibleValues: string[];
  overflowValues: string[];
}

/**
 * Fits a stable prefix plus More. When the active tab came from overflow, it
 * occupies the final visible slot immediately before More.
 */
export function resolveTabOverflow(
  items: TabOverflowItem[],
  activeValue: string,
  availableWidth: number,
  moreWidth: number,
  trackInset = 0,
): TabOverflowResult {
  const usableWidth = Math.max(availableWidth - trackInset, 0);
  const totalWidth = items.reduce((sum, item) => sum + item.width, 0);

  if (totalWidth <= usableWidth) {
    return {
      visibleValues: items.map((item) => item.value),
      overflowValues: [],
    };
  }

  const tabBudget = Math.max(usableWidth - moreWidth, 0);
  const prefix: TabOverflowItem[] = [];
  let usedWidth = 0;

  for (const item of items) {
    if (usedWidth + item.width > tabBudget) break;
    prefix.push(item);
    usedWidth += item.width;
  }

  const activeItem = items.find((item) => item.value === activeValue);
  const activeIsOverflowed =
    activeItem != null && !prefix.some((item) => item.value === activeValue);

  if (activeIsOverflowed && activeItem != null) {
    while (
      prefix.length > 0 &&
      usedWidth + activeItem.width > tabBudget
    ) {
      usedWidth -= prefix.pop()?.width ?? 0;
    }

    if (activeItem.width <= tabBudget) {
      prefix.push(activeItem);
    }
  }

  const visibleValues = prefix.map((item) => item.value);
  const visibleSet = new Set(visibleValues);

  return {
    visibleValues,
    overflowValues: items
      .filter((item) => !visibleSet.has(item.value))
      .map((item) => item.value),
  };
}
