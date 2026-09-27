import { ArrowRight } from "lucide-react";
import { useContext, type ReactNode } from "react";
import { Badge } from "../../atoms/Badge/Badge";
import { Button } from "../../atoms/Button/Button";
import { ScrollHorizontalIntroContext } from "./scrollHorizontalIntroContext";
import {
  scrollHorizontalIntroBodyClasses,
  scrollHorizontalIntroCopyClasses,
  scrollHorizontalIntroStatementClasses,
} from "./scrollHorizontalStyles";

export interface ScrollHorizontalIntroAction {
  /** Visible label. Rendered mono uppercase. The accessible name keeps this casing. */
  label: string;
  onClick?: () => void;
  /** When set, the action is an anchor with Button chrome. */
  href?: string;
}

export interface ScrollHorizontalIntroProps {
  /**
   * Eyebrow chip. Names the section (`aria-labelledby`), replacing `heading`.
   * Pass the short label, for example `SELECTED WORK`.
   */
  eyebrow: string;
  /** Display statement. Rendered as the section `h2`. */
  statement: ReactNode;
  /** Outline action under the statement. Omit for a statement with no button. */
  action?: ScrollHorizontalIntroAction;
}

/**
 * First panel of **ScrollHorizontal**. Composes **Badge** `eyebrow`, display
 * type, and **Button** `role="outline"` `mono` with a trailing arrow square.
 * The eyebrow is the section's accessible name. The statement is the `h2`.
 */
export function ScrollHorizontalIntro({ eyebrow, statement, action }: ScrollHorizontalIntroProps) {
  const labelId = useContext(ScrollHorizontalIntroContext);

  return (
    <div className={scrollHorizontalIntroBodyClasses}>
      <div className={scrollHorizontalIntroCopyClasses}>
        <Badge eyebrow id={labelId}>
          {eyebrow}
        </Badge>
        <h2 className={scrollHorizontalIntroStatementClasses}>{statement}</h2>
      </div>
      {action ? (
        <Button
          role="outline"
          size="sm"
          mono
          type="button"
          endIcon={<ArrowRight />}
          onClick={action.onClick}
          render={action.href ? <a href={action.href} /> : undefined}
        >
          {action.label}
        </Button>
      ) : null}
    </div>
  );
}
