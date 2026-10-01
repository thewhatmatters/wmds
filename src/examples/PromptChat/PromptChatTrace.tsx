import { Check, ChevronRight, FileText, LoaderCircle, Pencil, Search, Terminal } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "../../lib/cn";
import { motionTransitionProp } from "../../lib/motion";
import { Button } from "../../components/atoms/Button/Button";
import { TextLink } from "../../components/atoms/TextLink/TextLink";
import {
  promptChatThinkingLabelClasses,
  promptChatThoughtLabelClasses,
  promptChatTraceBodyClasses,
  promptChatTraceChevronClasses,
  promptChatTraceClasses,
  promptChatTraceIconClasses,
  promptChatTraceLineClasses,
  promptChatTraceSpinClasses,
} from "./promptChatStyles";
import {
  promptChatThinkingLabel,
  promptChatThoughtLabel,
  type PromptChatTraceEntry,
} from "./promptChatThinking";

/**
 * One thinking trace. Supporting muted status while lines resolve, then the row collapses.
 * Steps, reasoning, search, and coding are entries in the same list — not separate components.
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

  return (
    <div className={promptChatTraceClasses} aria-busy={settled ? undefined : true}>
      <Button
        layout="row"
        role="ghost"
        type="button"
        className="!w-auto"
        aria-expanded={open}
        onClick={onToggle}
      >
        {settled ? (
          <span className={promptChatThoughtLabelClasses}>{promptChatThoughtLabel}</span>
        ) : (
          <span className={promptChatThinkingLabelClasses}>{promptChatThinkingLabel}</span>
        )}
        <ChevronRight
          className={cn(promptChatTraceChevronClasses, open && "rotate-90")}
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
              initial={reduce ? false : { opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
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
