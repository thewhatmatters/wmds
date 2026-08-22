import { AlignLeft, ArrowUpRight } from "lucide-react";
import { Badge } from "../Badge/Badge";
import { Card } from "../Card/Card";

type FileKind = "pdf" | "csv";

const fileKindConfig: Record<
  FileKind,
  { label: string; badgeVariant: "destructive" | "success" }
> = {
  pdf: { label: "PDF", badgeVariant: "destructive" },
  csv: { label: "csv", badgeVariant: "success" },
};

function FileTypeMark({ kind }: { kind: FileKind }) {
  const { label, badgeVariant } = fileKindConfig[kind];
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-sm px-[length:var(--spacing-1)] py-[1px] text-[10px] font-semibold uppercase leading-none ${
        badgeVariant === "destructive"
          ? "bg-destructive text-destructive-foreground"
          : "bg-success text-success-foreground"
      }`}
    >
      {label}
    </span>
  );
}

export interface ContextChunkItem {
  id: string;
  title: string;
  characterCount: number;
  body: string;
  fileName: string;
  fileKind: FileKind;
  fileHref?: string;
}

export interface ContextChunksProps {
  heading?: string;
  totalCount?: number;
  chunks: ContextChunkItem[];
}

function ContextChunkCard({
  title,
  characterCount,
  body,
  fileName,
  fileKind,
  fileHref = "#",
}: Omit<ContextChunkItem, "id">) {
  const formattedCount = characterCount.toLocaleString("en-US");

  return (
    <Card variant="outlined" padding="none" elevation="none" className="overflow-hidden">
      <Card.Header className="py-[length:var(--spacing-2-5)]">
        <div className="flex items-center gap-[length:var(--spacing-2)]">
          <AlignLeft
            className="size-3.5 shrink-0 text-muted"
            strokeWidth={2}
            aria-hidden
          />
          <span className="min-w-0 flex-1 truncate text-sm font-medium leading-[var(--line-height-sm)] text-fg">
            {title}
          </span>
          <span className="shrink-0 text-xs leading-[var(--line-height-xs)] text-muted">
            {formattedCount} characters
          </span>
        </div>
      </Card.Header>
      <Card.Body className="flex flex-col gap-[length:var(--spacing-3)] pb-[length:var(--spacing-3)]">
        <p className="text-sm leading-[var(--line-height-sm)] text-muted">{body}</p>
        <a
          href={fileHref}
          className="inline-flex w-fit max-w-full rounded-full outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          <Badge
            variant="neutral"
            startSlot={<FileTypeMark kind={fileKind} />}
            endSlot={
              <ArrowUpRight
                className="size-3.5 shrink-0 text-muted"
                strokeWidth={2}
                aria-hidden
              />
            }
          >
            {fileName}
          </Badge>
        </a>
      </Card.Body>
    </Card>
  );
}

/** RAG / knowledge chunk list — design-system specimen, not a public export. */
export function ContextChunks({
  heading = "All chunks",
  totalCount,
  chunks,
}: ContextChunksProps) {
  const count = totalCount ?? chunks.length;

  return (
    <section className="flex w-full max-w-md flex-col gap-[length:var(--spacing-3)] font-sans">
      <div className="flex items-center gap-[length:var(--spacing-2)]">
        <h2 className="text-sm font-semibold leading-[var(--line-height-sm)] text-fg">
          {heading}
        </h2>
        <Badge variant="neutral" appearance="count">
          {count}
        </Badge>
      </div>
      <ul className="m-0 flex list-none flex-col gap-[length:var(--spacing-2)] p-0">
        {chunks.map((chunk) => (
          <li key={chunk.id}>
            <ContextChunkCard {...chunk} />
          </li>
        ))}
      </ul>
    </section>
  );
}
