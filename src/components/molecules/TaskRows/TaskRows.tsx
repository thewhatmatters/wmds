import {
  createContext,
  useContext,
  useMemo,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { Check, X } from "lucide-react";
import { Badge } from "../../atoms/Badge/Badge";
import { Button } from "../../atoms/Button/Button";
import { ButtonIcon } from "../../atoms/Button/ButtonIcon";
import { Status } from "../../atoms/Status/Status";
import { Accordion } from "../Accordion/Accordion";
import { cn } from "../../../lib/cn";
import {
  taskRowsDetailButtonClasses,
  taskRowsDetailLabelClasses,
  taskRowsDetailMetaClasses,
  taskRowsDetailRowClasses,
  taskRowsDetailRowInteractiveClasses,
  taskRowsDetailsActionsClasses,
  taskRowsDetailsChipsClasses,
  taskRowsDetailsExpandOnlyClasses,
  taskRowsDetailsGridClasses,
  taskRowsDetailsLabelClasses,
  taskRowsDetailsListClasses,
  taskRowsDetailsPanelClasses,
  taskRowsDetailsPlainClasses,
  taskRowsDetailsRailClasses,
  taskRowsMetaClasses,
  taskRowsStatusSlotClasses,
  taskRowsTrailingClusterClasses,
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
  /** `list` — inset panel with dividers. `capsule` — separated rounded rows. */
  variant?: TaskRowsVariant;
  /** List only — drop the standalone shell (radius, fill, shadow) inside **Card.Body**. */
  inset?: boolean;
  labels?: Partial<TaskRowsLabels>;
  className?: TaskRowsLayoutClassName;
}

export interface TaskRowsItemProps {
  /** Primary row label — task name, action title. */
  label: ReactNode;
  /** Trailing summary — convenience when `trailing` is omitted. Count, distance, duration. */
  meta?: ReactNode;
  /** Entire trailing cluster — any content. When set, replaces default `meta` + status pill composition. */
  trailing?: ReactNode;
  /** Entire leading column — any content. When set, replaces default status / icon composition. */
  leading?: ReactNode;
  /** Leading Lucide icon for expand-only rows — not combinable with `status` when `leading` is omitted. */
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

  return (
    <TaskRowsContext.Provider value={contextValue}>
      <Accordion variant={variant} inset={inset} className={className} {...props}>
        {children}
      </Accordion>
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
  trailing,
  leading,
  icon,
  status = "none",
  step,
  statusLabel,
  defaultOpen = false,
  open,
  onOpenChange,
  detailsLayout = "stack",
  detailsLabel,
  children,
  className,
}: TaskRowsItemProps) {
  const { labels } = useContext(TaskRowsContext);
  const hasDetails = children != null;
  const showLeading = leading != null || status !== "none" || icon != null;

  if (leading == null && icon != null && status !== "none") {
    console.warn("[WMDS TaskRows] `icon` is not combinable with `status` — icon is ignored.");
  }

  if (leading != null && (status !== "none" || icon != null)) {
    console.warn(
      "[WMDS TaskRows] `leading` replaces default status/icon composition — `status` still drives trailing pill when `trailing` is omitted.",
    );
  }

  const defaultLeading = (() => {
    if (status === "done") {
      return <Badge variant="success" icon={<Check strokeWidth={3.5} />} iconOnly />;
    }
    if (status === "failed") {
      return <Badge variant="destructive" icon={<X strokeWidth={3.5} />} iconOnly />;
    }
    if (status === "running" || status === "pending") {
      return <Status variant="ring" active={status === "running"} step={step} besideLabel />;
    }
    if (icon) {
      return (
        <span className="text-muted" aria-hidden>
          <ButtonIcon size="sm">{icon}</ButtonIcon>
        </span>
      );
    }
    return null;
  })();

  const leadingContent = leading ?? defaultLeading;

  const statusPill = (() => {
    if (statusLabel != null) return statusLabel;
    if (status === "done") {
      return (
        <Badge variant="success" emphasis="muted">
          {labels.completed}
        </Badge>
      );
    }
    if (status === "failed") {
      return (
        <Badge variant="destructive" emphasis="muted">
          {labels.failed}
        </Badge>
      );
    }
    return null;
  })();

  const hasTrailingCluster = trailing != null || meta != null || statusPill != null;

  const trailingClusterContent =
    trailing != null ? (
      trailing
    ) : (
      <>
        {meta != null ? <span className={taskRowsMetaClasses}>{meta}</span> : null}
        {statusPill}
      </>
    );

  return (
    <Accordion.Item
      label={label}
      leading={showLeading ? <span className={taskRowsStatusSlotClasses}>{leadingContent}</span> : undefined}
      trailing={hasTrailingCluster ? (
        <span className={taskRowsTrailingClusterClasses}>{trailingClusterContent}</span>
      ) : undefined}
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
      className={className}
    >
      {hasDetails ? (
        <TaskRowsItemDetails
          showLeading={showLeading}
          status={status}
          detailsLayout={detailsLayout}
          detailsLabel={detailsLabel}
        >
          {children}
        </TaskRowsItemDetails>
      ) : undefined}
    </Accordion.Item>
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
