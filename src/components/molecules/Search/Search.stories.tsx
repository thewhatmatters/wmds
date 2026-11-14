import type { Meta, StoryObj } from "@storybook/react-vite";
import { MapPin } from "lucide-react";
import { useState, type FormEvent } from "react";
import { expect } from "storybook/test";
import { Field } from "../Field/Field";
import { Search, searchSizes, searchVariants } from "./Search";

const meta = {
  title: "Components/Search",
  component: Search,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: [...searchSizes] },
    variant: { control: "select", options: [...searchVariants] },
    icon: { control: false },
    actionLabel: { control: "text" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
  },
  args: {
    placeholder: "ZIP or city",
    "aria-label": "Location",
    actionLabel: "Use my location",
    size: "md",
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        component: `
## Usage

Hero location search — one **pill shell** with inset action button.

| Pattern | Composition |
|---------|-------------|
| **Inline + button** | \`Search\` — \`Input inline\` + trailing \`Button\` |
| **Find collapsed** | \`Button\` "Find" only — parent owns expand |
| **Find committed** | removable \`Chip\` — app flow |

**Shell:** \`bg-surface\` pill on \`bg-body\` page, \`h-11\` with \`p-1 pl-2\` inset — even gutter on the embedded button (top / right / bottom); inner track is \`h-8\`.

| Prop | Values | Use |
|------|--------|-----|
| \`size\` | \`sm\` 40px, \`md\` 44px (default), \`lg\` 56px | \`lg\` for a signup that closes a page, or beside a **PromptBar** (the same height) |
| \`variant\` | \`surface\` (default), \`glass\` | \`glass\` over a picture or a scene: **Card**'s frosted fill under a hairline edge |

## Best practices

- **Do** use for ZIP/city + "Use my location" / "GO" search rows.
- **Do** pair with Example-level expand/collapse from a "Find" trigger.
- **Do** use it for a one-field signup (newsletter, waitlist): \`type="email"\`, \`actionType="submit"\` inside a \`form\`, a visible label from **Field**, and \`status\` + \`message\` for what to fix.
- **Don't** use solo bordered \`Input\` beside \`Button\` for this pattern — use \`Search\`.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof Search>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InlineButton: Story = {
  name: "Pattern — inline + button",
};

export const WithIcon: Story = {
  name: "With leading icon",
  args: {
    icon: <MapPin strokeWidth={2} />,
  },
};

export const GoAction: Story = {
  name: "GO action",
  args: {
    actionLabel: "GO",
    defaultValue: "97201",
  },
};

export const OnBeige: Story = {
  name: "On page background (FM)",
  parameters: {
    docs: {
      description: {
        story: "White surface pill on gray body — WMDS surface hierarchy (body → surface).",
      },
    },
  },
  render: (args) => (
    <div className="w-full max-w-lg rounded-xl bg-body p-6">
      <Search {...args} />
    </div>
  ),
};

export const WithMessage: Story = {
  name: "With validation message",
  args: {
    actionLabel: "Subscribe",
    "aria-label": "Email address",
    placeholder: undefined,
    type: "email",
    defaultValue: "randy@",
    status: "error",
    message: "Enter an email address, like name@example.com.",
  },
  render: (args) => (
    <div className="w-full max-w-lg">
      <Search {...args} />
    </div>
  ),
};

/** A one-field signup: the button sends the form; Enter does the same. */
function NewsletterSignup() {
  const [error, setError] = useState<string | undefined>();
  const [sent, setSent] = useState<string | null>(null);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") ?? "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter an email address, like name@example.com.");
      return;
    }
    setError(undefined);
    setSent(email);
  };
  return (
    <form className="w-full max-w-lg" onSubmit={submit} noValidate>
      <Field label="Email address">
        <Search
          type="email"
          name="email"
          autoComplete="email"
          actionLabel="Subscribe"
          actionType="submit"
          status={error ? "error" : undefined}
          message={error}
          onChange={() => setError(undefined)}
        />
      </Field>
      {sent ? <p className="mt-3 type-body text-muted">Subscribed {sent}</p> : null}
    </form>
  );
}

export const NewsletterSignupPattern: Story = {
  name: "Pattern — newsletter signup",
  parameters: {
    docs: {
      description: {
        story: "One email field with **Subscribe** inside it at the right end (`actionType=\"submit\"`). A wrong address opens the band under the pill and keeps what was typed.",
      },
    },
  },
  render: () => <NewsletterSignup />,
};

// A stand-in picture with light and dark areas (the same one Card's and PromptBar's glass stories use).
const glassBackdropStyle = {
  backgroundImage: [
    "radial-gradient(circle at 18% 28%, rgb(255 214 153) 0 14%, transparent 15%)",
    "radial-gradient(circle at 78% 70%, rgb(22 60 94) 0 22%, transparent 23%)",
    "repeating-linear-gradient(115deg, rgb(120 170 190) 0 28px, rgb(214 232 236) 28px 56px)",
  ].join(", "),
};

export const Glass: Story = {
  name: "Glass over a picture (lg)",
  parameters: {
    docs: {
      description: {
        story:
          "`variant=\"glass\"` frosts the pill: the surface colour at part strength over a blur of what's behind (**Card**'s glass and its knobs, `--card-glass-tint` and `--card-glass-blur`), under the hairline edge **PromptBar**'s glass bar has. The field is told apart by its fill, its label and the button inside it, not by a ring; a validation status still colours the border. Solid where the browser has no backdrop filter, and when the visitor asks for less transparency. `size=\"lg\"` is 56px, the height of a **PromptBar**, with a 40px action.",
      },
    },
  },
  render: () => (
    <div className="flex w-full justify-center rounded-xl px-4 py-16" style={glassBackdropStyle}>
      <form className="w-full max-w-lg" onSubmit={(event) => event.preventDefault()} noValidate>
        <Search variant="glass" size="lg" type="email" name="email" autoComplete="email" label="Email address" placeholder="name@example.com" actionLabel="Subscribe" actionType="submit" />
      </form>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const shell = canvasElement.querySelector<HTMLElement>("[data-variant='glass']")!;
    const style = getComputedStyle(shell);
    // The surface colour at the theme's default strength: the picture shows through, blurred.
    const tint = Number.parseFloat(style.getPropertyValue("--card-glass-tint-default")) / 100;
    await expect([0.7, 0.88]).toContain(tint);
    await expect(style.backgroundColor).toMatch(new RegExp(`[/,] ?${tint}\\)$`));
    await expect(style.backdropFilter).toContain("blur(12px)");
    // A hairline edge, and the lg pill: 56px tall around a 40px action.
    await expect(style.borderTopWidth).toBe("1px");
    await expect(shell.offsetHeight).toBe(56);
    await expect(canvasElement.querySelector<HTMLElement>("button")!.offsetHeight).toBe(40);
  },
};
