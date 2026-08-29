import { Check, Loader2, X } from "lucide-react";
import { AnimatePresence, motion, useTime, useTransform } from "motion/react";
import { cn } from "../../../lib/cn";
import { buttonIconSizeClasses, type ButtonSize } from "./buttonStyles";
import {
  statusIconSpring,
  statusLabelSpring,
} from "./buttonStatusMotion";
import type { ButtonStatus } from "./buttonStatusStyles";

function StatusLoader({ size }: { size: ButtonSize }) {
  const time = useTime();
  const rotate = useTransform(time, [0, 1000], [0, 360], { clamp: false });

  return (
    <motion.span
      className="inline-flex shrink-0"
      style={{ rotate }}
      aria-hidden
    >
      <Loader2
        className={cn("stroke-current", buttonIconSizeClasses[size])}
        strokeWidth={2}
      />
    </motion.span>
  );
}

function StatusIconGlyph({
  status,
  size,
}: {
  status: Exclude<ButtonStatus, "idle">;
  size: ButtonSize;
}) {
  const iconClass = cn("shrink-0 stroke-current", buttonIconSizeClasses[size]);

  if (status === "loading") {
    return <StatusLoader size={size} />;
  }

  if (status === "success") {
    return <Check className={iconClass} strokeWidth={2.5} aria-hidden />;
  }

  return <X className={iconClass} strokeWidth={2.5} aria-hidden />;
}

export function ButtonStatusIcon({ status, size }: { status: ButtonStatus; size: ButtonSize }) {
  if (status === "idle") {
    return null;
  }

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={status}
        layout
        layoutId="status-icon"
        className="inline-flex shrink-0 items-center justify-center"
        initial={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
        transition={statusIconSpring}
        aria-hidden
      >
        <StatusIconGlyph status={status} size={size} />
      </motion.span>
    </AnimatePresence>
  );
}

export function ButtonStatusLabel({ label }: { label: string }) {
  return (
    <span className="relative inline-flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={label}
          layout
          className="inline-block whitespace-nowrap"
          initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
          transition={statusLabelSpring}
        >
          {label}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
