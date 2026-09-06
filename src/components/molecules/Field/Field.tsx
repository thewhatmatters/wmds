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
  /** Neutral helper below the control(s). */
  description?: string;
  /** Stack (default) or label beside control. */
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
  const descriptionId = description != null ? `${fieldId}-description` : undefined;
  const legendId = label != null ? `${fieldId}-legend` : undefined;

  const wiredChild =
    singleChild != null && controlId != null && (singleChild.props as { id?: string }).id == null
      ? cloneElement(singleChild, { id: controlId } as { id: string })
      : singleChild;

  const controlStack =
    childCount > 1 ? (
      <div className={fieldMultiControlStackClasses}>{children}</div>
    ) : (
      wiredChild ?? children
    );

  const descriptionNode =
    description != null ? (
      <p id={descriptionId} className={fieldDescriptionClasses}>
        {description}
      </p>
    ) : null;

  if (label == null && description == null) {
    return <div className={cn("w-full", className)}>{children}</div>;
  }

  if (label == null) {
    return (
      <div className={cn(fieldVerticalStackClasses, className)} aria-describedby={descriptionId}>
        {children}
        {descriptionNode}
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
        {controlStack}
        {descriptionNode}
      </div>
    );
  }

  if (orientation === "horizontal") {
    return (
      <div className={cn(fieldHorizontalStackClasses, className)} aria-describedby={descriptionId}>
        <label
          htmlFor={controlId}
          className={cn(fieldHorizontalLabelColumnClasses, fieldLabelClassesFor(disabled))}
        >
          {label}
        </label>
        <div className={fieldHorizontalControlColumnClasses}>
          {controlStack}
          {descriptionNode}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(fieldVerticalStackClasses, className)} aria-describedby={descriptionId}>
      <label htmlFor={controlId} className={fieldLabelClassesFor(disabled)}>
        {label}
      </label>
      {controlStack}
      {descriptionNode}
    </div>
  );
}
