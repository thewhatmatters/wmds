import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactElement,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus, X } from "lucide-react";
import { IconButton } from "../../atoms/IconButton/IconButton";
import { cn } from "../../../lib/cn";
import { motionTransitionProp } from "../../../lib/motion";
import {
  floatingActionButtonBackdropClasses,
  floatingActionButtonInnerClasses,
  floatingActionButtonItemClasses,
  floatingActionButtonLabelClasses,
  floatingActionButtonPathOriginClasses,
  floatingActionButtonRootClasses,
  floatingActionButtonTriggerClasses,
  floatingActionButtonVerticalPath,
} from "./floatingActionButtonStyles";

export interface FloatingActionButtonItem {
  id: string;
  label: string;
  icon: ReactElement;
  disabled?: boolean;
}

export type FloatingActionButtonLayoutClassName = string;

export interface FloatingActionButtonProps {
  items: FloatingActionButtonItem[];
  onAction: (id: string) => void;
  triggerIcon?: ReactElement;
  openIcon?: ReactElement;
  triggerLabel?: string;
  closeLabel?: string;
  /** Adds a dismissible semantic overlay behind the expanded actions. */
  backdrop?: boolean;
  /** Layout only — use for fixed placement or margins. */
  className?: FloatingActionButtonLayoutClassName;
}

const fabStaggerInterval = 0.05;
const fabMaxOffsetDistance = 84;
const fabActionSlots = 4;

export function FloatingActionButton({
  items,
  onAction,
  triggerIcon = <Plus strokeWidth={2} />,
  openIcon = <X strokeWidth={2} />,
  triggerLabel = "Open actions",
  closeLabel = "Close actions",
  backdrop = false,
  className,
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const actionsId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key !== "Escape") return;
      setIsOpen(false);
      triggerRef.current?.querySelector("button")?.focus();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  function handleAction(id: string) {
    onAction(id);
    setIsOpen(false);
  }

  function handleActionKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;

    const buttons = Array.from(
      rootRef.current?.querySelectorAll<HTMLButtonElement>("[data-fab-action] button") ?? [],
    );
    const currentIndex = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (currentIndex < 0) return;

    event.preventDefault();
    const direction = event.key === "ArrowUp" ? 1 : -1;
    const nextIndex = (currentIndex + direction + buttons.length) % buttons.length;
    buttons[nextIndex]?.focus();
  }

  return (
    <div
      ref={rootRef}
      className={cn(floatingActionButtonRootClasses, className)}
      onKeyDown={handleActionKeyDown}
    >
      <div className={floatingActionButtonInnerClasses}>
      <AnimatePresence>
        {isOpen && backdrop ? (
          <motion.button
            key="fab-backdrop"
            type="button"
            aria-label="Dismiss actions"
            className={floatingActionButtonBackdropClasses}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={motionTransitionProp("medium-min")}
            onClick={() => setIsOpen(false)}
          />
        ) : null}
      </AnimatePresence>

      <motion.div
        ref={triggerRef}
        className={floatingActionButtonTriggerClasses}
        animate={{ rotate: isOpen ? 90 : 0 }}
        transition={motionTransitionProp("medium-min")}
      >
        <IconButton
          icon={isOpen ? openIcon : triggerIcon}
          aria-label={isOpen ? closeLabel : triggerLabel}
          aria-expanded={isOpen}
          aria-controls={actionsId}
          fab
          size="lg"
          onClick={() => setIsOpen((current) => !current)}
        />
      </motion.div>

      <div
        id={actionsId}
        role="group"
        aria-label="Actions"
        aria-hidden={!isOpen}
        className={floatingActionButtonPathOriginClasses}
      >
        <AnimatePresence>
          {isOpen
            ? items.map((item, index) => {
                const distance =
                  ((index + 1) / fabActionSlots) * fabMaxOffsetDistance;
                const enterDelay = index * fabStaggerInterval;
                const exitDelay = (items.length - index - 1) * (fabStaggerInterval / 2);

                return (
                  <motion.div
                    key={item.id}
                    data-fab-action=""
                    className={floatingActionButtonItemClasses}
                    style={{
                      offsetPath: `path("${floatingActionButtonVerticalPath}")`,
                      offsetRotate: "0deg",
                    }}
                    initial={{ offsetDistance: "0%", opacity: 0, scale: 0.3 }}
                    animate={{ offsetDistance: `${distance}%`, opacity: 1, scale: 1 }}
                    exit={{
                      offsetDistance: "0%",
                      opacity: 0,
                      scale: 0.3,
                      transition: {
                        ...motionTransitionProp("fast"),
                        delay: exitDelay,
                      },
                    }}
                    transition={{
                      ...motionTransitionProp("medium-min"),
                      delay: enterDelay,
                    }}
                  >
                    <IconButton
                      icon={item.icon}
                      aria-label={item.label}
                      title={item.label}
                      role="secondary"
                      size="md"
                      disabled={item.disabled}
                      onClick={() => handleAction(item.id)}
                    />
                    <motion.span
                      className={floatingActionButtonLabelClasses}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{
                        ...motionTransitionProp("fast-min"),
                        delay: enterDelay + 0.08,
                      }}
                    >
                      {item.label}
                    </motion.span>
                  </motion.div>
                );
              })
            : null}
        </AnimatePresence>
      </div>
      </div>
    </div>
  );
}
