import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "../../components/atoms/Button/Button";
import { Checkbox } from "../../components/atoms/Checkbox/Checkbox";
import { IconButton } from "../../components/atoms/IconButton/IconButton";
import {
  Card,
  cardLayoutBodyOccupantInsetXClasses,
  cardLayoutBodyOccupantPadYClasses,
  cardSubtitleClasses,
  cardTitleClasses,
} from "../../components/molecules/Card/Card";
import { cn } from "../../lib/cn";
import {
  promptChatStartGateFooterClasses,
  promptChatStartGateHeaderEndClasses,
  promptChatStartGateOptionClasses,
  promptChatStartGateOptionNumberClasses,
  promptChatStartGateOptionsClasses,
  promptChatStartGateStepClasses,
} from "./promptChatStyles";

/** Step 1 choices — from the starter intake, not four identical placeholders. */
export const promptChatStartOptions = [
  {
    value: "brand",
    label: "Brand identity",
    description: "Name, mark, and a system you can actually use.",
    number: "01",
  },
  {
    value: "website",
    label: "Website",
    description: "A site that explains the work and earns the next conversation.",
    number: "02",
  },
  {
    value: "product",
    label: "Product design",
    description: "Flows, screens, and the details in between.",
    number: "03",
  },
  {
    value: "system",
    label: "Design system",
    description: "Components, tokens, and the rules that keep them honest.",
    number: "04",
  },
] as const;

export const promptChatStartGateSteps = 4;

export const promptChatStartGateTitle = "What are we making?";
export const promptChatStartGateSubtitle = "Pick everything that fits. We'll shape the work around it.";

/**
 * Gated starter form. Replaces the composer in place. Existing Card + Checkbox +
 * Button + IconButton — no new variant.
 */
export function PromptChatStartGate({
  step,
  values,
  onValuesChange,
  onCancel,
  onBack,
  onNext,
}: {
  step: number;
  values: readonly string[];
  onValuesChange: (values: string[]) => void;
  onCancel: () => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const atStart = step <= 1;
  const atEnd = step >= promptChatStartGateSteps;

  function toggle(value: string, checked: boolean) {
    if (checked) {
      onValuesChange([...values, value]);
      return;
    }
    onValuesChange(values.filter((item) => item !== value));
  }

  return (
    <Card padding="none" variant="surface" aria-label={promptChatStartGateTitle}>
      <Card.Header
        start={
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className={cardTitleClasses}>{promptChatStartGateTitle}</p>
            <p className={cardSubtitleClasses}>{promptChatStartGateSubtitle}</p>
          </div>
        }
        end={
          <div className={promptChatStartGateHeaderEndClasses}>
            <IconButton
              aria-label="Previous step"
              size="sm"
              icon={<ChevronLeft />}
              disabled={atStart}
              onClick={onBack}
            />
            <IconButton
              aria-label="Next step"
              size="sm"
              icon={<ChevronRight />}
              disabled={atEnd || values.length === 0}
              onClick={onNext}
            />
            <span className={promptChatStartGateStepClasses}>
              {step} of {promptChatStartGateSteps}
            </span>
            <IconButton aria-label="Close starter" size="sm" icon={<X />} onClick={onCancel} />
          </div>
        }
      />
      <Card.Body>
        <div
          className={cn(
            promptChatStartGateOptionsClasses,
            cardLayoutBodyOccupantInsetXClasses,
            cardLayoutBodyOccupantPadYClasses,
          )}
          role="group"
          aria-label={promptChatStartGateTitle}
        >
          {promptChatStartOptions.map((option) => (
            <div key={option.value} className={promptChatStartGateOptionClasses}>
              <Checkbox
                className="min-w-0 flex-1"
                size="md"
                label={option.label}
                description={option.description}
                checked={values.includes(option.value)}
                onChange={(event) => toggle(option.value, event.target.checked)}
              />
              <span className={promptChatStartGateOptionNumberClasses} aria-hidden>
                {option.number}
              </span>
            </div>
          ))}
        </div>
      </Card.Body>
      <Card.Footer>
        <div className={promptChatStartGateFooterClasses}>
          <Button role="ghost" size="md" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            role="primary"
            size="md"
            type="button"
            disabled={values.length === 0}
            onClick={onNext}
          >
            Next
          </Button>
        </div>
      </Card.Footer>
    </Card>
  );
}
