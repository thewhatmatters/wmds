import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { ChevronDown, PanelLeft } from "lucide-react";
import { Button } from "../../atoms/Button/Button";
import { IconButton } from "../../atoms/IconButton/IconButton";
import { Kbd } from "../../atoms/Kbd/Kbd";
import { Tooltip } from "../../atoms/Tooltip/Tooltip";
import { PageHeader } from "../../molecules/PageHeader/PageHeader";
import { pageHeaderTitleClasses } from "../../molecules/PageHeader/pageHeaderStyles";
import { cn } from "../../../lib/cn";
import { OverlayPanelHeader } from "../Dialog/OverlayPanelHeader";
import { overlayPanelBodyScrollClasses, overlayPanelSectionStackClasses } from "../Dialog/dialogStyles";
import { Panel } from "../Panel/Panel";
import { Sheet } from "../Sheet/Sheet";
import {
  appShellAsideDockedClasses,
  appShellAsideInsetClasses,
  appShellAsideInsetHeaderClasses,
  appShellInsetRowClasses,
  appShellToolbarClasses,
  appShellBrandClasses,
  appShellCanvasClasses,
  appShellMainClasses,
  appShellSkipLinkClasses,
  appShellRootClasses,
  appShellSheetBodyClasses,
  appShellSidebarBodyClasses,
  appShellSidebarFooterClasses,
  appShellSidebarClasses,
  appShellSurfaceClasses,
  appShellToggleDesktopClasses,
  appShellToggleMobileClasses,
} from "./appShellStyles";

/** Layout-only — height and placement of the shell. */
export type AppShellLayoutClassName = string;

export interface AppShellLabels {
  /** Accessible name and tooltip of the collapse toggle while the sidebar is open. */
  collapse: string;
  /** Accessible name and tooltip of the collapse toggle while the sidebar is collapsed. */
  expand: string;
  /** Name of the phone menu button and the **Sheet** title. */
  menu: string;
  /** Default title of the aside **Panel**. */
  aside: string;
  /** The skip link, the first tab stop, which moves focus to the page content. */
  skipToContent: string;
}

const DEFAULT_LABELS: AppShellLabels = {
  collapse: "Collapse sidebar",
  expand: "Expand sidebar",
  menu: "Menu",
  aside: "Details",
  skipToContent: "Skip to content",
};

export const appShellAsideModes = ["overlay", "docked", "inset"] as const;
export type AppShellAsideMode = (typeof appShellAsideModes)[number];

export const appShellMenuButtons = ["icon", "label", "picker"] as const;
export type AppShellMenuButton = (typeof appShellMenuButtons)[number];

export interface AppShellProps {
  /** Page title — the `h1` in the title bar. */
  title: string;
  /** Brand row at the top of the sidebar — wordmark or **Avatar** + name. Same 56px band as the title bar. */
  brand?: ReactNode;
  /** Sidebar body — a **NavList**. Omit it for a shell with no sidebar. */
  sidebar?: ReactNode;
  /** Pinned to the bottom of the sidebar and the phone menu while the **NavList** above it scrolls — a **DisplayControls** `controls="theme"` switch, an account row. */
  sidebarFooter?: ReactNode;
  /** Trailing title-bar controls — **Button**, **Avatar**, **MoreMenu** at one cluster tier. */
  header?: ReactNode;
  /** Full-width band under the title bar (a view toolbar). With an inset aside it spans above both. */
  toolbar?: ReactNode;
  /** Right slide-out content, in a non-blocking **Panel**. Omit it for no aside. */
  aside?: ReactNode;
  /** Title of the aside **Panel**. Defaults to `labels.aside`. */
  asideTitle?: ReactNode;
  asideDescription?: ReactNode;
  /** Desktop sidebar expanded — controlled. */
  sidebarOpen?: boolean;
  defaultSidebarOpen?: boolean;
  onSidebarOpenChange?: (open: boolean) => void;
  /**
   * `overlay` (default): the aside is a non-blocking **Panel** over the page.
   * `docked`: from `lg` it sits beside the page, which narrows to make room, for controls you use while
   * watching the page change (a font panel). Below `lg` it's the overlay **Panel** either way.
   * `inset`: from `lg` a raised card floating inside the page surface, under the title bar and `toolbar`,
   * 12px from the end and bottom; the page body narrows beside it. Its header is the title bar's 56px band.
   */
  asideMode?: AppShellAsideMode;
  /** Aside open — controlled. */
  asideOpen?: boolean;
  defaultAsideOpen?: boolean;
  onAsideOpenChange?: (open: boolean) => void;
  labels?: Partial<AppShellLabels>;
  /**
   * The phone menu button (below `lg`): `icon` (default); `label`, the icon plus `labels.menu` as visible
   * text ("Patterns"), when the glyph alone wouldn't say what the menu holds; or `picker`, the icon plus the
   * current page (`title`) and a chevron, standing in for the title on phones, when the menu is a list of
   * pages and the button should say which one you're on ("Hero — Feature Center ▾"). With `picker` the
   * `h1` stays in the page for screen readers but is only visible from `lg`.
   */
  menuButton?: AppShellMenuButton;
  /** Page content. **AppShell.Brand**, **Sidebar**, **Header**, and **Aside** children fill their slots instead. */
  children?: ReactNode;
  className?: AppShellLayoutClassName;
}

interface AppShellSlotProps {
  children?: ReactNode;
}

interface AppShellAsideSlotProps extends AppShellSlotProps {
  title?: ReactNode;
  description?: ReactNode;
}

function AppShellBrand({ children }: AppShellSlotProps) {
  return <>{children}</>;
}

function AppShellSidebar({ children }: AppShellSlotProps) {
  return <>{children}</>;
}

function AppShellSidebarFooter({ children }: AppShellSlotProps) {
  return <>{children}</>;
}

function AppShellHeader({ children }: AppShellSlotProps) {
  return <>{children}</>;
}

function AppShellToolbar({ children }: AppShellSlotProps) {
  return <>{children}</>;
}

function AppShellAside({ children }: AppShellAsideSlotProps) {
  return <>{children}</>;
}

export interface AppShellContextValue {
  /** Desktop sidebar is expanded. */
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  /** Phone menu **Sheet** is open. */
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  asideOpen: boolean;
  setAsideOpen: (open: boolean) => void;
  /** Collapses or expands the sidebar from `lg`; opens or closes the menu below it. */
  toggleSidebar: () => void;
}

const AppShellContext = createContext<AppShellContextValue | null>(null);

/** State of the nearest **AppShell** — for a header button that opens the aside. */
export function useAppShell(): AppShellContextValue {
  const context = useContext(AppShellContext);
  if (context == null) {
    throw new Error("useAppShell must be used inside <AppShell>.");
  }
  return context;
}

function useControllableOpen(
  controlled: boolean | undefined,
  defaultValue: boolean,
  onChange: ((open: boolean) => void) | undefined,
): [boolean, (open: boolean) => void] {
  const [inner, setInner] = useState(defaultValue);
  const value = controlled ?? inner;
  const set = useCallback(
    (next: boolean) => {
      if (controlled == null) setInner(next);
      onChange?.(next);
    },
    [controlled, onChange],
  );
  return [value, set];
}

const DESKTOP_QUERY = "(min-width: 1024px)";

function isEditable(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && target.isContentEditable;
}

function pickSlots(children: ReactNode) {
  const slots: {
    brand?: ReactNode;
    sidebar?: ReactNode;
    sidebarFooter?: ReactNode;
    header?: ReactNode;
    toolbar?: ReactNode;
    aside?: { title?: ReactNode; description?: ReactNode; children?: ReactNode };
    content: ReactNode[];
  } = { content: [] };

  Children.forEach(children, (child) => {
    if (!isValidElement<AppShellSlotProps & AppShellAsideSlotProps>(child)) {
      if (child != null && child !== false) slots.content.push(child);
      return;
    }
    if (child.type === AppShellBrand) slots.brand = child.props.children;
    else if (child.type === AppShellSidebar) slots.sidebar = child.props.children;
    else if (child.type === AppShellSidebarFooter) slots.sidebarFooter = child.props.children;
    else if (child.type === AppShellHeader) slots.header = child.props.children;
    else if (child.type === AppShellToolbar) slots.toolbar = child.props.children;
    else if (child.type === AppShellAside) slots.aside = child.props;
    else slots.content.push(child);
  });
  return slots;
}

function AppShellRoot({
  title,
  brand: brandProp,
  sidebar: sidebarProp,
  sidebarFooter: sidebarFooterProp,
  header: headerProp,
  toolbar: toolbarProp,
  aside: asideProp,
  asideTitle,
  asideDescription,
  sidebarOpen: sidebarOpenProp,
  defaultSidebarOpen = true,
  onSidebarOpenChange,
  asideOpen: asideOpenProp,
  defaultAsideOpen = false,
  onAsideOpenChange,
  asideMode = "overlay",
  menuButton = "icon",
  labels: labelsProp,
  children,
  className,
}: AppShellProps) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const slots = pickSlots(children);
  const brand = brandProp ?? slots.brand;
  const sidebar = sidebarProp ?? slots.sidebar;
  const sidebarFooter = sidebarFooterProp ?? slots.sidebarFooter;
  const header = headerProp ?? slots.header;
  const toolbar = toolbarProp ?? slots.toolbar;
  const aside = asideProp ?? slots.aside?.children;
  const hasSidebar = sidebar != null;
  const hasAside = aside != null;

  const [sidebarOpen, setSidebarOpenState] = useControllableOpen(
    sidebarOpenProp,
    defaultSidebarOpen,
    onSidebarOpenChange,
  );
  const [asideOpen, setAsideOpen] = useControllableOpen(
    asideOpenProp,
    defaultAsideOpen,
    onAsideOpenChange,
  );
  const [menuOpen, setMenuOpen] = useState(false);
  // False on the server and the first paint, so a docked aside starts as the overlay until the query runs.
  const [isDesktop, setIsDesktop] = useState(false);
  // Docked and inset asides wait for the query: rendering the overlay Panel first would differ from the
  // server HTML (a hydration mismatch) and flash an overlay before the aside settles beside the page.
  const [mediaKnown, setMediaKnown] = useState(false);

  const sidebarId = useId();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const desktopToggleRef = useRef<HTMLButtonElement>(null);

  const setSidebarOpen = useCallback(
    (open: boolean) => {
      // Focus inside a column that is about to disappear returns to the toggle.
      if (!open && sidebarRef.current?.contains(document.activeElement)) {
        desktopToggleRef.current?.focus();
      }
      setSidebarOpenState(open);
    },
    [setSidebarOpenState],
  );

  const toggleSidebar = useCallback(() => {
    if (window.matchMedia(DESKTOP_QUERY).matches) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setMenuOpen((open) => !open);
    }
  }, [setSidebarOpen, sidebarOpen]);

  // Close the phone menu when the viewport grows past `lg`.
  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    setIsDesktop(query.matches);
    setMediaKnown(true);
    function handleChange(event: MediaQueryListEvent) {
      setIsDesktop(event.matches);
      if (event.matches) setMenuOpen(false);
    }
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  // Cmd/Ctrl+B — the same toggle as the title-bar button.
  useEffect(() => {
    if (!hasSidebar) return undefined;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.altKey || event.shiftKey) return;
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "b") return;
      if (isEditable(event.target)) return;
      event.preventDefault();
      toggleSidebar();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [hasSidebar, toggleSidebar]);

  const context = useMemo<AppShellContextValue>(
    () => ({
      sidebarOpen,
      setSidebarOpen,
      menuOpen,
      setMenuOpen,
      asideOpen,
      setAsideOpen,
      toggleSidebar,
    }),
    [asideOpen, menuOpen, setAsideOpen, setSidebarOpen, sidebarOpen, toggleSidebar],
  );

  // A link or button chosen inside the navigation closes the phone menu.
  function handleMenuClick(event: MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    if (target.closest("nav a[href], nav button") != null) setMenuOpen(false);
  }

  const docked = hasAside && (asideMode === "docked" || asideMode === "inset") && isDesktop;
  const inset = docked && asideMode === "inset";
  const asideId = `${sidebarId}-aside`;
  const asideRef = useRef<HTMLElement>(null);
  const asideReturnFocusRef = useRef<HTMLElement | null>(null);

  // Docked: remember what opened the aside, and give focus back there when it closes from inside.
  useEffect(() => {
    if (!docked) return;
    if (asideOpen) {
      asideReturnFocusRef.current = document.activeElement as HTMLElement | null;
    } else {
      asideReturnFocusRef.current = null;
    }
  }, [asideOpen, docked]);

  const dockedAside =
    docked && asideOpen ? (
      <aside
              ref={asideRef}
              id={asideId}
              aria-labelledby={`${asideId}-title`}
              className={inset ? appShellAsideInsetClasses : appShellAsideDockedClasses}
              onKeyDown={(event) => {
                if (event.key === "Escape" && !event.defaultPrevented) {
                  event.preventDefault();
                  closeDockedAside();
                }
              }}
            >
              <div className={overlayPanelSectionStackClasses}>
                <OverlayPanelHeader
                  titleId={`${asideId}-title`}
                  descriptionId={`${asideId}-description`}
                  title={asideTitle ?? slots.aside?.title ?? labels.aside}
                  description={asideDescription ?? slots.aside?.description}
                  closeLabel="Close panel"
                  onClose={closeDockedAside}
                  delineated={!inset}
                  className={inset ? appShellAsideInsetHeaderClasses : undefined}
                />
                <div className={cn(overlayPanelBodyScrollClasses, "pb-4")}>{aside}</div>
              </div>
            </aside>
    ) : null;

  function closeDockedAside() {
    const returnTo = asideReturnFocusRef.current;
    const focusInside = asideRef.current?.contains(document.activeElement) ?? false;
    setAsideOpen(false);
    if (focusInside) {
      if (returnTo?.isConnected) returnTo.focus();
      else document.getElementById(`${sidebarId}-main`)?.focus();
    }
  }

  const desktopLabel = sidebarOpen ? labels.collapse : labels.expand;
  const mainId = `${sidebarId}-main`;
  const brandRow = brand != null ? <div className={appShellBrandClasses}>{brand}</div> : null;
  const footerRow = sidebarFooter != null ? <div className={appShellSidebarFooterClasses}>{sidebarFooter}</div> : null;

  const toggle = hasSidebar ? (
    <Tooltip.Provider>
      <Tooltip>
        <Tooltip.Trigger
          render={
            <IconButton
              ref={desktopToggleRef}
              role="ghost"
              size="sm"
              title=""
              icon={<PanelLeft strokeWidth={2} />}
              aria-label={desktopLabel}
              aria-expanded={sidebarOpen}
              aria-controls={sidebarId}
              aria-keyshortcuts="Control+B Meta+B"
              className={appShellToggleDesktopClasses}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            />
          }
        />
        <Tooltip.Content>
          <span className="inline-flex items-center gap-2">
            {desktopLabel}
            <Kbd size="sm">Ctrl</Kbd>
            <Kbd size="sm">B</Kbd>
          </span>
        </Tooltip.Content>
      </Tooltip>
      {menuButton === "picker" ? (
        <Button
          role="ghost"
          size="sm"
          icon={<PanelLeft strokeWidth={2} />}
          aria-label={`${labels.menu}: ${title}`}
          aria-expanded={menuOpen}
          aria-haspopup="dialog"
          aria-keyshortcuts="Control+B Meta+B"
          // Button's label span may shrink, so the name truncates and the chevron stays on its line.
          className={cn(appShellToggleMobileClasses, "min-w-0 max-w-full [&>span:last-child]:min-w-0")}
          onClick={() => setMenuOpen(true)}
        >
          <span className="flex min-w-0 items-center gap-1">
            <span className="min-w-0 truncate">{title}</span>
            {/* A plain chevron, not `endIcon` (that's the filled square of a menu trigger). */}
            <ChevronDown strokeWidth={2} aria-hidden="true" className="size-4 shrink-0 text-muted" />
          </span>
        </Button>
      ) : menuButton === "label" ? (
        <Button
          role="ghost"
          size="sm"
          icon={<PanelLeft strokeWidth={2} />}
          aria-expanded={menuOpen}
          aria-haspopup="dialog"
          aria-keyshortcuts="Control+B Meta+B"
          className={cn(appShellToggleMobileClasses, "shrink-0")}
          onClick={() => setMenuOpen(true)}
        >
          {labels.menu}
        </Button>
      ) : (
        <IconButton
          role="ghost"
          size="sm"
          icon={<PanelLeft strokeWidth={2} />}
          aria-label={labels.menu}
          aria-expanded={menuOpen}
          aria-haspopup="dialog"
          aria-keyshortcuts="Control+B Meta+B"
          className={appShellToggleMobileClasses}
          onClick={() => setMenuOpen(true)}
        />
      )}
    </Tooltip.Provider>
  ) : null;

  return (
    <AppShellContext.Provider value={context}>
      <div className={cn(appShellRootClasses, className)}>
        <a
          href={`#${mainId}`}
          className={appShellSkipLinkClasses}
          onClick={(event) => {
            // Focus <main> without writing a hash into the URL, which an app's router may own.
            event.preventDefault();
            document.getElementById(mainId)?.focus();
          }}
        >
          {labels.skipToContent}
        </a>
        {hasSidebar ? (
          <div
            ref={sidebarRef}
            id={sidebarId}
            className={cn(appShellSidebarClasses, !sidebarOpen && "lg:!hidden")}
          >
            {brandRow}
            <div className={appShellSidebarBodyClasses}>{sidebar}</div>
            {footerRow}
          </div>
        ) : null}

        <div className={appShellCanvasClasses}>
          <div className={appShellSurfaceClasses}>
            {menuButton === "picker" ? (
              // The picker names the page below lg, so the h1 is visible only from lg (screen readers always get it).
              <PageHeader
                variant="app"
                aria-label={title}
                start={
                  <>
                    {toggle}
                    <h1 className={cn(pageHeaderTitleClasses.app, "max-lg:sr-only")}>{title}</h1>
                  </>
                }
                end={header}
              />
            ) : (
              <PageHeader variant="app" title={title} aria-label={title} start={toggle} end={header} />
            )}
            {toolbar != null ? <div className={appShellToolbarClasses}>{toolbar}</div> : null}
            {inset ? (
              <div className={appShellInsetRowClasses}>
                <main id={mainId} tabIndex={-1} className={appShellMainClasses}>
                  {slots.content}
                </main>
                {dockedAside}
              </div>
            ) : (
              <main id={mainId} tabIndex={-1} className={appShellMainClasses}>
                {slots.content}
              </main>
            )}
          </div>
          {docked && !inset ? dockedAside : null}
        </div>

        {hasSidebar ? (
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <Sheet.Content side="start" title={labels.menu}>
              {/* The click handler only closes the menu after a nav choice; it adds no control. */}
              <div className={appShellSheetBodyClasses} onClick={handleMenuClick}>
                {brandRow}
                <div className={appShellSidebarBodyClasses}>{sidebar}</div>
                {footerRow}
              </div>
            </Sheet.Content>
          </Sheet>
        ) : null}

        {hasAside && !docked && (asideMode === "overlay" || mediaKnown) ? (
          <Panel open={asideOpen} onOpenChange={setAsideOpen}>
            <Panel.Content
              side="end"
              title={asideTitle ?? slots.aside?.title ?? labels.aside}
              description={asideDescription ?? slots.aside?.description}
            >
              {aside}
            </Panel.Content>
          </Panel>
        ) : null}
      </div>
    </AppShellContext.Provider>
  );
}

/**
 * App chrome — a sidebar on the page background and the page as an inset, raised surface with a
 * title bar. Below `lg` the sidebar is a start **Sheet**; the optional aside is a non-blocking **Panel**,
 * or with `asideMode="docked"`, from `lg`, a column beside the page.
 */
export const AppShell = Object.assign(AppShellRoot, {
  Brand: AppShellBrand,
  Sidebar: AppShellSidebar,
  SidebarFooter: AppShellSidebarFooter,
  Header: AppShellHeader,
  Toolbar: AppShellToolbar,
  Aside: AppShellAside,
});
