import {
  Children,
  cloneElement,
  isValidElement,
  useId,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "../../../lib/cn";
import {
  fieldDescriptionClasses,
  fieldHorizontalControlColumnClasses,
  fieldHorizontalLabelColumnClasses,
  fieldHorizontalStackClasses,
  fieldLabelClassesFor,
  fieldMultiControlStackClasses,
  fieldVerticalStackClasses,
  type FieldOrientation,
} from "./fieldStyles";

export { fieldOrientations, type FieldOrientation } from "./fieldStyles";

/** Layout-only — not for colors, borders, or typography overrides. */
export type FieldLayoutClassName = string;

export interface FieldProps {
  /** Visible label — omit when children are self-labeled. */
  label?: string;
  /** Neutral hint between the label and the control(s) (Labels and placeholders F8): read before typing. */
  description?: string;
  /**
   * A character counter ("67 / 400"), the one helper that sits below the control, next to what it counts
   * (as GOV.UK places it). Read with the control, like the hint.
   */
  counter?: string;
  /**
   * Stack (default) or label beside control. `horizontal` applies from `lg` (1024) up and stacks below
   * it. For dense app settings only, never marketing or contact forms (Form layout L8).
   */
  orientation?: FieldOrientation;
  /** Explicit control id — auto-wired for a single child when omitted. */
  htmlFor?: string;
  disabled?: boolean;
  /** One or more form controls — **Input**, **TextArea**, **Select**, **Search**, etc. */
  children: ReactNode;
  className?: FieldLayoutClassName;
}

function countElementChildren(children: ReactNode): number {
  return Children.toArray(children).filter(isValidElement).length;
}

function soleElementChild(children: ReactNode): ReactElement | null {
  const elements = Children.toArray(children).filter(isValidElement) as ReactElement[];
  return elements.length === 1 ? elements[0]! : null;
}

function assertFieldPattern(props: Pick<FieldProps, "label" | "children">) {
  if (props.label == null) {
    return;
  }

  const child = soleElementChild(props.children);
  if (child == null) {
    return;
  }

  const childProps = child.props as { label?: string };

  if (childProps.label != null) {
    console.warn(
      "[WMDS Field] Child has its own `label` — omit one label source (Field or control).",
    );
  }
}

/**
 * Label/layout wrapper for form controls (ADR-0006) — never required.
 * Validation stays on **Input** / **TextArea** (`status` + `message`); **Field** owns spacing and orientation only.
 */
export function Field({
  label,
  description,
  counter,
  orientation = "vertical",
  htmlFor,
  disabled = false,
  children,
  className,
}: FieldProps) {
  const fieldId = useId();
  assertFieldPattern({ label, children });

  const childCount = countElementChildren(children);
  const singleChild = soleElementChild(children);
  const childId =
    htmlFor ??
    (singleChild != null ? (singleChild.props as { id?: string }).id : undefined);
  const controlId = childId ?? (singleChild != null ? `${fieldId}-control` : undefined);
  const hintId = description != null ? `${fieldId}-description` : undefined;
  const counterId = counter != null ? `${fieldId}-counter` : undefined;
  /** Hint, then counter: what the control's accessible description reads. */
  const descriptionId = [hintId, counterId].filter(Boolean).join(" ") || undefined;
  const legendId = label != null ? `${fieldId}-legend` : undefined;

  // The description must reach the control itself: `aria-describedby` on a wrapper <div> is ignored.
  const wiredChild = singleChild != null ? wireControl(singleChild, controlId, descriptionId) : singleChild;

  const controlStack =
    childCount > 1 ? (
      <div className={fieldMultiControlStackClasses}>{children}</div>
    ) : (
      wiredChild ?? children
    );

  const descriptionNode =
    description != null ? (
      <p id={hintId} className={fieldDescriptionClasses}>
        {description}
      </p>
    ) : null;
  const counterNode =
    counter != null ? (
      <p id={counterId} className={fieldDescriptionClasses} data-field-counter="">
        {counter}
      </p>
    ) : null;

  if (label == null && description == null && counter == null) {
    return <div className={cn("w-full", className)}>{children}</div>;
  }

  if (label == null) {
    return (
      <div className={cn(fieldVerticalStackClasses, className)}>
        {descriptionNode}
        {childCount > 1 ? children : (wiredChild ?? children)}
        {counterNode}
      </div>
    );
  }

  if (childCount > 1) {
    return (
      <div
        role="group"
        aria-labelledby={legendId}
        aria-describedby={descriptionId}
        className={cn(fieldVerticalStackClasses, className)}
      >
        <span id={legendId} className={fieldLabelClassesFor(disabled)}>
          {label}
        </span>
        {descriptionNode}
        {controlStack}
        {counterNode}
      </div>
    );
  }

  if (orientation === "horizontal") {
    return (
      <div className={cn(fieldHorizontalStackClasses, className)}>
        <label
          htmlFor={controlId}
          className={cn(fieldHorizontalLabelColumnClasses, fieldLabelClassesFor(disabled))}
        >
          {label}
        </label>
        <div className={fieldHorizontalControlColumnClasses}>
          {descriptionNode}
          {controlStack}
          {counterNode}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(fieldVerticalStackClasses, className)}>
      <label htmlFor={controlId} className={fieldLabelClassesFor(disabled)}>
        {label}
      </label>
      {descriptionNode}
      {controlStack}
      {counterNode}
    </div>
  );
}

/** Gives the single control its id (unless it has one) and appends the description to its `aria-describedby`. */
function wireControl(child: ReactElement, controlId: string | undefined, descriptionId: string | undefined) {
  const props = child.props as { id?: string; "aria-describedby"?: string };
  const wired: { id?: string; "aria-describedby"?: string } = {};
  if (props.id == null && controlId != null) wired.id = controlId;
  if (descriptionId != null) {
    wired["aria-describedby"] = [props["aria-describedby"], descriptionId].filter(Boolean).join(" ");
  }
  return Object.keys(wired).length > 0 ? cloneElement(child, wired) : child;
}
