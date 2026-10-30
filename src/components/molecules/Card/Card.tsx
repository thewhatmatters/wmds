import {
  Children,
  createContext,
  isValidElement,
  useContext,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { Badge } from "../../atoms/Badge/Badge";
import { Skeleton } from "../../atoms/Skeleton/Skeleton";
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
  cardLayoutShellTopClasses,
  cardLayoutScrollBodyClasses,
  cardLayoutShellShapeClasses,
  cardLayoutTerminalBodyClasses,
  cardLayoutVariantClasses,
  cardOverflowClasses,
  cardRootPaddingClasses,
  cardSectionPaddingClasses,
  cardShapeClasses,
  cardSubtitleClasses,
  cardTerminalBarClasses,
  cardTerminalFrameClasses,
  cardTerminalFrameElementClasses,
  cardTerminalHeightClasses,
  cardTerminalMessageClasses,
  cardTerminalStageClasses,
  cardTerminalTitleClasses,
  cardTitleClasses,
  cardVariantClasses,
  type CardBodyVariant,
  type CardPadding,
  type CardShape,
  type CardTerminalHeight,
  type CardTerminalState,
  type CardVariant,
} from "./cardStyles";

export type {
  CardBodyVariant,
  CardPadding,
  CardShape,
  CardTerminalHeight,
  CardTerminalState,
  CardVariant,
} from "./cardStyles";
export {
  cardBodyVariants,
  cardPaddings,
  cardShapes,
  cardTerminalHeights,
  cardTerminalStates,
  cardVariants,
} from "./cardStyles";

/** Layout-only — not for surface, border, or radius overrides. */
export type CardLayoutClassName = string;

export interface CardProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  /** `rounded` (default) — shell + inset well with outer radius/shadow; `flush` when parent owns chrome. */
  shape?: CardShape;
  /** Surface treatment: layout cards use soft card elevation. `outlined` is that elevation with no stroke. */
  variant?: CardVariant;
  /** Root padding. Use `none` with `Card.Header` / `Card.Body` / `Card.Footer`. */
  padding?: CardPadding;
  /** Overrides automatic terminal-Body detection. Normally omitted: Body without Footer gets a 2px bottom inset. */
  bodyTerminal?: boolean;
  /** Overrides automatic headerless detection. Normally omitted: Body without Header gets a 2px top inset. */
  headerless?: boolean;
  as?: "div" | "article" | "section";
  /**
   * The card's own colour pair, so a card can stand apart from its section (testimonials, offers):
   * `inverse` (the brand surface, dark roles), `field` (the saturated field colour, flat), or `light` (the
   * light palette, e.g. a paper card on a dark or toned section). Default: the section's own colours.
   * Everything inside re-skins, as in **Band** `tone`.
   */
  tone?: CardTone;
  className?: CardLayoutClassName;
}

export const cardTones = ["default", "inverse", "field", "light"] as const;
export type CardTone = (typeof cardTones)[number];

/** `data-tone` / `data-theme` for a card tone (the same scopes Band uses; `light` is the light palette). */
function cardToneAttributes(tone: CardTone): { "data-tone"?: string; "data-theme"?: string } {
  if (tone === "inverse") return { "data-tone": "inverse", "data-theme": "dark" };
  if (tone === "field") return { "data-tone": "field" };
  if (tone === "light") return { "data-theme": "light" };
  return {};
}

export interface CardSectionProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  className?: CardLayoutClassName;
}

export interface CardBodyProps extends Omit<CardSectionProps, "title"> {
  /**
   * `slot` (default) is the composition well.
   * `terminal` is a dark embed frame. It is not `bodyTerminal`, which only densifies the shell bottom.
   */
  variant?: CardBodyVariant;
  /** Embed URL. Omit while `loading` or `disconnected`. */
  src?: string;
  /** Inline document when there is no `src`. `src` wins when both are set. */
  srcDoc?: string;
  /** Accessible name of the embed. Default `Terminal`. */
  title?: string;
  /** `sm` 160px, `md` 256px, `lg` 384px, `fill` grows in a pinned card. Default `md`. */
  height?: CardTerminalHeight;
  /** Muted **Read only** badge in the frame bar. */
  readOnly?: boolean;
  /** `ready` shows the embed. `loading` is a **Skeleton**. `disconnected` is a status line. */
  state?: CardTerminalState;
  /** Status copy when `state` is `disconnected`. Default `Disconnected`. */
  message?: string;
}

export interface CardHeaderProps extends CardSectionProps {
  /** Start slot — title + subtitle, or any leading cluster. */
  start?: ReactNode;
  /** End slot — kebab, chips-as-tabs, Badge, or any trailing cluster. Always packs to the right. */
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
  headerless,
  as: Component = "div",
  tone = "default",
  className,
  children,
  ...props
}: CardProps) {
  const isLayout = padding === "none";
  const childList = Children.toArray(children);
  const hasHeader = childList.some(
    (child) => isValidElement(child) && child.type === CardHeader,
  );
  const hasBody = childList.some(
    (child) => isValidElement(child) && child.type === CardBody,
  );
  const hasFooter = childList.some(
    (child) => isValidElement(child) && child.type === CardFooter,
  );
  const hasTerminalFrame =
    isLayout &&
    childList.some(
      (child) =>
        isValidElement(child) &&
        child.type === CardBody &&
        (child.props as CardBodyProps).variant === "terminal",
    );
  const inferredBodyTerminal = isLayout && hasBody && !hasFooter;
  const inferredHeaderless = isLayout && hasBody && !hasHeader;
  const terminalBody = bodyTerminal ?? inferredBodyTerminal;
  const omitHeader = headerless ?? inferredHeaderless;
  const flushTerminal = hasTerminalFrame && !hasFooter;

  return (
    <CardPaddingContext.Provider value={padding}>
      <CardBodyTerminalContext.Provider value={terminalBody}>
        <Component
          className={cn(
            cardBaseClasses,
            isLayout
              ? cn(
                  cardLayoutShellClasses,
                  cardLayoutShellTopClasses(!omitHeader),
                  cardLayoutShellBottomClasses(terminalBody, flushTerminal),
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
          {...cardToneAttributes(tone)}
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

/** Inset well — composition slot, or a dark embed when `variant="terminal"`. */
function CardBody({
  className,
  children,
  variant = "slot",
  src,
  srcDoc,
  title = "Terminal",
  height = "md",
  readOnly = false,
  state = "ready",
  message = "Disconnected",
  ...props
}: CardBodyProps) {
  const padding = useCardPadding();
  const terminal = useContext(CardBodyTerminalContext);
  const isLayout = padding === "none";
  const frame = variant === "terminal";
  const ready = state === "ready" && (src != null || srcDoc != null);

  return (
    <div
      className={cn(
        frame ? cardTerminalFrameClasses : cardSectionPaddingClasses[padding].body,
        frame && cardTerminalHeightClasses[height],
        !frame && isLayout && terminal && cardLayoutTerminalBodyClasses,
        !frame && isLayout && !terminal && cardLayoutScrollBodyClasses,
        className,
      )}
      data-variant={frame ? "terminal" : undefined}
      data-theme={frame ? "dark" : undefined}
      data-state={frame ? state : undefined}
      data-height={frame ? height : undefined}
      {...props}
    >
      {frame ? (
        <>
          <div className={cardTerminalBarClasses}>
            <span className={cardTerminalTitleClasses}>{title}</span>
            {readOnly ? (
              <Badge size="sm" emphasis="muted">
                Read only
              </Badge>
            ) : null}
          </div>
          <div
            className={cardTerminalStageClasses}
            aria-busy={state === "loading" || undefined}
          >
            {state === "loading" ? <Skeleton width="100%" height="100%" radius="inner" /> : null}
            {state === "disconnected" ? (
              <p className={cardTerminalMessageClasses} role="status">
                {message}
              </p>
            ) : null}
            {state === "ready" && !ready ? (
              <p className={cardTerminalMessageClasses} role="status">
                No session
              </p>
            ) : null}
            {ready ? (
              <iframe
                className={cardTerminalFrameElementClasses}
                title={title}
                {...(src != null ? { src } : { srcDoc })}
              />
            ) : null}
          </div>
        </>
      ) : (
        children
      )}
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
 * Layout cards (`padding="none"`) — shell + optional **Header** (`start` | `end`) + **Body** slot
 * (2px gutter, square, transparent — occupant owns fill and chrome).
 * Headerless Body densifies shell top to 2px; footerless / `bodyTerminal` densifies shell bottom to 2px.
 * Pin a height on the root (`className`) with Header + Body + Footer — Header/Footer stay put;
 * **Card.Body** scrolls. `bodyTerminal` is that density flag.
 * **`Card.Body variant="terminal"`** is a separate dark embed frame (`data-theme="dark"` in both page themes).
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
