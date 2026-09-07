import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Badge } from "../../components/atoms/Badge/Badge";
import { Button } from "../../components/atoms/Button/Button";
import { Input } from "../../components/atoms/Input/Input";
import {
  DisplayControls,
  type DisplayControlThemeMode,
} from "../../components/molecules/DisplayControls/DisplayControls";
import { Panel } from "../../components/organisms/Panel/Panel";
import {
  exampleGridControlsBodyClasses,
  exampleGridControlsClusterClasses,
  exampleGridControlsFooterClasses,
} from "./exampleGridControlsStyles";

export interface ExampleGridControlsProps {
  gridVisible: boolean;
  onGridVisibleChange: (visible: boolean) => void;
  theme: DisplayControlThemeMode;
  onThemeChange: (theme: DisplayControlThemeMode) => void;
  maxWidth: number;
  onMaxWidthChange: (value: number) => void;
  columnGap: number;
  onColumnGapChange: (value: number) => void;
  defaultMaxWidth?: number;
  defaultColumnGap?: number;
}

interface NumberControlProps {
  label: string;
  description: string;
  value: number;
  min: number;
  max: number;
  onValueChange: (value: number) => void;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function NumberControl({
  label,
  description,
  value,
  min,
  max,
  onValueChange,
}: NumberControlProps) {
  const [draft, setDraft] = useState(String(value));

  return (
    <Input
      type="number"
      inputMode="numeric"
      label={label}
      description={description}
      min={min}
      max={max}
      step={8}
      value={draft}
      endBadge={
        <Badge variant="neutral" emphasis="muted" size="sm">
          px
        </Badge>
      }
      onChange={(event) => {
        const nextDraft = event.target.value;
        setDraft(nextDraft);
        const parsed = Number(nextDraft);
        if (Number.isFinite(parsed) && parsed >= min && parsed <= max) {
          onValueChange(parsed);
        }
      }}
      onBlur={() => {
        const parsed = Number(draft);
        const normalized = Number.isFinite(parsed)
          ? clamp(parsed, min, max)
          : value;
        setDraft(String(normalized));
        onValueChange(normalized);
      }}
    />
  );
}

export function ExampleGridControls({
  gridVisible,
  onGridVisibleChange,
  theme,
  onThemeChange,
  maxWidth,
  onMaxWidthChange,
  columnGap,
  onColumnGapChange,
  defaultMaxWidth = 960,
  defaultColumnGap = 24,
}: ExampleGridControlsProps) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [resetVersion, setResetVersion] = useState(0);

  return (
    <Panel open={panelOpen} onOpenChange={setPanelOpen}>
      <div className={exampleGridControlsClusterClasses}>
        <DisplayControls
          gridVisible={gridVisible}
          onGridVisibleChange={onGridVisibleChange}
          theme={theme}
          onThemeChange={onThemeChange}
        />
        <Panel.Trigger>
          <Button role="secondary" size="sm" icon={<SlidersHorizontal />}>
            Layout
          </Button>
        </Panel.Trigger>
      </div>

      <Panel.Content
        title="Grid layout"
        description="Development controls for this Storybook example."
        headerStart={<SlidersHorizontal />}
        size="sm"
        footer={
          <div className={exampleGridControlsFooterClasses}>
            <Button
              role="ghost"
              size="sm"
              onClick={() => {
                onMaxWidthChange(defaultMaxWidth);
                onColumnGapChange(defaultColumnGap);
                setResetVersion((version) => version + 1);
              }}
            >
              Reset
            </Button>
            <Button
              role="secondary"
              size="sm"
              onClick={() => setPanelOpen(false)}
            >
              Done
            </Button>
          </div>
        }
      >
        <div className={exampleGridControlsBodyClasses}>
          <NumberControl
            key={`max-width-${resetVersion}`}
            label="Wrapper max width"
            description="Updates --grid-max live."
            value={maxWidth}
            min={640}
            max={1280}
            onValueChange={onMaxWidthChange}
          />
          <NumberControl
            key={`column-gap-${resetVersion}`}
            label="Column gap"
            description="Updates every inter-column gap."
            value={columnGap}
            min={8}
            max={64}
            onValueChange={onColumnGapChange}
          />
        </div>
      </Panel.Content>
    </Panel>
  );
}
