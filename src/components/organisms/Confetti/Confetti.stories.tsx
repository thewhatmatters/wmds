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

Mount **ConfettiProvider** once at the app root. After an async success, render the confirmation surface and call \`useConfettiOnMount()\`. Do not fire from the submit click. Pass \`origin\` as an element, a ref (its center), or a viewport \`{ x, y }\` point. Omit \`origin\` to start at the viewport center. A page celebration uses the top-center of the viewport and a wide \`spread\`.

\`useConfettiOnMount()\` calls \`fire()\` once per mount. A ref skips React StrictMode's extra effect run and later re-renders. \`fire()\` does nothing when the reader prefers reduced motion, or when \`MotionConfig\` \`reducedMotion\` is \`"always"\`. There is no fallback fade.

Overlapping calls each spawn their own burst. A burst leaves the overlay \`duration + 0.5s\` after it starts. Unmounting the provider cancels in-flight animations.

\`\`\`tsx
function RequestReceived() {
  useConfettiOnMount({
    spread: 180,
    origin: { x: window.innerWidth / 2, y: 0 },
  });

  return <h1>Request received</h1>;
}

<ConfettiProvider>
  <RequestReceived />
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

- One provider per app. After the async action resolves, render the confirmation surface and call \`useConfettiOnMount()\` there — not from the submit click.
- For a page celebration, pass a top-center viewport \`origin\` and a wide \`spread\` so the burst rains over the page.
- Default colors are \`confettiDefaultColors\` (chart categorical 1–7). Pass \`colors\` to override. Do not invent a second celebratory palette.
- Do not build a one-off trigger. See **Examples/RFP submitted → Pattern — RFP submitted**.
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
          "Physics specimen. Adjust the controls, then press Celebrate — this burst starts at the button so the values are easy to compare. The product pattern fires once from the confirmation surface. Reduced motion skips the burst.",
      },
    },
  },
  render: (args) => (
    <ConfettiProvider>
      <PlaygroundButton {...args} />
    </ConfettiProvider>
  ),
};
