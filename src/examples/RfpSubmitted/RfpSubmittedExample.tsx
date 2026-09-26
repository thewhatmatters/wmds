import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { Badge } from "../../components/atoms/Badge/Badge";
import { Button } from "../../components/atoms/Button/Button";
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
import { ConfettiProvider, useConfettiOnMount } from "../../components/organisms/Confetti/Confetti";
import { cn } from "../../lib/cn";

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

const initialBrief =
  "We need a calm way for clients to request a proposal and see that it landed.";

interface RfpDraft {
  company: string;
  email: string;
  project: string;
  budget: string;
  brief: string;
}

function optionLabel(
  options: readonly { value: string; label: string }[],
  value: string,
): string {
  return options.find((option) => option.value === value)?.label ?? value;
}

function RfpConfirmation({
  submission,
  onStartAnother,
}: {
  submission: RfpDraft;
  onStartAnother: () => void;
}) {
  useConfettiOnMount({
    particleCount: 90,
    spread: 180,
    startVelocity: 28,
    origin: {
      x: typeof window === "undefined" ? 0 : window.innerWidth / 2,
      y: 0,
    },
  });

  const summary = [
    { label: "Company", value: submission.company },
    { label: "Work email", value: submission.email },
    { label: "Project", value: optionLabel(projectOptions, submission.project) },
    { label: "Budget", value: optionLabel(budgetOptions, submission.budget) },
    { label: "Brief", value: submission.brief },
  ];

  return (
    <div className="band py-10">
      <div className="col-span-full lg:col-span-6 lg:col-start-4">
        <Card padding="none">
          <Card.Header
            start={
              <div className="flex flex-col items-start gap-2">
                <Badge variant="success" emphasis="muted" icon={<Check strokeWidth={2} />}>
                  Request received
                </Badge>
                <h1 className="type-heading-2 text-fg">Your proposal request is in</h1>
                <p className={cardSubtitleClasses}>
                  We will reply to {submission.email} within two business days.
                </p>
              </div>
            }
          />
          <Card.Body>
            <div
              className={cn(
                cardLayoutBodyOccupantInsetXClasses,
                cardLayoutBodyOccupantPadYClasses,
                "flex flex-col gap-6",
              )}
            >
              <section className="flex flex-col gap-3">
                <h2 className="type-label text-fg">What you sent</h2>
                <dl className="flex flex-col gap-3">
                  {summary.map((row) => (
                    <div key={row.label} className="flex flex-col gap-0.5">
                      <dt className="type-supporting text-muted">{row.label}</dt>
                      <dd className="type-body text-fg">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
              <section className="flex flex-col gap-3">
                <h2 className="type-label text-fg">What happens next</h2>
                <ol className="flex list-decimal flex-col gap-2 ps-5">
                  <li className="type-body text-fg">
                    We read the brief and match it to the right team.
                  </li>
                  <li className="type-body text-fg">You get a reply at the work email above.</li>
                  <li className="type-body text-fg">If it is a fit, we schedule a short call.</li>
                </ol>
              </section>
              <div>
                <Button type="button" role="secondary" onClick={onStartAnother}>
                  Submit another request
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

function RfpForm({
  company,
  email,
  project,
  budget,
  brief,
  submitting,
  onCompanyChange,
  onEmailChange,
  onProjectChange,
  onBudgetChange,
  onBriefChange,
  onSubmit,
}: {
  company: string;
  email: string;
  project: string;
  budget: string;
  brief: string;
  submitting: boolean;
  onCompanyChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onProjectChange: (value: string) => void;
  onBudgetChange: (value: string) => void;
  onBriefChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
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
              onSubmit={onSubmit}
            >
              <Input
                label="Company"
                name="company"
                value={company}
                autoComplete="organization"
                onChange={(event) => onCompanyChange(event.target.value)}
                required
              />
              <Input
                label="Work email"
                name="email"
                type="email"
                value={email}
                autoComplete="email"
                onChange={(event) => onEmailChange(event.target.value)}
                required
              />
              <Select
                label="Project"
                options={[...projectOptions]}
                value={project}
                onValueChange={onProjectChange}
              />
              <Select
                label="Budget"
                options={[...budgetOptions]}
                value={budget}
                onValueChange={onBudgetChange}
              />
              <TextArea
                label="What should we build?"
                name="brief"
                value={brief}
                rows={5}
                onChange={(event) => onBriefChange(event.target.value)}
                required
              />
              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  status={submitting ? "loading" : "idle"}
                  statusLabels={{
                    idle: "Submit request",
                    loading: "Sending",
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

export function RfpFlow() {
  const [phase, setPhase] = useState<"editing" | "submitting" | "confirmed">("editing");
  const [company, setCompany] = useState("Northwind");
  const [email, setEmail] = useState("ava@northwind.example");
  const [project, setProject] = useState("product");
  const [budget, setBudget] = useState("50");
  const [brief, setBrief] = useState(initialBrief);
  const [submission, setSubmission] = useState<RfpDraft | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (phase !== "editing") return;
    setPhase("submitting");
    await new Promise((resolve) => {
      window.setTimeout(resolve, 600);
    });
    setSubmission({ company, email, project, budget, brief });
    setPhase("confirmed");
  }

  if (phase === "confirmed" && submission) {
    return (
      <RfpConfirmation
        submission={submission}
        onStartAnother={() => {
          setSubmission(null);
          setPhase("editing");
        }}
      />
    );
  }

  return (
    <RfpForm
      company={company}
      email={email}
      project={project}
      budget={budget}
      brief={brief}
      submitting={phase === "submitting"}
      onCompanyChange={setCompany}
      onEmailChange={setEmail}
      onProjectChange={setProject}
      onBudgetChange={setBudget}
      onBriefChange={setBrief}
      onSubmit={handleSubmit}
    />
  );
}

export function RfpSubmittedPage() {
  return (
    <ConfettiProvider>
      <main className="grid-page min-h-dvh bg-body [--grid-column-gap:24px] [--grid-max:80rem]">
        <RfpFlow />
      </main>
    </ConfettiProvider>
  );
}

export const rfpSubmittedCopySource = `
import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";
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
  useConfettiOnMount,
} from "@whatmatters/wmds";

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

const initialBrief =
  "We need a calm way for clients to request a proposal and see that it landed.";

interface RfpDraft {
  company: string;
  email: string;
  project: string;
  budget: string;
  brief: string;
}

function optionLabel(
  options: readonly { value: string; label: string }[],
  value: string,
): string {
  return options.find((option) => option.value === value)?.label ?? value;
}

function RfpConfirmation({
  submission,
  onStartAnother,
}: {
  submission: RfpDraft;
  onStartAnother: () => void;
}) {
  useConfettiOnMount({
    particleCount: 90,
    spread: 180,
    startVelocity: 28,
    origin: {
      x: typeof window === "undefined" ? 0 : window.innerWidth / 2,
      y: 0,
    },
  });

  const summary = [
    { label: "Company", value: submission.company },
    { label: "Work email", value: submission.email },
    { label: "Project", value: optionLabel(projectOptions, submission.project) },
    { label: "Budget", value: optionLabel(budgetOptions, submission.budget) },
    { label: "Brief", value: submission.brief },
  ];

  return (
    <div className="band py-10">
      <div className="col-span-full lg:col-span-6 lg:col-start-4">
        <Card padding="none">
          <Card.Header
            start={
              <div className="flex flex-col items-start gap-2">
                <Badge variant="success" emphasis="muted" icon={<Check strokeWidth={2} />}>
                  Request received
                </Badge>
                <h1 className="type-heading-2 text-fg">Your proposal request is in</h1>
                <p className={cardSubtitleClasses}>
                  We will reply to {submission.email} within two business days.
                </p>
              </div>
            }
          />
          <Card.Body>
            <div
              className={cn(
                cardLayoutBodyOccupantInsetXClasses,
                cardLayoutBodyOccupantPadYClasses,
                "flex flex-col gap-6",
              )}
            >
              <section className="flex flex-col gap-3">
                <h2 className="type-label text-fg">What you sent</h2>
                <dl className="flex flex-col gap-3">
                  {summary.map((row) => (
                    <div key={row.label} className="flex flex-col gap-0.5">
                      <dt className="type-supporting text-muted">{row.label}</dt>
                      <dd className="type-body text-fg">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
              <section className="flex flex-col gap-3">
                <h2 className="type-label text-fg">What happens next</h2>
                <ol className="flex list-decimal flex-col gap-2 ps-5">
                  <li className="type-body text-fg">
                    We read the brief and match it to the right team.
                  </li>
                  <li className="type-body text-fg">You get a reply at the work email above.</li>
                  <li className="type-body text-fg">If it is a fit, we schedule a short call.</li>
                </ol>
              </section>
              <div>
                <Button type="button" role="secondary" onClick={onStartAnother}>
                  Submit another request
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

function RfpForm({
  company,
  email,
  project,
  budget,
  brief,
  submitting,
  onCompanyChange,
  onEmailChange,
  onProjectChange,
  onBudgetChange,
  onBriefChange,
  onSubmit,
}: {
  company: string;
  email: string;
  project: string;
  budget: string;
  brief: string;
  submitting: boolean;
  onCompanyChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onProjectChange: (value: string) => void;
  onBudgetChange: (value: string) => void;
  onBriefChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
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
              onSubmit={onSubmit}
            >
              <Input
                label="Company"
                name="company"
                value={company}
                autoComplete="organization"
                onChange={(event) => onCompanyChange(event.target.value)}
                required
              />
              <Input
                label="Work email"
                name="email"
                type="email"
                value={email}
                autoComplete="email"
                onChange={(event) => onEmailChange(event.target.value)}
                required
              />
              <Select
                label="Project"
                options={[...projectOptions]}
                value={project}
                onValueChange={onProjectChange}
              />
              <Select
                label="Budget"
                options={[...budgetOptions]}
                value={budget}
                onValueChange={onBudgetChange}
              />
              <TextArea
                label="What should we build?"
                name="brief"
                value={brief}
                rows={5}
                onChange={(event) => onBriefChange(event.target.value)}
                required
              />
              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  status={submitting ? "loading" : "idle"}
                  statusLabels={{
                    idle: "Submit request",
                    loading: "Sending",
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

function RfpFlow() {
  const [phase, setPhase] = useState<"editing" | "submitting" | "confirmed">("editing");
  const [company, setCompany] = useState("Northwind");
  const [email, setEmail] = useState("ava@northwind.example");
  const [project, setProject] = useState("product");
  const [budget, setBudget] = useState("50");
  const [brief, setBrief] = useState(initialBrief);
  const [submission, setSubmission] = useState<RfpDraft | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (phase !== "editing") return;
    setPhase("submitting");
    await new Promise((resolve) => {
      window.setTimeout(resolve, 600);
    });
    setSubmission({ company, email, project, budget, brief });
    setPhase("confirmed");
  }

  if (phase === "confirmed" && submission) {
    return (
      <RfpConfirmation
        submission={submission}
        onStartAnother={() => {
          setSubmission(null);
          setPhase("editing");
        }}
      />
    );
  }

  return (
    <RfpForm
      company={company}
      email={email}
      project={project}
      budget={budget}
      brief={brief}
      submitting={phase === "submitting"}
      onCompanyChange={setCompany}
      onEmailChange={setEmail}
      onProjectChange={setProject}
      onBudgetChange={setBudget}
      onBriefChange={setBrief}
      onSubmit={handleSubmit}
    />
  );
}

export function RfpSubmitted() {
  return (
    <ConfettiProvider>
      <main className="grid-page min-h-dvh bg-body [--grid-column-gap:24px] [--grid-max:80rem]">
        <RfpFlow />
      </main>
    </ConfettiProvider>
  );
}
`.trim();
