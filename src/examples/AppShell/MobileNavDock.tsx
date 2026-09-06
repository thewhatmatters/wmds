import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useMemo,
  useState,
  type ReactElement,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronUp, X } from "lucide-react";
import { Button } from "../../components/atoms/Button/Button";
import { ButtonIcon } from "../../components/atoms/Button/ButtonIcon";
import { IconButton } from "../../components/atoms/IconButton/IconButton";
import { iconButtonSizeForCluster } from "../../lib/clusterScale";
import { cn } from "../../lib/cn";
import {
  motionNavDockItemVariants,
  motionNavDockMenuVariants,
  motionTransitionProp,
} from "../../lib/motion";
import {
  mobileNavDockActiveButtonClasses,
  mobileNavDockActiveIconClasses,
  mobileNavDockActiveLabelClasses,
  mobileNavDockClusterTier,
  mobileNavDockHostClasses,
  mobileNavDockMenuClasses,
  mobileNavDockMenuItemWrapClasses,
  mobileNavDockScrimClasses,
  mobileNavDockShellClasses,
  mobileNavDockToggleWrapClasses,
} from "./mobileNavDockStyles";
import {
  navListItemCountClasses,
  navListItemIconClasses,
  navListItemLabelClasses,
} from "../../components/molecules/NavList/navListStyles";

export interface MobileNavDockItem {
  id: string;
  label: string;
  icon: ReactElement;
  count?: number;
}

export interface MobileNavDockProps {
  items: MobileNavDockItem[];
  activeId: string;
  onSelect: (id: string) => void;
  footerItems?: MobileNavDockItem[];
  "aria-label"?: string;
}

function MobileNavDockItemIcon({ icon, selected }: { icon: ReactElement; selected: boolean }) {
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

function MobileNavDockMenuItem({
  item,
  selected,
  onSelect,
}: {
  item: MobileNavDockItem;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <motion.div variants={motionNavDockItemVariants} className={mobileNavDockMenuItemWrapClasses}>
      <Button
        layout="nav"
        type="button"
        selected={selected}
        onClick={() => onSelect(item.id)}
      >
        <MobileNavDockItemIcon icon={item.icon} selected={selected} />
        <span className={navListItemLabelClasses}>{item.label}</span>
        {item.count != null ? (
          <span className={navListItemCountClasses}>{item.count.toLocaleString()}</span>
        ) : null}
      </Button>
    </motion.div>
  );
}

/**
 * Mobile primary nav — expandable bottom dock with a vertical menu stack (not a radial arch).
 * Collapsed: active destination + toggle. Expanded: full-label rows above the pill.
 */
export function MobileNavDock({
  items,
  activeId,
  onSelect,
  footerItems = [],
  "aria-label": ariaLabel = "Primary",
}: MobileNavDockProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const allItems = useMemo(() => [...items, ...footerItems], [items, footerItems]);
  const activeItem = allItems.find((item) => item.id === activeId) ?? items[0];

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function handleSelect(id: string) {
    onSelect(id);
    setOpen(false);
  }

  if (activeItem == null) return null;

  return (
    <div className={mobileNavDockHostClasses}>
      <AnimatePresence>
        {open ? (
          <motion.button
            key="mobile-nav-dock-scrim"
            type="button"
            aria-label="Close navigation menu"
            className={mobileNavDockScrimClasses}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={motionTransitionProp("medium")}
            onClick={() => setOpen(false)}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {open ? (
          <motion.nav
            key="mobile-nav-dock-menu"
            id={menuId}
            aria-label={ariaLabel}
            className={mobileNavDockMenuClasses}
            variants={motionNavDockMenuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {allItems.map((item) => (
              <MobileNavDockMenuItem
                key={item.id}
                item={item}
                selected={item.id === activeId}
                onSelect={handleSelect}
              />
            ))}
          </motion.nav>
        ) : null}
      </AnimatePresence>

      <div className={mobileNavDockShellClasses}>
        <Button
          layout="nav"
          type="button"
          className={mobileNavDockActiveButtonClasses}
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls={menuId}
        >
          <span className={mobileNavDockActiveIconClasses}>
            <MobileNavDockItemIcon icon={activeItem.icon} selected />
          </span>
          <span className={mobileNavDockActiveLabelClasses}>{activeItem.label}</span>
        </Button>

        <div className={mobileNavDockToggleWrapClasses}>
          <IconButton
            icon={open ? <X strokeWidth={2} /> : <ChevronUp strokeWidth={2} />}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            aria-controls={menuId}
            size={iconButtonSizeForCluster(mobileNavDockClusterTier)}
            role="secondary"
            onClick={() => setOpen((current) => !current)}
          />
        </div>
      </div>
    </div>
  );
}
