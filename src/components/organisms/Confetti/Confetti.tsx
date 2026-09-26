"use client";

import {
  animate,
  MotionConfigContext,
  useReducedMotion,
  type DOMKeyframesDefinition,
} from "motion/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
  confettiCleanupDelayMs,
  confettiPieceBox,
  createConfettiParticles,
  isConfettiReducedMotion,
  resolveConfettiOrigin,
  resolveConfettiPhysics,
  type ConfettiOrigin,
  type ConfettiParticleSpec,
  type ConfettiPhysicsOptions,
  type ConfettiViewportPoint,
} from "./confettiPhysics";
import { confettiLayerClasses } from "./confettiStyles";

export {
  confettiDefaultColors,
  confettiDefaults,
  type ConfettiOrigin,
} from "./confettiPhysics";

/** Physics props plus where the burst starts and which colors to sample. */
export type ConfettiFireOptions = ConfettiPhysicsOptions & {
  origin?: ConfettiOrigin;
};

export interface ConfettiProviderProps {
  children: ReactNode;
}

interface ConfettiBurst {
  id: number;
  origin: ConfettiViewportPoint;
  particles: ConfettiParticleSpec[];
}

interface ConfettiContextValue {
  fire: (options?: ConfettiFireOptions) => void;
}

const ConfettiContext = createContext<ConfettiContextValue | null>(null);

/**
 * `fire` from the nearest **ConfettiProvider**.
 * Does nothing when the reader prefers reduced motion, or when `MotionConfig`
 * `reducedMotion` is `"always"`.
 */
export function useConfetti(): ConfettiContextValue {
  const value = useContext(ConfettiContext);
  if (!value) {
    throw new Error("useConfetti must be rendered inside ConfettiProvider.");
  }
  return value;
}

/**
 * Fire one burst when this component mounts.
 * A ref skips React StrictMode's extra effect run and later re-renders.
 * Leaving the surface and mounting it again fires again.
 * `fire()` still does nothing when reduced motion is on.
 */
export function useConfettiOnMount(options?: ConfettiFireOptions) {
  const { fire } = useConfetti();
  const fired = useRef(false);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    if (fired.current) {
      return;
    }
    fired.current = true;
    fire(optionsRef.current);
  }, [fire]);
}

/**
 * App-root overlay for celebratory bursts. Mount once. After an async success,
 * render the confirmation surface and call `useConfettiOnMount()` there.
 * `useConfetti().fire()` is the same burst when the moment is not a mount.
 * Bursts may overlap. Each burst is removed `duration + 0.5s` after it starts.
 * Unmount cancels in-flight animations.
 */
export function ConfettiProvider({ children }: ConfettiProviderProps) {
  const [bursts, setBursts] = useState<ConfettiBurst[]>([]);
  const [mounted, setMounted] = useState(false);
  const nextId = useRef(0);
  const timeouts = useRef<number[]>([]);
  const { reducedMotion: reducedMotionConfig } = useContext(MotionConfigContext);
  const prefersReduced = useReducedMotion() === true;
  const reduceMotion = isConfettiReducedMotion(prefersReduced, reducedMotionConfig);
  const reduceMotionRef = useRef(reduceMotion);
  reduceMotionRef.current = reduceMotion;

  useLayoutEffect(() => {
    setMounted(true);
    return () => {
      for (const timeout of timeouts.current) {
        window.clearTimeout(timeout);
      }
      timeouts.current = [];
    };
  }, []);

  const fire = useCallback((options?: ConfettiFireOptions) => {
    if (reduceMotionRef.current) {
      return;
    }
    if (typeof window === "undefined") {
      return;
    }

    const physics = resolveConfettiPhysics(options);
    const id = nextId.current++;
    const origin = resolveConfettiOrigin(options?.origin, {
      width: window.innerWidth,
      height: window.innerHeight,
    });
    const particles = createConfettiParticles(options);

    setBursts((prev) => [...prev, { id, origin, particles }]);

    const timeout = window.setTimeout(() => {
      timeouts.current = timeouts.current.filter((entry) => entry !== timeout);
      setBursts((prev) => prev.filter((burst) => burst.id !== id));
    }, confettiCleanupDelayMs(physics.duration));
    timeouts.current.push(timeout);
  }, []);

  const value = useMemo(() => ({ fire }), [fire]);

  const layer =
    mounted && typeof document !== "undefined"
      ? createPortal(
          <div className={confettiLayerClasses} data-confetti-layer="" aria-hidden="true">
            {bursts.map((burst) => (
              <div
                key={burst.id}
                data-confetti-burst=""
                style={{
                  position: "absolute",
                  left: burst.origin.x,
                  top: burst.origin.y,
                  width: 0,
                  height: 0,
                }}
              >
                {burst.particles.map((particle, index) => (
                  <ConfettiPiece key={index} particle={particle} />
                ))}
              </div>
            ))}
          </div>,
          document.body,
        )
      : null;

  return (
    <ConfettiContext.Provider value={value}>
      {children}
      {layer}
    </ConfettiContext.Provider>
  );
}

function ConfettiPiece({ particle }: { particle: ConfettiParticleSpec }) {
  const ref = useRef<HTMLDivElement>(null);
  const { keyframes, duration, size, color, shape } = particle;
  const box = confettiPieceBox(shape, size);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }
    const animation = animate(node, keyframes as DOMKeyframesDefinition, {
      duration,
      ease: "linear",
    });
    return () => {
      animation.cancel();
    };
  }, [duration, keyframes]);

  return (
    <div
      ref={ref}
      data-confetti-piece=""
      data-shape={shape}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: box.width,
        height: box.height,
        borderRadius: box.borderRadius,
        backgroundColor: color,
        transform: keyframes.transform[0],
        opacity: keyframes.opacity[0],
        willChange: "transform, opacity",
        pointerEvents: "none",
      }}
    />
  );
}
