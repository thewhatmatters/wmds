// @thewhatmatters/wmds@0.4.34 · Pattern — approvals with sheet
// Storybook: Components/Table → Pattern — approvals with sheet (?path=/story/components-table--approvals-with-sheet)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState } from "react";
import {
  Button,
  Sheet,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TextLink,
  dialogFooterActionsClasses,
} from "@thewhatmatters/wmds";

interface ApprovalRow {
  id: string;
  name: string;
  kind: string;
  waiting: string;
}

export function ApprovalsWithSheet({ rows }: { rows: ApprovalRow[] }) {
  const [id, setId] = useState<string | null>(null);
  const row = rows.find((item) => item.id === id);

  return (
    <>
      <Table aria-label="Approvals waiting on you">
        <TableCaption>{rows.length} waiting on you</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Kind</TableHead>
            <TableHead align="end">Waiting</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((item) => (
            <TableRow key={item.id} onClick={() => setId(item.id)}>
              <TableCell>
                <TextLink
                  variant="quiet"
                  href={`#${item.id}`}
                  onClick={(event) => event.preventDefault()}
                >
                  {item.name}
                </TextLink>
              </TableCell>
              <TableCell>{item.kind}</TableCell>
              <TableCell align="end">{item.waiting}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Sheet open={row != null} onOpenChange={(open) => setId(open ? id : null)}>
        <Sheet.Content
          side="end"
          title={row?.name}
          description={row?.kind}
          footer={
            <div className={dialogFooterActionsClasses}>
              <Button size="sm" role="outline" onClick={() => setId(null)}>
                Deny
              </Button>
              <Button size="sm" role="primary" onClick={() => setId(null)}>
                Approve
              </Button>
            </div>
          }
        >
          <p>Waiting {row?.waiting}.</p>
        </Sheet.Content>
      </Sheet>
    </>
  );
}
