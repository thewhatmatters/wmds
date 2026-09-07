import {
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  type ReactElement,
  type ReactNode,
  type SVGProps,
} from "react";
import { Button } from "../../atoms/Button/Button";
import { ButtonIcon } from "../../atoms/Button/ButtonIcon";
import { cn } from "../../../lib/cn";
import {
  navListItemCountClasses,
  navListItemIconClasses,
  navListItemLabelClasses,
  navListItemWrapClasses,
  navListSectionBrandBandClasses,
  navListSectionClasses,
  navListSectionLabelBrandClasses,
  navListSectionLabelDefaultClasses,
  navListShellClasses,
  type NavListLabelAlignment,
} from "./navListStyles";

export type { NavListLabelAlignment } from "./navListStyles";
export { navListLabelAlignments } from "./navListStyles";

/** Layout-only — width override; default shell is `w-52`. */
export type NavListLayoutClassName = string;

export type NavListIcon = ReactElement<SVGProps<SVGSVGElement>>;

export interface NavListItemDef {
  id: string;
  label: string;
  icon?: NavListIcon;
  count?: number;
}

export interface NavListSectionDef {
  label?: string;
  /** `brand` aligns the first section overline to an adjacent 56px header band. */
  labelAlign?: NavListLabelAlignment;
  items: NavListItemDef[];
}

export interface NavListProps {
  /** Data-driven sections — or compose **NavList.Section** / **NavList.Item** as children. */
  sections?: NavListSectionDef[];
  activeId?: string;
  onSelect?: (id: string) => void;
  children?: ReactNode;
  "aria-label"?: string;
  className?: NavListLayoutClassName;
}

export interface NavListSectionProps {
  label?: string;
  labelAlign?: NavListLabelAlignment;
  children: ReactNode;
  className?: NavListLayoutClassName;
}

export interface NavListItemProps {
  id: string;
  label: string;
  icon?: NavListIcon;
  count?: number;
  selected?: boolean;
  onSelect?: (id: string) => void;
  className?: NavListLayoutClassName;
}

interface NavListContextValue {
  activeId?: string;
  onSelect?: (id: string) => void;
}

const NavListContext = createContext<NavListContextValue>({});

function NavListItemIcon({ icon, selected }: { icon: NavListIcon; selected: boolean }) {
  const glyph = isValidElement(icon)
    ? cloneElement(icon, {
        strokeWidth: selected ? 2.25 : 1.75,
        ...(selected ? { fill: "currentColor", fillOpacity: 0.12 } : { fill: "none" }),
      })
    : icon;

  return (
    <span className={cn("inline-flex shrink-0", navListItemIconClasses(selected))}>
      <ButtonIcon size="sm">{glyph}</ButtonIcon>
    </span>
  );
}

function NavListSectionLabel({
  label,
  labelAlign = "section",
}: {
  label: string;
  labelAlign?: NavListLabelAlignment;
}) {
  if (labelAlign === "brand") {
    return (
      <div className={navListSectionBrandBandClasses}>
        <p className={navListSectionLabelBrandClasses}>{label}</p>
      </div>
    );
  }

  return <p className={navListSectionLabelDefaultClasses}>{label}</p>;
}

function NavListSectionRoot({
  label,
  labelAlign = "section",
  children,
  className,
}: NavListSectionProps) {
  return (
    <div className={cn(navListSectionClasses, className)}>
      {label != null ? <NavListSectionLabel label={label} labelAlign={labelAlign} /> : null}
      {children}
    </div>
  );
}

function NavListItemRoot({
  id,
  label,
  icon,
  count,
  selected: selectedProp,
  onSelect,
  className,
}: NavListItemProps) {
  const context = useContext(NavListContext);
  const selected = selectedProp ?? context.activeId === id;
  const handleSelect = onSelect ?? context.onSelect;

  return (
    <div className={cn(navListItemWrapClasses, className)}>
      <Button
        layout="nav"
        type="button"
        selected={selected}
        onClick={handleSelect != null ? () => handleSelect(id) : undefined}
      >
        {icon != null ? <NavListItemIcon icon={icon} selected={selected} /> : null}
        <span className={navListItemLabelClasses}>{label}</span>
        {count != null ? (
          <span className={navListItemCountClasses}>{count.toLocaleString()}</span>
        ) : null}
      </Button>
    </div>
  );
}

function NavListRoot({
  sections,
  activeId,
  onSelect,
  children,
  "aria-label": ariaLabel = "Section",
  className,
}: NavListProps) {
  const contextValue = { activeId, onSelect };

  if (sections != null) {
    return (
      <nav aria-label={ariaLabel} className={cn(navListShellClasses, className)}>
        <NavListContext.Provider value={contextValue}>
          {sections.map((section, index) => (
            <NavListSectionRoot
              key={section.label ?? index}
              label={section.label}
              labelAlign={
                section.labelAlign ?? (index === 0 && section.label != null ? "brand" : "section")
              }
            >
              {section.items.map((item) => (
                <NavListItemRoot key={item.id} {...item} />
              ))}
            </NavListSectionRoot>
          ))}
        </NavListContext.Provider>
      </nav>
    );
  }

  return (
    <nav aria-label={ariaLabel} className={cn(navListShellClasses, className)}>
      <NavListContext.Provider value={contextValue}>{children}</NavListContext.Provider>
    </nav>
  );
}

/**
 * Sectioned secondary navigation — inset pills with optional icons and counts.
 * Compose **NavList.Item** with **Button** `layout="nav"` or pass a `sections` array.
 */
export const NavList = Object.assign(NavListRoot, {
  Section: NavListSectionRoot,
  Item: NavListItemRoot,
});
