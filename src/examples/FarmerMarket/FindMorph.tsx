import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useReducedMotion,
  type Transition,
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
 * reveal of ZIP + Use my location. Example-only; not exported from the package.
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
        <AnimatePresence initial={false}>
          {!expanded ? (
            <FindCollapsedButton
              reduceMotion={Boolean(reduceMotion)}
              transition={transition}
              onExpand={onExpand}
            />
          ) : (
            <motion.div
              key="fm-find-expanded"
              layoutId="fm-find-shell"
              transition={transition}
              style={{ borderRadius: 999 }}
              className="w-full overflow-hidden will-change-transform"
            >
              <motion.div
                className="w-full"
                initial={reduceMotion ? { clipPath: CLIP_OPEN } : { clipPath: CLIP_CLOSED }}
                animate={{ clipPath: CLIP_OPEN }}
                exit={reduceMotion ? { clipPath: CLIP_OPEN } : { clipPath: CLIP_CLOSED }}
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}

function FindCollapsedButton({
  reduceMotion,
  transition,
  onExpand,
}: {
  reduceMotion: boolean;
  transition: Transition;
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
      key="fm-find-collapsed"
      type="button"
      layoutId="fm-find-shell"
      transition={transition}
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
      aria-label="Find"
      style={{ borderRadius: 999 }}
      className={cn(
        buttonBaseClasses,
        buttonPillClass,
        buttonRoleClasses.primary,
        buttonSizeClasses.md,
        "w-full overflow-hidden sm:w-auto",
      )}
    >
      <FindRollingLabel
        active={active}
        reduceMotion={reduceMotion}
        onAnimationComplete={completeAnimation}
      />
    </motion.button>
  );
}

/** Rolling Find label — Motion rolling-text button. No `layoutId` (scaleX smear). */
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
    <motion.span layout className="relative inline-block overflow-hidden leading-none">
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
    </motion.span>
  );
}
