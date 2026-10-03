import type { Meta, StoryObj } from "@storybook/react-vite";
import { storyCopySource, storyMetaDocsDefaults } from "../../../lib/storyCopySource";
import { ConfettiProvider } from "../Confetti/Confetti";
import { IntakeConfirmation } from "./IntakeConfirmation";

const meta = {
  title: "Components/IntakeConfirmation",
  component: IntakeConfirmation,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        component: `
## Usage

Two confirmation surfaces. **Booked** reads **You're booked**. **Emailed** reads **We'll be in touch**.

Each one calls \`useConfettiOnMount\` when it mounts. The burst uses the existing Confetti colors option with brand tokens, including \`--color-brand\`. Do not fire from the button that opened the screen.

Optional booking slots — \`bookingTime\`, \`videoHref\`, \`googleCalendarHref\`, \`icsHref\` — render with existing **TextLink** and **Button**. Omit them when the path has no calendar details.

Mount **ConfettiProvider** once above the surface. Reduced motion skips the burst and leaves the static copy.

## Anatomy

\`\`\`
ConfettiProvider
└── IntakeConfirmation
    ├── Badge — Booked (neutral) or Sent (info)
    ├── heading
    ├── body
    ├── booking actions (optional)
    │   ├── booking time
    │   ├── TextLink — video
    │   ├── TextLink — Google Calendar
    │   └── Button render={<a/>} — .ics
    └── Button — Done
\`\`\`

## Best practices

- **Do** mount the confirmation only after the booking or the skip succeeds.
- **Do** keep one provider at the root.
- **Do** pass booking slots only when you have real URLs — reuse **TextLink** / **Button**, do not invent a second confirmation style.
- **Don't** call \`fire()\` from Continue, Confirm, or the skip link.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof IntakeConfirmation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BookedPattern: Story = {
  name: "Pattern — booked",
  args: {
    variant: "booked",
  },
  render: () => (
    <ConfettiProvider>
      <IntakeConfirmation
        variant="booked"
        bookingTime="Thu, Oct 9 · 10:00–10:30am CT"
        videoHref="https://meet.example.com/whatmatters"
        googleCalendarHref="https://calendar.google.com/calendar/render?action=TEMPLATE"
        icsHref="/calendar/whatmatters-intake.ics"
        onDone={() => undefined}
      />
    </ConfettiProvider>
  ),
  parameters: storyCopySource(`
import { ConfettiProvider, IntakeConfirmation } from "@whatmatters/wmds";

export function Booked() {
  return (
    <ConfettiProvider>
      <IntakeConfirmation
        variant="booked"
        bookingTime="Thu, Oct 9 · 10:00–10:30am CT"
        videoHref="https://meet.example.com/whatmatters"
        googleCalendarHref="https://calendar.google.com/calendar/render?action=TEMPLATE"
        icsHref="/calendar/whatmatters-intake.ics"
        onDone={() => undefined}
      />
    </ConfettiProvider>
  );
}
`),
};

export const EmailedPattern: Story = {
  name: "Pattern — emailed",
  args: {
    variant: "emailed",
  },
  render: () => (
    <ConfettiProvider>
      <IntakeConfirmation variant="emailed" onDone={() => undefined} />
    </ConfettiProvider>
  ),
  parameters: storyCopySource(`
import { ConfettiProvider, IntakeConfirmation } from "@whatmatters/wmds";

export function Emailed() {
  return (
    <ConfettiProvider>
      <IntakeConfirmation variant="emailed" onDone={() => undefined} />
    </ConfettiProvider>
  );
}
`),
};
