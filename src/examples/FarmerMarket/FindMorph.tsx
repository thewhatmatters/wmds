import { useEffect, useRef } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import {
  buttonBaseClasses,
  buttonPillClass,
  buttonRoleClasses,
  buttonSizeClasses,
} from "../../components/atoms/Button/buttonStyles";
import { Search } from "../../components/molecules/Search/Search";
import { cn } from "../../lib/cn";

/** FM Find expand — spring matched to [Motion Create Button](https://motion.dev/examples/react-create-button). */
export const findMorphSpring = { stiffness: 240, damping: 23 } as const;

export const findMorphContentSpring = { stiffness: 500, damping: 35 } as const;

export interface FindMorphProps {
  expanded: boolean;
  onExpand: () => void;
  query: string;
  onQueryChange: (value: string) => void;
  onUseLocation?: () => void;
  className?: string;
}

/**
 * Farmer Market hero Find — `Button` morphs into {@link Search} via shared `layoutId`.
 * Example-only; not exported from the package.
 */
export function FindMorph({
  expanded,
  onExpand,
  query,
  onQueryChange,
  onUseLocation,
  className,
}: FindMorphProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!expanded) {
      return;
    }
    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [expanded]);

  return (
    <MotionConfig
      transition={{
        type: "spring",
        ...findMorphSpring,
      }}
    >
      <div className={cn("relative w-full max-w-lg", className)}>
        <AnimatePresence mode="popLayout" initial={false}>
          {!expanded ? (
            <motion.button
              key="fm-find-collapsed"
              type="button"
              layoutId="fm-find-shell"
              onClick={onExpand}
              className={cn(
                buttonBaseClasses,
                buttonPillClass,
                buttonRoleClasses.primary,
                buttonSizeClasses.md,
                "w-full sm:w-auto",
              )}
            >
              <motion.span layoutId="fm-find-label" className="relative">
                Find
              </motion.span>
            </motion.button>
          ) : (
            <motion.div
              key="fm-find-expanded"
              layoutId="fm-find-shell"
              className="w-full will-change-transform"
            >
              <motion.div
                className="w-full"
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                transition={{
                  type: "spring",
                  ...findMorphContentSpring,
                  delay: 0.05,
                }}
              >
                <Search
                  ref={inputRef}
                  placeholder="ZIP or city"
                  aria-label="Location"
                  actionLabel="Use my location"
                  value={query}
                  onChange={(event) => onQueryChange(event.target.value)}
                  onAction={onUseLocation ?? (() => onQueryChange("97201"))}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
