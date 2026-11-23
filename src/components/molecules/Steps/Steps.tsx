import { Children, createContext, useContext, useMemo, type LiHTMLAttributes, type OlHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../../lib/cn";
import {
  stepsBodyClasses,
  stepsItemClasses,
  stepsNumberClasses,
  stepsRootClasses,
  stepsTextClasses,
  stepsTitleClasses,
  type StepsLayout,
  type StepsTitleTag,
} from "./stepsStyles";

export { stepsLayouts, stepsTitleTags, type StepsLayout, type StepsTitleTag } from "./stepsStyles";

/** Layout only: width, margins, grid placement. */
export type StepsLayoutClassName = string;

/** The number as it is drawn: two digits, "01". */
export function stepsNumber(position: number): string {
  return String(position).padStart(2, "0");
}

export type StepsProps = Omit<OlHTMLAttributes<HTMLOListElement>, "children" | "className" | "role" | "start" | "type"> & {
  /** **Steps.Item** children, in order. Three to five reads best. */
  children: ReactNode;
  layout?: StepsLayout;
  /** The first step's number. `1` by default. */
  start?: number;
  /** The element each title is. `h3` by default, for a list under a section's `h2`. */
  titleAs?: StepsTitleTag;
  className?: StepsLayoutClassName;
};

export type StepsItemProps = Omit<LiHTMLAttributes<HTMLLIElement>, "children" | "className" | "title"> & {
  /** What happens at this step, in a few words. */
  title: ReactNode;
  /** One line more. */
  children?: ReactNode;
  className?: StepsLayoutClassName;
};

interface StepsContextValue {
  layout: StepsLayout;
  titleAs: StepsTitleTag;
}

const StepsContext = createContext<StepsContextValue>({ layout: "rows", titleAs: "h3" });

/** Each step's place in the list, given by **Steps**. */
const StepsPositionContext = createContext(1);

/**
 * What happens, in order: a short numbered list of steps, each a title and one line, with a rule
 * above each. The numbers are counted for you.
 */
function StepsRoot({ children, layout = "rows", start = 1, titleAs = "h3", className, ...rest }: StepsProps) {
  const contextValue = useMemo(() => ({ layout, titleAs }), [layout, titleAs]);

  return (
    <StepsContext.Provider value={contextValue}>
      <ol
        {...rest}
        // list-none drops the list role in Safari; the explicit role keeps "list, 4 items".
        role="list"
        start={start}
        data-slot="steps"
        data-layout={layout}
        className={cn(stepsRootClasses[layout], className)}
      >
        {Children.toArray(children).map((child, index) => (
          <StepsPositionContext.Provider key={index} value={start + index}>
            {child}
          </StepsPositionContext.Provider>
        ))}
      </ol>
    </StepsContext.Provider>
  );
}

function StepsItem({ title, children, className, ...rest }: StepsItemProps) {
  const { layout, titleAs: Title } = useContext(StepsContext);
  const position = useContext(StepsPositionContext);

  return (
    <li {...rest} data-slot="step" className={cn(stepsItemClasses[layout], className)}>
      {/* The list already says "2 of 4"; the drawn number is for the eye. */}
      <span aria-hidden="true" data-slot="number" className={stepsNumberClasses}>
        {stepsNumber(position)}
      </span>
      <div data-slot="body" className={stepsBodyClasses}>
        <Title data-slot="title" className={stepsTitleClasses}>
          {title}
        </Title>
        {children != null && children !== false ? (
          <p data-slot="text" className={stepsTextClasses}>
            {children}
          </p>
        ) : null}
      </div>
    </li>
  );
}

export const Steps = Object.assign(StepsRoot, {
  Item: StepsItem,
});
