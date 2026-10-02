/** @vitest-environment happy-dom */
import { createElement } from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { ConfettiProvider } from "../Confetti/Confetti";
import { IntakeConfirmation } from "./IntakeConfirmation";
import { intakeConfettiColors } from "./intakeConfirmationStyles";

describe("intake confetti colors", () => {
  it("includes brand navy through the existing token", () => {
    expect(intakeConfettiColors).toContain("var(--color-brand)");
    expect(intakeConfettiColors.every((color) => color.startsWith("var(--color-"))).toBe(true);
  });
});

describe("IntakeConfirmation booking slots", () => {
  let root: Root | undefined;
  let container: HTMLDivElement | undefined;

  afterEach(() => {
    act(() => {
      root?.unmount();
    });
    container?.remove();
    root = undefined;
    container = undefined;
  });

  it("renders booking time, video, Google Calendar, and .ics with TextLink and Button", () => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);

    act(() => {
      root?.render(
        createElement(
          ConfettiProvider,
          null,
          createElement(IntakeConfirmation, {
            variant: "booked",
            bookingTime: "Thu, Oct 9 · 10:00–10:30am CT",
            videoHref: "https://meet.example.com/room",
            googleCalendarHref: "https://calendar.google.com/calendar/render?action=TEMPLATE",
            icsHref: "/calendar/intake.ics",
            onDone: () => undefined,
          }),
        ),
      );
    });

    expect(container.textContent).toContain("Thu, Oct 9 · 10:00–10:30am CT");
    const video = container.querySelector('a[href="https://meet.example.com/room"]');
    const calendar = container.querySelector(
      'a[href="https://calendar.google.com/calendar/render?action=TEMPLATE"]',
    );
    const ics = container.querySelector('a[href="/calendar/intake.ics"]');
    expect(video?.textContent).toContain("Join video call");
    expect(calendar?.textContent).toContain("Add to Google Calendar");
    expect(ics?.textContent).toContain("Download .ics");
    expect(ics?.hasAttribute("download")).toBe(true);
  });
});
