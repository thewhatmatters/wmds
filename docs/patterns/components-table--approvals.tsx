// @thewhatmatters/wmds@0.4.21 · Pattern — approvals queue
// Storybook: Components/Table → Pattern — approvals queue (?path=/story/components-table--approvals)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Check, X } from "lucide-react";
import {
  Badge,
  Button,
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

/** The row's buttons, side by side. */
function ActionGroup({
  label,
  onEscape,
  children,
}: {
  label: string;
  onEscape?: () => void;
  children: ReactNode;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex h-11 items-center gap-2"
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
  const [focusId, setFocusId] = useState<string | null>(null);

  useEffect(() => {
    if (focusId) document.getElementById(focusId)?.focus();
  }, [focusId]);

  const waiting = items.filter((item) => !decisions[item.id]).length;

  function decide(item: ApprovalItem, decision: ApprovalDecision) {
    setDecisions((current) => ({ ...current, [item.id]: decision }));
    setConfirmingId(null);
    setFocusId(`${item.id}-decision`);
    onDecision?.(item, decision);
  }

  function cancel(item: ApprovalItem) {
    setConfirmingId(null);
    setFocusId(`${item.id}-deny`);
  }

  return (
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
          items.map((item) => {
            const decision = decisions[item.id];
            const confirming = confirmingId === item.id;
            return (
              <TableRow key={item.id}>
                <TableCell sticky>{item.name}</TableCell>
                <TableCell>{item.kind}</TableCell>
                <TableCell>{item.waiting}</TableCell>
                <TableCell>
                  {decision ? (
                    <div className="flex h-11 items-center">
                      <span
                        id={`${item.id}-decision`}
                        tabIndex={-1}
                        className="inline-flex rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-body"
                      >
                        <Badge status={decision === "approved" ? "success" : "failed"} dot>
                          {decision === "approved" ? "Approved" : "Denied"}
                        </Badge>
                      </span>
                    </div>
                  ) : confirming ? (
                    <ActionGroup label={`Confirm denying ${item.name}`} onEscape={() => cancel(item)}>
                      <Button
                        id={`${item.id}-confirm`}
                        role="primary"
                        icon={<X />}
                        aria-label={`Confirm deny ${item.name}`}
                        onClick={() => decide(item, "denied")}
                      >
                        Confirm deny
                      </Button>
                      <Button role="ghost" aria-label={`Cancel deny ${item.name}`} onClick={() => cancel(item)}>
                        Cancel
                      </Button>
                    </ActionGroup>
                  ) : (
                    <ActionGroup label={`Actions for ${item.name}`}>
                      <Button
                        role="primary"
                        icon={<Check />}
                        aria-label={`Approve ${item.name}`}
                        onClick={() => decide(item, "approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        id={`${item.id}-deny`}
                        role="outline"
                        icon={<X />}
                        aria-label={`Deny ${item.name}`}
                        onClick={() => {
                          setConfirmingId(item.id);
                          setFocusId(`${item.id}-confirm`);
                        }}
                      >
                        Deny
                      </Button>
                    </ActionGroup>
                  )}
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
