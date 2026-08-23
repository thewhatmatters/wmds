import {
  createContext,
  useContext,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../lib/cn";
import { shadowElevationClass } from "../../foundation/shadows";

export type CardVariant = "surface" | "outlined" | "ghost";
export type CardElevation = "none" | "sm" | "md" | "raised";
export type CardPadding = "none" | "sm" | "md" | "lg";

export interface CardProps extends HTMLAttributes<HTMLElement> {
  variant?: CardVariant;
  elevation?: CardElevation;
  /** Container padding. Use `none` with Header/Body/Footer for divided layouts. */
  padding?: CardPadding;
  as?: "div" | "article" | "section";
  children: ReactNode;
}

export interface CardSectionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const CardPaddingContext = createContext<CardPadding>("none");

const baseClasses =
  "flex w-full flex-col overflow-hidden rounded-lg font-sans text-fg";

const variantClasses: Record<CardVariant, string> = {
  surface: "bg-surface",
  outlined: "border border-border bg-bg",
  ghost: "bg-transparent",
};

const elevationClasses: Record<CardElevation, string> = {
  none: shadowElevationClass("none"),
  sm: shadowElevationClass("sm"),
  md: shadowElevationClass("md"),
  raised: shadowElevationClass("raised"),
};

const rootPaddingClasses: Record<CardPadding, string> = {
  none: "p-[length:var(--spacing-0)]",
  sm: "p-[length:var(--spacing-3)]",
  md: "p-[length:var(--spacing-4)]",
  lg: "p-[length:var(--spacing-6)]",
};

const sectionPaddingClasses: Record<
  CardPadding,
  { block: string; header: string; body: string; footer: string }
> = {
  none: {
    block: "px-[length:var(--spacing-3)] py-[length:var(--spacing-2)]",
    header:
      "flex flex-col gap-[length:var(--spacing-1-5)] border-b border-border px-[length:var(--spacing-3)] pt-[length:var(--spacing-3)] pb-[length:var(--spacing-2)]",
    body: "px-[length:var(--spacing-3)] py-[length:var(--spacing-2)]",
    footer:
      "flex items-center justify-between gap-[length:var(--spacing-3)] border-t border-border px-[length:var(--spacing-3)] py-[length:var(--spacing-2)]",
  },
  sm: {
    block: "px-[length:var(--spacing-3)] py-[length:var(--spacing-2)]",
    header:
      "flex flex-col gap-[length:var(--spacing-2)] border-b border-border px-[length:var(--spacing-3)] pt-[length:var(--spacing-3)] pb-[length:var(--spacing-2)]",
    body: "px-[length:var(--spacing-3)] py-[length:var(--spacing-2)]",
    footer:
      "flex items-center justify-between gap-[length:var(--spacing-3)] border-t border-border px-[length:var(--spacing-3)] py-[length:var(--spacing-2)]",
  },
  md: {
    block: "px-[length:var(--spacing-4)] py-[length:var(--spacing-3)]",
    header:
      "flex flex-col gap-[length:var(--spacing-2)] border-b border-border px-[length:var(--spacing-4)] pt-[length:var(--spacing-4)] pb-[length:var(--spacing-3)]",
    body: "px-[length:var(--spacing-4)] py-[length:var(--spacing-3)]",
    footer:
      "flex items-center justify-between gap-[length:var(--spacing-4)] border-t border-border px-[length:var(--spacing-4)] py-[length:var(--spacing-3)]",
  },
  lg: {
    block: "px-[length:var(--spacing-6)] py-[length:var(--spacing-4)]",
    header:
      "flex flex-col gap-[length:var(--spacing-2)] border-b border-border px-[length:var(--spacing-6)] pt-[length:var(--spacing-6)] pb-[length:var(--spacing-4)]",
    body: "px-[length:var(--spacing-6)] py-[length:var(--spacing-4)]",
    footer:
      "flex items-center justify-between gap-[length:var(--spacing-4)] border-t border-border px-[length:var(--spacing-6)] py-[length:var(--spacing-4)]",
  },
};

function useCardPadding() {
  return useContext(CardPaddingContext);
}

function CardRoot({
  variant = "surface",
  elevation = "none",
  padding = "none",
  as: Component = "div",
  className,
  children,
  ...props
}: CardProps) {
  return (
    <CardPaddingContext.Provider value={padding}>
      <Component
        className={cn(
          baseClasses,
          variantClasses[variant],
          elevationClasses[elevation],
          rootPaddingClasses[padding],
          className,
        )}
        data-variant={variant}
        data-elevation={elevation}
        data-padding={padding}
        {...props}
      >
        {children}
      </Component>
    </CardPaddingContext.Provider>
  );
}

function CardHeader({ className, children, ...props }: CardSectionProps) {
  const padding = useCardPadding();
  return (
    <header
      className={cn(sectionPaddingClasses[padding].header, className)}
      {...props}
    >
      {children}
    </header>
  );
}

function CardBody({ className, children, ...props }: CardSectionProps) {
  const padding = useCardPadding();
  return (
    <div className={cn(sectionPaddingClasses[padding].body, className)} {...props}>
      {children}
    </div>
  );
}

function CardFooter({ className, children, ...props }: CardSectionProps) {
  const padding = useCardPadding();
  return (
    <footer
      className={cn(sectionPaddingClasses[padding].footer, className)}
      {...props}
    >
      {children}
    </footer>
  );
}

function CardDivider({ className, ...props }: HTMLAttributes<HTMLHRElement>) {
  return (
    <hr className={cn("m-0 border-0 border-t border-border", className)} {...props} />
  );
}

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
  Divider: CardDivider,
});
