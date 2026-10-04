import {
  forwardRef,
  useContext,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, MotionConfigContext, motion, useReducedMotion, type Variants } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motionTransitionProp } from "../../../lib/motion";
import { Button } from "../../atoms/Button/Button";
import { IconButton } from "../../atoms/IconButton/IconButton";
import { Card, cardSubtitleClasses, cardTitleClasses } from "../../molecules/Card/Card";
import { useChatDockWide } from "./chatDockViewport";
import {
  chatDockGateCardClasses,
  chatDockGateClasses,
  chatDockGateFooterActionsClasses,
  chatDockGateOccupantClasses,
  chatDockGateProgressClasses,
  chatDockGateStepClasses,
} from "./chatDockGateStyles";

export interface ChatDockGateLabels {
  /** Header control back one step. Default: "Previous step". */
  previous: string;
  /** Header control on one step. Default: "Next step". */
  next: string;
  /** Header close. Default: "Close". */
  close: string;
  /** Footer close. Default: "Cancel". */
  cancel: string;
  /** Footer primary action. Default: "Next". */
  continue: string;
  /** Where the visitor is, between the header controls. Default: "2 of 4". */
  progress: (step: number, stepCount: number) => string;
}

export const chatDockGateDefaultLabels: ChatDockGateLabels = {
  previous: "Previous step",
  next: "Next step",
  close: "Close",
  cancel: "Cancel",
  continue: "Next",
  progress: (step, stepCount) => `${step} of ${stepCount}`,
};

export interface ChatDockGateProps {
  /** The step's title. It also names the gate for screen readers. */
  title: string;
  /** One line under the title. */
  subtitle?: string;
  /** The current step, from 1. */
  step: number;
  /** How many steps there are. */
  stepCount: number;
  /** Back one step. The control is disabled on the first step. */
  onPrevious: () => void;
  /**
   * On one step — the header's next control and the footer's primary action. Leave it out on a
   * step that ends another way (for example booking a call): both are then left out or disabled.
   */
  onNext?: () => void;
  /** Whether the visitor can move on from this step. Default: true. */
  canContinue?: boolean;
  /** Closes the gate — the header's close, the footer's Cancel, and Escape. */
  onClose: () => void;
  /** Footer start — for example **CalEmbed.Skip** on a booking step. */
  footerStart?: ReactNode;
  /** This step's primary label, for example "Send". Default: `labels.continue`. */
  continueLabel?: string;
  labels?: Partial<ChatDockGateLabels>;
  /** The step's content. Change it with `step`; the body slides between steps. */
  children: ReactNode;
}

/**
 * A multi-step form in the chat window, in the composer's place — pass it as **ChatDock**'s
 * `gate`. A **Card** shell: the step's title and subtitle with previous, progress, next, and close
 * controls; the step in a scrolling body; Cancel and the primary action in the footer. It hugs each
 * step up to the height ChatDock allows, then the body scrolls. Escape closes it.
 */
export const ChatDockGate = forwardRef<HTMLDivElement, ChatDockGateProps>(function ChatDockGate(
  {
    title,
    subtitle,
    step,
    stepCount,
    onPrevious,
    onNext,
    canContinue = true,
    onClose,
    footerStart,
    continueLabel,
    labels: labelsProp,
    children,
  },
  ref,
) {
  const labels = { ...chatDockGateDefaultLabels, ...labelsProp };
  const titleId = useId();
  const subtitleId = useId();
  const wide = useChatDockWide();
  const { reducedMotion: reducedMotionConfig } = useContext(MotionConfigContext);
  const reduceMotion = useReducedMotion() === true || reducedMotionConfig === "always";

  // Which way the steps move: forward slides in from the end, back from the start.
  const [lastStep, setLastStep] = useState(step);
  const [direction, setDirection] = useState(1);
  if (step !== lastStep) {
    setDirection(step > lastStep ? 1 : -1);
    setLastStep(step);
  }

  // The body eases to each step's height instead of jumping.
  const rootRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | null>(null);
  useLayoutEffect(() => {
    const content = contentRef.current;
    if (content == null || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => setContentHeight(content.offsetHeight));
    observer.observe(content);
    return () => {
      observer.disconnect();
    };
  }, []);

  const fast = motionTransitionProp("fast");
  const medium = motionTransitionProp("medium");
  const shift = reduceMotion ? 0 : 16;
  const stepVariants: Variants = {
    enter: (towards: number) => ({ opacity: 0, x: towards * shift }),
    center: { opacity: 1, x: 0, transition: fast },
    exit: (towards: number) => ({ opacity: 0, x: -towards * shift, transition: fast }),
  };

  const controlSize = wide ? "sm" : "md";
  const canGoNext = onNext != null && canContinue;

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Escape" || event.defaultPrevented) return;
    event.preventDefault();
    onClose();
  }

  return (
    <div
      ref={(node) => {
        rootRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref != null) ref.current = node;
      }}
      className={chatDockGateClasses}
      role="group"
      aria-labelledby={titleId}
      aria-describedby={subtitle != null ? subtitleId : undefined}
      tabIndex={-1}
      data-chat-dock-gate-focus=""
      data-step={step}
      onKeyDown={handleKeyDown}
    >
      {/* A section, so the step header is not a second page banner. */}
      <Card as="section" shape="rounded" padding="none" variant="surface" className={chatDockGateCardClasses}>
        <Card.Header
          start={
            <>
              <h2 id={titleId} className={cardTitleClasses}>
                {title}
              </h2>
              {subtitle != null ? (
                <p id={subtitleId} className={cardSubtitleClasses}>
                  {subtitle}
                </p>
              ) : null}
            </>
          }
          end={
            <>
              <IconButton
                size={controlSize}
                icon={<ChevronLeft />}
                aria-label={labels.previous}
                disabled={step <= 1}
                onClick={onPrevious}
              />
              <span className={chatDockGateProgressClasses} aria-live="polite">
                {labels.progress(step, stepCount)}
              </span>
              <IconButton
                size={controlSize}
                icon={<ChevronRight />}
                aria-label={labels.next}
                disabled={!canGoNext}
                onClick={onNext}
              />
              <IconButton size={controlSize} icon={<X />} aria-label={labels.close} onClick={onClose} />
            </>
          }
        />
        <Card.Body>
          <motion.div
            className={chatDockGateStepClasses}
            initial={false}
            animate={{ height: contentHeight ?? "auto" }}
            transition={reduceMotion ? { duration: 0 } : medium}
          >
            <div ref={contentRef}>
              <AnimatePresence
                mode="wait"
                initial={false}
                custom={direction}
                onExitComplete={() => {
                  // The control that had focus left with the old step: keep focus in the gate.
                  const root = rootRef.current;
                  if (root != null && !root.contains(document.activeElement)) root.focus({ preventScroll: true });
                }}
              >
                <motion.div
                  key={step}
                  className={chatDockGateOccupantClasses}
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </Card.Body>
        <Card.Footer>
          {footerStart}
          <div className={chatDockGateFooterActionsClasses}>
            <Button role="secondary" size={controlSize} type="button" onClick={onClose}>
              {labels.cancel}
            </Button>
            {onNext != null ? (
              <Button role="primary" size={controlSize} type="button" disabled={!canContinue} onClick={onNext}>
                {continueLabel ?? labels.continue}
              </Button>
            ) : null}
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
});
