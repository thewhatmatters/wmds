"use client";

import { Fit, Layout, useRive, useStateMachineInput, useViewModelInstanceColor } from "@rive-app/react-canvas";
import { motion } from "motion/react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../../lib/cn";
import {
  applyRiveHandTokenColors,
  nextRiveHandIdleDelayMs,
  paintRiveHandColors,
  riveHandArtboards,
  riveHandBooleanInput,
  riveHandBooleanValue,
  riveHandBoxSize,
  riveHandClassName,
  riveHandInlineLayout,
  riveHandInlineSlotClassName,
  riveHandFillProperty,
  installRiveHandLayoutRect,
  riveHandGrowDelaySec,
  riveHandGrowOrigin,
  riveHandGrowSettled,
  riveHandIdleAllowed,
  riveHandIdleHoldMs,
  riveHandOutlineProperty,
  riveHandSrc,
  riveHandStateMachine,
  riveHands,
  type RiveHandEntrance,
  type RiveHandName,
} from "./riveHandUtils";

export {
  riveHandArtboards,
  riveHandSrc,
  riveHands,
  type RiveHandEntrance,
  type RiveHandName,
};

/** Layout-only — not for colors. Size comes from the `size` prop. */
export type RiveHandLayoutClassName = string;

export interface RiveHandProps {
  /** `point` is artboard `31_Cigarette` (the cigarette is removed). `rock` is `29_Rock`. */
  hand: RiveHandName;
  /**
   * Box size. A number is pixels. An `em` length tracks the parent font size.
   * Ignored when `inline` is set — that mode sizes the canvas from the artboard ink.
   */
  size?: number | string;
  /**
   * Sit in a text line. The canvas is larger than the artboard padding so the
   * drawn hand is about 1.15em and centered on the line. The in-flow slot is
   * zero height, so the line box does not grow. Entrance is skipped.
   */
  inline?: boolean;
  /**
   * Drives state-machine input `Boolean 1`. Hover or focus on the headline sets this.
   * Ignored while `prefers-reduced-motion: reduce` matches.
   */
  active?: boolean;
  /**
   * Plays `Boolean 1` on a random 4–9s timer, per hand, while the page is visible
   * and this hand is in view. Default is on. Reduced motion never starts the timer.
   */
  idle?: boolean;
  /**
   * `slide-up` rises from below an overflow-clip (the hero clips at the baseline).
   * `grow` scales from 0 at the grip, with a short spring after the rock hand.
   * `none` renders at rest. Reduced motion skips the entrance.
   */
  entrance?: RiveHandEntrance;
  className?: RiveHandLayoutClassName;
  /** Decorative by default so the headline text stays the accessible name. */
  "aria-hidden"?: boolean;
}

export function RiveHand({
  hand,
  size,
  inline = false,
  active = false,
  idle = true,
  entrance = "none",
  className,
  "aria-hidden": ariaHidden = true,
}: RiveHandProps) {
  // Server and the hydration render both skip the entrance. Reading
  // matchMedia here would paint `translateY(100%)` / `scale(0)` on the server
  // and `transform: none` on a reduced-motion client.
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);
  const [themeEpoch, setThemeEpoch] = useState(0);
  const [idlePulse, setIdlePulse] = useState(false);
  const [entered, setEntered] = useState(entrance === "none");
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;
  const activeRef = useRef(active);
  activeRef.current = active;
  const hostRef = useRef<HTMLDivElement>(null);

  const layout = useMemo(() => new Layout({ fit: Fit.Contain }), []);

  const { rive, RiveComponent } = useRive({
    src: riveHandSrc,
    artboard: riveHandArtboards[hand],
    stateMachines: riveHandStateMachine,
    autoplay: true,
    autoBind: true,
    shouldDisableRiveListeners: true,
    layout,
    onRiveReady: (instance) => {
      paintRiveHandColors(instance);
      instance.drawFrame();
      if (reducedRef.current) {
        instance.pause();
      }
    },
  });

  const handFill = useViewModelInstanceColor(riveHandFillProperty, rive?.viewModelInstance);
  const outline = useViewModelInstanceColor(riveHandOutlineProperty, rive?.viewModelInstance);
  const pressed = useStateMachineInput(rive, riveHandStateMachine, riveHandBooleanInput);

  useLayoutEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      setReady(true);
      return;
    }
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(media.matches);
    onChange();
    setReady(true);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined" || typeof MutationObserver === "undefined") {
      return;
    }
    const observer = new MutationObserver(() => setThemeEpoch((epoch) => epoch + 1));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class", "style"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    applyRiveHandTokenColors({ handFill, outline });
    if (!rive) {
      return;
    }
    if (reduced) {
      rive.drawFrame();
      rive.pause();
      if (pressed) {
        pressed.value = false;
      }
      return;
    }
    if (pressed) {
      pressed.value = riveHandBooleanValue(active, idlePulse, false);
    }
    // `setRgb` identity changes when the view-model color binds. The result objects are new every render.
  }, [active, handFill.setRgb, idlePulse, outline.setRgb, pressed, reduced, rive, themeEpoch]);

  useEffect(() => {
    if (!ready || reduced || entrance === "none") {
      return;
    }
    const el = hostRef.current;
    // The entrance pose can clip this box out of view. Watch the parent so the
    // slide or grow is allowed to start.
    const target = el?.parentElement ?? el;
    if (!target || typeof IntersectionObserver === "undefined") {
      setEntered(true);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setEntered(true);
        observer.disconnect();
      }
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, [entrance, ready, reduced]);

  useEffect(() => {
    if (!idle || reduced) {
      return;
    }
    const el = hostRef.current?.parentElement ?? hostRef.current;
    let timer = 0;
    let hold = 0;
    let pageVisible = document.visibilityState !== "hidden";
    let inView = typeof IntersectionObserver === "undefined";
    let stopped = false;

    const clearTimers = () => {
      window.clearTimeout(timer);
      window.clearTimeout(hold);
      timer = 0;
      hold = 0;
    };

    const arm = () => {
      clearTimers();
      if (stopped || !riveHandIdleAllowed({ idle: true, reduced: reducedRef.current, pageVisible, inView })) {
        return;
      }
      timer = window.setTimeout(() => {
        if (stopped || !riveHandIdleAllowed({ idle: true, reduced: reducedRef.current, pageVisible, inView })) {
          return;
        }
        if (activeRef.current) {
          arm();
          return;
        }
        setIdlePulse(true);
        hold = window.setTimeout(() => {
          setIdlePulse(false);
          arm();
        }, riveHandIdleHoldMs);
      }, nextRiveHandIdleDelayMs());
    };

    const onVisibility = () => {
      pageVisible = document.visibilityState !== "hidden";
      if (!pageVisible) setIdlePulse(false);
      arm();
    };

    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined" && el) {
      observer = new IntersectionObserver((entries) => {
        inView = entries.some((entry) => entry.isIntersecting);
        if (!inView) setIdlePulse(false);
        arm();
      });
      observer.observe(el);
    } else {
      arm();
    }

    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stopped = true;
      clearTimers();
      setIdlePulse(false);
      observer?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [idle, reduced]);

  const inlineLayout = inline ? riveHandInlineLayout(hand) : null;
  const length = inlineLayout ? inlineLayout.box : riveHandBoxSize(size ?? "1em");
  const [shadow, setShadow] = useState<ShadowRoot | null>(null);
  const playSlide = !inline && ready && !reduced && entrance === "slide-up";
  const playGrow = !inline && ready && !reduced && entrance === "grow";

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (host.shadowRoot) {
      setShadow(host.shadowRoot);
      return;
    }
    setShadow(host.attachShadow({ mode: "open" }));
  }, [playSlide, playGrow]);

  // The canvas runtime sizes its bitmap from getBoundingClientRect once clientWidth
  // leaves 0. That rect includes the grow scale, so the sample has to be the layout box.
  useLayoutEffect(() => {
    const canvas = hostRef.current?.shadowRoot?.querySelector("canvas");
    if (canvas) installRiveHandLayoutRect(canvas);
  }, [shadow]);

  const resampleRef = useRef<() => void>(() => {});

  useEffect(() => {
    const host = hostRef.current;
    if (!rive || !host) return;

    const resample = () => {
      const box = hostRef.current;
      if (!box) return;
      const painted = box.getBoundingClientRect();
      // Skip while a grow scale collapses the border box — sampling then would store 0×0.
      if (!riveHandGrowSettled(box.offsetWidth, box.offsetHeight, painted.width, painted.height)) return;
      // The runtime copies container size onto the canvas once. A later layout change
      // can leave that pixel width stale, and the layout-rect patch would then resample
      // the stale box. Pin the canvas to the host's layout size before sampling.
      const canvas = box.shadowRoot?.querySelector("canvas");
      if (canvas && box.clientWidth > 0 && box.clientHeight > 0) {
        canvas.style.width = `${box.clientWidth}px`;
        canvas.style.height = `${box.clientHeight}px`;
      }
      rive.resizeDrawingSurfaceToCanvas();
      if (reducedRef.current) {
        rive.pause();
        return;
      }
      rive.startRendering();
    };
    resampleRef.current = resample;

    // The inline slot is 0px tall. The canvas starts at 0×0 until the host's em box
    // has been laid out — at 390 that box can still be 0 on the first sample.
    let frames = 0;
    let frame = 0;
    const kick = () => {
      resample();
      const box = hostRef.current;
      const canvas = box?.shadowRoot?.querySelector("canvas");
      const canvasWaiting = !canvas || canvas.clientWidth < 1 || canvas.clientHeight < 1;
      const hostWaiting = !box || !box.isConnected || box.clientWidth < 1 || box.clientHeight < 1;
      if ((canvasWaiting || hostWaiting) && box?.isConnected && frames < 8) {
        frames += 1;
        frame = requestAnimationFrame(kick);
      }
    };
    kick();

    if (typeof ResizeObserver === "undefined") {
      return () => {
        cancelAnimationFrame(frame);
        resampleRef.current = () => {};
      };
    }
    const observer = new ResizeObserver(() => {
      resample();
    });
    observer.observe(host);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resampleRef.current = () => {};
    };
  }, [playGrow, playSlide, rive]);

  const canvas = shadow
    ? createPortal(
        <div style={{ width: "100%", height: "100%" }}>
          <RiveComponent />
        </div>,
        shadow,
      )
    : null;
  const hostClassName = cn(riveHandClassName, className);
  const hostStyle = {
    width: length,
    height: length,
    transformOrigin: playGrow ? riveHandGrowOrigin : undefined,
    ...(inlineLayout
      ? { position: "absolute" as const, left: "50%", top: "50%", transform: inlineLayout.transform }
      : {}),
  };

  const host = !playSlide && !playGrow ? (
    <div
      ref={hostRef}
      aria-hidden={ariaHidden}
      data-rive-hand={hand}
      className={hostClassName}
      style={hostStyle}
    >
      {canvas}
    </div>
  ) : (
    <motion.div
      ref={hostRef}
      aria-hidden={ariaHidden}
      data-rive-hand={hand}
      className={hostClassName}
      style={hostStyle}
      initial={playSlide ? { y: "100%" } : { scale: 0 }}
      animate={
        playSlide ? { y: entered ? "0%" : "100%" } : { scale: entered ? 1 : 0 }
      }
      transition={
        playSlide
          ? { type: "spring", stiffness: 260, damping: 28, mass: 0.85 }
          : {
              type: "spring",
              stiffness: 480,
              damping: 12,
              mass: 0.55,
              delay: entered ? riveHandGrowDelaySec : 0,
            }
      }
      onAnimationComplete={() => {
        resampleRef.current();
      }}
    >
      {canvas}
    </motion.div>
  );

  if (!inlineLayout) return host;

  return (
    <span
      aria-hidden={ariaHidden}
      data-rive-hand-slot={hand}
      className={riveHandInlineSlotClassName}
      style={{ width: inlineLayout.slot }}
    >
      {host}
    </span>
  );
}
