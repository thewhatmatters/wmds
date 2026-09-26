import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../../components/atoms/Badge/Badge";
import { Button, type ButtonStatus } from "../../components/atoms/Button/Button";
import { Input } from "../../components/atoms/Input/Input";
import { TextArea } from "../../components/atoms/TextArea/TextArea";
import {
  Card,
  cardLayoutBodyOccupantInsetXClasses,
  cardLayoutBodyOccupantPadYClasses,
  cardSubtitleClasses,
  cardTitleClasses,
} from "../../components/molecules/Card/Card";
import { Select } from "../../components/molecules/Select/Select";
import type { DisplayControlThemeMode } from "../../components/molecules/DisplayControls/DisplayControls";
import { ConfettiProvider, useConfetti } from "../../components/organisms/Confetti/Confetti";
import { GridOverlay } from "../../lib/GridOverlay";
import { cn } from "../../lib/cn";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../lib/storyCopySource";
import { ExampleGridControls } from "../ExampleGridControls/ExampleGridControls";

const meta = {
  title: "Examples/RFP submitted",
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  parameters: {
    wmdsLayout: "fullscreen",
    docs: {
      description: {
        component: `
## Usage

Request-for-proposal form. **ConfettiProvider** wraps the page. On a successful submit the button morphs to success and \`fire()\` starts at that button.

## Anatomy

\`\`\`
ConfettiProvider
└── grid-page
    └── Card
        ├── Card.Header — title + supporting copy
        └── Card.Body — company, email, project, budget, brief, submit
\`\`\`

\`fire()\` does nothing when reduced motion is on. Show code is the page without Storybook grid controls.
        `.trim(),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const projectOptions = [
  { value: "product", label: "Product" },
  { value: "brand", label: "Brand" },
  { value: "engineering", label: "Engineering" },
] as const;

const budgetOptions = [
  { value: "25", label: "$25k–$50k" },
  { value: "50", label: "$50k–$100k" },
  { value: "100", label: "$100k+" },
] as const;

const rfpSubmittedCopySource = `
import { useRef, useState, type FormEvent } from "react";
import {
  Badge,
  Button,
  Card,
  ConfettiProvider,
  Input,
  Select,
  TextArea,
  cardLayoutBodyOccupantInsetXClasses,
  cardLayoutBodyOccupantPadYClasses,
  cardSubtitleClasses,
  cardTitleClasses,
  cn,
  useConfetti,
  type ButtonStatus,
} from "@whatmatters/wmds";

const projectOptions = [
  { value: "product", label: "Product" },
  { value: "brand", label: "Brand" },
  { value: "engineering", label: "Engineering" },
];

const budgetOptions = [
  { value: "25", label: "$25k–$50k" },
  { value: "50", label: "$50k–$100k" },
  { value: "100", label: "$100k+" },
];

export function RfpSubmitted() {
  return (
    <ConfettiProvider>
      <main className="grid-page min-h-dvh bg-body [--grid-column-gap:24px] [--grid-max:80rem]">
        <RfpForm />
      </main>
    </ConfettiProvider>
  );
}

function RfpForm() {
  const submitRef = useRef<HTMLButtonElement>(null);
  const { fire } = useConfetti();
  const [phase, setPhase] = useState<ButtonStatus>("idle");
  const [company, setCompany] = useState("Northwind");
  const [email, setEmail] = useState("ava@northwind.example");
  const [project, setProject] = useState("product");
  const [budget, setBudget] = useState("50");
  const [brief, setBrief] = useState(
    "We need a calm way for clients to request a proposal and see that it landed.",
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (phase !== "idle") return;
    setPhase("loading");
    await new Promise((resolve) => {
      window.setTimeout(resolve, 600);
    });
    setPhase("success");
    fire({ origin: submitRef });
  }

  return (
    <div className="band py-10">
      <div className="col-span-full lg:col-span-6 lg:col-start-4">
        <Card padding="none">
          <Card.Header
            start={
              <div className="flex flex-col gap-1">
                <h1 className={cardTitleClasses}>Request a proposal</h1>
                <p className={cardSubtitleClasses}>
                  Tell us what you want to build. We reply within two business days.
                </p>
              </div>
            }
          />
          <Card.Body>
            <form
              className={cn(
                cardLayoutBodyOccupantInsetXClasses,
                cardLayoutBodyOccupantPadYClasses,
                "flex flex-col gap-4",
              )}
              onSubmit={handleSubmit}
            >
              <Input
                label="Company"
                name="company"
                value={company}
                autoComplete="organization"
                onChange={(event) => setCompany(event.target.value)}
                required
              />
              <Input
                label="Work email"
                name="email"
                type="email"
                value={email}
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <Select
                label="Project"
                options={[...projectOptions]}
                value={project}
                onValueChange={setProject}
              />
              <Select
                label="Budget"
                options={[...budgetOptions]}
                value={budget}
                onValueChange={setBudget}
              />
              <TextArea
                label="What should we build?"
                name="brief"
                value={brief}
                rows={5}
                onChange={(event) => setBrief(event.target.value)}
                required
              />
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="min-h-6">
                  {phase === "success" ? <Badge variant="success">Request received</Badge> : null}
                </div>
                <Button
                  ref={submitRef}
                  type="submit"
                  status={phase}
                  disabled={phase === "success"}
                  statusLabels={{
                    idle: "Submit request",
                    loading: "Sending",
                    success: "Request sent",
                  }}
                >
                  Submit request
                </Button>
              </div>
            </form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
`.trim();

function RfpForm() {
  const submitRef = useRef<HTMLButtonElement>(null);
  const { fire } = useConfetti();
  const [phase, setPhase] = useState<ButtonStatus>("idle");
  const [company, setCompany] = useState("Northwind");
  const [email, setEmail] = useState("ava@northwind.example");
  const [project, setProject] = useState("product");
  const [budget, setBudget] = useState("50");
  const [brief, setBrief] = useState(
    "We need a calm way for clients to request a proposal and see that it landed.",
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (phase !== "idle") return;
    setPhase("loading");
    await new Promise((resolve) => {
      window.setTimeout(resolve, 600);
    });
    setPhase("success");
    fire({ origin: submitRef });
  }

  return (
    <div className="band py-10">
      <div className="col-span-full lg:col-span-6 lg:col-start-4">
        <Card padding="none">
          <Card.Header
            start={
              <div className="flex flex-col gap-1">
                <h1 className={cardTitleClasses}>Request a proposal</h1>
                <p className={cardSubtitleClasses}>
                  Tell us what you want to build. We reply within two business days.
                </p>
              </div>
            }
          />
          <Card.Body>
            <form
              className={cn(
                cardLayoutBodyOccupantInsetXClasses,
                cardLayoutBodyOccupantPadYClasses,
                "flex flex-col gap-4",
              )}
              onSubmit={handleSubmit}
            >
              <Input
                label="Company"
                name="company"
                value={company}
                autoComplete="organization"
                onChange={(event) => setCompany(event.target.value)}
                required
              />
              <Input
                label="Work email"
                name="email"
                type="email"
                value={email}
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <Select
                label="Project"
                options={[...projectOptions]}
                value={project}
                onValueChange={setProject}
              />
              <Select
                label="Budget"
                options={[...budgetOptions]}
                value={budget}
                onValueChange={setBudget}
              />
              <TextArea
                label="What should we build?"
                name="brief"
                value={brief}
                rows={5}
                onChange={(event) => setBrief(event.target.value)}
                required
              />
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="min-h-6">
                  {phase === "success" ? <Badge variant="success">Request received</Badge> : null}
                </div>
                <Button
                  ref={submitRef}
                  type="submit"
                  status={phase}
                  disabled={phase === "success"}
                  statusLabels={{
                    idle: "Submit request",
                    loading: "Sending",
                    success: "Request sent",
                  }}
                >
                  Submit request
                </Button>
              </div>
            </form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

function RfpSubmittedCanvas() {
  const [gridVisible, setGridVisible] = useState(false);
  const [theme, setTheme] = useState<DisplayControlThemeMode>("auto");
  const [gridMax, setGridMax] = useState(1280);
  const [columnGap, setColumnGap] = useState(24);

  useEffect(() => {
    const root = document.documentElement;
    const previousTheme = root.getAttribute("data-theme");
    if (theme === "auto") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", theme);
    return () => {
      if (previousTheme == null) root.removeAttribute("data-theme");
      else root.setAttribute("data-theme", previousTheme);
    };
  }, [theme]);

  return (
    <ConfettiProvider>
      <main
        className="grid-page min-h-dvh bg-body"
        style={
          {
            "--grid-max": `${gridMax}px`,
            "--grid-column-gap": `${columnGap}px`,
          } as CSSProperties
        }
      >
        <GridOverlay visible={gridVisible} onVisibleChange={setGridVisible} keyboardShortcut={false} />
        <RfpForm />
        <ExampleGridControls
          gridVisible={gridVisible}
          onGridVisibleChange={setGridVisible}
          theme={theme}
          onThemeChange={setTheme}
          maxWidth={gridMax}
          onMaxWidthChange={setGridMax}
          columnGap={columnGap}
          onColumnGapChange={setColumnGap}
          defaultMaxWidth={1280}
          defaultColumnGap={24}
        />
      </main>
    </ConfettiProvider>
  );
}

export const RfpSubmitted: Story = {
  name: "Pattern — RFP submitted",
  parameters: withStoryCopySource(
    {
      wmdsLayout: "fullscreen",
      docs: {
        description: {
          story:
            "Submit the request. The button moves to success and confetti fires from that button. Reduced motion skips the burst. Grid controls are Storybook-only; Show code freezes `--grid-max: 80rem` and `--grid-column-gap: 24px`.",
        },
      },
    },
    rfpSubmittedCopySource,
  ),
  render: () => <RfpSubmittedCanvas />,
};
