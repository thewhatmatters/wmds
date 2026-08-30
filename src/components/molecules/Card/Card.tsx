import {
  createContext,
  useContext,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../../lib/cn";
import {
  cardBaseClasses,
  cardBodyTextClasses,
  cardDividerClasses,
  cardRootPaddingClasses,
  cardSectionPaddingClasses,
  cardShapeClasses,
  cardVariantClasses,
  cardTitleClasses,
  type CardPadding,
  type CardShape,
  type CardVariant,
} from "./cardStyles";

export type { CardPadding, CardShape, CardVariant } from "./cardStyles";
export { cardPaddings, cardShapes, cardVariants } from "./cardStyles";

/** Layout-only — not for surface, border, or radius overrides. */
export type CardLayoutClassName = string;

export interface CardProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  /** `flush` (default) — inset in panels/sidebars; `rounded` for standalone surfaces. */
  shape?: CardShape;
  variant?: CardVariant;
  /** Root padding. Use `none` with `Card.Header` / `Card.Body` / `Card.Footer`. */
  padding?: CardPadding;
  as?: "div" | "article" | "section";
  className?: CardLayoutClassName;
}

export interface CardSectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  className?: CardLayoutClassName;
}

const CardPaddingContext = createContext<CardPadding>("none");

function useCardPadding() {
  return useContext(CardPaddingContext);
}

function CardRoot({
  shape = "flush",
  variant = "surface",
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
          cardBaseClasses,
          cardShapeClasses[shape],
          cardVariantClasses[variant],
          cardRootPaddingClasses[padding],
          className,
        )}
        data-shape={shape}
        data-variant={variant}
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
    <header className={cn(cardSectionPaddingClasses[padding].header, className)} {...props}>
      {children}
    </header>
  );
}

function CardBody({ className, children, ...props }: CardSectionProps) {
  const padding = useCardPadding();
  return (
    <div className={cn(cardSectionPaddingClasses[padding].body, className)} {...props}>
      {children}
    </div>
  );
}

function CardFooter({ className, children, ...props }: CardSectionProps) {
  const padding = useCardPadding();
  return (
    <footer className={cn(cardSectionPaddingClasses[padding].footer, className)} {...props}>
      {children}
    </footer>
  );
}

function CardDivider({ className, ...props }: HTMLAttributes<HTMLHRElement>) {
  return <hr className={cn(cardDividerClasses, className)} {...props} />;
}

/**
 * Content surface — [Astryx Card](https://astryx.atmeta.com/components/Card).
 * Default **flush** (no radius) for panel/sidebar inset; compose with Header, Body, Footer.
 */
export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
  Divider: CardDivider,
});

export { cardBodyTextClasses, cardTitleClasses };
