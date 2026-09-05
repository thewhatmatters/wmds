import type { CSSProperties, ReactNode } from "react";
import {
  dropdownItemButtonClasses,
  dropdownItemEndClasses,
  dropdownItemLabelFullClasses,
  dropdownItemSelectedCheckClasses,
  dropdownItemStartClasses,
  dropdownMenuClasses,
  dropdownMenuListClasses,
  dropdownMenuOffsetPx,
} from "../Dropdown/dropdownStyles";

/** Max fraction of menu width that may extend outside the boundary shell. */
export const selectMenuMaxOutsideFraction = 0.5;

type SelectMenuMeasureOption = {
  label: string;
  start?: ReactNode;
  end?: ReactNode;
};

let measureHost: HTMLDivElement | null = null;

function getMeasureHost(): HTMLDivElement {
  if (measureHost == null) {
    measureHost = document.createElement("div");
    measureHost.style.cssText =
      "position:fixed;left:-10000px;top:0;visibility:hidden;pointer-events:none";
    document.body.appendChild(measureHost);
  }
  return measureHost;
}

/**
 * Nearest layout shell — **Card** `data-layout="shell"`, else the viewport.
 * Keeps menu sizing relative to the owning surface without hard-coded widths.
 */
export function findSelectMenuBoundary(trigger: HTMLElement): DOMRect {
  let node: HTMLElement | null = trigger.parentElement;
  while (node != null && node !== document.documentElement) {
    if (node.dataset.layout === "shell") {
      return node.getBoundingClientRect();
    }
    node = node.parentElement;
  }
  return document.documentElement.getBoundingClientRect();
}

function clampMenuLeft(left: number, menuWidth: number, boundary: DOMRect): number {
  const maxOutside = menuWidth * selectMenuMaxOutsideFraction;
  const minLeft = boundary.left - maxOutside;
  const maxLeft = boundary.right + maxOutside - menuWidth;
  if (minLeft > maxLeft) {
    return minLeft;
  }
  return Math.min(Math.max(left, minLeft), maxLeft);
}

/** Widest option row — labels, optional start, check or end meta. */
export function measureSelectOptionsContentWidth(options: SelectMenuMeasureOption[]): number {
  if (options.length === 0) {
    return 0;
  }

  const host = getMeasureHost();
  host.replaceChildren();

  const menu = document.createElement("ul");
  menu.className = `${dropdownMenuClasses} ${dropdownMenuListClasses}`;

  for (const option of options) {
    const row = document.createElement("button");
    row.type = "button";
    row.className = dropdownItemButtonClasses;

    if (option.start != null) {
      const start = document.createElement("span");
      start.className = dropdownItemStartClasses;
      start.textContent = "•";
      row.appendChild(start);
    }

    const label = document.createElement("span");
    label.className = dropdownItemLabelFullClasses;
    label.textContent = option.label;
    row.appendChild(label);

    if (option.end != null) {
      const end = document.createElement("span");
      end.className = dropdownItemEndClasses;
      end.textContent = typeof option.end === "string" ? option.end : "⌘K";
      row.appendChild(end);
    } else {
      const check = document.createElement("span");
      check.className = dropdownItemSelectedCheckClasses;
      check.setAttribute("aria-hidden", "true");
      check.textContent = "✓";
      row.appendChild(check);
    }

    const item = document.createElement("li");
    item.appendChild(row);
    menu.appendChild(item);
  }

  host.appendChild(menu);
  return menu.scrollWidth;
}

export function measureSelectMenuStyle(
  shell: HTMLElement,
  options: SelectMenuMeasureOption[],
): CSSProperties {
  const rect = shell.getBoundingClientRect();
  const boundary = findSelectMenuBoundary(shell);
  const triggerWidth = rect.width;
  const contentWidth = measureSelectOptionsContentWidth(options);
  const menuWidth = Math.max(triggerWidth, contentWidth);

  let left = rect.left;
  if (menuWidth > triggerWidth) {
    const triggerCenter = rect.left + triggerWidth / 2;
    const boundaryCenter = boundary.left + boundary.width / 2;
    if (triggerCenter > boundaryCenter) {
      left = rect.right - menuWidth;
    }
  }

  left = clampMenuLeft(left, menuWidth, boundary);

  return {
    position: "fixed",
    top: rect.bottom + dropdownMenuOffsetPx,
    left,
    width: menuWidth,
    minWidth: triggerWidth,
  };
}
