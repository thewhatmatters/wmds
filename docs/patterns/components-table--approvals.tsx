// @thewhatmatters/wmds@0.4.41 · Pattern — approvals queue
// Storybook: Components/Table → Pattern — approvals queue (?path=/story/components-table--approvals)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Check, X } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@thewhatmatters/wmds";

export type ApprovalDecision = "approved" | "denied";

export interface ApprovalItem {
  id: string;
  name: string;
  kind: string;
  waiting: string;
}

export interface ApprovalsQueueProps {
  items: ApprovalItem[];
  onDecision?: (item: ApprovalItem, decision: ApprovalDecision) => void;
}

type ApprovalView = "table" | "card";

/** The row's buttons. `table` sits them side by side; `card` gives each half the row. */
function ActionGroup({
  label,
  view,
  onEscape,
  children,
}: {
  label: string;
  view: ApprovalView;
  onEscape?: () => void;
  children: ReactNode;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={view === "card" ? "grid h-11 grid-cols-2 items-center gap-2" : "flex h-11 items-center gap-2"}
      onKeyDown={(event) => {
        if (event.key === "Escape") onEscape?.();
      }}
    >
      {children}
    </div>
  );
}

export function ApprovalsQueue({ items, onDecision }: ApprovalsQueueProps) {
  const [decisions, setDecisions] = useState<Record<string, ApprovalDecision>>({});
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [focusKey, setFocusKey] = useState<string | null>(null);

  useEffect(() => {
    if (!focusKey) return;
    const targets = document.querySelectorAll<HTMLElement>(`[data-focus="${focusKey}"]`);
    Array.from(targets)
      .find((target) => target.getClientRects().length > 0)
      ?.focus();
  }, [focusKey]);

  const waiting = items.filter((item) => !decisions[item.id]).length;

  function decide(item: ApprovalItem, decision: ApprovalDecision) {
    setDecisions((current) => ({ ...current, [item.id]: decision }));
    setConfirmingId(null);
    setFocusKey(`${item.id}-decision`);
    onDecision?.(item, decision);
  }

  function cancel(item: ApprovalItem) {
    setConfirmingId(null);
    setFocusKey(`${item.id}-deny`);
  }

  function renderDecision(item: ApprovalItem, view: ApprovalView) {
    const decision = decisions[item.id];
    const full = view === "card" ? "w-full" : undefined;
    if (decision) {
      return (
        <div className="flex h-11 items-center">
          <span
            data-focus={`${item.id}-decision`}
            tabIndex={-1}
            className="inline-flex rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-body"
          >
            <Badge status={decision === "approved" ? "success" : "failed"} dot>
              {decision === "approved" ? "Approved" : "Denied"}
            </Badge>
          </span>
        </div>
      );
    }
    if (confirmingId === item.id) {
      return (
        <ActionGroup label={`Confirm denying ${item.name}`} view={view} onEscape={() => cancel(item)}>
          <Button
            data-focus={`${item.id}-confirm`}
            role="primary"
            icon={<X />}
            className={full}
            aria-label={`Confirm deny ${item.name}`}
            onClick={() => decide(item, "denied")}
          >
            Confirm deny
          </Button>
          <Button role="ghost" className={full} aria-label={`Cancel deny ${item.name}`} onClick={() => cancel(item)}>
            Cancel
          </Button>
        </ActionGroup>
      );
    }
    return (
      <ActionGroup label={`Actions for ${item.name}`} view={view}>
        <Button
          role="primary"
          icon={<Check />}
          className={full}
          aria-label={`Approve ${item.name}`}
          onClick={() => decide(item, "approved")}
        >
          Approve
        </Button>
        <Button
          data-focus={`${item.id}-deny`}
          role="outline"
          icon={<X />}
          className={full}
          aria-label={`Deny ${item.name}`}
          onClick={() => {
            setConfirmingId(item.id);
            setFocusKey(`${item.id}-confirm`);
          }}
        >
          Deny
        </Button>
      </ActionGroup>
    );
  }

  return (
    <>
      <div className="md:hidden">
        <p className="mb-3 text-muted">{waiting} waiting on you</p>
        {items.length === 0 ? (
          <Card variant="outlined" padding="md">
            <p className="text-center">Nothing waiting on you</p>
          </Card>
        ) : (
          <ul aria-label="Approvals waiting on you" className="flex flex-col gap-3">
            {items.map((item) => (
              <li key={item.id}>
                <Card variant="outlined" padding="md">
                  <div className="flex flex-col gap-3">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-muted">
                        {item.kind} · Waiting {item.waiting}
                      </p>
                    </div>
                    {renderDecision(item, "card")}
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="hidden md:block">
        <Table aria-label="Approvals waiting on you">
          <TableCaption>{waiting} waiting on you</TableCaption>
          <colgroup>
            <col className="w-40" />
            <col className="w-44" />
            <col className="w-32" />
            <col className="w-72" />
          </colgroup>
          <TableHeader>
            <TableRow>
              <TableHead sticky>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Waiting</TableHead>
              <TableHead>Decision</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Nothing waiting on you
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell sticky>{item.name}</TableCell>
                  <TableCell>{item.kind}</TableCell>
                  <TableCell>{item.waiting}</TableCell>
                  <TableCell>{renderDecision(item, "table")}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
