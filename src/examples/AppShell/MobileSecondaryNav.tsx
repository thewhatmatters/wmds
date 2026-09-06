import type { NavListSectionDef } from "../../components/molecules/NavList/NavList";
import { Tab } from "../../components/organisms/Tab/Tab";
import { mobileSecondaryNavShellClasses } from "./mobileSecondaryNavStyles";

export interface MobileSecondaryNavProps {
  sections: NavListSectionDef[];
  activeId: string;
  onSelect: (id: string) => void;
}

/**
 * Compact mobile page tabs — excess destinations move into More.
 */
export function MobileSecondaryNav({
  sections,
  activeId,
  onSelect,
}: MobileSecondaryNavProps) {
  const items = sections.flatMap((section) => section.items);

  return (
    <div className={mobileSecondaryNavShellClasses}>
      <Tab.Group
        aria-label="Settings pages"
        value={activeId}
        onValueChange={onSelect}
        size="md"
      >
        {items.map((item) => (
          <Tab key={item.id} value={item.id} count={item.count}>
            {item.label}
          </Tab>
        ))}
      </Tab.Group>
    </div>
  );
}
