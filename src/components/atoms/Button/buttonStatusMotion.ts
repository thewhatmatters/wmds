import type { ButtonRole } from "./buttonStyles";
import type { ButtonStatus } from "./buttonStatusStyles";

/** Motion `animate` targets — CSS vars resolve at runtime for smooth crossfades. */
export type StatusPaint = {
  backgroundColor: string;
  color: string;
};

const roleIdlePaint: Record<ButtonRole, StatusPaint> = {
  primary: {
    backgroundColor: "var(--color-primary)",
    color: "var(--color-on-primary)",
  },
  secondary: {
    backgroundColor: "var(--color-secondary)",
    color: "var(--color-secondary-foreground)",
  },
  ghost: {
    backgroundColor: "transparent",
    color: "var(--color-ghost-foreground)",
  },
  destructive: {
    backgroundColor: "var(--color-error)",
    color: "var(--color-on-error)",
  },
};

const statusPaint: Record<Exclude<ButtonStatus, "idle">, StatusPaint> = {
  loading: {
    backgroundColor: "var(--color-secondary)",
    color: "var(--color-secondary-foreground)",
  },
  success: {
    backgroundColor: "var(--color-success)",
    color: "var(--color-on-success)",
  },
  error: {
    backgroundColor: "var(--color-error)",
    color: "var(--color-on-error)",
  },
};

/** Non-animated shell utilities paired with `animate` paint. */
export const statusShellClasses: Record<ButtonStatus, string> = {
  idle: "",
  loading: "shadow-raised",
  success: "shadow-inset-highlight",
  error: "",
};

export const roleIdleShellClasses: Record<ButtonRole, string> = {
  primary: "",
  secondary: "shadow-raised",
  ghost: "",
  destructive: "",
};

export function getStatusPaint(status: ButtonStatus, role: ButtonRole): StatusPaint {
  return status === "idle" ? roleIdlePaint[role] : statusPaint[status];
}

export function getStatusShellClass(status: ButtonStatus, role: ButtonRole): string {
  return status === "idle" ? roleIdleShellClasses[role] : statusShellClasses[status];
}

/** Shared layout transition for pill width + paint — matches Motion example feel. */
export const statusMorphTransition = {
  layout: { duration: 0.28, ease: [0.16, 1, 0.3, 1] as const },
  backgroundColor: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const },
  color: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const },
};

export const statusIconSpring = {
  type: "spring" as const,
  stiffness: 520,
  damping: 32,
  mass: 0.85,
};

export const statusLabelSpring = {
  type: "spring" as const,
  stiffness: 480,
  damping: 34,
  mass: 0.9,
};
