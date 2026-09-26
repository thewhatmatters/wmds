"use client";

import {
  MotionConfigContext,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  type MotionValue,
} from "motion/react";
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { cn } from "../../../lib/cn";
import {
  heroTileRepel,
  heroTileRestingLayout,
  heroTileStackDefaultSpring,
  heroTileStackDefaultStrength,
  heroTileStackIsOneShot,
  heroTileStackTapHoldMs,
  type HeroTileRestingLayout,
} from "./heroTileScatter";
import {
  heroTileStackImageClasses,
  heroTileStackRootClasses,
  heroTileStackRowClasses,
  heroTileStackSlotClasses,
  heroTileStackSurfaceClasses,
  heroTileStackTileOverlap,
  heroTileStackTileSize,
} from "./heroTileStackStyles";

export {
  heroTileRepel,
  heroTileRestingLayout,
  heroTileStackDefaultFalloff,
  heroTileStackDefaultSpring,
  heroTileStackDefaultStrength,
  heroTileStackTapHoldMs,
} from "./heroTileScatter";
export type { HeroTileRepel, HeroTileRepelInput, HeroTileRestingLayout } from "./heroTileScatter";

/** Layout-only — width and margin. Do not restyle the tile surface here. */
export type HeroTileStackLayoutClassName = string;

export interface HeroTileStackTile {
  src: string;
  /** Spoken name for the image. The scatter itself is decorative. */
  alt: string;
  /** Resting horizontal nudge in px. Default 0. */
  offsetX?: number;
  /** Resting vertical nudge. A number is px; a string is any CSS length (`5%`). */
  offsetY?: number | string;
  /** Resting tilt in degrees. */
  rotate?: number;
  /** Paint order. Higher sits on top. Defaults to the fan (later tiles in front). */
  zIndex?: number;
}

export interface HeroTileStackSpring {
  stiffness?: number;
  damping?: number;
  mass?: number;
}

export interface HeroTileStackProps {
  /** Image tiles, left to right. Resting tilt and overlap default to a four-tile fan. */
  tiles: HeroTileStackTile[];
  /**
   * How hard cards push away from the pointer. The default is the full wild
   * scatter — cards near the pointer can leave the viewport. Lower it for a
   * softer fan. `0` keeps the resting stack.
   */
  strength?: number;
  /** Spring used for x, y, and rotate. Defaults to a soft, slightly underdamped spring. */
  spring?: HeroTileStackSpring;
  className?: HeroTileStackLayoutClassName;
}

interface TileBinding {
  slot: HTMLDivElement;
  centerX: MotionValue<number>;
  centerY: MotionValue<number>;
  targetX: MotionValue<number>;
  targetY: MotionValue<number>;
  targetRotate: MotionValue<number>;
  getRotate: () => number;
}

interface HeroTileStackContextValue {
  reduceMotion: boolean;
  spring: { stiffness: number; damping: number; mass: number };
  register: (index: number, binding: TileBinding) => void;
  unregister: (index: number) => void;
}

const HeroTileStackContext = createContext<HeroTileStackContextValue | null>(null);

function useHeroTileStackContext(): HeroTileStackContextValue {
  const value = useContext(HeroTileStackContext);
  if (!value) {
    throw new Error("HeroTileStack tiles must be rendered inside HeroTileStack.");
  }
  return value;
}

function coarsePointer(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(pointer: coarse)").matches
  );
}

interface TileViewProps {
  tile: HeroTileStackTile;
  index: number;
  count: number;
  layout: HeroTileRestingLayout;
}

function slotStyle(layout: HeroTileRestingLayout, overlap: boolean): CSSProperties {
  return {
    width: heroTileStackTileSize,
    zIndex: layout.zIndex,
    transform: `translate(${layout.offsetX}px, ${layout.offsetY})`,
    marginInlineEnd: overlap ? heroTileStackTileOverlap : undefined,
  };
}

function HeroTileStatic({ tile, index, count, layout }: TileViewProps) {
  return (
    <div
      className={heroTileStackSlotClasses}
      style={slotStyle(layout, index < count - 1)}
      data-hero-tile-slot=""
      data-hero-tile-index={index}
    >
      <div
        className={heroTileStackSurfaceClasses}
        style={{ transform: `rotate(${layout.rotate}deg)` }}
        data-hero-tile=""
        data-hero-tile-index={index}
        data-scatter-x="0"
        data-scatter-y="0"
        data-scatter-rotate={layout.rotate}
      >
        <img
          className={heroTileStackImageClasses}
          src={tile.src}
          alt={tile.alt}
          draggable={false}
        />
      </div>
    </div>
  );
}

function HeroTileMotion({ tile, index, count, layout }: TileViewProps) {
  const { spring, register, unregister } = useHeroTileStackContext();
  const slotRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const centerX = useMotionValue(0);
  const centerY = useMotionValue(0);
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const targetRotate = useMotionValue(layout.rotate);
  const x = useSpring(targetX, { ...spring, skipInitialAnimation: true });
  const y = useSpring(targetY, { ...spring, skipInitialAnimation: true });
  const rotate = useSpring(targetRotate, { ...spring, skipInitialAnimation: true });
  const rotateRef = useRef(layout.rotate);
  rotateRef.current = layout.rotate;

  useMotionValueEvent(x, "change", (latest) => {
    surfaceRef.current?.setAttribute("data-scatter-x", latest.toFixed(2));
  });
  useMotionValueEvent(y, "change", (latest) => {
    surfaceRef.current?.setAttribute("data-scatter-y", latest.toFixed(2));
  });
  useMotionValueEvent(rotate, "change", (latest) => {
    surfaceRef.current?.setAttribute("data-scatter-rotate", latest.toFixed(2));
  });

  useLayoutEffect(() => {
    const slot = slotRef.current;
    if (!slot) return;
    register(index, {
      slot,
      centerX,
      centerY,
      targetX,
      targetY,
      targetRotate,
      getRotate: () => rotateRef.current,
    });
    return () => unregister(index);
  }, [centerX, centerY, index, register, targetRotate, targetX, targetY, unregister]);

  return (
    <div
      ref={slotRef}
      className={heroTileStackSlotClasses}
      style={slotStyle(layout, index < count - 1)}
      data-hero-tile-slot=""
      data-hero-tile-index={index}
    >
      <motion.div
        ref={surfaceRef}
        className={heroTileStackSurfaceClasses}
        style={{ x, y, rotate }}
        data-hero-tile=""
        data-hero-tile-index={index}
        data-scatter-x="0"
        data-scatter-y="0"
        data-scatter-rotate={layout.rotate}
      >
        <img
          className={heroTileStackImageClasses}
          src={tile.src}
          alt={tile.alt}
          draggable={false}
        />
      </motion.div>
    </div>
  );
}

/**
 * Overlapping image tiles for a marketing hero. While a fine pointer is over
 * the stack, every card springs away from that point — closer cards travel
 * farther, and the push adds tilt. Leaving the stack springs them back to the
 * resting fan. No scale, dim, or reorder.
 *
 * Reduced motion renders the resting fan and ignores the pointer.
 * A coarse pointer or touch tap scatters once from the tap, holds, then springs back.
 * The root clips inline overflow so the page does not gain a horizontal scrollbar.
 */
export function HeroTileStack({
  tiles,
  strength = heroTileStackDefaultStrength,
  spring: springProp,
  className,
}: HeroTileStackProps) {
  const stackRef = useRef<HTMLDivElement>(null);
  const bindings = useRef<(TileBinding | undefined)[]>([]);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const oneShotUntil = useRef(0);
  const oneShotTimer = useRef<number | undefined>(undefined);
  const strengthRef = useRef(strength);
  const reduceMotionRef = useRef(false);
  strengthRef.current = strength;

  const { reducedMotion: reducedMotionConfig } = useContext(MotionConfigContext);
  const reduceMotion = useReducedMotion() === true || reducedMotionConfig === "always";
  reduceMotionRef.current = reduceMotion;

  const spring = {
    stiffness: springProp?.stiffness ?? heroTileStackDefaultSpring.stiffness,
    damping: springProp?.damping ?? heroTileStackDefaultSpring.damping,
    mass: springProp?.mass ?? heroTileStackDefaultSpring.mass,
  };

  const register = (index: number, binding: TileBinding) => {
    bindings.current[index] = binding;
  };
  const unregister = (index: number) => {
    bindings.current[index] = undefined;
  };

  const measure = () => {
    const stack = stackRef.current;
    if (!stack) return;
    const origin = stack.getBoundingClientRect();
    for (const binding of bindings.current) {
      if (!binding) continue;
      const box = binding.slot.getBoundingClientRect();
      binding.centerX.set(box.left + box.width / 2 - origin.left);
      binding.centerY.set(box.top + box.height / 2 - origin.top);
    }
  };

  const scatterAt = (x: number, y: number, active: boolean) => {
    if (reduceMotionRef.current) {
      active = false;
    }
    measure();
    for (const binding of bindings.current) {
      if (!binding) continue;
      const rest = binding.getRotate();
      if (!active) {
        binding.targetX.set(0);
        binding.targetY.set(0);
        binding.targetRotate.set(rest);
        continue;
      }
      const repel = heroTileRepel({
        pointerX: x,
        pointerY: y,
        centerX: binding.centerX.get(),
        centerY: binding.centerY.get(),
        strength: strengthRef.current,
      });
      binding.targetX.set(repel.x);
      binding.targetY.set(repel.y);
      binding.targetRotate.set(rest + repel.rotate);
    }
  };

  const scatterAtRef = useRef(scatterAt);
  scatterAtRef.current = scatterAt;
  const measureRef = useRef(measure);
  measureRef.current = measure;

  useLayoutEffect(() => {
    measureRef.current();
    const stack = stackRef.current;
    if (!stack || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => measureRef.current());
    observer.observe(stack);
    return () => observer.disconnect();
  }, [tiles, reduceMotion]);

  useEffect(() => {
    const point = pointerRef.current;
    if (!point || reduceMotionRef.current) return;
    scatterAtRef.current(point.x, point.y, true);
  }, [strength]);

  useEffect(() => {
    if (!reduceMotion) return;
    pointerRef.current = null;
    oneShotUntil.current = 0;
    if (oneShotTimer.current !== undefined) {
      window.clearTimeout(oneShotTimer.current);
      oneShotTimer.current = undefined;
    }
    scatterAtRef.current(0, 0, false);
  }, [reduceMotion]);

  useEffect(() => {
    return () => {
      if (oneShotTimer.current !== undefined) {
        window.clearTimeout(oneShotTimer.current);
      }
    };
  }, []);

  const toLocal = (event: ReactPointerEvent<HTMLDivElement>) => {
    const stack = stackRef.current;
    if (!stack) return null;
    const rect = stack.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const onFinePointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reduceMotionRef.current) return;
    if (heroTileStackIsOneShot(event.pointerType, coarsePointer())) return;
    const point = toLocal(event);
    if (!point) return;
    pointerRef.current = point;
    scatterAtRef.current(point.x, point.y, true);
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reduceMotionRef.current) return;
    if (!heroTileStackIsOneShot(event.pointerType, coarsePointer())) return;
    const point = toLocal(event);
    if (!point) return;
    pointerRef.current = null;
    scatterAtRef.current(point.x, point.y, true);
    oneShotUntil.current = performance.now() + heroTileStackTapHoldMs;
    if (oneShotTimer.current !== undefined) {
      window.clearTimeout(oneShotTimer.current);
    }
    oneShotTimer.current = window.setTimeout(() => {
      oneShotUntil.current = 0;
      oneShotTimer.current = undefined;
      scatterAtRef.current(0, 0, false);
    }, heroTileStackTapHoldMs);
  };

  const onPointerLeave = () => {
    if (performance.now() < oneShotUntil.current) return;
    pointerRef.current = null;
    scatterAtRef.current(0, 0, false);
  };

  const contextValue: HeroTileStackContextValue = {
    reduceMotion,
    spring,
    register,
    unregister,
  };

  let tilesNode: ReactNode = null;
  const count = tiles.length;
  if (reduceMotion) {
    tilesNode = tiles.map((tile, index) => (
      <HeroTileStatic
        key={`${tile.src}-${index}`}
        tile={tile}
        index={index}
        count={count}
        layout={heroTileRestingLayout(index, tile)}
      />
    ));
  } else {
    tilesNode = tiles.map((tile, index) => (
      <HeroTileMotion
        key={`${tile.src}-${index}`}
        tile={tile}
        index={index}
        count={count}
        layout={heroTileRestingLayout(index, tile)}
      />
    ));
  }

  return (
    <HeroTileStackContext.Provider value={contextValue}>
      <div
        className={cn(heroTileStackRootClasses, className)}
        style={{ containerType: "inline-size" }}
        data-hero-tile-stack=""
      >
        <div
          ref={stackRef}
          className={heroTileStackRowClasses}
          data-hero-tile-row=""
          onPointerEnter={onFinePointer}
          onPointerMove={onFinePointer}
          onPointerDown={onPointerDown}
          onPointerLeave={onPointerLeave}
          onPointerCancel={onPointerLeave}
        >
          {tilesNode}
        </div>
      </div>
    </HeroTileStackContext.Provider>
  );
}
