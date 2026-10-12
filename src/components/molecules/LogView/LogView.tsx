import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Button, buttonStatusHoldMs } from "../../atoms/Button/Button";
import { Skeleton } from "../../atoms/Skeleton/Skeleton";
import { cn } from "../../../lib/cn";
import {
  logViewActionsClasses,
  logViewCountClasses,
  logViewEmptyClasses,
  logViewLineClasses,
  logViewNumberClasses,
  logViewRootClasses,
  logViewScrollerClasses,
  logViewSkeletonClasses,
  logViewTextClasses,
  logViewToolbarClasses,
} from "./logViewStyles";

/** Layout-only — height and margin. Not for re-theming the log. */
export type LogViewLayoutClassName = string;

export interface LogViewLabels {
  copy: string;
  copied: string;
  follow: string;
  following: string;
  empty: string;
}

export interface LogViewProps {
  /** Log text, one entry per line. */
  lines: readonly string[];
  /** Accessible name of the log, for example "Scan log". */
  label: string;
  /** When true, the scroller stays on the last line. */
  follow?: boolean;
  onFollowChange?: (follow: boolean) => void;
  /** Skeleton in the scroller. The line count stays hidden. */
  loading?: boolean;
  /** Replaces the lines when there are none. Default: "No log lines". */
  empty?: ReactNode;
  labels?: Partial<LogViewLabels>;
  className?: LogViewLayoutClassName;
}

const defaultLabels: LogViewLabels = {
  copy: "Copy",
  copied: "Copied",
  follow: "Follow",
  following: "Following",
  empty: "No log lines",
};

function lineCountLabel(count: number): string {
  return count === 1 ? "1 line" : `${count} lines`;
}

/**
 * Scrolling log — line numbers, a tabular count, Copy, and Follow.
 * Compose it inside a dark detail pane. The pane owns `data-theme`.
 */
export function LogView({
  lines,
  label,
  follow = false,
  onFollowChange,
  loading = false,
  empty,
  labels: labelsProp,
  className,
}: LogViewProps) {
  const labels = { ...defaultLabels, ...labelsProp };
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const count = lines.length;
  const showLines = !loading && count > 0;

  useLayoutEffect(() => {
    if (!follow || !showLines) return;
    const node = scrollerRef.current;
    if (node == null) return;
    node.scrollTop = node.scrollHeight;
  }, [follow, lines, showLines]);

  useLayoutEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), buttonStatusHoldMs);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copy() {
    const text = lines.join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className={cn(logViewRootClasses, className)} data-follow={follow ? "" : undefined}>
      <div className={logViewToolbarClasses}>
        {loading ? null : (
          <span className={logViewCountClasses}>{lineCountLabel(count)}</span>
        )}
        <div className={logViewActionsClasses}>
          <Button
            role="secondary"
            size="xs"
            type="button"
            disabled={loading || count === 0}
            onClick={() => {
              void copy();
            }}
          >
            {copied ? labels.copied : labels.copy}
          </Button>
          <Button
            role="ghost"
            size="xs"
            type="button"
            aria-pressed={follow}
            disabled={loading}
            onClick={() => onFollowChange?.(!follow)}
          >
            {follow ? labels.following : labels.follow}
          </Button>
        </div>
      </div>
      <div
        ref={scrollerRef}
        className={logViewScrollerClasses}
        role="log"
        aria-label={label}
        aria-busy={loading || undefined}
      >
        {loading ? <Skeleton className={logViewSkeletonClasses} width="100%" height={96} radius="inner" /> : null}
        {!loading && count === 0 ? (
          <p className={logViewEmptyClasses} role="status">
            {empty ?? labels.empty}
          </p>
        ) : null}
        {showLines
          ? lines.map((line, index) => (
              <div key={`${index}-${line}`} className={logViewLineClasses}>
                <span className={logViewNumberClasses} aria-hidden="true">
                  {index + 1}
                </span>
                <span className={logViewTextClasses}>{line}</span>
              </div>
            ))
          : null}
      </div>
    </div>
  );
}
