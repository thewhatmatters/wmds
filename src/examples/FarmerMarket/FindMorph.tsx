import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useReducedMotion,
} from "motion/react";
import {
  buttonBaseClasses,
  buttonPillClass,
  buttonRoleClasses,
  buttonSizeClasses,
} from "../../components/atoms/Button/buttonStyles";
import { Search } from "../../components/molecules/Search/Search";
import { cn } from "../../lib/cn";

/** Shared-shell spring — Create Button lock. */
export const findMorphSpring = {
  type: "spring" as const,
  stiffness: 380,
  damping: 32,
  mass: 0.9,
};

const CLIP_CLOSED = "inset(0% 50% 0% 50% round 999px)";
const CLIP_OPEN = "inset(0% 0% 0% 0% round 999px)";
const CLIP_HIDE = "inset(0 0 100% 0)";

const rollOut = {
  rest: { y: "0%" },
  hover: { y: "-100%" },
};

const rollIn = {
  rest: { y: "100%" },
  hover: { y: "0%" },
};

export interface FindMorphProps {
  expanded: boolean;
  onExpand: () => void;
  query: string;
  onQueryChange: (value: string) => void;
  onUseLocation?: () => void;
  className?: string;
}

/**
 * Farmer Market hero Find — Create Button: shared `layoutId` shell, clip-path
 * reveal of ZIP + Use my location. Find word is clipped/hidden — no `layout`.
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
  const reduceMotion = useReducedMotion();
  const transition = reduceMotion ? { duration: 0 } : findMorphSpring;

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
    <MotionConfig reducedMotion="user" transition={transition}>
      <div className={cn("relative w-full max-w-lg", className)}>
        <motion.div
          layout
          layoutId="fm-find-shell"
          transition={transition}
          style={{ borderRadius: 999 }}
          className={cn("overflow-hidden", expanded ? "w-full" : "w-full sm:w-auto")}
        >
          <AnimatePresence initial={false}>
            {!expanded ? (
              <FindCollapsedControl
                key="fm-find-label"
                reduceMotion={Boolean(reduceMotion)}
                onExpand={onExpand}
              />
            ) : (
              <motion.div
                key="fm-find-search"
                className="w-full"
                initial={reduceMotion ? { clipPath: CLIP_OPEN } : { clipPath: CLIP_CLOSED }}
                animate={{ clipPath: CLIP_OPEN }}
                transition={transition}
              >
                <Search
                  ref={inputRef}
                  placeholder="ZIP or city"
                  aria-label="Location"
                  actionLabel="Use my location"
                  value={query}
                  onChange={(event) => onQueryChange(event.target.value)}
                  onAction={onUseLocation}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </MotionConfig>
  );
}

function FindCollapsedControl({
  reduceMotion,
  onExpand,
}: {
  reduceMotion: boolean;
  onExpand: () => void;
}) {
  const [active, setActive] = useState(false);
  const activeRef = useRef(false);
  const animating = useRef(false);
  const pending = useRef<boolean | null>(null);
  const hovered = useRef(false);
  const focused = useRef(false);

  const updateActive = (next: boolean) => {
    activeRef.current = next;
    setActive(next);
  };

  const requestActive = (next: boolean) => {
    if (reduceMotion) return;
    if (next === activeRef.current) {
      pending.current = null;
      return;
    }
    if (animating.current) {
      pending.current = next;
      return;
    }
    animating.current = true;
    updateActive(next);
  };

  const completeAnimation = () => {
    if (!animating.current) return;
    animating.current = false;
    if (pending.current !== null && pending.current !== activeRef.current) {
      const next = pending.current;
      pending.current = null;
      animating.current = true;
      updateActive(next);
    } else {
      pending.current = null;
    }
  };

  return (
    <motion.button
      type="button"
      aria-label="Find"
      className={cn(
        buttonBaseClasses,
        buttonPillClass,
        buttonRoleClasses.primary,
        buttonSizeClasses.md,
        "w-full",
      )}
      onClick={onExpand}
      onHoverStart={() => {
        hovered.current = true;
        requestActive(true);
      }}
      onHoverEnd={() => {
        hovered.current = false;
        requestActive(focused.current);
      }}
      onFocus={() => {
        focused.current = true;
        requestActive(true);
      }}
      onBlur={() => {
        focused.current = false;
        requestActive(hovered.current);
      }}
      initial={false}
      exit={{ clipPath: CLIP_HIDE }}
      transition={{ duration: 0 }}
    >
      <FindRollingLabel
        active={active}
        reduceMotion={reduceMotion}
        onAnimationComplete={completeAnimation}
      />
    </motion.button>
  );
}

/** Rolling Find label — y-roll only. No `layout`, no `layoutId`. */
function FindRollingLabel({
  active,
  reduceMotion,
  onAnimationComplete,
}: {
  active: boolean;
  reduceMotion: boolean;
  onAnimationComplete: () => void;
}) {
  return (
    <span className="relative inline-block overflow-hidden leading-none">
      <motion.span
        className="block whitespace-nowrap"
        variants={rollOut}
        initial="rest"
        animate={active ? "hover" : "rest"}
        onAnimationComplete={onAnimationComplete}
        transition={reduceMotion ? { duration: 0 } : findMorphSpring}
      >
        Find
      </motion.span>
      {reduceMotion ? null : (
        <motion.span
          aria-hidden
          className="absolute inset-0 block whitespace-nowrap"
          variants={rollIn}
          initial="rest"
          animate={active ? "hover" : "rest"}
          transition={findMorphSpring}
        >
          Find
        </motion.span>
      )}
    </span>
  );
}
