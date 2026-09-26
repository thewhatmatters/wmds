"use client";

import { Fit, Layout, useRive, useStateMachineInput, useViewModelInstanceColor } from "@rive-app/react-canvas";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../../../lib/cn";
import {
  applyRiveGloveHandTokenColors,
  paintRiveGloveHandColors,
  prefersReducedMotion,
  riveGloveHandArtboards,
  riveGloveHandBooleanInput,
  riveGloveHandBoxSize,
  riveGloveHandClassName,
  riveGloveHandFillProperty,
  riveGloveHandOutlineProperty,
  riveGloveHandSrc,
  riveGloveHandStateMachine,
  riveGloveHands,
  type RiveGloveHandName,
} from "./riveGloveHand";

export { riveGloveHandArtboards, riveGloveHandSrc, riveGloveHands, type RiveGloveHandName };

/** Layout-only — not for colors. Size comes from the `size` prop. */
export type RiveGloveHandLayoutClassName = string;

export interface RiveGloveHandProps {
  /** `point` is artboard `31_Cigarette` (the cigarette is removed). `rock` is `29_Rock`. */
  hand: RiveGloveHandName;
  /** Box size. A number is pixels. An `em` length tracks the parent font size. */
  size: number | string;
  /**
   * Drives state-machine input `Boolean 1`. Hover or focus on the headline sets this.
   * Ignored while `prefers-reduced-motion: reduce` matches.
   */
  active?: boolean;
  className?: RiveGloveHandLayoutClassName;
  /** Decorative by default so the headline text stays the accessible name. */
  "aria-hidden"?: boolean;
}

export function RiveGloveHand({
  hand,
  size,
  active = false,
  className,
  "aria-hidden": ariaHidden = true,
}: RiveGloveHandProps) {
  const [reduced, setReduced] = useState(prefersReducedMotion);
  const [themeEpoch, setThemeEpoch] = useState(0);
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;

  const layout = useMemo(() => new Layout({ fit: Fit.Contain }), []);

  const { rive, RiveComponent } = useRive({
    src: riveGloveHandSrc,
    artboard: riveGloveHandArtboards[hand],
    stateMachines: riveGloveHandStateMachine,
    autoplay: true,
    autoBind: true,
    shouldDisableRiveListeners: true,
    layout,
    onRiveReady: (instance) => {
      paintRiveGloveHandColors(instance);
      instance.drawFrame();
      if (reducedRef.current) {
        instance.pause();
      }
    },
  });

  const handFill = useViewModelInstanceColor(riveGloveHandFillProperty, rive?.viewModelInstance);
  const outline = useViewModelInstanceColor(riveGloveHandOutlineProperty, rive?.viewModelInstance);
  const pressed = useStateMachineInput(rive, riveGloveHandStateMachine, riveGloveHandBooleanInput);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(media.matches);
    onChange();
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
    applyRiveGloveHandTokenColors({ handFill, outline });
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
      pressed.value = active;
    }
    // `setRgb` identity changes when the view-model color binds. The result objects are new every render.
  }, [active, handFill.setRgb, outline.setRgb, pressed, reduced, rive, themeEpoch]);

  const length = riveGloveHandBoxSize(size);

  return (
    <div
      aria-hidden={ariaHidden}
      className={cn(riveGloveHandClassName, className)}
      style={{ width: length, height: length }}
    >
      <RiveComponent />
    </div>
  );
}
