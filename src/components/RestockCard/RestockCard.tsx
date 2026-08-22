import { Badge } from "../Badge/Badge";
import { Button } from "../Button/Button";

function MediaCircle({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex size-3.5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-bg p-[1px] outline outline-1 -outline-offset-1 outline-[color-mix(in_srgb,var(--color-fg)_10%,transparent)] [&>img]:size-full [&>img]:object-contain">
      {children}
    </span>
  );
}

function SignalBars({
  strength,
  activeColor = "var(--color-muted)",
}: {
  strength: 0 | 1 | 2 | 3;
  activeColor?: string;
}) {
  const heights = [6, 9, 12];
  return (
    <span className="flex shrink-0 items-end gap-0.5" aria-hidden>
      {heights.map((h, i) => (
        <span
          key={h}
          className="w-[3px] rounded-[1px]"
          style={{
            height: h,
            background: i < strength ? activeColor : "var(--color-border)",
          }}
        />
      ))}
    </span>
  );
}

export interface RestockCardProps {
  onAlternatives?: () => void;
  onAccepted?: () => void;
}

/** Agent restock prompt — design-system specimen (Storybook + Paper proof), not a public export. */
export function RestockCard({ onAlternatives, onAccepted }: RestockCardProps) {
  return (
    <article className="flex w-full max-w-[380px] flex-col rounded-lg bg-surface font-sans shadow-md">
      <header className="flex flex-col gap-2 p-4 pb-3">
        <h2 className="text-sm font-semibold leading-[1.5] tracking-normal text-fg">
          Want me to place this restock order?
        </h2>
        <p className="text-sm font-normal leading-[1.5] text-muted">
          Reorder waffle cones from{" "}
          <Badge
            variant="neutral"
            startSlot={
              <MediaCircle>
                <img src="/brands/cone-king.svg" alt="" />
              </MediaCircle>
            }
          >
            Cone King
          </Badge>{" "}
          with lead time{" "}
          <Badge variant="success" className="mx-[length:var(--spacing-0)] align-middle">
            7 days
          </Badge>
        </p>
      </header>

      <hr className="border-0 border-t border-border" />

      <section className="flex flex-col gap-1 px-2 py-3">
        <p className="px-2 text-xs font-medium uppercase tracking-wider text-muted">
          Other options
        </p>
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded-md p-1.5 text-left transition-colors hover:bg-secondary-hover"
        >
          <SignalBars strength={2} activeColor="var(--color-warning)" />
          <span className="min-w-0 flex-1 text-sm leading-[1.5] text-fg">
            Switch to Vanilla Madagascar
          </span>
          <Badge variant="warning" className="shrink-0">
            Needs review
          </Badge>
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded-md p-1.5 text-left transition-colors hover:bg-secondary-hover"
        >
          <SignalBars strength={0} />
          <span className="min-w-0 flex-1 text-sm leading-[1.5] text-fg">
            Full restock across every SKU
          </span>
          <Badge variant="neutral" className="shrink-0">
            No signal
          </Badge>
        </button>
      </section>

      <footer className="flex items-center justify-between gap-4 border-t border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <SignalBars strength={3} activeColor="var(--color-success)" />
          <span className="text-sm leading-[1.5] text-muted">High confidence</span>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="secondary" size="xs" badge={2} onClick={onAlternatives}>
            Alternatives
          </Button>
          <Button variant="success" size="xs" onClick={onAccepted}>
            Accepted
          </Button>
        </div>
      </footer>
    </article>
  );
}
