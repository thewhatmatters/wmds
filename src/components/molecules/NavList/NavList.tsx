import {
  cloneElement,
  createContext,
  createElement,
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
  navListItemTrailClasses,
  navListItemWrapClasses,
  navListSectionLabelRowClasses,
  navListSectionBrandBandClasses,
  navListSectionClasses,
  navListSectionLabelBrandClasses,
  navListSectionLabelClasses,
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
  /** Plain URL. The row is an anchor, so a server-rendered app does not need `onSelect` to navigate. */
  href?: string;
  /**
   * Router link in place of `href` — `render={<Link href="/tasks/ikea" />}`.
   * Pass `href` or `render`, not both.
   */
  render?: ReactElement;
  /** Trailing mark — a **Status** dot or a **Badge** `status` pill. Not a second label. */
  trailing?: ReactNode;
}

export interface NavListSectionDef {
  label?: string;
  /** `brand` aligns the first section overline to an adjacent 56px header band. */
  labelAlign?: NavListLabelAlignment;
  /** Section control — filter or more. Pass **IconButton**. */
  action?: ReactNode;
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
  /** Section control — filter or more. Pass **IconButton**. */
  action?: ReactNode;
  children: ReactNode;
  className?: NavListLayoutClassName;
}

export interface NavListItemProps {
  id: string;
  label: string;
  icon?: NavListIcon;
  count?: number;
  /** Plain URL. The row is an anchor. */
  href?: string;
  /** Router link in place of `href`. Pass one, not both. */
  render?: ReactElement;
  /** Trailing mark — a **Status** dot or a **Badge** `status` pill. */
  trailing?: ReactNode;
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
  action,
}: {
  label: string;
  labelAlign?: NavListLabelAlignment;
  action?: ReactNode;
}) {
  if (labelAlign === "brand") {
    return (
      <div className={cn(navListSectionBrandBandClasses, action != null && "justify-between gap-2")}>
        <p className={navListSectionLabelBrandClasses}>{label}</p>
        {action}
      </div>
    );
  }

  return (
    <div className={cn(navListSectionLabelDefaultClasses, navListSectionLabelRowClasses)}>
      <p className={navListSectionLabelClasses}>{label}</p>
      {action}
    </div>
  );
}

function NavListSectionRoot({
  label,
  labelAlign = "section",
  action,
  children,
  className,
}: NavListSectionProps) {
  return (
    <div className={cn(navListSectionClasses, className)}>
      {label != null ? (
        <NavListSectionLabel label={label} labelAlign={labelAlign} action={action} />
      ) : null}
      {children}
    </div>
  );
}

function navListItemRender(href: string | undefined, render: ReactElement | undefined) {
  if (render != null && href != null) {
    console.warn("[WMDS NavList] Pass `href` or `render` on an item, not both. `render` is used.");
  }
  if (render != null) return render;
  if (href != null) return createElement("a", { href });
  return undefined;
}

function NavListItemRoot({
  id,
  label,
  icon,
  count,
  href,
  render,
  trailing,
  selected: selectedProp,
  onSelect,
  className,
}: NavListItemProps) {
  const context = useContext(NavListContext);
  const selected = selectedProp ?? context.activeId === id;
  const handleSelect = onSelect ?? context.onSelect;
  const link = navListItemRender(href, render);

  return (
    <div className={cn(navListItemWrapClasses, className)}>
      <Button
        layout="nav"
        type="button"
        selected={selected}
        render={link}
        onClick={handleSelect != null ? () => handleSelect(id) : undefined}
      >
        {icon != null ? <NavListItemIcon icon={icon} selected={selected} /> : null}
        <span className={navListItemLabelClasses}>{label}</span>
        {count != null || trailing != null ? (
          <span className={navListItemTrailClasses}>
            {count != null ? (
              <span className={navListItemCountClasses}>{count.toLocaleString()}</span>
            ) : null}
            {trailing}
          </span>
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
              action={section.action}
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
 * Sectioned secondary navigation — inset pills with optional icons, counts, and trailing marks.
 * `href` or `render` makes a row a link. Compose **NavList.Item** or pass a `sections` array.
 */
export const NavList = Object.assign(NavListRoot, {
  Section: NavListSectionRoot,
  Item: NavListItemRoot,
});
