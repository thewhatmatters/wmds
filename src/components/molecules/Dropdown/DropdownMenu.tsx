import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../../lib/cn";
import { dropdownMenuClasses, dropdownMenuListClasses } from "./dropdownStyles";

/** Layout-only — width and positioning come from the anchor or inline style. */
export type DropdownMenuLayoutClassName = string;

export interface DropdownMenuProps extends HTMLAttributes<HTMLUListElement> {
  children: ReactNode;
  className?: DropdownMenuLayoutClassName;
}

/** Floating list shell — compose **Dropdown.Item** rows inside. */
export function DropdownMenu({ children, className, ...props }: DropdownMenuProps) {
  return (
    <ul {...props} className={cn(dropdownMenuClasses, dropdownMenuListClasses, className)}>
      {children}
    </ul>
  );
}
