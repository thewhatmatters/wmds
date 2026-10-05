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
import { AnimatePresence, MotionConfigContext, motion, type Variants } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motionTransitionProp } from "../../../lib/motion";
import { Button } from "../../atoms/Button/Button";
import { IconButton } from "../../atoms/IconButton/IconButton";
import { cardSubtitleClasses, cardTitleClasses } from "../../molecules/Card/Card";
import { useChatDockGateWindow } from "./chatDockGateContext";
import { useChatDockReducedMotion, useChatDockWide } from "./chatDockViewport";
import {
  chatDockGateClasses,
  chatDockGateControlsClasses,
  chatDockGateErrorClasses,
  chatDockGateFooterActionsClasses,
  chatDockGateFooterBlockClasses,
  chatDockGateFooterRowClasses,
  chatDockGateFooterRuleClasses,
  chatDockGateHeaderClasses,
  chatDockGateHeadingClasses,
  chatDockGatePendingClasses,
  chatDockGateProgressClasses,
  chatDockGateStepClasses,
} from "./chatDockGateStyles";

export interface ChatDockGateLabels {
  /** Header control back one step. Default: "Previous step". */
  previous: string;
  /** Header control on one step. Default: "Next step". */
  next: string;
  /** @deprecated The gate has no close of its own: Cancel leaves it, and the window's close folds the window. Unused. */
  close: string;
  /** Footer action that leaves the gate. Default: "Cancel". */
  cancel: string;
  /** Footer primary action. Default: "Next". */
  continue: string;
  /** Shown over the footer while `pending`. Default: "Sending…". */
  pending: string;
  /** Where the visitor is, between the header controls. Default: "2 of 4". */
  progress: (step: number, stepCount: number) => string;
}

export const chatDockGateDefaultLabels: ChatDockGateLabels = {
  previous: "Previous step",
  next: "Next step",
  close: "Close",
  cancel: "Cancel",
  continue: "Next",
  pending: "Sending…",
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
   * The footer's primary action — on one step, or on the last step an action such as "Send" or
   * "Try again" (`continueLabel`). The header's next control moves on one step, so it is disabled on
   * the last step. Leave it out on a step that ends another way (for example booking a call).
   */
  onNext?: () => void;
  /** Whether the visitor can move on from this step. Default: true. */
  canContinue?: boolean;
  /**
   * Leaves the gate — the footer's Cancel. The gate has no close of its own: inside **ChatDock** the
   * window's close and Escape fold the window and keep the gate. On its own, Escape calls it too.
   */
  onClose: () => void;
  /** Footer start — for example **CalEmbed.Skip** on a booking step. */
  footerStart?: ReactNode;
  /** This step's primary label, for example "Send". Default: `labels.continue`. */
  continueLabel?: string;
  /** The step's action is running — for example sending the form. Shows `labels.pending` over the footer and disables the step controls. */
  pending?: boolean;
  /** The step's action failed — a line over the footer, announced. Keep the visitor's answers, and offer a retry through `onNext`. */
  error?: ReactNode;
  labels?: Partial<ChatDockGateLabels>;
  /** The step's content. Change it with `step`; the step slides in. */
  children: ReactNode;
}

/**
 * A multi-step form in the conversation — pass it as **ChatDock**'s `gate`. It sits under the latest
 * message, set into the conversation as a well (hairline border, page floor, inset shade — embedded,
 * not raised): the step's title and subtitle with previous,
 * progress, and next; the step; Cancel and the primary action under a second hairline. It has no close
 * of its own and never scrolls on its own — the window grows to fit it, and past that the conversation
 * scrolls.
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
    pending = false,
    error,
    labels: labelsProp,
    children,
  },
  ref,
) {
  const labels = { ...chatDockGateDefaultLabels, ...labelsProp };
  const titleId = useId();
  const subtitleId = useId();
  const wide = useChatDockWide();
  const dockWindow = useChatDockGateWindow();
  const { reducedMotion: reducedMotionConfig } = useContext(MotionConfigContext);
  const reduceMotion = useChatDockReducedMotion(reducedMotionConfig);

  // Which way the steps move: forward slides in from the end, back from the start.
  const [lastStep, setLastStep] = useState(step);
  const [direction, setDirection] = useState(1);
  if (step !== lastStep) {
    setDirection(step > lastStep ? 1 : -1);
    setLastStep(step);
  }

  const rootRef = useRef<HTMLDivElement | null>(null);

  // On mount and on each step, the conversation brings the gate into view.
  useLayoutEffect(() => {
    dockWindow?.revealGate();
  }, [dockWindow, step]);

  const fast = motionTransitionProp("fast");
  const shift = reduceMotion ? 0 : 16;
  const stepVariants: Variants = {
    enter: (towards: number) => ({ opacity: 0, x: towards * shift }),
    center: { opacity: 1, x: 0, transition: fast },
    exit: (towards: number) => ({ opacity: 0, x: -towards * shift, transition: fast }),
  };

  const controlSize = wide ? "sm" : "md";
  const canGoNext = onNext != null && canContinue && step < stepCount && !pending;

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    // Inside ChatDock, Escape folds the window (ChatDock handles it); on its own the gate closes.
    if (dockWindow != null || event.key !== "Escape" || event.defaultPrevented) return;
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
      aria-busy={pending || undefined}
      tabIndex={-1}
      data-chat-dock-gate-focus=""
      data-step={step}
      onKeyDown={handleKeyDown}
    >
      <div className={chatDockGateHeaderClasses}>
        <div className={chatDockGateHeadingClasses}>
          {/* The window's title is the dialog's h2; the step is a section of it. */}
          <h3 id={titleId} className={cardTitleClasses}>
            {title}
          </h3>
          {subtitle != null ? (
            <p id={subtitleId} className={cardSubtitleClasses}>
              {subtitle}
            </p>
          ) : null}
        </div>
        <div className={chatDockGateControlsClasses}>
          <IconButton
            size={controlSize}
            icon={<ChevronLeft />}
            aria-label={labels.previous}
            disabled={step <= 1 || pending}
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
        </div>
      </div>

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
          className={chatDockGateStepClasses}
          custom={direction}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
        >
          {children}
        </motion.div>
      </AnimatePresence>

      <div className={chatDockGateFooterBlockClasses}>
        <hr className={chatDockGateFooterRuleClasses} aria-hidden="true" />
        {/* Mounted throughout, so "Sending…" is announced when it appears. */}
        <div role="status">{pending ? <p className={chatDockGatePendingClasses}>{labels.pending}</p> : null}</div>
        {!pending && error != null ? (
          <p className={chatDockGateErrorClasses} role="alert">
            {error}
          </p>
        ) : null}
        <div className={chatDockGateFooterRowClasses}>
          {footerStart}
          <div className={chatDockGateFooterActionsClasses}>
            <Button role="secondary" size={controlSize} type="button" disabled={pending} onClick={onClose}>
              {labels.cancel}
            </Button>
            {onNext != null ? (
              <Button
                role="primary"
                size={controlSize}
                type="button"
                disabled={!canContinue || pending}
                onClick={onNext}
              >
                {continueLabel ?? labels.continue}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
});
