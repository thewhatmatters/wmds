import {
  createContext,
  useContext,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../../lib/cn";
import {
  cardAddressClasses,
  cardBaseClasses,
  cardBodyTextClasses,
  cardBodyWellClasses,
  cardDividerClasses,
  cardLayoutHeaderEndClasses,
  cardLayoutHeaderStartClasses,
  cardLayoutShellClasses,
  cardLayoutShellShapeClasses,
  cardOverflowClasses,
  cardRootPaddingClasses,
  cardSectionPaddingClasses,
  cardShapeClasses,
  cardSubtitleClasses,
  cardTitleClasses,
  cardVariantClasses,
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
  /** `rounded` (default) — shell + inset well with outer radius/shadow; `flush` when parent owns chrome. */
  shape?: CardShape;
  /** Applies to simple padded cards only — layout cards use the body/surface shell pattern. */
  variant?: CardVariant;
  /** Root padding. Use `none` with `Card.Header` / `Card.Body` / `Card.Footer`. */
  padding?: CardPadding;
  as?: "div" | "article" | "section";
  className?: CardLayoutClassName;
}

export interface CardSectionProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  className?: CardLayoutClassName;
}

export interface CardHeaderProps extends Omit<CardSectionProps, "title"> {
  /** Primary heading in the start slot. */
  title?: ReactNode;
  /** Secondary line under the title (address, meta). Strings use caption + muted. */
  subtitle?: ReactNode;
  /** End slot — kebab `IconButton`, chips-as-tabs, Badge, etc. */
  end?: ReactNode;
}

const CardPaddingContext = createContext<CardPadding>("none");

function useCardPadding() {
  return useContext(CardPaddingContext);
}

function CardRoot({
  shape = "rounded",
  variant = "surface",
  padding = "none",
  as: Component = "div",
  className,
  children,
  ...props
}: CardProps) {
  const isLayout = padding === "none";

  return (
    <CardPaddingContext.Provider value={padding}>
      <Component
        className={cn(
          cardBaseClasses,
          isLayout
            ? cn(cardLayoutShellClasses, cardLayoutShellShapeClasses[shape])
            : cn(
                cardOverflowClasses,
                cardShapeClasses[shape],
                cardVariantClasses[variant],
                cardRootPaddingClasses[padding],
              ),
          className,
        )}
        data-shape={shape}
        data-variant={isLayout ? undefined : variant}
        data-padding={padding}
        data-layout={isLayout ? "shell" : undefined}
        {...props}
      >
        {children}
      </Component>
    </CardPaddingContext.Provider>
  );
}

function renderHeaderTitle(title: ReactNode) {
  if (typeof title === "string" || typeof title === "number") {
    return <h2 className={cardTitleClasses}>{title}</h2>;
  }
  return title;
}

function renderHeaderSubtitle(subtitle: ReactNode) {
  if (typeof subtitle === "string" || typeof subtitle === "number") {
    return <p className={cardSubtitleClasses}>{subtitle}</p>;
  }
  return subtitle;
}

function CardHeader({
  className,
  children,
  title,
  subtitle,
  end,
  ...props
}: CardHeaderProps) {
  const padding = useCardPadding();
  const hasStructured = title != null || subtitle != null || end != null;
  const hasStart = title != null || subtitle != null || children != null;

  return (
    <header className={cn(cardSectionPaddingClasses[padding].header, className)} {...props}>
      {hasStructured ? (
        <>
          {hasStart ? (
            <div className={cardLayoutHeaderStartClasses}>
              {title != null ? renderHeaderTitle(title) : null}
              {subtitle != null ? renderHeaderSubtitle(subtitle) : null}
              {children}
            </div>
          ) : null}
          {end != null ? <div className={cardLayoutHeaderEndClasses}>{end}</div> : null}
        </>
      ) : (
        children
      )}
    </header>
  );
}

/** Inset well — composition slot for any supporting content. */
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
 * Layout cards (`padding="none"`) — shell + **Header** start/end + **Body** slot
 * (2px outside, square, no fill).
 */
export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
  Divider: CardDivider,
});

export {
  cardAddressClasses,
  cardBodyTextClasses,
  cardBodyWellClasses,
  cardSubtitleClasses,
  cardTitleClasses,
};
