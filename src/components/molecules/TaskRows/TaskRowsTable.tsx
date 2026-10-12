import { Children, type CSSProperties, type HTMLAttributes, type ReactElement, type ReactNode } from "react";
import { Badge } from "../../atoms/Badge/Badge";
import { Skeleton } from "../../atoms/Skeleton/Skeleton";
import { Status, type StatusTone } from "../../atoms/Status/Status";
import { TextLink } from "../../atoms/TextLink/TextLink";
import { cn } from "../../../lib/cn";
import {
  taskRowsTableAlignEndClasses,
  taskRowsTableClasses,
  taskRowsTableColumnsClasses,
  taskRowsTableDetailClasses,
  taskRowsTableEmptyClasses,
  taskRowsTableErrorClasses,
  taskRowsTableHeadCellClasses,
  taskRowsTableHeadClasses,
  taskRowsTableMetricClasses,
  taskRowsTableMetricValueClasses,
  taskRowsTableMobileLineClasses,
  taskRowsTableNoteClasses,
  taskRowsTableRowClasses,
  taskRowsTableStatusClasses,
  taskRowsTableStatusLabelClasses,
  taskRowsTableTitleClasses,
  taskRowsTableWaitingClasses,
} from "./taskRowsStyles";

export const taskRowsTableColumnIds = ["title", "waiting", "metric"] as const;

export type TaskRowsTableColumnId = (typeof taskRowsTableColumnIds)[number];

export const taskRowsTableSources = ["ready", "loading", "error", "unwired"] as const;

export type TaskRowsTableSource = (typeof taskRowsTableSources)[number];

export interface TaskRowsColumn {
  id: TaskRowsTableColumnId;
  header: string;
  align?: "start" | "end";
  /** CSS grid track, applied from `md`. Example: `"8rem"`. */
  width?: string;
}

export const taskRowsTableColumnsDefault: TaskRowsColumn[] = [
  { id: "title", header: "Item" },
  { id: "waiting", header: "Waiting" },
  { id: "metric", header: "Metric", align: "end" },
];

export interface TaskRowsTableStatus {
  tone?: StatusTone;
  label: string;
  pulsing?: boolean;
}

export interface TaskRowsTableWaiting {
  /** Pill label — "22 creators". */
  label: string;
  /** Line under the pill — "4 waiting over 5 days". */
  detail?: string;
}

export interface TaskRowsTableMetric {
  value: string;
  detail?: string;
}

export interface TaskRowsRowProps {
  title: string;
  /** Plain anchor. `render` wins when both are set. */
  href?: string;
  /** Router link — `render={<Link href="/campaigns/stir" />}`. */
  render?: ReactElement;
  /** Dot and a label such as "Open · 2d". */
  status?: TaskRowsTableStatus;
  waiting?: TaskRowsTableWaiting;
  metric?: TaskRowsTableMetric;
  /** `ready` shows the cells. `loading` is a skeleton. `error` and `unwired` show `note`. */
  source?: TaskRowsTableSource;
  /** Error copy, or the footer note when the source is not wired. */
  note?: string;
}

export function TaskRowsTable({
  columns = taskRowsTableColumnsDefault,
  empty = "Nothing waiting",
  className,
  children,
  ...props
}: {
  columns?: TaskRowsColumn[];
  empty?: ReactNode;
  className?: string;
  children?: ReactNode;
} & HTMLAttributes<HTMLDivElement>) {
  const rows = Children.toArray(children).filter(Boolean);
  const tracks = ["minmax(0,1.6fr)", "minmax(0,1.2fr)", "7rem"];
  const template = columns
    .map((column, index) => column.width ?? tracks[index] ?? "minmax(0,1fr)")
    .join(" ");
  const gridStyle = { "--task-rows-columns": template } as CSSProperties;

  return (
    <div
      {...props}
      role="table"
      className={cn(taskRowsTableClasses, className)}
      style={{ ...props.style, ...gridStyle }}
    >
      <div role="row" className={cn(taskRowsTableHeadClasses, taskRowsTableColumnsClasses)}>
        {columns.map((column) => (
          <div
            key={column.id}
            role="columnheader"
            className={cn(
              taskRowsTableHeadCellClasses,
              column.align === "end" && taskRowsTableAlignEndClasses,
            )}
          >
            {column.header}
          </div>
        ))}
      </div>
      {rows.length === 0 ? (
        <p className={taskRowsTableEmptyClasses} role="status">
          {empty}
        </p>
      ) : (
        rows
      )}
    </div>
  );
}

function hasColumn(columns: TaskRowsColumn[], id: TaskRowsTableColumnId): boolean {
  return columns.some((column) => column.id === id);
}

function columnAlign(columns: TaskRowsColumn[], id: TaskRowsTableColumnId): "start" | "end" {
  return columns.find((column) => column.id === id)?.align ?? "start";
}

export function TaskRowsRow({
  title,
  href,
  render,
  status,
  waiting,
  metric,
  source = "ready",
  note,
  columns,
}: TaskRowsRowProps & { columns: TaskRowsColumn[] }) {
  const showWaiting = hasColumn(columns, "waiting");
  const showMetric = hasColumn(columns, "metric");
  const metricEnd = columnAlign(columns, "metric") === "end";
  const blocked = source === "error" || source === "unwired";

  return (
    <div
      role="row"
      className={cn(taskRowsTableRowClasses, taskRowsTableColumnsClasses)}
      aria-busy={source === "loading" || undefined}
    >
      <div role="cell" className="min-w-0">
        {source === "loading" ? (
          <Skeleton width={168} height={16} radius="inner" index={0} />
        ) : (
          <h3 className={taskRowsTableTitleClasses}>
            <TaskRowsRowTitle title={title} href={href} render={render} />
          </h3>
        )}
        {source === "loading" ? (
          <Skeleton width={120} height={12} radius="inner" index={1} className="mt-2 md:hidden" />
        ) : null}
        {blocked && note ? (
          <p className={source === "error" ? taskRowsTableErrorClasses : taskRowsTableNoteClasses}>{note}</p>
        ) : null}
        {source === "ready" && status ? (
          <div className="mt-1 max-md:hidden md:block">
            <TaskRowsStatus status={status} />
          </div>
        ) : null}
        {source === "ready" ? (
          <div className={taskRowsTableMobileLineClasses}>
            {status ? <TaskRowsStatus status={status} /> : null}
            {showWaiting && waiting?.detail ? (
              <span className={taskRowsTableDetailClasses}>{waiting.detail}</span>
            ) : null}
            {showMetric && metric ? (
              <span className={taskRowsTableMetricValueClasses}>{metric.value}</span>
            ) : null}
          </div>
        ) : null}
      </div>
      {showWaiting ? (
        <div role="cell" className="max-md:hidden min-w-0 md:block">
          {source === "loading" ? <Skeleton width={112} height={20} radius="full" index={2} /> : null}
          {source === "ready" && waiting ? (
            <span className={taskRowsTableWaitingClasses}>
              <Badge emphasis="muted" size="sm">
                {waiting.label}
              </Badge>
              {waiting.detail ? <span className={taskRowsTableDetailClasses}>{waiting.detail}</span> : null}
            </span>
          ) : null}
        </div>
      ) : null}
      {showMetric ? (
        <div role="cell" className={cn("max-md:hidden min-w-0 md:block", metricEnd && taskRowsTableAlignEndClasses)}>
          {source === "loading" ? (
            <Skeleton width={40} height={16} radius="inner" index={3} className="md:ml-auto" />
          ) : null}
          {source === "ready" && metric ? (
            <span className={taskRowsTableMetricClasses}>
              <span className={taskRowsTableMetricValueClasses}>{metric.value}</span>
              {metric.detail ? <span className={taskRowsTableDetailClasses}>{metric.detail}</span> : null}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function TaskRowsStatus({ status }: { status: TaskRowsTableStatus }) {
  return (
    <span className={taskRowsTableStatusClasses}>
      <Status variant="dot" tone={status.tone ?? "neutral"} besideLabel pulsing={status.pulsing} />
      <span className={taskRowsTableStatusLabelClasses}>{status.label}</span>
    </span>
  );
}

function TaskRowsRowTitle({
  title,
  href,
  render,
}: {
  title: string;
  href?: string;
  render?: ReactElement;
}) {
  if (render) {
    if (href != null) {
      console.warn("[WMDS TaskRows] `render` wins over `href`.");
    }
    return (
      <TextLink variant="quiet" render={render}>
        {title}
      </TextLink>
    );
  }
  if (href != null) {
    return (
      <TextLink variant="quiet" href={href}>
        {title}
      </TextLink>
    );
  }
  return title;
}
