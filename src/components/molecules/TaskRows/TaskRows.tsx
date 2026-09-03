import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { Check, ChevronDown, RotateCw, X } from "lucide-react";
import { Button } from "../../atoms/Button/Button";
import { cn } from "../../../lib/cn";
import {
  taskRowsChevronButtonClasses,
  taskRowsChevronClasses,
  taskRowsChevronOpenClasses,
  taskRowsDetailButtonClasses,
  taskRowsDetailLabelClasses,
  taskRowsDetailMetaClasses,
  taskRowsDetailRowClasses,
  taskRowsDetailRowInteractiveClasses,
  taskRowsDetailsActionsClasses,
  taskRowsDetailsChipsClasses,
  taskRowsDetailsExpandOnlyClasses,
  taskRowsDetailsGridClasses,
  taskRowsDetailsInnerClasses,
  taskRowsDetailsLabelClasses,
  taskRowsDetailsListClasses,
  taskRowsDetailsPanelClasses,
  taskRowsDetailsPlainClasses,
  taskRowsDetailsRailClasses,
  taskRowsExpandGridClasses,
  taskRowsExpandGridClosedClasses,
  taskRowsExpandGridOpenClasses,
  taskRowsItemCapsuleClasses,
  taskRowsItemCapsuleClosedClasses,
  taskRowsItemCapsuleOpenClasses,
  taskRowsItemHoverClasses,
  taskRowsItemListClasses,
  taskRowsLabelClasses,
  taskRowsLeadingIconClasses,
  taskRowsMetaClasses,
  taskRowsRootCapsuleClasses,
  taskRowsRootListClasses,
  taskRowsRootListInsetClasses,
  taskRowsStatusBadgeBaseClasses,
  taskRowsStatusBadgeDoneClasses,
  taskRowsStatusBadgeFailedClasses,
  taskRowsStatusPillBaseClasses,
  taskRowsStatusPillDoneClasses,
  taskRowsStatusPillFailedClasses,
  taskRowsStatusSlotClasses,
  taskRowsTriggerClasses,
  type TaskRowStatus,
  type TaskRowsDetailLayout,
  type TaskRowsDetailVariant,
  type TaskRowsVariant,
} from "./taskRowsStyles";

export type { TaskRowStatus, TaskRowsDetailLayout, TaskRowsDetailVariant, TaskRowsVariant } from "./taskRowsStyles";
export {
  taskRowStatuses,
  taskRowsDetailLayouts,
  taskRowsDetailVariants,
  taskRowsVariants,
} from "./taskRowsStyles";

/** Layout-only — not for row colors or status styling overrides. */
export type TaskRowsLayoutClassName = string;

export interface TaskRowsLabels {
  completed: string;
  failed: string;
}

const DEFAULT_LABELS: TaskRowsLabels = {
  completed: "Completed",
  failed: "Failed",
};

interface TaskRowsContextValue {
  variant: TaskRowsVariant;
  labels: TaskRowsLabels;
}

const TaskRowsContext = createContext<TaskRowsContextValue>({
  variant: "list",
  labels: DEFAULT_LABELS,
});

export interface TaskRowsProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** `list` — inset panel with dividers (FM map card). `capsule` — separated rounded rows. */
  variant?: TaskRowsVariant;
  /** List only — drop the standalone shell (radius, fill, shadow) inside **Card.Body**. */
  inset?: boolean;
  labels?: Partial<TaskRowsLabels>;
  className?: TaskRowsLayoutClassName;
}

export interface TaskRowsItemProps {
  /** Primary row label — task name, action title. */
  label: ReactNode;
  /** Trailing summary — count, distance, duration. */
  meta?: ReactNode;
  /** Leading Lucide icon for expand-only rows — not combinable with `status`. */
  icon?: ReactElement;
  /** Progress / task status UI. Omit or `none` for expandable action rows (FM). */
  status?: TaskRowStatus;
  /** Step number inside running / pending ring. */
  step?: number;
  /** Override default completed / failed pill copy. */
  statusLabel?: ReactNode;
  /** Uncontrolled expand. */
  defaultOpen?: boolean;
  /** Controlled expand. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** `stack` — label / meta lines. `actions` — map app buttons. `chips` — read-only Chip row. */
  detailsLayout?: TaskRowsDetailLayout;
  /** Optional lead-in above details — e.g. "Open in". */
  detailsLabel?: ReactNode;
  /** Detail lines — use `TaskRows.Detail`. */
  children?: ReactNode;
  className?: TaskRowsLayoutClassName;
}

export interface TaskRowsDetailProps {
  label: ReactNode;
  meta?: ReactNode;
  /** `row` — stacked detail line. `button` — secondary pill in `detailsLayout="actions"`. */
  variant?: TaskRowsDetailVariant;
  /** Leading Lucide icon — `detailsLayout="actions"` button rows (e.g. Apple, Google). */
  icon?: ReactElement;
  onPress?: () => void;
  className?: TaskRowsLayoutClassName;
}

function TaskRowStatusRing({ active, step }: { active?: boolean; step?: number }) {
  const size = 24;
  const stroke = 2;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg
        width={size}
        height={size}
        className={cn("absolute inset-0", active && "animate-spin")}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="stroke-border"
          strokeWidth={stroke}
        />
        {active ? (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            className="stroke-muted"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference * 0.28} ${circumference * 0.72}`}
          />
        ) : null}
      </svg>
      {step != null ? (
        <span className="relative text-[0.65625rem] font-semibold tabular-nums text-fg">{step}</span>
      ) : null}
    </span>
  );
}

function TaskRowStatusBadge({ status }: { status: Exclude<TaskRowStatus, "none" | "running" | "pending"> }) {
  return (
    <span
      className={cn(
        taskRowsStatusBadgeBaseClasses,
        status === "done" ? taskRowsStatusBadgeDoneClasses : taskRowsStatusBadgeFailedClasses,
      )}
      aria-hidden
    >
      {status === "done" ? (
        <Check strokeWidth={3.5} className="size-3 stroke-current" />
      ) : (
        <X strokeWidth={3.5} className="size-3 stroke-current" />
      )}
    </span>
  );
}

function TaskRowsRoot({
  variant = "list",
  inset = false,
  labels,
  className,
  children,
  ...props
}: TaskRowsProps) {
  const contextValue = useMemo(
    () => ({
      variant,
      labels: { ...DEFAULT_LABELS, ...labels },
    }),
    [labels, variant],
  );

  const rootListClasses =
    variant === "list" && inset ? taskRowsRootListInsetClasses : taskRowsRootListClasses;

  return (
    <TaskRowsContext.Provider value={contextValue}>
      <div
        className={cn(
          variant === "list" ? rootListClasses : taskRowsRootCapsuleClasses,
          className,
        )}
        data-variant={variant}
        data-inset={inset ? "true" : undefined}
        {...props}
      >
        {children}
      </div>
    </TaskRowsContext.Provider>
  );
}

function taskRowsExpandOnlyDetailsClasses(layout: TaskRowsDetailLayout): string {
  if (layout === "actions") return taskRowsDetailsActionsClasses;
  if (layout === "chips") return taskRowsDetailsChipsClasses;
  return taskRowsDetailsPlainClasses;
}

function TaskRowsItemDetails({
  showLeading,
  status,
  detailsLayout,
  detailsLabel,
  children,
}: {
  showLeading: boolean;
  status: TaskRowStatus;
  detailsLayout: TaskRowsDetailLayout;
  detailsLabel?: ReactNode;
  children: ReactNode;
}) {
  if (showLeading) {
    return (
      <div className={taskRowsDetailsGridClasses}>
        <span aria-hidden className={taskRowsDetailsRailClasses} />
        {status !== "none" ? (
          <div className={taskRowsDetailsListClasses}>{children}</div>
        ) : (
          <div className={taskRowsDetailsPanelClasses}>
            {detailsLabel ? <p className={taskRowsDetailsLabelClasses}>{detailsLabel}</p> : null}
            <div className={taskRowsExpandOnlyDetailsClasses(detailsLayout)}>{children}</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={taskRowsDetailsExpandOnlyClasses}>
      {detailsLabel ? <p className={taskRowsDetailsLabelClasses}>{detailsLabel}</p> : null}
      <div className={taskRowsExpandOnlyDetailsClasses(detailsLayout)}>{children}</div>
    </div>
  );
}

function TaskRowsItem({
  label,
  meta,
  icon,
  status = "none",
  step,
  statusLabel,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  detailsLayout = "stack",
  detailsLabel,
  children,
  className,
}: TaskRowsItemProps) {
  const { variant, labels } = useContext(TaskRowsContext);
  const detailId = useId();
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;
  const hasDetails = children != null;
  const showLeading = status !== "none" || icon != null;

  if (icon != null && status !== "none") {
    console.warn("[WMDS TaskRows] `icon` is not combinable with `status` — icon is ignored.");
  }

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setInternalOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const statusBadge = (() => {
    if (status === "none") return null;
    if (status === "done" || status === "failed") {
      return <TaskRowStatusBadge status={status} />;
    }
    return <TaskRowStatusRing active={status === "running"} step={step} />;
  })();

  const statusPill = (() => {
    if (statusLabel != null) return statusLabel;
    if (status === "done") {
      return (
        <span className={cn(taskRowsStatusPillBaseClasses, taskRowsStatusPillDoneClasses)}>
          {labels.completed}
        </span>
      );
    }
    if (status === "failed") {
      return (
        <span className={cn(taskRowsStatusPillBaseClasses, taskRowsStatusPillFailedClasses)}>
          {labels.failed}
          <RotateCw strokeWidth={3} className="size-3 animate-spin stroke-current" aria-hidden />
        </span>
      );
    }
    return null;
  })();

  const trigger = (
    <>
      {showLeading ? (
        <span className={taskRowsStatusSlotClasses}>
          {status !== "none" ? (
            statusBadge
          ) : icon ? (
            <span className={taskRowsLeadingIconClasses} aria-hidden>
              {icon}
            </span>
          ) : null}
        </span>
      ) : null}
      <span className={taskRowsLabelClasses}>{label}</span>
      {meta ? <span className={taskRowsMetaClasses}>{meta}</span> : null}
      {statusPill}
      {hasDetails ? (
        <span className={taskRowsChevronButtonClasses} aria-hidden>
          <ChevronDown
            strokeWidth={2.2}
            className={cn(taskRowsChevronClasses, open && taskRowsChevronOpenClasses)}
          />
        </span>
      ) : null}
    </>
  );

  return (
    <div
      className={cn(
        variant === "list" ? taskRowsItemListClasses : taskRowsItemCapsuleClasses,
        variant === "capsule" &&
          (open ? taskRowsItemCapsuleOpenClasses : taskRowsItemCapsuleClosedClasses),
        hasDetails && taskRowsItemHoverClasses,
        className,
      )}
    >
      {hasDetails ? (
        <button
          type="button"
          className={taskRowsTriggerClasses}
          aria-expanded={open}
          aria-controls={detailId}
          onClick={() => setOpen(!open)}
        >
          {trigger}
        </button>
      ) : (
        <div className={taskRowsTriggerClasses}>{trigger}</div>
      )}

      {hasDetails ? (
        <div
          id={detailId}
          className={cn(
            taskRowsExpandGridClasses,
            open ? taskRowsExpandGridOpenClasses : taskRowsExpandGridClosedClasses,
          )}
        >
          <div className={taskRowsDetailsInnerClasses}>
            <TaskRowsItemDetails
              showLeading={showLeading}
              status={status}
              detailsLayout={detailsLayout}
              detailsLabel={detailsLabel}
            >
              {children}
            </TaskRowsItemDetails>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function TaskRowsDetail({
  label,
  meta,
  variant = "row",
  icon,
  onPress,
  className,
}: TaskRowsDetailProps) {
  if (variant === "button") {
    return (
      <Button
        role="secondary"
        size="sm"
        type="button"
        icon={icon}
        className={cn(taskRowsDetailButtonClasses, className)}
        onClick={onPress}
      >
        {label}
      </Button>
    );
  }

  const content = (
    <>
      <span className={taskRowsDetailLabelClasses}>{label}</span>
      {meta ? <span className={taskRowsDetailMetaClasses}>{meta}</span> : null}
    </>
  );

  if (onPress) {
    return (
      <button
        type="button"
        onClick={onPress}
        className={cn(taskRowsDetailRowClasses, taskRowsDetailRowInteractiveClasses, className)}
      >
        {content}
      </button>
    );
  }

  return <div className={cn(taskRowsDetailRowClasses, className)}>{content}</div>;
}

export const TaskRows = Object.assign(TaskRowsRoot, {
  Item: TaskRowsItem,
  Detail: TaskRowsDetail,
});
