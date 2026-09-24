import type { CSSProperties, ReactNode } from "react";
import {
  type DropdownMenuMeasureRow,
  measureDropdownMenuContentWidth,
  measureDropdownMenuStyle,
} from "../Dropdown/dropdownMenuPosition";

type SelectMenuMeasureOption = {
  label: string;
  start?: ReactNode;
  end?: ReactNode;
};

/** Widest option row — labels, optional start, check or end meta. */
export function measureSelectOptionsContentWidth(options: SelectMenuMeasureOption[]): number {
  return measureDropdownMenuContentWidth(
    options.map((option) => ({
      label: option.label,
      start: option.start,
      end: option.end,
      selectionCheck: option.end == null,
    })),
  );
}

export function measureSelectMenuStyle(
  shell: HTMLElement,
  options: SelectMenuMeasureOption[],
): CSSProperties {
  const rows: DropdownMenuMeasureRow[] = options.map((option) => ({
    label: option.label,
    start: option.start,
    end: option.end,
    selectionCheck: option.end == null,
  }));

  return measureDropdownMenuStyle(shell, rows, "start");
}
