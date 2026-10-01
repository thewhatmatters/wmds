import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Badge } from "../../components/atoms/Badge/Badge";
import { Button } from "../../components/atoms/Button/Button";
import { Checkbox } from "../../components/atoms/Checkbox/Checkbox";
import { IconButton } from "../../components/atoms/IconButton/IconButton";
import {
  Card,
  cardLayoutBodyOccupantInsetXClasses,
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

/**
 * Step 1 choices from the starter intake — not four identical
 * “Web experience” placeholders from the Paper file.
 */
export const promptChatStartOptions = [
  {
    value: "brand",
    label: "Brand identity",
    description: "Name, mark, and a system you can actually use.",
    number: 1,
  },
  {
    value: "website",
    label: "Website",
    description: "A site that explains the work and earns the next conversation.",
    number: 2,
  },
  {
    value: "product",
    label: "Product design",
    description: "Flows, screens, and the details in between.",
    number: 3,
  },
  {
    value: "system",
    label: "Design system",
    description: "Components, tokens, and the rules that keep them honest.",
    number: 4,
  },
] as const;

export const promptChatStartGateSteps = 4;

/** Card title — Paper header lead. */
export const promptChatStartGateTitle = "Name the work";

/** Quieter subtitle under the title — Paper secondary line. */
export const promptChatStartGateSubtitle = "What are we making?";

/**
 * Gated starter form. Replaces the composer in place. Existing Card + Checkbox +
 * Badge + Button + IconButton — no new variant.
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
            <span className={promptChatStartGateStepClasses}>
              {step} of {promptChatStartGateSteps}
            </span>
            <IconButton
              aria-label="Next step"
              size="sm"
              icon={<ChevronRight />}
              disabled={atEnd || values.length === 0}
              onClick={onNext}
            />
            <IconButton aria-label="Close starter" size="sm" icon={<X />} onClick={onCancel} />
          </div>
        }
      />
      <Card.Body>
        <div
          className={cn(promptChatStartGateOptionsClasses, cardLayoutBodyOccupantInsetXClasses)}
          role="group"
          aria-label={promptChatStartGateSubtitle}
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
              <Badge
                className={promptChatStartGateOptionNumberClasses}
                variant="neutral"
                emphasis="muted"
                size="sm"
                count={option.number}
              />
            </div>
          ))}
        </div>
      </Card.Body>
      <Card.Footer>
        <div className={promptChatStartGateFooterClasses}>
          <Button role="secondary" size="md" type="button" onClick={onCancel}>
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
