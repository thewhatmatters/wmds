/** @vitest-environment happy-dom */
import { createElement } from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import {
  IntakeForm,
  intakeAboutEmpty,
  intakeDetailsMax,
  isIntakeAboutValid,
  isIntakeUrlValid,
} from "./IntakeForm";

const valid = {
  name: "Jordan Lee",
  email: "jordan@example.com",
  company: "",
  url: "",
  details: "A calmer way to brief a new brand.",
};

describe("isIntakeUrlValid", () => {
  it("allows an empty link", () => {
    expect(isIntakeUrlValid("")).toBe(true);
    expect(isIntakeUrlValid("  ")).toBe(true);
  });

  it("accepts http(s) URLs and rejects other schemes", () => {
    expect(isIntakeUrlValid("https://whatmatters.so")).toBe(true);
    expect(isIntakeUrlValid("http://example.com/path")).toBe(true);
    expect(isIntakeUrlValid("not-a-url")).toBe(false);
    expect(isIntakeUrlValid("ftp://example.com")).toBe(false);
  });
});

describe("isIntakeAboutValid", () => {
  it("accepts name, email, and details without a company or link", () => {
    expect(isIntakeAboutValid(valid)).toBe(true);
    expect(isIntakeAboutValid({ ...valid, company: "Northwind" })).toBe(true);
    expect(isIntakeAboutValid({ ...valid, url: "https://northwind.example" })).toBe(true);
  });

  it("rejects an empty name, a bad email, empty details, or a bad link", () => {
    expect(isIntakeAboutValid({ ...valid, name: "  " })).toBe(false);
    expect(isIntakeAboutValid({ ...valid, email: "jordan" })).toBe(false);
    expect(isIntakeAboutValid({ ...valid, details: "" })).toBe(false);
    expect(isIntakeAboutValid({ ...valid, url: "notaurl" })).toBe(false);
    expect(isIntakeAboutValid(intakeAboutEmpty)).toBe(false);
  });

  it("rejects details past the counter", () => {
    expect(isIntakeAboutValid({ ...valid, details: "a".repeat(intakeDetailsMax + 1) })).toBe(false);
    expect(isIntakeAboutValid({ ...valid, details: "a".repeat(intakeDetailsMax) })).toBe(true);
  });
});

describe("IntakeForm blur errors", () => {
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

  it("shows an error on blur when a required field is invalid, and leaves company optional", () => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);

    let values = { ...intakeAboutEmpty };
    const onChange = (next: typeof values) => {
      values = next;
      act(() => {
        root?.render(createElement(IntakeForm, { values, onChange }));
      });
    };

    act(() => {
      root?.render(createElement(IntakeForm, { values, onChange }));
    });

    const name = container.querySelector('input[aria-label="Name"]');
    const email = container.querySelector('input[aria-label="Email"]');
    const company = container.querySelector('input[aria-label="Company"]');
    const link = container.querySelector('input[aria-label="Link"]');
    const details = container.querySelector('textarea[aria-label="Project details"]');
    if (
      !(name instanceof HTMLInputElement) ||
      !(email instanceof HTMLInputElement) ||
      !(company instanceof HTMLInputElement) ||
      !(link instanceof HTMLInputElement) ||
      !(details instanceof HTMLTextAreaElement)
    ) {
      throw new Error("IntakeForm fields missing");
    }

    act(() => {
      name.focus();
      name.blur();
      name.dispatchEvent(new FocusEvent("blur", { bubbles: true }));
    });
    expect(container.textContent).toContain("Enter your name.");

    act(() => {
      email.focus();
      email.blur();
      email.dispatchEvent(new FocusEvent("blur", { bubbles: true }));
    });
    expect(container.textContent).toContain("Please enter a valid email address.");

    act(() => {
      company.focus();
      company.blur();
    });
    expect(container.textContent).not.toContain("Enter your company");
    expect(container.querySelector('input[aria-label="Company"]')?.getAttribute("aria-invalid")).toBeNull();

    act(() => {
      details.focus();
      details.blur();
    });
    expect(container.textContent).toContain("Tell us a bit about the project.");

    act(() => {
      link.focus();
      link.blur();
    });
    expect(container.textContent).not.toContain("Please enter a valid URL.");
    expect(container.querySelector('input[aria-label="Link"]')?.getAttribute("aria-invalid")).toBeNull();
  });
});
