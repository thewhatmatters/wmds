import {
  Card,
  cardLayoutBodyOccupantInsetXClasses,
  cardLayoutBodyOccupantPadYClasses,
  cardTitleClasses,
} from "../../components/molecules/Card/Card";
import { typographyClass } from "../../lib/typography";

const settingsSectionCopy: Record<string, { title: string; body: string }> = {
  profile: {
    title: "Profile",
    body: "Name, avatar, and public creator details.",
  },
  notifications: {
    title: "Notifications",
    body: "Email, push, and in-app alert preferences.",
  },
  security: {
    title: "Security",
    body: "Password, sessions, and two-factor authentication.",
  },
  general: {
    title: "General",
    body: "Workspace name, locale, and default views.",
  },
  members: {
    title: "Members",
    body: "Invite collaborators and manage roles.",
  },
  billing: {
    title: "Billing",
    body: "Plan, payment method, and invoices.",
  },
  connected: {
    title: "Connected apps",
    body: "OAuth integrations and linked platforms.",
  },
  api: {
    title: "API keys",
    body: "Create and rotate programmatic access tokens.",
  },
};

export interface SettingsPageProps {
  activeSection: string;
}

export function SettingsPage({ activeSection }: SettingsPageProps) {
  const copy = settingsSectionCopy[activeSection] ?? settingsSectionCopy.profile;

  return (
    <Card padding="none" bodyTerminal>
      <Card.Header start={<h2 className={cardTitleClasses}>{copy.title}</h2>} />
      <Card.Body>
        <div
          className={`${cardLayoutBodyOccupantInsetXClasses} ${cardLayoutBodyOccupantPadYClasses}`}
        >
          <p className={`${typographyClass("body")} text-muted`}>{copy.body}</p>
        </div>
      </Card.Body>
    </Card>
  );
}
