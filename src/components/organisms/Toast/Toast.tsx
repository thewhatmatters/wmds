import {
  useSyncExternalStore,
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
} from "react";
import { createPortal } from "react-dom";
import {
  CircleCheck,
  CircleX,
  Info,
  TriangleAlert,
  X,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type TargetAndTransition,
} from "motion/react";
import { Badge, type BadgeVariant } from "../../atoms/Badge/Badge";
import { Button } from "../../atoms/Button/Button";
import { IconButton } from "../../atoms/IconButton/IconButton";
import { cn } from "../../../lib/cn";
import { motionTransitionProp } from "../../../lib/motion";
import {
  getServerToastSnapshot,
  getToastSnapshot,
  subscribeToToasts,
  toast,
  type ToastRecord,
  type ToastTone,
} from "./toastStore";
import {
  toastActionsClasses,
  toastContentClasses,
  toastDescriptionClasses,
  toastItemClasses,
  toastItemContentRowClasses,
  toastStatusClasses,
  toastTitleClasses,
  toastViewportPositionClasses,
  type ToastPosition,
} from "./toastStyles";

export interface ToasterProps
  extends Pick<HTMLAttributes<HTMLOListElement>, "aria-label"> {
  position?: ToastPosition;
  /** Maximum simultaneously rendered notifications. Default `5`. */
  maxVisible?: number;
  /** Layout-only: z-index or page inset adjustments. */
  className?: string;
}

const toastTonePresentation: Record<
  Exclude<ToastTone, "neutral">,
  { badge: BadgeVariant; icon: ReactElement }
> = {
  success: { badge: "success", icon: <CircleCheck /> },
  info: { badge: "info", icon: <Info /> },
  warning: { badge: "warning", icon: <TriangleAlert /> },
  error: { badge: "destructive", icon: <CircleX /> },
};

function toastInitialState(
  position: ToastPosition,
  shouldReduceMotion: boolean,
): TargetAndTransition {
  if (shouldReduceMotion) return { opacity: 1 };
  if (position.endsWith("left")) return { opacity: 0, x: -16, scale: 0.96 };
  if (position.endsWith("right")) return { opacity: 0, x: 16, scale: 0.96 };
  return {
    opacity: 0,
    y: position.startsWith("top") ? -12 : 12,
    scale: 0.96,
  };
}

function toastExitState(
  position: ToastPosition,
  shouldReduceMotion: boolean,
): TargetAndTransition {
  if (shouldReduceMotion) return { opacity: 0 };
  if (position.endsWith("left")) return { opacity: 0, x: -8, scale: 0.98 };
  if (position.endsWith("right")) return { opacity: 0, x: 8, scale: 0.98 };
  return {
    opacity: 0,
    y: position.startsWith("top") ? -8 : 8,
    scale: 0.98,
  };
}

function ToastItem({
  record,
  position,
  index,
  maxVisible,
}: {
  record: ToastRecord;
  position: ToastPosition;
  index: number;
  maxVisible: number;
}) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const stackDepth = Math.min(index, 4);
  const stackY =
    (position.startsWith("top") ? 1 : -1) * stackDepth * 12;
  const stackScale = 1 - stackDepth * 0.04;
  const presentation =
    record.tone === "neutral" ? null : toastTonePresentation[record.tone];
  const transformOrigin = `${position.startsWith("top") ? "top" : "bottom"} ${
    position.endsWith("left")
      ? "left"
      : position.endsWith("right")
        ? "right"
        : "center"
  }`;

  return (
    <motion.li
      layout
      role={
        index === 0
          ? record.tone === "error"
            ? "alert"
            : "status"
          : undefined
      }
      aria-hidden={index > 0 || undefined}
      aria-atomic="true"
      className={toastItemClasses}
      initial={toastInitialState(position, shouldReduceMotion)}
      animate={{ opacity: 1, x: 0, y: stackY, scale: stackScale }}
      exit={toastExitState(position, shouldReduceMotion)}
      transition={motionTransitionProp("medium")}
      style={
        {
          transformOrigin,
          zIndex: maxVisible - index,
          pointerEvents: index === 0 ? "auto" : "none",
        } as CSSProperties
      }
    >
      <motion.div
        className={toastItemContentRowClasses}
        animate={{ opacity: index === 0 ? 1 : 0 }}
        transition={motionTransitionProp("fast")}
      >
        {presentation != null ? (
          <Badge
            iconOnly
            icon={presentation.icon}
            variant={presentation.badge}
            className={toastStatusClasses}
          />
        ) : null}
        <div className={toastContentClasses}>
          <p className={toastTitleClasses}>{record.title}</p>
          {record.description != null ? (
            <p className={toastDescriptionClasses}>{record.description}</p>
          ) : null}
        </div>
        <div className={toastActionsClasses}>
          {record.action != null ? (
            <Button
              size="xs"
              role="ghost"
              onClick={() => {
                record.action?.onClick(record.id);
                if (record.action?.dismiss !== false) toast.dismiss(record.id);
              }}
            >
              {record.action.label}
            </Button>
          ) : null}
          {record.dismissible ? (
            <IconButton
              size="xs"
              role="ghost"
              icon={<X />}
              aria-label="Dismiss notification"
              onClick={() => toast.dismiss(record.id)}
            />
          ) : null}
        </div>
      </motion.div>
    </motion.li>
  );
}

export function Toaster({
  position = "bottom-right",
  maxVisible = 5,
  "aria-label": ariaLabel = "Notifications",
  className,
}: ToasterProps) {
  const records = useSyncExternalStore(
    subscribeToToasts,
    getToastSnapshot,
    getServerToastSnapshot,
  );

  if (typeof document === "undefined") return null;

  const visible = records.slice(-Math.max(1, maxVisible));
  const ordered = [...visible].reverse();

  return createPortal(
    <ol
      aria-label={ariaLabel}
      className={cn(toastViewportPositionClasses[position], className)}
      data-position={position}
    >
      <AnimatePresence initial={false}>
        {ordered.map((record, index) => (
          <ToastItem
            key={record.id}
            record={record}
            position={position}
            index={index}
            maxVisible={maxVisible}
          />
        ))}
      </AnimatePresence>
    </ol>,
    document.body,
  );
}

/** Notification viewport. `Toaster` is the familiar alias. */
export function Toast(props: ToasterProps) {
  return <Toaster {...props} />;
}

export { toast };
export type {
  ToastAction,
  ToastId,
  ToastOptions,
  ToastRecord,
  ToastTone,
} from "./toastStore";
export { toastPositions, type ToastPosition } from "./toastStyles";
