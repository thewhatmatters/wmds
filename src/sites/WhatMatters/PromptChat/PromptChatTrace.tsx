import { useEffect, useState } from "react";
import {
  Check,
  ChevronDown,
  FileText,
  LoaderCircle,
  Pencil,
  Search,
  Sparkle,
  Terminal,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "../../../lib/cn";
import { motionBlurReveal, motionTransitionProp } from "../../../lib/motion";
import { Button } from "../../../components/atoms/Button/Button";
import { TextLink } from "../../../components/atoms/TextLink/TextLink";
import {
  promptChatThoughtLabelClasses,
  promptChatTraceBodyClasses,
  promptChatTraceChevronClasses,
  promptChatTraceClasses,
  promptChatTraceIconClasses,
  promptChatTraceLineClasses,
  promptChatTraceSpinClasses,
} from "./promptChatStyles";
import {
  promptChatThoughtForLabel,
  promptChatThoughtLabel,
  type PromptChatTraceEntry,
} from "./promptChatThinking";

/**
 * One thinking trace. Default is a collapsed sparkle + timer row. The user can
 * expand it while steps resolve. Supporting muted gray — not brand navy.
 */
export function PromptChatTrace({
  entries,
  revealed,
  resolved,
  settled,
  open,
  onToggle,
}: {
  entries: PromptChatTraceEntry[];
  revealed: number;
  /** Checks that have finished spinning. The current step is revealed and not yet resolved. */
  resolved: number;
  settled: boolean;
  open: boolean;
  onToggle: () => void;
}) {
  const reduce = useReducedMotion() === true;
  const fast = motionTransitionProp("fast");
  const visible = entries.slice(0, revealed);
  const [seconds, setSeconds] = useState(1);

  useEffect(() => {
    if (settled || reduce) return;
    const timer = window.setInterval(() => {
      setSeconds((current) => current + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [settled, reduce]);

  return (
    <div className={promptChatTraceClasses} aria-busy={settled ? undefined : true}>
      <Button
        layout="row"
        width="hug"
        role="ghost"
        type="button"
        aria-expanded={open}
        onClick={onToggle}
      >
        <Sparkle className={promptChatTraceIconClasses} strokeWidth={2} aria-hidden />
        <span className={promptChatThoughtLabelClasses}>
          {settled ? promptChatThoughtLabel : promptChatThoughtForLabel(seconds)}
        </span>
        <ChevronDown
          className={cn(promptChatTraceChevronClasses, open && "rotate-180")}
          strokeWidth={2}
          aria-hidden
        />
      </Button>
      {open ? (
        <div className={promptChatTraceBodyClasses}>
          {visible.map((entry, index) => (
            <motion.div
              key={`${entry.kind}-${index}`}
              className={entry.kind === "prose" ? "type-body text-fg" : promptChatTraceLineClasses}
              {...motionBlurReveal(reduce)}
              transition={reduce ? { duration: 0 } : fast}
            >
              <TraceEntry entry={entry} spinning={entry.kind === "check" && index >= resolved} />
            </motion.div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function TraceEntry({ entry, spinning }: { entry: PromptChatTraceEntry; spinning: boolean }) {
  if (entry.kind === "check") {
    return (
      <>
        {spinning ? (
          <LoaderCircle className={promptChatTraceSpinClasses} strokeWidth={2} aria-hidden />
        ) : (
          <Check className={promptChatTraceIconClasses} strokeWidth={2} aria-hidden />
        )}
        {entry.text}
      </>
    );
  }
  if (entry.kind === "prose") return entry.text;
  if (entry.kind === "query") {
    return (
      <>
        <Search className={promptChatTraceIconClasses} strokeWidth={2} aria-hidden />
        {entry.text}
      </>
    );
  }
  if (entry.kind === "source") return <TextLink href={entry.href}>{entry.text}</TextLink>;
  if (entry.kind === "file") {
    return (
      <>
        <FileText className={promptChatTraceIconClasses} strokeWidth={2} aria-hidden />
        {entry.text}
      </>
    );
  }
  if (entry.kind === "edit") {
    return (
      <>
        <Pencil className={promptChatTraceIconClasses} strokeWidth={2} aria-hidden />
        {entry.text}
      </>
    );
  }
  return (
    <>
      <Terminal className={promptChatTraceIconClasses} strokeWidth={2} aria-hidden />
      <span className="type-code">{entry.text}</span>
    </>
  );
}
