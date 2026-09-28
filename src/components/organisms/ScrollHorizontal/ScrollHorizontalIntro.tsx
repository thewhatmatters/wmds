import { useContext, type ReactNode } from "react";
import { Badge } from "../../atoms/Badge/Badge";
import { Button } from "../../atoms/Button/Button";
import { TextSequence } from "../../molecules/TextSequence/TextSequence";
import { ScrollHorizontalIntroContext } from "./scrollHorizontalIntroContext";
import {
  scrollHorizontalIntroBodyClasses,
  scrollHorizontalIntroCopyClasses,
  scrollHorizontalIntroStatementClasses,
} from "./scrollHorizontalStyles";

export interface ScrollHorizontalIntroAction {
  /** Visible label, sentence case. The accessible name keeps this casing. */
  label: string;
  /**
   * Button click — a modal or other action. **Button** `type="button"`.
   * Not with `href`.
   */
  onClick?: () => void;
  /**
   * Navigation URL. **Button** chrome on an anchor (`render={<a href />}`).
   * Not with `onClick`.
   */
  href?: string;
}

export interface ScrollHorizontalIntroProps {
  /**
   * Section label. Rendered as the **Badge** label pill and names the section
   * (`aria-labelledby`), replacing `heading`. Pass the short label, for example
   * `SELECTED WORK`.
   */
  eyebrow: string;
  /**
   * Display statement. Rendered as the section `h2` through **TextSequence**
   * (`emphasis="none"`, `trigger="inView"`). Mix text with **TextSequence.Shape**.
   * The heading keeps the plain sentence as its accessible name.
   */
  statement: ReactNode;
  /** Secondary action under the statement. Omit for a statement with no button. */
  action?: ScrollHorizontalIntroAction;
}

/**
 * First panel of **ScrollHorizontal**. Composes the **Badge** label pill
 * (neutral, sm, solid — the category pill), a `type-display-2` **TextSequence**
 * inside the `h2` (display-2 leading, same as **HeroIntro**), and **Button**
 * `role="secondary"` with no extra className. Secondary has no icon slot.
 * The badge is the section's accessible name. The statement is the `h2`.
 * The sequence runs once, when the statement scrolls into view.
 */
export function ScrollHorizontalIntro({ eyebrow, statement, action }: ScrollHorizontalIntroProps) {
  const labelId = useContext(ScrollHorizontalIntroContext);

  return (
    <div className={scrollHorizontalIntroBodyClasses}>
      <div className={scrollHorizontalIntroCopyClasses}>
        <Badge id={labelId}>{eyebrow}</Badge>
        <h2 className={scrollHorizontalIntroStatementClasses}>
          <TextSequence trigger="inView" emphasis="none">
            {statement}
          </TextSequence>
        </h2>
      </div>
      {action ? (
        action.href ? (
          <Button role="secondary" render={<a href={action.href} />}>
            {action.label}
          </Button>
        ) : (
          <Button role="secondary" type="button" onClick={action.onClick}>
            {action.label}
          </Button>
        )
      ) : null}
    </div>
  );
}
