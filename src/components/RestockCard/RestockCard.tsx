import { Button } from "../Button/Button";

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

/** Agent restock prompt — light mode, WMDS tokens only. */
export function RestockCard({ onAlternatives, onAccepted }: RestockCardProps) {
  return (
    <article className="flex w-full max-w-[380px] flex-col rounded-lg bg-surface font-sans shadow-md">
      <header className="flex flex-col gap-2 p-4 pb-3">
        <h2 className="text-sm font-semibold leading-[1.5] tracking-normal text-fg">
          Want me to place this restock order?
        </h2>
        <p className="text-sm font-normal leading-[1.5] text-muted">
          Reorder waffle cones from Cone King with lead time 7 days.
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
          <span className="shrink-0 text-sm leading-[1.5] text-muted">Needs review</span>
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded-md p-1.5 text-left transition-colors hover:bg-secondary-hover"
        >
          <SignalBars strength={0} />
          <span className="min-w-0 flex-1 text-sm leading-[1.5] text-fg">
            Full restock across every SKU
          </span>
          <span className="shrink-0 text-sm leading-[1.5] text-muted">No signal</span>
        </button>
      </section>

      <footer className="flex items-center justify-between gap-4 border-t border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <SignalBars strength={3} activeColor="var(--color-success)" />
          <span className="text-sm leading-[1.5] text-muted">High confidence</span>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="secondary" size="xs" onClick={onAlternatives}>
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
