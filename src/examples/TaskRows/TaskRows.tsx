"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Badge } from "../../components/Badge/Badge";
import { Card } from "../../components/Card/Card";
import { List } from "../../components/List/List";
import { StatusRing } from "../../components/StatusRing/StatusRing";
import { cn } from "../../lib/cn";
import { semanticStatusDotClasses } from "../../lib/semanticVariants";

/* ─────────────────────────────────────────────────────────
 * TASK ROWS — agent task list specimen (Examples only).
 *
 *     0ms   rows enter staggered (80ms apart)
 *   600ms   row 1 ring sweeps
 *  1500ms   row 1 expands — detail steps drop down
 *  3900ms   row 1 collapses; row 2 flips to Failed + retry
 *  5300ms   row 2 resolves to Completed
 * ───────────────────────────────────────────────────────── */

const TICKS = [600, 900, 2400, 1400, 2400, 600];

function useTick(intervals: number[]) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (tick >= intervals.length - 1) return;
    const timer = window.setTimeout(() => setTick((value) => value + 1), intervals[tick]);
    return () => window.clearTimeout(timer);
  }, [tick, intervals]);
  return tick;
}

function StepBadge({ tone, children }: { tone: "destructive" | "success"; children: ReactNode }) {
  return (
    <span
      className={cn(
        "flex size-[22px] shrink-0 items-center justify-center rounded-full text-success-foreground",
        semanticStatusDotClasses[tone],
      )}
      style={{ animation: "pop-in 300ms cubic-bezier(0.23,1,0.32,1) both" }}
    >
      {children}
    </span>
  );
}

const XIcon = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);
const CheckIcon = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);
const RetryIcon = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6" />
  </svg>
);

export interface TaskRowsProps {
  /** `contained` — Card + dividers; `separated` — raised row chips. */
  variant?: "contained" | "separated";
}

export function TaskRows({ variant = "contained" }: TaskRowsProps) {
  const tick = useTick(TICKS);
  const [manualOpen, setManualOpen] = useState<Record<string, boolean>>({});
  const row2State: "pending" | "failed" | "done" = tick < 3 ? "pending" : tick === 3 ? "failed" : "done";

  const rows = [
    {
      key: "verify",
      badge: (
        <StepBadge tone="success">{CheckIcon}</StepBadge>
      ),
      label: "Verified vendor records",
      meta: "12 suppliers",
      pill: <Badge variant="success">Completed</Badge>,
      details: [
        { label: "Matched tax and contact IDs", meta: "12/12" },
        { label: "Flagged stale records", meta: "0" },
      ],
    },
    {
      key: "index",
      badge: (
        <StatusRing count={2} active={tick >= 1 && tick < 3} decorative />
      ),
      label: "Build reorder task list",
      meta: "7 SKUs",
      pill: null,
      details: [
        { label: "Reading POS export", meta: "3 files" },
        { label: "Scoring stockout risk", meta: "68%" },
      ],
    },
    {
      key: "draft",
      badge:
        row2State === "pending" ? (
          <StatusRing count={3} active={false} decorative />
        ) : row2State === "failed" ? (
          <StepBadge tone="destructive">{XIcon}</StepBadge>
        ) : (
          <StepBadge tone="success">{CheckIcon}</StepBadge>
        ),
      label: "Draft supplier emails",
      meta: "2 messages",
      pill:
        row2State === "failed" ? (
          <Badge variant="destructive" endSlot={<span className="inline-flex animate-spin">{RetryIcon}</span>}>
            Failed
          </Badge>
        ) : row2State === "done" ? (
          <Badge variant="success">Completed</Badge>
        ) : null,
      details: [
        { label: "Cone supplier follow-up", meta: "draft" },
        { label: "Pistachio reorder note", meta: "draft" },
      ],
    },
  ] as const;

  const list = (
    <List variant={variant}>
      {rows.map((row, index) => {
        const open = manualOpen[row.key] ?? (row.key === "index" && tick === 2);
        return (
          <List.Item
            key={row.key}
            style={{
              animation: `fade-up 450ms cubic-bezier(0.23,1,0.32,1) ${index * 80}ms both`,
            }}
          >
            <List.ItemButton
              aria-expanded={open}
              onClick={() =>
                setManualOpen((current) => ({ ...current, [row.key]: !open }))
              }
            >
              <List.ItemMedia>{row.badge}</List.ItemMedia>
              <List.ItemLabel>{row.label}</List.ItemLabel>
              <List.ItemMeta>{row.meta}</List.ItemMeta>
              {row.pill ? <List.ItemTrailing>{row.pill}</List.ItemTrailing> : null}
              <List.ItemChevron open={open} />
            </List.ItemButton>
            <List.ItemPanel open={open}>
              <List.ItemDetailRail />
              <List.ItemDetailGroup>
                {row.details.map((detail, detailIndex) => (
                  <List.ItemDetail
                    key={detail.label}
                    label={detail.label}
                    meta={detail.meta}
                    style={
                      open
                        ? {
                            animation: `fade-up 300ms cubic-bezier(0.23,1,0.32,1) ${120 + detailIndex * 100}ms both`,
                          }
                        : undefined
                    }
                  />
                ))}
              </List.ItemDetailGroup>
            </List.ItemPanel>
          </List.Item>
        );
      })}
    </List>
  );

  if (variant === "contained") {
    return (
      <Card variant="outlined" elevation="raised" padding="none" className="w-full max-w-md">
        {list}
      </Card>
    );
  }

  return <div className="w-full max-w-md">{list}</div>;
}
