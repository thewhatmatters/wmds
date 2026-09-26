"use client";

import {
  MotionConfigContext,
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { cn } from "../../../lib/cn";
import { footerRevealAt } from "./footerRevealAt";
import {
  footerRevealContentClasses,
  footerRevealFadeClasses,
  footerRevealFieldClasses,
  footerRevealFieldLinkClasses,
  footerRevealRootClasses,
  footerRevealScaleClasses,
  footerRevealStickyClasses,
} from "./footerRevealStyles";

export { footerRevealFieldClasses, footerRevealFieldLinkClasses };

/** Layout-only — placement. Do not add overflow clipping; it breaks the sticky footer. */
export type FooterRevealLayoutClassName = string;

export interface FooterRevealProps {
  /** **FooterReveal.Content** then **FooterReveal.Footer**. */
  children?: ReactNode;
  className?: FooterRevealLayoutClassName;
}

export interface FooterRevealContentProps {
  /** Page body that covers the sticky footer until scroll. Needs an opaque background. */
  children?: ReactNode;
  className?: FooterRevealLayoutClassName;
}

export interface FooterRevealFooterProps {
  /** Footer contents — any node, including a composed marketing footer. */
  children?: ReactNode;
  /** Merged onto the fading field. Put the field color here (`footerRevealFieldClasses`). */
  className?: FooterRevealLayoutClassName;
}

interface FooterRevealContextValue {
  /** 0 covered → 1 uncovered. Stays at 1 when reduced motion is on. */
  reveal: MotionValue<number>;
  reduceMotion: boolean;
  contentRef: RefObject<HTMLDivElement | null>;
  footerRef: RefObject<HTMLElement | null>;
  scale: MotionValue<number>;
  filter: MotionValue<string>;
  opacityWillChange: MotionValue<string>;
  contentWillChange: MotionValue<string>;
}

const FooterRevealContext = createContext<FooterRevealContextValue | null>(null);

function useFooterRevealContext(consumer: string): FooterRevealContextValue {
  const value = useContext(FooterRevealContext);
  if (!value) {
    throw new Error(`${consumer} must be rendered inside FooterReveal.`);
  }
  return value;
}

/**
 * Reveal progress from the enclosing **FooterReveal** (0 covered, 1 uncovered).
 * Stays at 1 when the reader prefers reduced motion.
 */
export function useFooterRevealProgress(): MotionValue<number> {
  return useFooterRevealContext("useFooterRevealProgress").reveal;
}

/**
 * Sticky under-page footer. The page cover sits at z-index 1 with the page
 * background. The footer is sticky to the bottom at z-index -1 inside an
 * isolate wrapper, and scrubs opacity, scale, and blur across one footer-height
 * of scroll. Reduced motion shows the footer fully opaque at scale 1 with no blur.
 */
function FooterRevealRoot({ children, className }: FooterRevealProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const [revealAt, setRevealAt] = useState(0.35);
  /**
   * OS `prefers-reduced-motion` wins. `MotionConfig reducedMotion="always"`
   * also reduces. The default config value is `"never"` (no provider); that
   * must not ignore the OS query.
   */
  const { reducedMotion: reducedMotionConfig } = useContext(MotionConfigContext);
  const reduceMotion = useReducedMotion() === true || reducedMotionConfig === "always";

  useLayoutEffect(() => {
    const footer = footerRef.current;
    if (!footer || typeof ResizeObserver === "undefined") return;

    const update = () => {
      setRevealAt(footerRevealAt(footer.offsetHeight, window.innerHeight || 1));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(footer);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ["end end", "end start"],
  });

  const scrubbedReveal = useTransform(scrollYProgress, [0, revealAt], [0, 1]);
  const reveal = useTransform(scrubbedReveal, (value) => (reduceMotion ? 1 : value));
  const scale = useTransform(scrollYProgress, [0, revealAt], reduceMotion ? [1, 1] : [0.9, 1]);
  const blur = useTransform(scrollYProgress, [0, revealAt], reduceMotion ? [0, 0] : [6, 0]);
  const filter = useMotionTemplate`blur(${blur}px)`;
  const opacityWillChange = useTransform(scrollYProgress, (progress): string =>
    !reduceMotion && progress > 0.0001 && progress < revealAt ? "opacity" : "auto",
  );
  const contentWillChange = useTransform(scrollYProgress, (progress): string =>
    !reduceMotion && progress > 0.0001 && progress < revealAt ? "transform, filter" : "auto",
  );

  const value: FooterRevealContextValue = {
    reveal,
    reduceMotion,
    contentRef,
    footerRef,
    scale,
    filter,
    opacityWillChange,
    contentWillChange,
  };

  return (
    <FooterRevealContext.Provider value={value}>
      <div className={cn(footerRevealRootClasses, className)} data-footer-reveal="root">
        {children}
      </div>
    </FooterRevealContext.Provider>
  );
}

function FooterRevealContent({ children, className }: FooterRevealContentProps) {
  const { contentRef } = useFooterRevealContext("FooterReveal.Content");

  return (
    <div
      ref={contentRef}
      className={cn(footerRevealContentClasses, className)}
      data-footer-reveal="content"
    >
      {children}
    </div>
  );
}

function FooterRevealFooter({ children, className }: FooterRevealFooterProps) {
  const { footerRef, reveal, reduceMotion, scale, filter, opacityWillChange, contentWillChange } =
    useFooterRevealContext("FooterReveal.Footer");

  return (
    <footer
      ref={footerRef}
      className={footerRevealStickyClasses}
      data-footer-reveal="sticky"
    >
      {reduceMotion ? (
        <div
          className={cn(footerRevealFadeClasses, className)}
          style={{ opacity: 1 }}
          data-footer-reveal="fade"
        >
          <div
            className={footerRevealScaleClasses}
            style={{ transform: "none", filter: "none", transformOrigin: "50% 100%" }}
            data-footer-reveal="scale"
          >
            {children}
          </div>
        </div>
      ) : (
        <motion.div
          className={cn(footerRevealFadeClasses, className)}
          style={{ opacity: reveal, willChange: opacityWillChange }}
          data-footer-reveal="fade"
        >
          <motion.div
            className={footerRevealScaleClasses}
            style={{
              scale,
              filter,
              transformOrigin: "50% 100%",
              willChange: contentWillChange,
            }}
            data-footer-reveal="scale"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </footer>
  );
}

export const FooterReveal = Object.assign(FooterRevealRoot, {
  Content: FooterRevealContent,
  Footer: FooterRevealFooter,
});
