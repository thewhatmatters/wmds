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
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motionTransitionProp } from "../../../lib/motion";
import { Button } from "../../atoms/Button/Button";
import { IconButton } from "../../atoms/IconButton/IconButton";
import { Card, cardSubtitleClasses, cardTitleClasses } from "../../molecules/Card/Card";
import {
  overlayPanelFooterHairlineClasses,
  overlayPanelHeaderClasses,
  overlayPanelHeaderDelineatedInnerClasses,
  overlayPanelHeaderHairlineClasses,
} from "../Dialog/dialogStyles";
import { useChatDockGateWindow } from "./chatDockGateContext";
import { useChatDockReducedMotion, useChatDockWide } from "./chatDockViewport";
import {
  chatDockGateBodyClasses,
  chatDockGateCardClasses,
  chatDockGateClasses,
  chatDockGateErrorClasses,
  chatDockGateFooterActionsClasses,
  chatDockGateFooterBlockClasses,
  chatDockGateFooterRowClasses,
  chatDockGateOccupantClasses,
  chatDockGatePendingClasses,
  chatDockGateProgressClasses,
} from "./chatDockGateStyles";

export interface ChatDockGateLabels {
  /** Header control back one step. Default: "Previous step". */
  previous: string;
  /** Header control on one step. Default: "Next step". */
  next: string;
  /** Header close outside **ChatDock**. Inside it the close folds the window and takes **ChatDock**'s `labels.close`. Default: "Close". */
  close: string;
  /** Footer close. Default: "Cancel". */
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
  /** The step's title — the window's header while the gate is up. It also names the gate for screen readers. */
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
   * Leaves the gate — the footer's Cancel. Inside **ChatDock** the header's close and Escape fold the
   * window instead and keep the gate, with its progress, for when it reopens.
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
  /** The step's content. Change it with `step`; the body slides between steps. */
  children: ReactNode;
}

/**
 * A multi-step form that takes over the chat window — pass it as **ChatDock**'s `gate`. While it is
 * up the window is the form: one header with the step's title and subtitle, previous, progress, next,
 * and close; the step in a body that scrolls; Cancel and the primary action pinned to the window's
 * bottom edge. The header's close and Escape fold the window and keep the gate; Cancel leaves it.
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

  // Each step starts at the top of the body.
  useLayoutEffect(() => {
    const body = rootRef.current?.querySelector<HTMLElement>("[data-chat-dock-gate-body]");
    if (body != null) body.scrollTop = 0;
  }, [step]);

  const fast = motionTransitionProp("fast");
  const shift = reduceMotion ? 0 : 16;
  const stepVariants: Variants = {
    enter: (towards: number) => ({ opacity: 0, x: towards * shift }),
    center: { opacity: 1, x: 0, transition: fast },
    exit: (towards: number) => ({ opacity: 0, x: -towards * shift, transition: fast }),
  };

  const controlSize = wide ? "sm" : "md";
  const canGoNext = onNext != null && canContinue && step < stepCount && !pending;
  const close = dockWindow?.closeWindow ?? onClose;

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
      {/* A section, so the step header is not a second page banner. The window owns the surface. */}
      <Card
        as="section"
        shape="flush"
        padding="none"
        variant="ghost"
        headerless={false}
        bodyTerminal={false}
        className={chatDockGateCardClasses}
      >
        <div className={`${overlayPanelHeaderClasses} w-full`}>
          <Card.Header
            className={overlayPanelHeaderDelineatedInnerClasses}
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
                <IconButton
                  size={controlSize}
                  icon={<X />}
                  aria-label={dockWindow?.closeLabel ?? labels.close}
                  onClick={close}
                />
              </>
            }
          />
          <hr className={overlayPanelHeaderHairlineClasses} aria-hidden="true" />
        </div>
        <Card.Body className={chatDockGateBodyClasses} data-chat-dock-gate-body="">
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
        </Card.Body>
        <div className={chatDockGateFooterBlockClasses}>
          <hr className={overlayPanelFooterHairlineClasses} aria-hidden="true" />
          {/* Mounted throughout, so "Sending…" is announced when it appears. */}
          <div role="status">{pending ? <p className={chatDockGatePendingClasses}>{labels.pending}</p> : null}</div>
          {!pending && error != null ? (
            <p className={chatDockGateErrorClasses} role="alert">
              {error}
            </p>
          ) : null}
          <Card.Footer className={chatDockGateFooterRowClasses}>
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
          </Card.Footer>
        </div>
      </Card>
    </div>
  );
});
