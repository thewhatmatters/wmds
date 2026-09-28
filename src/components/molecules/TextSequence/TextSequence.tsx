"use client";

import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import {
  Children,
  Fragment,
  isValidElement,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "../../../lib/cn";
import {
  TextSequenceShape,
  type TextSequenceShapeProps,
} from "../../atoms/TextSequenceShape/TextSequenceShape";
import {
  textSequenceRootClasses,
  textSequenceWordBoldClasses,
  textSequenceWordRegularClasses,
} from "./textSequenceStyles";

gsap.registerPlugin(SplitText, useGSAP);

export const textSequenceTriggers = ["mount", "inView"] as const;
export type TextSequenceTrigger = (typeof textSequenceTriggers)[number];

export const textSequenceEmphases = ["alternate", "none"] as const;
export type TextSequenceEmphasis = (typeof textSequenceEmphases)[number];

export const textSequenceDefaultStagger = 0.07;
export const textSequenceDefaultDelay = 0;

const wordDuration = 0.72;
const shapeDuration = 0.55;
const asteriskIdleDuration = 8;
const pillIdleDuration = 1.4;

/** Layout only — width and margin. Not for re-theming. */
export type TextSequenceLayoutClassName = string;

export interface TextSequenceProps {
  /**
   * Words and `TextSequence.Shape` marks. Text nodes are split on whitespace.
   * Shapes sit between words and do not take an emphasis turn.
   */
  children: ReactNode;
  /** Seconds between word reveals. Shapes pop halfway between their neighbors. */
  stagger?: number;
  /** Seconds before the first word moves. */
  delay?: number;
  /**
   * `mount` splits before first paint. `inView` waits until the block intersects
   * the viewport, then splits once.
   */
  trigger?: TextSequenceTrigger;
  /**
   * After the entrance, spin asterisks and stretch pills. Off when reduced motion
   * is preferred. Default off.
   */
  idle?: boolean;
  /**
   * Also split lines so SplitText re-splits when the block wraps.
   * SplitText's resize observer runs only when lines are included.
   */
  lines?: boolean;
  /** `alternate` sets even words regular and odd words bold. `none` leaves the parent weight. */
  emphasis?: TextSequenceEmphasis;
  /** Layout only. */
  className?: TextSequenceLayoutClassName;
}

export {
  textSequenceShapeTones,
  textSequenceShapeVariants,
  type TextSequenceShapeLayoutClassName,
  type TextSequenceShapeProps,
  type TextSequenceShapeTone,
  type TextSequenceShapeVariant,
} from "../../atoms/TextSequenceShape/TextSequenceShape";

interface BuiltSequence {
  nodes: ReactNode[];
  /** Plain sentence. Shapes omitted. Whitespace collapsed. */
  plain: string;
  signature: string;
}

function isShapeElement(child: ReactNode): child is ReactElement<TextSequenceShapeProps> {
  return isValidElement(child) && child.type === TextSequenceShape;
}

export function sequencePlainText(children: ReactNode): string {
  return buildSequence(children, "none").plain;
}

function buildSequence(children: ReactNode, emphasis: TextSequenceEmphasis): BuiltSequence {
  const nodes: ReactNode[] = [];
  const words: string[] = [];
  let wordIndex = 0;

  const pushWord = (word: string) => {
    const weightClass =
      emphasis === "alternate"
        ? wordIndex % 2 === 1
          ? textSequenceWordBoldClasses
          : textSequenceWordRegularClasses
        : undefined;
    nodes.push(
      <span key={`w-${wordIndex}`} data-text-sequence-word="" className={weightClass}>
        {word}
      </span>,
    );
    words.push(word);
    wordIndex += 1;
  };

  const walk = (child: ReactNode) => {
    if (child == null || typeof child === "boolean") return;
    if (typeof child === "string" || typeof child === "number") {
      const parts = String(child).split(/(\s+)/);
      for (const part of parts) {
        if (!part) continue;
        if (/^\s+$/.test(part)) nodes.push(part);
        else pushWord(part);
      }
      return;
    }
    if (Array.isArray(child)) {
      child.forEach(walk);
      return;
    }
    if (!isValidElement(child)) return;
    if (child.type === Fragment) {
      walk((child.props as { children?: ReactNode }).children);
      return;
    }
    if (isShapeElement(child)) {
      nodes.push(child.key != null ? child : <TextSequenceShape key={`s-${nodes.length}`} {...child.props} />);
      return;
    }
    nodes.push(child);
  };

  Children.forEach(children, walk);

  return {
    nodes,
    plain: words.join(" "),
    signature: `${emphasis}:${words.join("\u0001")}:${nodes.length}`,
  };
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function wordsBefore(shape: Element, words: readonly Element[]): number {
  let count = 0;
  for (const word of words) {
    const position = shape.compareDocumentPosition(word);
    if (position & Node.DOCUMENT_POSITION_PRECEDING) count += 1;
    else break;
  }
  return count;
}

function shapeStart(before: number, stagger: number): number {
  if (before <= 0) return 0;
  return (before - 0.5) * stagger;
}

/** Placeholder while SplitText owns the root. The live slot is not in the snapshot. */
const textSequenceHandAnchorAttr = "data-text-sequence-hand-anchor";

/**
 * SplitText snapshots `innerHTML` and writes it back on every re-split.
 * A hand slot in that snapshot is a dead clone: the Rive canvas lives on the
 * React node, in a shadow root, and does not survive `innerHTML`.
 * Lift the live slot out first and leave an anchor that has the same gap.
 */
function detachHandSlots(root: HTMLElement): HTMLElement[] {
  const slots = [...root.querySelectorAll<HTMLElement>("[data-rive-hand-slot]")];
  for (const slot of slots) {
    const anchor = document.createElement("span");
    anchor.setAttribute(textSequenceHandAnchorAttr, slot.getAttribute("data-rive-hand-slot") ?? "");
    anchor.setAttribute("aria-hidden", "true");
    anchor.className = slot.className;
    anchor.style.width = slot.style.width;
    slot.replaceWith(anchor);
  }
  return slots;
}

function restoreHandSlots(root: HTMLElement, slots: readonly HTMLElement[]) {
  const anchors = [...root.querySelectorAll<HTMLElement>(`[${textSequenceHandAnchorAttr}]`)];
  anchors.forEach((anchor, index) => {
    const slot = slots[index];
    if (slot) anchor.replaceWith(slot);
  });
}

interface SequenceMotionConfig {
  stagger: number;
  delay: number;
  idle: boolean;
  lines: boolean;
  plain: string;
  /** Live hand slots lifted out before this split. Put back on every `onSplit`. */
  hands: readonly HTMLElement[];
}

function playSequence(root: HTMLElement, config: SequenceMotionConfig) {
  const { stagger, delay, idle, lines, plain, hands } = config;
  const split = SplitText.create(root, {
    type: lines ? "words,lines" : "words",
    mask: "words",
    tag: "span",
    autoSplit: lines,
    aria: "auto",
    reduceWhiteSpace: true,
    // Anchors stand in for the hand. Ignore keeps SplitText from wrapping them into a word.
    ignore: `[${textSequenceHandAnchorAttr}]`,
    onSplit(self) {
      // Re-split restores the anchor snapshot, which drops the live slot. Put that
      // same node back so the Rive canvas stays connected.
      restoreHandSlots(root, hands);
      self.elements.forEach((element) => {
        const heading = element.closest("h1, h2, h3, h4, h5, h6");
        if (heading instanceof HTMLElement && heading !== element) {
          const plains = [...heading.querySelectorAll("[data-text-sequence]")]
            .map((node) => node.getAttribute("data-plain"))
            .filter((value): value is string => Boolean(value));
          heading.setAttribute("aria-label", plains.length > 0 ? plains.join(" ") : plain);
          element.removeAttribute("aria-label");
          element.removeAttribute("role");
          return;
        }
        element.setAttribute("aria-label", plain);
        if (!/^H[1-6]$/.test(element.tagName)) {
          element.setAttribute("role", "paragraph");
        }
      });
      for (const line of self.lines) {
        (line as HTMLElement).style.display = "block";
      }
      for (const word of self.words) {
        const box = word as HTMLElement;
        box.style.display = "inline-block";
        box.style.position = "relative";
      }
      for (const mask of self.masks) {
        const box = mask as HTMLElement;
        box.style.display = "inline-block";
        box.style.position = "relative";
        box.style.verticalAlign = "baseline";
      }

      const shapes = [...root.querySelectorAll<HTMLElement>("[data-text-sequence-shape]")];
      const timeline = gsap.timeline({ delay });
      self.words.forEach((word, index) => {
        timeline.from(
          word,
          {
            yPercent: 110,
            duration: wordDuration,
            ease: "power3.out",
            immediateRender: true,
          },
          index * stagger,
        );
      });
      shapes.forEach((shape) => {
        const before = wordsBefore(shape, self.words);
        const spinIn = shape.dataset.variant === "asterisk";
        timeline.from(
          shape,
          {
            scale: 0,
            rotation: spinIn ? -80 : -16,
            duration: shapeDuration,
            ease: "back.out(1.8)",
            transformOrigin: "50% 50%",
            immediateRender: true,
          },
          shapeStart(before, stagger),
        );
      });

      if (idle && shapes.length > 0) {
        const idleAt = timeline.duration();
        const asterisks = shapes.filter((shape) => shape.dataset.variant === "asterisk");
        const pills = shapes.filter(
          (shape) => shape.dataset.variant === "pill" || shape.dataset.variant === "double-pill",
        );
        if (asterisks.length > 0) {
          timeline.to(
            asterisks,
            {
              rotation: "+=360",
              duration: asteriskIdleDuration,
              ease: "none",
              repeat: -1,
              transformOrigin: "50% 50%",
            },
            idleAt,
          );
        }
        if (pills.length > 0) {
          timeline.to(
            pills,
            {
              scaleX: 1.12,
              duration: pillIdleDuration,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
              transformOrigin: "50% 50%",
            },
            idleAt,
          );
        }
      }

      root.dataset.textSequenceState = "playing";
      return timeline;
    },
  });
  return split;
}

function TextSequenceRoot({
  children,
  stagger = textSequenceDefaultStagger,
  delay = textSequenceDefaultDelay,
  trigger = "mount",
  idle = false,
  lines = true,
  emphasis = "alternate",
  className,
}: TextSequenceProps) {
  const rootRef = useRef<HTMLElement>(null);
  // Capture the sentence once so a parent re-render cannot reset SplitText's DOM.
  const [built] = useState(() => buildSequence(children, emphasis));
  const safeStagger = Math.max(0, stagger);
  const safeDelay = Math.max(0, delay);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      let split: SplitText | undefined;
      let observer: IntersectionObserver | undefined;
      let hands: HTMLElement[] = [];

      const stop = () => {
        observer?.disconnect();
        observer = undefined;
        split?.revert();
        split = undefined;
        restoreHandSlots(root, hands);
        delete root.dataset.textSequenceState;
        root.dataset.textSequenceState = "rest";
      };

      const start = () => {
        if (split || prefersReducedMotion()) {
          root.dataset.textSequenceState = "rest";
          return;
        }
        const detached = detachHandSlots(root);
        if (detached.length > 0) hands = detached;
        split = playSequence(root, {
          stagger: safeStagger,
          delay: safeDelay,
          idle,
          lines,
          plain: built.plain,
          hands,
        });
      };

      const onMotionChange = () => {
        if (media.matches) {
          stop();
          return;
        }
        if (trigger === "mount") start();
      };

      if (prefersReducedMotion()) {
        root.dataset.textSequenceState = "rest";
      } else if (trigger === "inView") {
        root.dataset.textSequenceState = "rest";
        if (typeof IntersectionObserver === "function") {
          observer = new IntersectionObserver(
            (entries) => {
              if (!entries.some((entry) => entry.isIntersecting)) return;
              observer?.disconnect();
              observer = undefined;
              start();
            },
            { threshold: 0.35 },
          );
          observer.observe(root);
        }
      } else {
        start();
      }

      media.addEventListener("change", onMotionChange);
      return () => {
        media.removeEventListener("change", onMotionChange);
        observer?.disconnect();
        split?.revert();
        restoreHandSlots(root, hands);
      };
    },
    {
      scope: rootRef,
      dependencies: [safeStagger, safeDelay, trigger, idle, lines, built.plain],
      revertOnUpdate: true,
    },
  );

  return (
    <span
      ref={rootRef}
      data-text-sequence=""
      data-plain={built.plain}
      className={cn(textSequenceRootClasses, className)}
    >
      {built.nodes}
    </span>
  );
}

export const TextSequence = Object.assign(TextSequenceRoot, {
  Shape: TextSequenceShape,
});
