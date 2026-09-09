import {
  Children,
  createContext,
  isValidElement,
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
  cardLayoutBodyOccupantInsetXClasses,
  cardLayoutBodyOccupantPadYClasses,
  cardLayoutBodyOccupantDotGridWellClasses,
  cardLayoutBodyOccupantRadiusClasses,
  cardLayoutBodyOccupantWellClasses,
  cardLayoutHeaderEndClasses,
  cardLayoutHeaderStartClasses,
  cardLayoutShellClasses,
  cardLayoutShellBottomClasses,
  cardLayoutShellShapeClasses,
  cardLayoutTerminalBodyClasses,
  cardLayoutVariantClasses,
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
  /** Surface treatment: `surface` elevates layout cards; `outlined` uses a hairline with no shadow. */
  variant?: CardVariant;
  /** Root padding. Use `none` with `Card.Header` / `Card.Body` / `Card.Footer`. */
  padding?: CardPadding;
  /** Overrides automatic terminal-Body detection. Normally omitted: Body without Footer gets a 2px bottom inset. */
  bodyTerminal?: boolean;
  as?: "div" | "article" | "section";
  className?: CardLayoutClassName;
}

export interface CardSectionProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  className?: CardLayoutClassName;
}

export interface CardHeaderProps extends CardSectionProps {
  /** Start slot — title + subtitle, or any leading cluster. */
  start?: ReactNode;
  /** End slot — kebab, chips-as-tabs, Badge, or any trailing cluster. */
  end?: ReactNode;
}

const CardPaddingContext = createContext<CardPadding>("none");
const CardBodyTerminalContext = createContext(false);

function useCardPadding() {
  return useContext(CardPaddingContext);
}

function CardRoot({
  shape = "rounded",
  variant = "surface",
  padding = "none",
  bodyTerminal,
  as: Component = "div",
  className,
  children,
  ...props
}: CardProps) {
  const isLayout = padding === "none";
  const inferredBodyTerminal =
    isLayout &&
    Children.toArray(children).some(
      (child) => isValidElement(child) && child.type === CardBody,
    ) &&
    !Children.toArray(children).some(
      (child) => isValidElement(child) && child.type === CardFooter,
    );
  const terminalBody = bodyTerminal ?? inferredBodyTerminal;

  return (
    <CardPaddingContext.Provider value={padding}>
      <CardBodyTerminalContext.Provider value={terminalBody}>
        <Component
          className={cn(
            cardBaseClasses,
            isLayout
              ? cn(
                  cardLayoutShellClasses,
                  cardLayoutShellBottomClasses(terminalBody),
                  cardLayoutShellShapeClasses[shape],
                cardLayoutVariantClasses[variant],
                )
              : cn(
                  cardOverflowClasses,
                  cardShapeClasses[shape],
                  cardVariantClasses[variant],
                  cardRootPaddingClasses[padding],
                ),
            className,
          )}
          data-shape={shape}
          data-variant={variant}
          data-padding={padding}
          data-layout={isLayout ? "shell" : undefined}
          {...props}
        >
          {children}
        </Component>
      </CardBodyTerminalContext.Provider>
    </CardPaddingContext.Provider>
  );
}

function CardHeader({
  className,
  children,
  start,
  end,
  ...props
}: CardHeaderProps) {
  const padding = useCardPadding();
  const startContent = start ?? children;

  return (
    <header className={cn(cardSectionPaddingClasses[padding].header, className)} {...props}>
      {startContent != null ? (
        <div className={cardLayoutHeaderStartClasses}>{startContent}</div>
      ) : null}
      {end != null ? <div className={cardLayoutHeaderEndClasses}>{end}</div> : null}
    </header>
  );
}

/** Inset well — composition slot for any supporting content. */
function CardBody({ className, children, ...props }: CardSectionProps) {
  const padding = useCardPadding();
  const terminal = useContext(CardBodyTerminalContext);
  return (
    <div
      className={cn(
        cardSectionPaddingClasses[padding].body,
        padding === "none" && terminal && cardLayoutTerminalBodyClasses,
        className,
      )}
      {...props}
    >
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
 * Content surface — **Header**, **Body**, **Footer** composition slots.
 * Layout cards (`padding="none"`) — shell + **Header** (`start` | `end`) + **Body** slot
 * (2px gutter, square, transparent — occupant owns fill and chrome).
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
  cardLayoutBodyOccupantInsetXClasses,
  cardLayoutBodyOccupantPadYClasses,
  cardLayoutBodyOccupantDotGridWellClasses,
  cardLayoutBodyOccupantRadiusClasses,
  cardLayoutBodyOccupantWellClasses,
  cardSubtitleClasses,
  cardTitleClasses,
};
