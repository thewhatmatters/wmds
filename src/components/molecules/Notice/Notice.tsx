import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactElement,
  type ReactNode,
} from "react";
import { CircleCheck, CircleX, Info, TriangleAlert, X } from "lucide-react";
import { Badge, type BadgeVariant } from "../../atoms/Badge/Badge";
import { IconButton } from "../../atoms/IconButton/IconButton";
import { cn } from "../../../lib/cn";
import {
  noticeActionClasses,
  noticeBodyClasses,
  noticeClasses,
  noticeContentClasses,
  noticeDismissClasses,
  noticeIconClasses,
  noticeTitleClasses,
  noticeToneClasses,
  type NoticeTone,
} from "./noticeStyles";

export { noticeTones, type NoticeTone } from "./noticeStyles";

/** Layout-only — width, margin, grid placement. Not for colour or type. */
export type NoticeLayoutClassName = string;

/** `localStorage` key prefix for a notice dismissed with `dismissKey`. */
export const noticeStoragePrefix = "wmds-notice:";

/** `alert` interrupts the screen reader; `status` waits for a pause. */
export type NoticeLiveRole = "alert" | "status";

export interface NoticeProps {
  /** Default `neutral`. `error` is for something that failed, not for emphasis. */
  tone?: NoticeTone;
  /** Short lead line in `ui-label`. */
  title?: ReactNode;
  /** Supporting copy in `caption`. */
  children?: ReactNode;
  /** A **TextLink** or a small **Button** under the copy. */
  action?: ReactNode;
  /**
   * Replace the tone's icon (a Lucide element), or `false` for none. Default: Info, CircleCheck,
   * TriangleAlert or CircleX by tone.
   */
  icon?: ReactElement | false;
  /** Show a Dismiss button. */
  dismissible?: boolean;
  /** Accessible name of the Dismiss button. @default "Dismiss" */
  dismissLabel?: string;
  /** Called once when the visitor dismisses the notice. */
  onDismiss?: () => void;
  /**
   * Remember the dismissal in `localStorage` under `wmds-notice:<key>`, so the notice stays hidden
   * on later visits. Change the key (for example `holiday-2026`) to show a new notice again.
   * Server HTML always includes the notice; a visitor who dismissed it sees it removed on hydration.
   */
  dismissKey?: string;
  /**
   * Announce the notice when it appears after load (a sync failure, a form result). `error` uses
   * `role="alert"`, the others `role="status"`; pass `"alert"` or `"status"` to choose the role
   * yourself. Leave off for a notice that is part of the page.
   */
  live?: boolean | NoticeLiveRole;
  id?: string;
  className?: NoticeLayoutClassName;
}

const noticeToneBadge: Record<NoticeTone, BadgeVariant> = {
  neutral: "neutral",
  info: "info",
  success: "success",
  warning: "warning",
  error: "destructive",
};

function noticeToneIcon(tone: NoticeTone): ReactElement {
  if (tone === "success") return <CircleCheck />;
  if (tone === "warning") return <TriangleAlert />;
  if (tone === "error") return <CircleX />;
  return <Info />;
}

// Persisted dismissals: one listener set for every Notice, plus the cross-tab `storage` event.
const storeListeners = new Set<() => void>();

function subscribeToDismissals(listener: () => void): () => void {
  storeListeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    storeListeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function readDismissed(key: string): boolean {
  try {
    return window.localStorage.getItem(noticeStoragePrefix + key) === "1";
  } catch {
    return false;
  }
}

function writeDismissed(key: string) {
  try {
    window.localStorage.setItem(noticeStoragePrefix + key, "1");
  } catch {
    // Storage blocked (private mode, quota): the notice still hides for this page view.
  }
  storeListeners.forEach((listener) => listener());
}

const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** The next focusable element after `root` in document order, else the one before it. */
function focusTargetAfter(root: HTMLElement): HTMLElement | null {
  const candidates = Array.from(
    root.ownerDocument.querySelectorAll<HTMLElement>(focusableSelector),
  ).filter((element) => !root.contains(element));
  const after = candidates.find(
    (element) => root.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING,
  );
  if (after != null) return after;
  const before = candidates.filter(
    (element) => root.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_PRECEDING,
  );
  return before.at(-1) ?? null;
}

/** Inline callout: closures, buyouts, "account not connected", "sync failed". */
export function Notice({
  tone = "neutral",
  title,
  children,
  action,
  icon,
  dismissible = false,
  dismissLabel = "Dismiss",
  onDismiss,
  dismissKey,
  live = false,
  id,
  className,
}: NoticeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const focusAfterDismiss = useRef<HTMLElement | null>(null);
  const [dismissedHere, setDismissedHere] = useState(false);
  const persistedDismissed = useSyncExternalStore(
    subscribeToDismissals,
    () => (dismissKey != null ? readDismissed(dismissKey) : false),
    () => false,
  );
  const dismissed = dismissedHere || persistedDismissed;

  useEffect(() => {
    if (!dismissedHere) return;
    focusAfterDismiss.current?.focus();
    focusAfterDismiss.current = null;
  }, [dismissedHere]);

  const dismiss = useCallback(() => {
    const root = rootRef.current;
    // Only move focus when it was inside the notice, so it never lands on <body>.
    if (root != null && root.contains(root.ownerDocument.activeElement)) {
      focusAfterDismiss.current = focusTargetAfter(root);
    }
    setDismissedHere(true);
    if (dismissKey != null) writeDismissed(dismissKey);
    onDismiss?.();
  }, [dismissKey, onDismiss]);

  if (dismissed) return null;

  const role =
    live === true ? (tone === "error" ? "alert" : "status") : live === false ? undefined : live;
  const iconElement = icon === false ? null : (icon ?? noticeToneIcon(tone));

  return (
    <div
      ref={rootRef}
      id={id}
      role={role}
      data-tone={tone}
      className={cn(noticeClasses, noticeToneClasses[tone], className)}
    >
      {iconElement != null ? (
        <Badge
          iconOnly
          icon={iconElement}
          variant={noticeToneBadge[tone]}
          className={noticeIconClasses}
        />
      ) : null}
      <div className={noticeContentClasses}>
        {title != null ? <p className={noticeTitleClasses}>{title}</p> : null}
        {children != null ? <div className={noticeBodyClasses}>{children}</div> : null}
        {action != null ? <div className={noticeActionClasses}>{action}</div> : null}
      </div>
      {dismissible ? (
        <IconButton
          size="xs"
          role="ghost"
          icon={<X />}
          aria-label={dismissLabel}
          className={noticeDismissClasses}
          onClick={dismiss}
        />
      ) : null}
    </div>
  );
}
