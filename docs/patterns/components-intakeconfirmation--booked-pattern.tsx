// @thewhatmatters/wmds@0.4.2 · Pattern — booked
// Storybook: Components/IntakeConfirmation → Pattern — booked (?path=/story/components-intakeconfirmation--booked-pattern)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { ConfettiProvider, IntakeConfirmation } from "@thewhatmatters/wmds";

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
