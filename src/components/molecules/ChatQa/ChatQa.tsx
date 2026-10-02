import { cn } from "../../../lib/cn";
import {
  chatQaAnswerClasses,
  chatQaPairClasses,
  chatQaQuestionClasses,
  chatQaShellClasses,
} from "./chatQaStyles";

/** Layout-only — width, margin, flex placement. Not for colors. */
export type ChatQaLayoutClassName = string;

export interface ChatQaPair {
  /** Question shown muted above the answer. */
  question: string;
  /**
   * Pre-formatted answer string — one choice, a comma-separated list,
   * or a ranked line such as `Ranked: 1. Speed to ship, 2. Polish`.
   */
  answer: string;
}

export interface ChatQaProps {
  /** Ordered question/answer pairs. */
  pairs: readonly ChatQaPair[];
  /** Landmark name for the summary block. Default: "Collected answers". */
  "aria-label"?: string;
  className?: ChatQaLayoutClassName;
}

/**
 * Quiet Q&A summary for an AI chat thread — light surface panel with stacked
 * muted questions and heavier answers. The agent reply sits outside and below;
 * do not put thinking rows, hover actions, or tool slots inside this panel.
 */
export function ChatQa({
  pairs,
  "aria-label": ariaLabel = "Collected answers",
  className,
}: ChatQaProps) {
  return (
    <dl className={cn(chatQaShellClasses, className)} aria-label={ariaLabel}>
      {pairs.map((pair, index) => (
        <div key={`${index}-${pair.question}`} className={chatQaPairClasses}>
          <dt className={chatQaQuestionClasses}>{pair.question}</dt>
          <dd className={cn(chatQaAnswerClasses, "m-0")}>{pair.answer}</dd>
        </div>
      ))}
    </dl>
  );
}
