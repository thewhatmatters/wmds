// @thewhatmatters/wmds@0.4.39 · Pattern — side sheet URL deep link
// Storybook: Components/Sheet → Pattern — side sheet URL deep link (?path=/story/components-sheet--side-sheet-url-deep-link)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { TextLink, Sheet, Button, useSheetParam, withSheetParam, dialogFooterActionsClasses } from "@thewhatmatters/wmds";

interface ApprovalRow {
  id: string;
  name: string;
}

export function ApprovalList({ rows, initialUrl }: { rows: ApprovalRow[]; initialUrl?: string }) {
  const { open, id, onOpenChange } = useSheetParam("approval", { initialUrl });
  const row = rows.find((item) => item.id === id);

  return (
    <>
      <ul className="flex flex-col gap-2">
        {rows.map((item) => (
          <li key={item.id}>
            <TextLink
              href={withSheetParam(initialUrl ?? "/approvals", item.id, "approval")}
              onClick={(event) => {
                event.preventDefault();
                onOpenChange(true, item.id);
              }}
            >
              {item.name}
            </TextLink>
          </li>
        ))}
      </ul>
      <Sheet open={open && row != null} onOpenChange={(next) => onOpenChange(next)}>
        <Sheet.Content
          side="end"
          title={row?.name}
          description="Creator application"
          footer={
            <div className={dialogFooterActionsClasses}>
              <Button size="sm" role="primary" onClick={() => onOpenChange(false)}>
                Done
              </Button>
            </div>
          }
        >
          <p>Detail for {row?.name}.</p>
        </Sheet.Content>
      </Sheet>
    </>
  );
}
