import type { Meta, StoryObj } from "@storybook/react-vite";
import { PartyPopper } from "lucide-react";
import { useRef } from "react";
import { Button } from "../../atoms/Button/Button";
import { storyMetaDocsDefaults } from "../../../lib/storyCopySource";
import {
  ConfettiProvider,
  confettiDefaults,
  useConfetti,
  type ConfettiFireOptions,
} from "./Confetti";

const meta = {
  title: "Components/Feedback/Confetti",
  component: ConfettiProvider,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  parameters: {
    docs: {
      description: {
        component: `
## Usage

Mount **ConfettiProvider** once at the app root. After an async success, call \`fire()\` from \`useConfetti()\`. The burst is not tied to a button — pass \`origin\` as the control's ref (its center), an element, or a viewport \`{ x, y }\` point. Omit \`origin\` to start at the viewport center.

\`fire()\` does nothing when the reader prefers reduced motion, or when \`MotionConfig\` \`reducedMotion\` is \`"always"\`. There is no fallback fade.

Overlapping calls each spawn their own burst. A burst leaves the overlay \`duration + 0.5s\` after it starts. Unmounting the provider cancels in-flight animations.

\`\`\`tsx
const submitRef = useRef<HTMLButtonElement>(null);
const { fire } = useConfetti();

<ConfettiProvider>
  <Button ref={submitRef} type="button" onClick={() => fire({ origin: submitRef })}>
    Submit request
  </Button>
</ConfettiProvider>
\`\`\`

## Anatomy

\`\`\`
ConfettiProvider — context + portal
└── fixed overlay — pointer-events: none, z-index var(--z-confetti)
    └── burst (absolute at origin)
        └── piece — circle | rect | strip, WAAPI transform + opacity, linear ease
\`\`\`

## Best practices

- One provider per app. Call \`fire()\` when the action succeeds, not when the button is pressed, if the work is async.
- Pass the triggering control as \`origin\` so the burst reads as coming from that control.
- Default colors are \`confettiDefaultColors\` (chart categorical 1–7). Pass \`colors\` to override. Do not invent a second celebratory palette.
- Do not build a one-off trigger. Compose **Button** and call \`fire()\`. See **Examples/RFP submitted → Pattern — RFP submitted**.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof ConfettiProvider>;

export default meta;

type PhysicsArgs = Pick<
  ConfettiFireOptions,
  "particleCount" | "startVelocity" | "spread" | "decay" | "gravity" | "drift" | "duration" | "size"
>;

function PlaygroundButton(props: PhysicsArgs) {
  const submitRef = useRef<HTMLButtonElement>(null);
  const { fire } = useConfetti();

  return (
    <Button
      ref={submitRef}
      type="button"
      icon={<PartyPopper strokeWidth={2} />}
      onClick={() => fire({ ...props, origin: submitRef })}
    >
      Celebrate
    </Button>
  );
}

export const Playground: StoryObj<PhysicsArgs> = {
  name: "Playground",
  args: { ...confettiDefaults },
  argTypes: {
    particleCount: { control: { type: "range", min: 10, max: 150, step: 1 } },
    startVelocity: { control: { type: "range", min: 5, max: 60, step: 1 } },
    spread: { control: { type: "range", min: 20, max: 180, step: 1 } },
    decay: { control: { type: "range", min: 0.8, max: 0.99, step: 0.01 } },
    gravity: { control: { type: "range", min: 0.1, max: 3, step: 0.1 } },
    drift: { control: { type: "range", min: -2, max: 2, step: 0.1 } },
    duration: { control: { type: "range", min: 0.5, max: 5, step: 0.1 } },
    size: { control: { type: "range", min: 0.5, max: 2, step: 0.1 } },
  },
  parameters: {
    controls: {
      include: [
        "particleCount",
        "startVelocity",
        "spread",
        "decay",
        "gravity",
        "drift",
        "duration",
        "size",
      ],
    },
    docs: {
      description: {
        story:
          "Adjust the physics, then press Celebrate. The burst starts at the button. Reduced motion skips the burst.",
      },
    },
  },
  render: (args) => (
    <ConfettiProvider>
      <PlaygroundButton {...args} />
    </ConfettiProvider>
  ),
};
