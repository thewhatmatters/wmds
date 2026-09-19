import {
  pitchKitBrandClasses,
  pitchKitConnectionMetaClasses,
  pitchKitContentBandClasses,
  pitchKitContentClasses,
  pitchKitHeaderCopyClasses,
  pitchKitHeaderSectionClasses,
  pitchKitIdentityCopyClasses,
  pitchKitIdentityNameClasses,
  pitchKitIdentityNameplateClasses,
  pitchKitIdentityRowClasses,
  pitchKitIdentityTitleRowClasses,
  pitchKitPageClasses,
  pitchKitSectionEyebrowClasses,
  pitchKitSettingsBodyClasses,
  pitchKitSettingsCardClasses,
  pitchKitShareKitActionsClasses,
  pitchKitShareKitStackClasses,
  pitchKitSupportingClasses,
  pitchKitTopbarBandClasses,
  pitchKitTopbarClasses,
  pitchKitTopbarEndClasses,
} from "./pitchKitStyles";

/** Shared identity chrome — same strip on public nameplate and owner Settings. */
export const creatorIdentityStripCopySource = `
function CreatorIdentityStrip({ identity, nameAs = "h1", showProfessionalChip = false }) {
  const NameTag = nameAs;
  const avatarName = identity.displayName ?? identity.handle;
  const handleLabel = \`@\${identity.handle}\`;
  const followerLabel =
    identity.followersCount == null
      ? null
      : \`\${compactNumber.format(identity.followersCount)} followers\`;
  const meta = [handleLabel, followerLabel].filter(Boolean).join(" · ");
  const showTitleRow =
    identity.displayName != null ||
    (showProfessionalChip && identity.professionalAccount != null);

  return (
    <div className="${pitchKitIdentityRowClasses}">
      <Avatar
        name={avatarName}
        src={identity.profilePictureUrl}
        size="lg"
      />
      <div className="${pitchKitIdentityCopyClasses}">
        {showTitleRow ? (
          <div className="${pitchKitIdentityTitleRowClasses}">
            {identity.displayName != null ? (
              <NameTag className="${pitchKitIdentityNameClasses}">
                {identity.displayName}
              </NameTag>
            ) : null}
            {showProfessionalChip && identity.professionalAccount != null ? (
              <Chip readOnly size="sm">
                {identity.professionalAccount}
              </Chip>
            ) : null}
          </div>
        ) : null}
        <p className="${pitchKitSupportingClasses}">{meta}</p>
      </div>
    </div>
  );
}
`;

export const creatorIdentityPublicCopySource = `
import { Avatar, Chip } from "@whatmatters/wmds";

const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

${creatorIdentityStripCopySource}

export function CreatorIdentityPublicPage({ identity }) {
  return (
    <main className="${pitchKitPageClasses}">
      <div className="${pitchKitTopbarBandClasses}">
        <header className="${pitchKitTopbarClasses}">
          <span className="${pitchKitBrandClasses}">PitchKit</span>
        </header>
      </div>

      <div className="${pitchKitContentBandClasses}">
        <div className="${pitchKitContentClasses}">
          <section className="${pitchKitIdentityNameplateClasses}">
            <CreatorIdentityStrip
              identity={identity}
              nameAs="h1"
              showProfessionalChip
            />
          </section>
        </div>
      </div>
    </main>
  );
}
`;

export const creatorIdentityOwnerCopySource = `
import { Avatar, Badge, Button, Card, Chip, PageHeader, TextLink, Toaster, cardTitleClasses, toast } from "@whatmatters/wmds";
import { Copy } from "lucide-react";

const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

${creatorIdentityStripCopySource}

export function CreatorIdentityOwnerSettingsPage({ identity }) {
  const sharePath = \`/k/\${identity.handle}\`;

  function copyShareKitUrl() {
    void navigator.clipboard.writeText(sharePath);
    toast.add({
      title: "Kit URL copied",
      description: sharePath,
      tone: "success",
    });
  }

  return (
    <main className="${pitchKitPageClasses}">
      <div className="${pitchKitTopbarBandClasses}">
        <header className="${pitchKitTopbarClasses}">
          <span className="${pitchKitBrandClasses}">PitchKit</span>
          <span />
          <span className="${pitchKitTopbarEndClasses}">
            <Avatar
              name={identity.displayName ?? identity.handle}
              src={identity.profilePictureUrl}
              size="sm"
            />
          </span>
        </header>
      </div>

      <div className="${pitchKitContentBandClasses}">
        <div className="${pitchKitContentClasses}">
          <section className="${pitchKitHeaderSectionClasses}">
            <PageHeader variant="page" title="Settings" />
            <div className="${pitchKitHeaderCopyClasses}">
              <p className="${pitchKitSupportingClasses}">
                Instagram connection for this PitchKit.
              </p>
            </div>
          </section>

          <Card variant="outlined" shape="rounded" bodyTerminal className="${pitchKitSettingsCardClasses}">
            <Card.Header
              start={<h2 className={cardTitleClasses}>Connected Instagram</h2>}
              end={
                identity.connected ? (
                  <Badge variant="success" emphasis="muted" size="sm">
                    Connected
                  </Badge>
                ) : null
              }
            />
            <Card.Body>
              <div className="${pitchKitSettingsBodyClasses}">
                <CreatorIdentityStrip
                  identity={identity}
                  nameAs="p"
                  showProfessionalChip
                />
                <div className="${pitchKitShareKitStackClasses}">
                  <span className="${pitchKitSectionEyebrowClasses}">Share kit</span>
                  <div className="${pitchKitShareKitActionsClasses}">
                    <TextLink href={sharePath}>{sharePath}</TextLink>
                    <Button role="secondary" size="sm" icon={<Copy />} onClick={copyShareKitUrl}>
                      Copy
                    </Button>
                  </div>
                </div>
                {identity.lastSyncedLabel != null ? (
                  <p className="${pitchKitConnectionMetaClasses}">
                    Last synced {identity.lastSyncedLabel}
                  </p>
                ) : null}
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
      <Toaster position="bottom-right" />
    </main>
  );
}
`;
