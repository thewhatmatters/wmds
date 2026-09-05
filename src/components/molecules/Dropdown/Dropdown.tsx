import { DropdownItem, type DropdownItemLayoutClassName, type DropdownItemProps } from "./DropdownItem";
import { DropdownMenu, type DropdownMenuLayoutClassName, type DropdownMenuProps } from "./DropdownMenu";

/** Menu panel + three-slot rows — shared by Select and future action menus. */
export const Dropdown = {
  Menu: DropdownMenu,
  Item: DropdownItem,
};

export {
  DropdownItem,
  DropdownMenu,
  type DropdownItemLayoutClassName,
  type DropdownItemProps,
  type DropdownMenuLayoutClassName,
  type DropdownMenuProps,
};
