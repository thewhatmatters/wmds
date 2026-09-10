import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import type {
  TooltipPortalProps as BaseTooltipPortalProps,
  TooltipPositionerProps as BaseTooltipPositionerProps,
  TooltipRootChangeEventDetails,
  TooltipTriggerProps as BaseTooltipTriggerProps,
} from "@base-ui/react/tooltip";
import {
  createContext,
  useContext,
  useId,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "../../../lib/cn";
import {
  tooltipArrowClasses,
  tooltipPopupClasses,
  tooltipPositionerClasses,
} from "./tooltipStyles";

export const tooltipSides = [
  "top",
  "right",
  "bottom",
  "left",
  "inline-start",
  "inline-end",
] as const;
export const tooltipAlignments = ["start", "center", "end"] as const;

export type TooltipSide = (typeof tooltipSides)[number];
export type TooltipAlignment = (typeof tooltipAlignments)[number];
export type TooltipOpenChangeDetails = TooltipRootChangeEventDetails;

export interface TooltipProviderProps {
  children?: ReactNode;
  /** Shared hover-open delay in milliseconds. Default: `500`. */
  delay?: number;
  /** Shared close delay in milliseconds. Default: `0`. */
  closeDelay?: number;
  /** Grace period in which an adjacent tooltip opens immediately. Default: `400`. */
  timeout?: number;
}

export interface TooltipProps {
  children?: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean, details: TooltipOpenChangeDetails) => void;
  disabled?: boolean;
}

export interface TooltipTriggerProps
  extends Omit<BaseTooltipTriggerProps, "children" | "className" | "render"> {
  /**
   * Trigger element composed through Base UI's `render` prop.
   * Custom components must forward their ref and DOM event/ARIA props.
   */
  render: ReactElement;
  /** Layout-only class applied to the trigger element. */
  className?: string;
}

export interface TooltipContentProps {
  children: ReactNode;
  side?: TooltipSide;
  align?: TooltipAlignment;
  sideOffset?: BaseTooltipPositionerProps["sideOffset"];
  alignOffset?: BaseTooltipPositionerProps["alignOffset"];
  collisionBoundary?: BaseTooltipPositionerProps["collisionBoundary"];
  collisionPadding?: BaseTooltipPositionerProps["collisionPadding"];
  collisionAvoidance?: BaseTooltipPositionerProps["collisionAvoidance"];
  /** Portal target. Defaults to `document.body`. */
  container?: BaseTooltipPortalProps["container"];
  /** Show the directional arrow. Default: `true`. */
  arrow?: boolean;
  /** Layout-only class for width or placement constraints; not for re-theming. */
  className?: string;
}

const TooltipDescriptionContext = createContext<string | null>(null);

/** Shares hover timing across a group of tooltips. */
export function TooltipProvider({
  children,
  delay = 500,
  closeDelay = 0,
  timeout = 400,
}: TooltipProviderProps) {
  return (
    <BaseTooltip.Provider delay={delay} closeDelay={closeDelay} timeout={timeout}>
      {children}
    </BaseTooltip.Provider>
  );
}

/** Controls one tooltip's open state. */
export function TooltipRoot({
  children,
  defaultOpen,
  open,
  onOpenChange,
  disabled,
}: TooltipProps) {
  const descriptionId = useId();

  return (
    <TooltipDescriptionContext.Provider value={descriptionId}>
      <BaseTooltip.Root
        defaultOpen={defaultOpen}
        open={open}
        onOpenChange={onOpenChange}
        disabled={disabled}
      >
        {children}
      </BaseTooltip.Root>
    </TooltipDescriptionContext.Provider>
  );
}

/** Attaches tooltip behavior and accessibility attributes to one trigger. */
export function TooltipTrigger({
  render,
  className,
  "aria-describedby": ariaDescribedBy,
  ...props
}: TooltipTriggerProps) {
  const descriptionId = useContext(TooltipDescriptionContext);
  const descriptionIds = [ariaDescribedBy, descriptionId].filter(Boolean).join(" ");

  return (
    <BaseTooltip.Trigger
      {...props}
      render={render}
      className={className}
      aria-describedby={descriptionIds || undefined}
    />
  );
}

/** Portaled, collision-aware tooltip surface. */
export function TooltipContent({
  children,
  side = "top",
  align = "center",
  sideOffset = 6,
  alignOffset,
  collisionBoundary,
  collisionPadding = 8,
  collisionAvoidance = {
    side: "flip",
    align: "shift",
    fallbackAxisSide: "none",
  },
  container,
  arrow = true,
  className,
}: TooltipContentProps) {
  const descriptionId = useContext(TooltipDescriptionContext);

  return (
    <BaseTooltip.Portal container={container}>
      <BaseTooltip.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        collisionBoundary={collisionBoundary}
        collisionPadding={collisionPadding}
        collisionAvoidance={collisionAvoidance}
        className={tooltipPositionerClasses}
      >
        <BaseTooltip.Popup
          id={descriptionId ?? undefined}
          role="tooltip"
          className={cn(tooltipPopupClasses, className)}
        >
          {arrow ? <BaseTooltip.Arrow className={tooltipArrowClasses} /> : null}
          {children}
        </BaseTooltip.Popup>
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  );
}

/** Short, supplemental labels for hover and keyboard focus. */
export const Tooltip = Object.assign(TooltipRoot, {
  Provider: TooltipProvider,
  Trigger: TooltipTrigger,
  Content: TooltipContent,
});
