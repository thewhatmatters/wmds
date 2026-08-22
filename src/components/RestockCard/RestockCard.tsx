"use client";

import { useState, type ReactNode } from "react";
import { Badge } from "../Badge/Badge";
import { Button, type ButtonVariant } from "../Button/Button";

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
          className="w-[3px] rounded-[1px] transition-colors duration-[length:var(--duration-slower)]"
          style={{
            height: h,
            background: i < strength ? activeColor : "var(--color-border)",
          }}
        />
      ))}
    </span>
  );
}

type RestockOption = {
  key: string;
  body: ReactNode;
  short: string;
  strength: 0 | 1 | 2 | 3;
  signalColor: string;
  statusLabel: string;
  rowBadge?: { label: string; variant: "neutral" | "warning" };
  cta: string;
  ctaVariant: ButtonVariant;
};

const OPTIONS: RestockOption[] = [
  {
    key: "high",
    body: (
      <>
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
      </>
    ),
    short: "Reorder from Cone King · 7-day lead",
    strength: 3,
    signalColor: "var(--color-success)",
    statusLabel: "High confidence",
    cta: "Accept",
    ctaVariant: "primary",
  },
  {
    key: "review",
    body: (
      <>
        Switch vanilla to <Badge variant="neutral">Vanilla Madagascar</Badge> for peak season.
      </>
    ),
    short: "Switch to Vanilla Madagascar",
    strength: 2,
    signalColor: "var(--color-warning)",
    statusLabel: "Needs review",
    rowBadge: { label: "Needs review", variant: "warning" },
    cta: "Configure",
    ctaVariant: "primary",
  },
  {
    key: "none",
    body: (
      <>
        Fall back to a <span className="font-medium text-fg">full restock</span> across every SKU.
      </>
    ),
    short: "Full restock across every SKU",
    strength: 0,
    signalColor: "var(--color-muted)",
    statusLabel: "No signal",
    rowBadge: { label: "No signal", variant: "neutral" },
    cta: "Accept full restock",
    ctaVariant: "primary",
  },
];

export interface RestockCardProps {
  /** Storybook / demo — start with the alternatives drawer expanded. */
  defaultOpen?: boolean;
  onAlternatives?: (open: boolean) => void;
  onAccepted?: () => void;
}

/** Agent restock prompt — design-system specimen (Storybook + Paper proof), not a public export. */
export function RestockCard({
  defaultOpen = false,
  onAlternatives,
  onAccepted,
}: RestockCardProps) {
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(defaultOpen);
  const [accepted, setAccepted] = useState(false);

  const active = OPTIONS[selected];
  const others = OPTIONS.map((option, index) => ({ option, index })).filter(
    ({ index }) => index !== selected,
  );

  const toggleAlternatives = () => {
    setOpen((current) => {
      const next = !current;
      onAlternatives?.(next);
      return next;
    });
  };

  return (
    <article className="flex w-full max-w-[440px] flex-col overflow-hidden rounded-lg bg-surface font-sans shadow-md">
      <header className="flex flex-col gap-2 p-4 pb-3">
        <h2 className="text-sm font-semibold leading-[1.5] tracking-normal text-fg">
          Want me to place this restock order?
        </h2>
        <p
          key={active.key}
          className="animate-fade-in text-sm font-normal leading-[1.5] text-muted"
        >
          {active.body}
        </p>
      </header>

      <div
        className="grid transition-[grid-template-rows,opacity] duration-[length:var(--duration-slower)] ease-[var(--ease-out-expo)]"
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
          opacity: open ? 1 : 0,
        }}
      >
        <div className="overflow-hidden">
          <section className="border-t border-border bg-surface px-2 py-2">
            <p className="px-1.5 pb-1 text-xs font-medium uppercase tracking-wider text-muted">
              Other options
            </p>
            <div className="flex flex-col gap-0.5">
              {others.map(({ option, index }) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => {
                    setSelected(index);
                    setAccepted(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-md px-1.5 py-1.5 text-left transition-colors duration-[length:var(--duration-instant)] hover:bg-secondary-hover"
                >
                  <SignalBars strength={option.strength} activeColor={option.signalColor} />
                  <span className="min-w-0 flex-1 truncate text-sm leading-[1.5] text-fg">
                    {option.short}
                  </span>
                  {option.rowBadge ? (
                    <Badge variant={option.rowBadge.variant} className="shrink-0">
                      {option.rowBadge.label}
                    </Badge>
                  ) : (
                    <span className="shrink-0 text-xs text-muted">{option.statusLabel}</span>
                  )}
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>

      <footer className="flex items-center gap-3 border-t border-border px-4 py-3">
        <div className="flex shrink-0 items-center gap-2">
          <SignalBars strength={active.strength} activeColor={active.signalColor} />
          <span className="whitespace-nowrap text-sm leading-[1.5] text-muted">
            {active.statusLabel}
          </span>
        </div>
        <div className="ml-auto flex min-w-0 shrink items-center justify-end gap-2">
          <Button
            variant="secondary"
            size="xs"
            badge={others.length}
            aria-expanded={open}
            onClick={toggleAlternatives}
            className="shrink-0"
          >
            Alternatives
          </Button>
          <Button
            variant={accepted ? "success" : active.ctaVariant}
            size="xs"
            onClick={() => {
              setAccepted(true);
              onAccepted?.();
            }}
          >
            {accepted ? "Accepted" : active.cta}
          </Button>
        </div>
      </footer>
    </article>
  );
}
