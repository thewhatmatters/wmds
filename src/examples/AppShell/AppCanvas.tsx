import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { appCanvasBodyClasses, appCanvasShellClasses } from "./appShellStyles";

export interface AppCanvasProps {
  children: ReactNode;
  className?: string;
}

/** Inset workspace sheet — chrome on **AppShellLayout** canvas host. */
export function AppCanvas({ children, className }: AppCanvasProps) {
  return <div className={cn(appCanvasShellClasses, className)}>{children}</div>;
}

export interface AppCanvasBodyProps {
  children: ReactNode;
  className?: string;
}

/** Scrollable canvas body below **AppHeader** — page layout via Tailwind utilities. */
export function AppCanvasBody({ children, className }: AppCanvasBodyProps) {
  return <div className={cn(appCanvasBodyClasses, className)}>{children}</div>;
}

/** @deprecated Use **AppCanvasBody** — grid-page bands removed from the shell example. */
export const AppCanvasGrid = AppCanvasBody;
