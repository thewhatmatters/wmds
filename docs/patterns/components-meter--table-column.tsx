// @thewhatmatters/wmds@0.4.52 · Pattern — share column in a table
// Storybook: Components/Meter → Pattern — share column in a table (?path=/story/components-meter--table-column)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Meter, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@thewhatmatters/wmds";

const sources = [
  { name: "Search", visits: "18,240", share: 48 },
  { name: "Direct", visits: "9,120", share: 24 },
  { name: "Referral", visits: "6,460", share: 17 },
  { name: "Social", visits: "4,180", share: 11 },
];

export function VisitsBySource() {
  return (
    <Table aria-label="Visits by source">
      <TableHeader>
        <TableRow>
          <TableHead>Source</TableHead>
          <TableHead align="end">Visits</TableHead>
          <TableHead align="end">Share</TableHead>
          <TableHead>
            <span className="sr-only">Share, drawn</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sources.map((source) => (
          <TableRow key={source.name}>
            <TableCell>{source.name}</TableCell>
            <TableCell align="end">{source.visits}</TableCell>
            <TableCell align="end">{source.share}%</TableCell>
            <TableCell>
              <Meter value={source.share} size="xs" tone="neutral" aria-hidden className="w-32" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
