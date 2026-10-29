import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotionConfig,
  useTransform,
} from "motion/react";
import { Pause, Play } from "lucide-react";
import { IconButton } from "../../atoms/IconButton/IconButton";
import { cn } from "../../../lib/cn";
import { motionTransitionProp } from "../../../lib/motion";
import {
  carouselActiveIndex,
  carouselClamp,
  carouselDragThreshold,
  carouselMaxScroll,
  carouselNearestSnap,
  carouselOverflows,
  carouselOverscrollOffset,
  carouselProgress,
  carouselProgressAtPointer,
  carouselSnapPoints,
  carouselStep,
  carouselThumbShare,
} from "./carouselMath";
import {
  carouselControlsClasses,
  carouselCounterClasses,
  carouselCursorClasses,
  carouselProgressInControlsClasses,
  carouselDefaultItemWidth,
  carouselExtentClasses,
  carouselFrameClasses,
  carouselItemClasses,
  carouselProgressClasses,
  carouselProgressPlacementClasses,
  carouselProgressThumbClasses,
  carouselProgressTrackClasses,
  carouselRootClasses,
  carouselTrackClasses,
  carouselViewportClasses,
  carouselViewportFadeClasses,
  carouselViewportSnapClasses,
  type CarouselBreakpoint,
  type CarouselItemWidth,
  type CarouselProgressPlacement,
} from "./carouselStyles";

export {
  carouselBreakpoints,
  carouselDefaultItemWidth,
  carouselProgressPlacements,
  type CarouselBreakpoint,
  type CarouselItemWidth,
  type CarouselProgressPlacement,
} from "./carouselStyles";

/** Layout-only — width, margin, or grid placement. */
export type CarouselLayoutClassName = string;

export interface CarouselLabels {
  /** Names each item by its place. Default: "2 of 4". */
  item: (position: number, count: number) => string;
  /** The visible counter under the row. Default: "1 of 6". */
  counter: (position: number, count: number) => string;
}

/** The row is a labelled region: name it, or point at the heading that does. */
type CarouselName =
  | { "aria-label": string; "aria-labelledby"?: never }
  | { "aria-labelledby": string; "aria-label"?: never };

interface CarouselBaseProps {
  /**
   * Item width as a percentage of the row — one number, or one per breakpoint
   * (`{ base, sm, md, lg }`; a breakpoint left out keeps the one below it). Keep it under 100 so
   * the next item shows. Default: `{ base: 80, sm: 55, lg: 40 }`.
   */
  itemWidth?: CarouselItemWidth;
  /** Rest on an item's leading edge when a drag, a scrub, or a scroll settles. Default: `true`. */
  snap?: boolean;
  /** Let the row run to the page edges; items still start on the grid. Default: `false`. */
  bleed?: boolean;
  /** Fade items where the row clips them. Default: `true`. */
  fade?: boolean;
  /**
   * The scrubber under the row: a shorter track at the `center` (default) or the `start`, the
   * `full` row width, or `none`. It hides itself while every item fits.
   */
  progress?: CarouselProgressPlacement;
  /** Show "1 of 6" under the row, announced politely as it changes. Hidden while every item fits. Default: `false`. */
  counter?: boolean;
  /** Fires with the 0-based index and the item count when the item the row rests on changes. */
  onIndexChange?: (index: number, count: number) => void;
  /** Controlled: the row moves to this item (0-based) when it changes. */
  activeIndex?: number;
  labels?: Partial<CarouselLabels>;
  /**
   * Drift the row slowly on its own, back and forth between its ends (`true`, about 24px a second, or
   * `{ speed }` in px a second). It holds while a pointer is over the row, while anything in it has focus,
   * during a drag or a scrub, while the row is off screen or the tab hidden, and never runs under reduced
   * motion. A Pause button sits beside the scrubber (WCAG 2.2.2: moving content can be stopped).
   */
  autoplay?: boolean | { speed?: number };
  /**
   * Repeat the items seamlessly: a copy follows the last one, and the row wraps back to the start as it passes
   * one full set, so it never ends. With `autoplay` it drifts one way only. The scrubber and counter are
   * hidden (a loop has no end to measure against). Needs enough items to fill the row at least once.
   */
  loop?: boolean;
  /**
   * A badge that follows a mouse pointer over the row, e.g. a hand icon, to say "drag me". Decorative and
   * hidden from assistive tech; only on devices with a fine pointer that can hover.
   */
  cursor?: ReactNode;
  /** **Carousel.Item** children, one per item. */
  children?: ReactNode;
  className?: CarouselLayoutClassName;
}

export type CarouselProps = CarouselBaseProps & CarouselName;

export interface CarouselItemProps {
  /** Anything — an image tile, a card, a quote. */
  children?: ReactNode;
  className?: CarouselLayoutClassName;
}

interface CarouselItemContextValue {
  label: string;
  /** A `loop` copy: hidden from assistive tech and out of the tab order; the originals carry the content. */
  clone?: boolean;
}

const CarouselItemContext = createContext<CarouselItemContextValue | null>(null);

const defaultLabels: CarouselLabels = {
  item: (position, count) => `${position} of ${count}`,
  counter: (position, count) => `${position} of ${count}`,
};

interface CarouselMetrics {
  /** How far the row can scroll, in px. */
  max: number;
  /** Where the row rests — each item's leading edge. */
  points: number[];
  /** Each item's leading edge, in px from the row's start. */
  offsets: number[];
  /** `1` left to right, `-1` right to left. */
  direction: 1 | -1;
  /** `loop`: the width of one set of items, where the copy starts. `0` without `loop`. */
  loopWidth: number;
}

interface CarouselDragState {
  pointerId: number;
  startX: number;
  startPosition: number;
  /** Past the threshold — the pointer is moving the row. */
  active: boolean;
  /** The press caught the row mid-glide. */
  interrupted: boolean;
}

interface CarouselScrubState {
  pointerId: number;
  startX: number;
  startProgress: number;
  /** How far the filled part can travel, in px. */
  travel: number;
}

/** How long the row is still, in ms, before the item it rests on counts as changed. */
const restingDelay = 120;

/** Extra px either side of the filled part that still count as a press on it. */
const thumbHitSlop = 10;

/** A pointer that has already gone cannot be captured; the drag carries on without it. */
function capturePointer(element: Element, pointerId: number) {
  try {
    element.setPointerCapture(pointerId);
  } catch {
    // Nothing to do.
  }
}

function resolveItemWidths(width: CarouselItemWidth): Record<CarouselBreakpoint, number> {
  if (typeof width === "number") return { base: width, sm: width, md: width, lg: width };
  const base = width.base ?? carouselDefaultItemWidth.base;
  const sm = width.sm ?? base;
  const md = width.md ?? sm;
  const lg = width.lg ?? md;
  return { base, sm, md, lg };
}

/** Without scroll-driven animations the edge fade is static; these hold an edge clear while nothing is clipped there. */
function setEdgeFade(viewport: HTMLElement, property: "--scroll-fade-s" | "--scroll-fade-e", clipped: boolean) {
  if (clipped) viewport.style.removeProperty(property);
  else viewport.style.setProperty(property, "0px");
}

/**
 * A horizontal row of items the visitor drags, scrolls, or steps through with the keyboard, with
 * a progress scrubber under it. The row is a native scroller, so touch, trackpad, and
 * shift-wheel scrolling come from the browser; the pointer drag, the glide, and the scrubber are
 * built on it.
 */
function CarouselRoot({
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  itemWidth = carouselDefaultItemWidth,
  snap = true,
  bleed = false,
  fade = true,
  progress = "center",
  counter = false,
  onIndexChange,
  activeIndex,
  labels,
  autoplay = false,
  loop = false,
  cursor,
  children,
  className,
}: CarouselProps) {
  // Follows the OS setting, or a MotionConfig `reducedMotion` around the row.
  const reduce = useReducedMotionConfig() ?? false;
  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressTrackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const metrics = useRef<CarouselMetrics>({ max: 0, points: [0], offsets: [], direction: 1, loopWidth: 0 });
  const animation = useRef<ReturnType<typeof animate> | null>(null);
  /** Where an animated move is heading — a second key press steps on from there. */
  const target = useRef<number | null>(null);
  const drag = useRef<CarouselDragState | null>(null);
  const scrub = useRef<CarouselScrubState | null>(null);
  const suppressClick = useRef(false);
  /** `null` until the row is measured — the server and the first paint. */
  const [overflowing, setOverflowing] = useState<boolean | null>(null);
  /** The item the row rests on — it follows the scroll once the row has been still for a moment. */
  const [restingIndex, setRestingIndex] = useState(0);
  const settleTimer = useRef<number | undefined>(undefined);
  const lastReported = useRef(0);
  const lastApplied = useRef<number | undefined>(undefined);
  const itemCount = useRef(0);
  const onIndexChangeRef = useRef(onIndexChange);
  const moveToRef = useRef<(position: number, animated?: boolean) => void>(() => {});
  const driftSpeed = autoplay === false ? 0 : typeof autoplay === "object" ? (autoplay.speed ?? defaultDriftSpeed) : defaultDriftSpeed;
  const [driftPaused, setDriftPaused] = useState(false);
  /** Reasons the drift holds: a hover, focus inside the row, or the row off screen. */
  const hold = useRef({ hover: false, focus: false, offscreen: false });
  const cursorRef = useRef<HTMLDivElement>(null);
  /** Last position and time, for `--carousel-velocity`. */
  const pace = useRef({ position: 0, time: 0, reset: undefined as number | undefined });

  /** The position being driven, in px from the row's start. Past either end while the row is overscrolled. */
  const drive = useMotionValue(0);
  const overshoot = useMotionValue(0);
  const trackX = useTransform(overshoot, (value) => -metrics.current.direction * carouselOverscrollOffset(value));

  const readPosition = useCallback(() => Math.abs(viewportRef.current?.scrollLeft ?? 0), []);

  const syncProgress = useCallback(() => {
    const root = rootRef.current;
    const viewport = viewportRef.current;
    if (!root || !viewport) return;
    const { max } = metrics.current;
    const position = Math.abs(viewport.scrollLeft);
    root.style.setProperty("--carousel-progress", String(carouselProgress(position, max)));
    setEdgeFade(viewport, "--scroll-fade-s", position > 1);
    setEdgeFade(viewport, "--scroll-fade-e", position < max - 1);
    window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(() => {
      const index = carouselActiveIndex(metrics.current.offsets, Math.abs(viewport.scrollLeft), metrics.current.max);
      setRestingIndex(index);
      if (index === lastReported.current) return;
      lastReported.current = index;
      onIndexChangeRef.current?.(index, itemCount.current);
    }, restingDelay);
  }, []);

  const writePosition = useCallback(
    (position: number) => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      viewport.scrollLeft = metrics.current.direction * position;
      syncProgress();
    },
    [syncProgress],
  );

  useMotionValueEvent(drive, "change", (value) => {
    const position = carouselClamp(value, 0, metrics.current.max);
    writePosition(position);
    overshoot.set(reduce ? 0 : value - position);
  });

  /** Scroll snapping is off while the pointer or an animation moves the row, or it would fight each step. */
  function setMoving(moving: boolean) {
    const viewport = viewportRef.current;
    if (!viewport) return;
    if (moving) viewport.dataset.moving = "";
    else delete viewport.dataset.moving;
  }

  function stop() {
    animation.current?.stop();
    animation.current = null;
    target.current = null;
  }

  function finish() {
    animation.current = null;
    target.current = null;
    setMoving(false);
  }

  /** The visitor's own scroll takes over from a glide. */
  function takeOver() {
    if (animation.current == null) return;
    stop();
    drive.jump(readPosition());
    setMoving(false);
  }

  function moveTo(position: number, animated = true) {
    const to = carouselClamp(position, 0, metrics.current.max);
    stop();
    drive.jump(readPosition());
    if (reduce || !animated) {
      setMoving(false);
      drive.jump(to);
      return;
    }
    target.current = to;
    setMoving(true);
    animation.current = animate(drive, to, { ...motionTransitionProp("medium"), onComplete: finish });
  }

  useEffect(() => {
    onIndexChangeRef.current = onIndexChange;
    moveToRef.current = moveTo;
  });

  /** Let go: glide on with the pointer's momentum and come to rest — on an item's edge when `snap` is on. */
  function settle(velocity: number) {
    const { max, points } = metrics.current;
    const rest = (position: number) => carouselNearestSnap(points, carouselClamp(position, 0, max));
    stop();
    if (reduce) {
      moveTo(snap ? rest(drive.get()) : drive.get(), false);
      return;
    }
    const from = drive.get();
    const resting = snap ? rest(from) : carouselClamp(from, 0, max);
    if (velocity === 0 && resting === from) {
      finish();
      return;
    }
    setMoving(true);
    // Inertia reads only where it starts, but Motion skips an animation whose keyframes are all
    // the same — so the second keyframe just has to differ.
    animation.current = animate(drive, resting === from ? from + Math.sign(velocity) : resting, {
      type: "inertia",
      velocity,
      min: 0,
      max,
      modifyTarget: snap ? rest : undefined,
      onComplete: finish,
    });
  }

  const measure = useCallback(() => {
    const root = rootRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    // Mid-overscroll the row is shifted and would measure wrong; the next resize measures it.
    if (!root || !viewport || !track || overshoot.get() !== 0) return;

    if (bleed) {
      const rect = root.getBoundingClientRect();
      const left = Math.max(0, Math.floor(rect.left));
      const right = Math.max(0, Math.floor(document.documentElement.clientWidth - rect.right));
      root.style.setProperty("--carousel-bleed-left", `${left}px`);
      root.style.setProperty("--carousel-bleed-right", `${right}px`);
    } else {
      root.style.removeProperty("--carousel-bleed-left");
      root.style.removeProperty("--carousel-bleed-right");
    }

    const direction = getComputedStyle(viewport).direction === "rtl" ? -1 : 1;
    const view = viewport.clientWidth;
    const content = viewport.scrollWidth;
    const max = carouselMaxScroll(view, content);
    const items = Array.from(track.querySelectorAll<HTMLElement>(":scope > [data-carousel-item]:not([data-carousel-clone])"));
    const firstClone = track.querySelector<HTMLElement>(":scope > [data-carousel-clone]");
    const first = items[0]?.getBoundingClientRect();
    const offsets =
      first == null
        ? []
        : items.map((item) => {
            const rect = item.getBoundingClientRect();
            return direction === 1 ? rect.left - first.left : first.right - rect.right;
          });
    const loopWidth =
      firstClone == null || first == null
        ? 0
        : direction === 1
          ? firstClone.getBoundingClientRect().left - first.left
          : first.right - firstClone.getBoundingClientRect().right;
    metrics.current = { max, direction, points: carouselSnapPoints(offsets, max), offsets, loopWidth };

    const progressTrack = progressTrackRef.current;
    if (progressTrack) {
      root.style.setProperty("--carousel-thumb", String(carouselThumbShare(view, content, progressTrack.clientWidth)));
    }
    syncProgress();
    const next = carouselOverflows(view, content);
    setOverflowing((previous) => (previous === next ? previous : next));
  }, [bleed, overshoot, syncProgress]);

  // Measure before the first paint after hydration, then whenever the row, its items (an image
  // that loads), or the page changes size.
  useLayoutEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    if (typeof ResizeObserver === "undefined") {
      return () => window.removeEventListener("resize", measure);
    }
    const observer = new ResizeObserver(measure);
    for (const element of [rootRef.current, viewportRef.current, trackRef.current, progressTrackRef.current]) {
      if (element) observer.observe(element);
    }
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure, progress]);

  useEffect(
    () => () => {
      animation.current?.stop();
      window.clearTimeout(settleTimer.current);
    },
    [],
  );

  // Drift: a slow back-and-forth while nothing holds it. Snapping is off while it runs, or it would pull
  // each step back to an item's edge.
  const drifting = driftSpeed > 0 && !reduce && !driftPaused && overflowing === true;
  useEffect(() => {
    const root = rootRef.current;
    const viewport = viewportRef.current;
    if (!drifting || !root || !viewport) return undefined;
    let frame = 0;
    let last = performance.now();
    let heading = 1;
    let position = readPosition();
    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(([entry]) => {
            hold.current.offscreen = !(entry?.isIntersecting ?? true);
          });
    observer?.observe(root);
    setMoving(true);
    const tick = (now: number) => {
      const seconds = Math.min(0.05, (now - last) / 1000);
      last = now;
      const { hover, focus, offscreen } = hold.current;
      const held = hover || focus || offscreen || document.hidden || drag.current != null || scrub.current != null || animation.current != null;
      if (held) {
        position = readPosition();
      } else {
        const { max } = metrics.current;
        // The visitor scrolled the row since the last frame: carry on from where they left it.
        if (Math.abs(readPosition() - position) > 2) position = readPosition();
        position += heading * driftSpeed * seconds;
        const { loopWidth } = metrics.current;
        if (loop && loopWidth > 0) {
          if (position >= loopWidth) position -= loopWidth;
        } else if (position >= max) {
          position = max;
          heading = -1;
        } else if (position <= 0) {
          position = 0;
          heading = 1;
        }
        setMoving(true);
        writePosition(position);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      setMoving(false);
    };
    // setMoving reads only refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drifting, driftSpeed, loop, readPosition, writePosition]);

  /**
   * `--carousel-velocity` on the root: how fast and which way the row is moving, -1 to 1 (1 is about 1.5px a
   * millisecond toward the end). Items can lean or skew with it; it eases back to 0 when the row stops. Always
   * 0 under reduced motion.
   */
  function trackVelocity() {
    const root = rootRef.current;
    if (!root || reduce) return;
    const now = performance.now();
    const position = readPosition();
    const state = pace.current;
    const elapsed = now - state.time;
    // A wrap jumps a whole set: not movement.
    if (elapsed > 0 && elapsed < 200 && Math.abs(position - state.position) < 400) {
      const velocity = carouselClamp((position - state.position) / elapsed / 1.5, -1, 1);
      root.style.setProperty("--carousel-velocity", velocity.toFixed(3));
    }
    state.position = position;
    state.time = now;
    window.clearTimeout(state.reset);
    state.reset = window.setTimeout(() => root.style.setProperty("--carousel-velocity", "0"), 120);
  }

  /** `loop`: past one full set, step back by a set, invisibly (the copy looks the same). Not mid-drag or mid-glide. */
  function handleScroll() {
    trackVelocity();
    const { loopWidth } = metrics.current;
    if (loop && loopWidth > 0 && drag.current == null && scrub.current == null && animation.current == null) {
      const position = readPosition();
      if (position >= loopWidth) {
        writePosition(position - loopWidth);
        return;
      }
    }
    syncProgress();
  }

  function handleRootPointerEnter(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse") hold.current.hover = true;
  }

  function handleRootPointerLeave() {
    hold.current.hover = false;
    const badge = cursorRef.current;
    if (badge) delete badge.dataset.shown;
  }

  function handleRootFocus() {
    hold.current.focus = true;
  }

  function handleRootBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) hold.current.focus = false;
  }

  /** The follow badge: placed at the pointer, over the row only, for a mouse on a device that can hover. */
  function handleCursorMove(event: PointerEvent<HTMLDivElement>) {
    const badge = cursorRef.current;
    const root = rootRef.current;
    if (!badge || !root) return;
    if (event.pointerType !== "mouse" || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const rect = root.getBoundingClientRect();
    badge.style.transform = `translate3d(${event.clientX - rect.left}px, ${event.clientY - rect.top}px, 0) translate(-50%, -50%)`;
    badge.dataset.shown = "";
    if (drag.current?.active) badge.dataset.dragging = "";
    else delete badge.dataset.dragging;
  }

  function handleCursorLeave() {
    const badge = cursorRef.current;
    if (badge) delete badge.dataset.shown;
  }

  // Controlled: move to the item when `activeIndex` changes, once the row is measured.
  useEffect(() => {
    if (activeIndex == null || overflowing == null || activeIndex === lastApplied.current) return;
    const { offsets, max } = metrics.current;
    if (offsets.length === 0) return;
    const first = lastApplied.current === undefined;
    lastApplied.current = activeIndex;
    const offset = offsets[carouselClamp(Math.round(activeIndex), 0, offsets.length - 1)];
    moveToRef.current(snap ? carouselNearestSnap(metrics.current.points, offset) : carouselClamp(offset, 0, max), !first);
  }, [activeIndex, overflowing, snap]);

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    // Touch and pen scroll the row natively; the pointer drag is for a mouse.
    if (event.pointerType !== "mouse" || event.button !== 0 || metrics.current.max <= 0) return;
    const interrupted = animation.current != null;
    stop();
    drive.jump(readPosition());
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startPosition: readPosition(),
      active: false,
      interrupted,
    };
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const state = drag.current;
    if (!state || state.pointerId !== event.pointerId) return;
    if (event.buttons === 0) {
      handlePointerEnd(event);
      return;
    }
    if (!state.active) {
      if (Math.abs(event.clientX - state.startX) < carouselDragThreshold) return;
      state.active = true;
      state.startX = event.clientX;
      // Capture only once it is a drag: capturing on press would take the click from a link inside an item.
      capturePointer(event.currentTarget, event.pointerId);
      event.currentTarget.dataset.dragging = "";
      // The press may have started a text selection inside an item; a drag isn't a selection.
      window.getSelection()?.removeAllRanges();
      setMoving(true);
    }
    drive.set(state.startPosition - metrics.current.direction * (event.clientX - state.startX));
  }

  function handlePointerEnd(event: PointerEvent<HTMLDivElement>) {
    const state = drag.current;
    if (!state || state.pointerId !== event.pointerId) return;
    drag.current = null;
    if (!state.active) {
      if (state.interrupted) settle(0);
      return;
    }
    const viewport = event.currentTarget;
    if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
    delete viewport.dataset.dragging;
    // The click that follows a drag must not follow a link inside an item.
    suppressClick.current = true;
    window.setTimeout(() => {
      suppressClick.current = false;
    }, 0);
    settle(event.type === "pointercancel" ? 0 : drive.getVelocity());
  }

  function handleClickCapture(event: MouseEvent<HTMLDivElement>) {
    if (!suppressClick.current) return;
    suppressClick.current = false;
    event.preventDefault();
    event.stopPropagation();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    // Keys belong to the row itself — not to a link or a field inside an item.
    if (event.target !== event.currentTarget || event.altKey || event.ctrlKey || event.metaKey) return;
    const { max, points, direction } = metrics.current;
    const from = target.current ?? readPosition();
    let to: number;
    switch (event.key) {
      case "ArrowRight":
        to = carouselStep(points, from, direction);
        break;
      case "ArrowLeft":
        to = carouselStep(points, from, direction === 1 ? -1 : 1);
        break;
      case "Home":
        to = 0;
        break;
      case "End":
        to = max;
        break;
      default:
        return;
    }
    event.preventDefault();
    moveTo(to);
  }

  function handleProgressPointerDown(event: PointerEvent<HTMLDivElement>) {
    const progressTrack = progressTrackRef.current;
    const thumb = thumbRef.current;
    const { max, points, direction } = metrics.current;
    if (!progressTrack || !thumb || max <= 0 || event.button !== 0) return;
    event.preventDefault();
    const trackRect = progressTrack.getBoundingClientRect();
    const thumbRect = thumb.getBoundingClientRect();

    if (event.clientX >= thumbRect.left - thumbHitSlop && event.clientX <= thumbRect.right + thumbHitSlop) {
      stop();
      drive.jump(readPosition());
      setMoving(true);
      capturePointer(event.currentTarget, event.pointerId);
      event.currentTarget.dataset.scrubbing = "";
      scrub.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startProgress: carouselProgress(readPosition(), max),
        travel: trackRect.width - thumbRect.width,
      };
      return;
    }

    // A press on the track moves the row there: the filled part centers on the pointer.
    const pointer = direction === 1 ? event.clientX - trackRect.left : trackRect.right - event.clientX;
    const to = carouselProgressAtPointer(pointer, trackRect.width, thumbRect.width) * max;
    moveTo(snap ? carouselNearestSnap(points, to) : to);
  }

  function handleProgressPointerMove(event: PointerEvent<HTMLDivElement>) {
    const state = scrub.current;
    if (!state || state.pointerId !== event.pointerId || state.travel <= 0) return;
    const { max, direction } = metrics.current;
    const delta = (direction * (event.clientX - state.startX)) / state.travel;
    drive.set(carouselClamp(state.startProgress + delta, 0, 1) * max);
  }

  function handleProgressPointerEnd(event: PointerEvent<HTMLDivElement>) {
    const state = scrub.current;
    if (!state || state.pointerId !== event.pointerId) return;
    scrub.current = null;
    const element = event.currentTarget;
    if (element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId);
    delete element.dataset.scrubbing;
    if (snap) moveTo(carouselNearestSnap(metrics.current.points, readPosition()));
    else setMoving(false);
  }

  const widths = resolveItemWidths(itemWidth);
  const rootStyle = {
    "--carousel-item": String(widths.base),
    "--carousel-item-sm": String(widths.sm),
    "--carousel-item-md": String(widths.md),
    "--carousel-item-lg": String(widths.lg),
  } as CSSProperties;

  const itemLabel = labels?.item ?? defaultLabels.item;
  const items = Children.toArray(children);
  itemCount.current = items.length;
  const counterLabel = (labels?.counter ?? defaultLabels.counter)(
    Math.min(restingIndex, Math.max(items.length - 1, 0)) + 1,
    items.length,
  );
  const overflowState = overflowing == null ? undefined : String(overflowing);
  /** The Pause / Play button: only while the row could drift (motion allowed, something to scroll). */
  const showDriftControl = driftSpeed > 0 && !reduce && overflowing === true;
  /** A loop has no end, so no scrubber and no counter. */
  const progressShown: CarouselProgressPlacement = loop ? "none" : progress;
  const counterShown = counter && !loop;

  return (
    <div
      ref={rootRef}
      className={cn(carouselRootClasses, cursor != null && "relative", className)}
      style={rootStyle}
      data-carousel=""
      data-autoplay={driftSpeed > 0 ? "" : undefined}
      onPointerEnter={handleRootPointerEnter}
      onPointerLeave={handleRootPointerLeave}
      onFocus={handleRootFocus}
      onBlur={handleRootBlur}
    >
      <div className={carouselFrameClasses}>
        <div
          ref={viewportRef}
          role="region"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          // A row that shows everything has nothing to scroll, so it is not a tab stop.
          tabIndex={overflowing === false ? undefined : 0}
          data-carousel-viewport=""
          data-overflowing={overflowState}
          className={cn(
            carouselViewportClasses,
            snap && carouselViewportSnapClasses,
            fade && carouselViewportFadeClasses,
          )}
          style={{ "--scroll-fade-s": "0px" } as CSSProperties}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
          onPointerMove={(event) => {
            handlePointerMove(event);
            if (cursor != null) handleCursorMove(event);
          }}
          onPointerLeave={cursor != null ? handleCursorLeave : undefined}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onClickCapture={handleClickCapture}
          onDragStart={(event) => event.preventDefault()}
          onWheel={takeOver}
          onTouchStart={takeOver}
        >
          {/* The extent holds the scroll width still while the track inside it shifts on an overscroll. */}
          <div className={carouselExtentClasses}>
            <motion.div ref={trackRef} className={carouselTrackClasses} style={{ x: trackX }}>
              {items.map((child, index) => (
                <CarouselItemSlot
                  key={isValidElement(child) && child.key != null ? child.key : index}
                  label={itemLabel(index + 1, items.length)}
                >
                  {child}
                </CarouselItemSlot>
              ))}
              {loop
                ? items.map((child, index) => (
                    <CarouselItemSlot key={`loop-${index}`} label={itemLabel(index + 1, items.length)} clone>
                      {child}
                    </CarouselItemSlot>
                  ))
                : null}
            </motion.div>
          </div>
        </div>
      </div>
      {progressShown !== "none" || showDriftControl ? (
        <div className={showDriftControl ? carouselControlsClasses[progressShown] : "contents"}>
      {progressShown !== "none" ? (
        // Hidden from assistive tech and not a tab stop: the row takes the same keys, and a
        // second control for one position would say everything twice.
        <div
          aria-hidden="true"
          data-carousel-progress=""
          data-overflowing={overflowState}
          className={cn(
            carouselProgressClasses,
            showDriftControl ? carouselProgressInControlsClasses[progressShown] : carouselProgressPlacementClasses[progressShown],
          )}
          onPointerDown={handleProgressPointerDown}
          onPointerMove={handleProgressPointerMove}
          onPointerUp={handleProgressPointerEnd}
          onPointerCancel={handleProgressPointerEnd}
        >
          <div ref={progressTrackRef} className={carouselProgressTrackClasses}>
            <div ref={thumbRef} className={carouselProgressThumbClasses} data-carousel-progress-thumb="" />
          </div>
        </div>
      ) : null}
      {showDriftControl ? (
        <IconButton
          role="ghost"
          size="sm"
          aria-label={driftPaused ? "Play" : "Pause"}
          icon={driftPaused ? <Play strokeWidth={2} /> : <Pause strokeWidth={2} />}
          onClick={() => setDriftPaused((paused) => !paused)}
          data-carousel-drift-control=""
        />
      ) : null}
        </div>
      ) : null}
      {cursor != null ? (
        <div ref={cursorRef} aria-hidden="true" className={carouselCursorClasses} data-carousel-cursor="">
          {cursor}
        </div>
      ) : null}
      {counterShown ? (
        // Always in the tree so a screen reader catches the change; the row's items already say
        // their place, so this is the one spoken update while the visitor moves.
        <p
          aria-live="polite"
          aria-atomic="true"
          data-carousel-counter=""
          data-overflowing={overflowState}
          className={carouselCounterClasses}
        >
          {counterLabel}
        </p>
      ) : null}
    </div>
  );
}

/** px a second: slow enough to read a quote as it passes. */
const defaultDriftSpeed = 24;

function CarouselItemSlot({ label, clone = false, children }: { label: string; clone?: boolean; children: ReactNode }) {
  const value = useMemo(() => ({ label, clone }), [label, clone]);
  return <CarouselItemContext.Provider value={value}>{children}</CarouselItemContext.Provider>;
}

function CarouselItem({ children, className }: CarouselItemProps) {
  const context = useContext(CarouselItemContext);
  return (
    <div
      role={context?.clone ? undefined : "group"}
      aria-label={context?.clone ? undefined : context?.label}
      aria-hidden={context?.clone ? true : undefined}
      inert={context?.clone ? true : undefined}
      data-carousel-item=""
      data-carousel-clone={context?.clone ? "" : undefined}
      className={cn(carouselItemClasses, className)}
    >
      {children}
    </div>
  );
}

export const Carousel = Object.assign(CarouselRoot, {
  Item: CarouselItem,
});
