import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { Copy } from "lucide-react";
import { Avatar } from "../../components/atoms/Avatar/Avatar";
import { Badge } from "../../components/atoms/Badge/Badge";
import { Button } from "../../components/atoms/Button/Button";
import { Skeleton } from "../../components/atoms/Skeleton/Skeleton";
import { TextLink } from "../../components/atoms/TextLink/TextLink";
import {
  Card,
  cardTitleClasses,
} from "../../components/molecules/Card/Card";
import { Chip } from "../../components/molecules/Chip/Chip";
import type { DisplayControlThemeMode } from "../../components/molecules/DisplayControls/DisplayControls";
import { PageHeader } from "../../components/molecules/PageHeader/PageHeader";
import { Toaster, toast } from "../../components/organisms/Toast/Toast";
import { GridOverlay } from "../../lib/GridOverlay";
import { ExampleGridControls } from "../ExampleGridControls/ExampleGridControls";
import {
  identityFromState,
  pitchKitCreatorIdentity,
  pitchKitHandleLabel,
  pitchKitShareKitPath,
  type PitchKitCreatorIdentity,
  type PitchKitCreatorIdentityState,
} from "./pitchKitData";
import {
  pitchKitBrandClasses,
  pitchKitConnectionMetaClasses,
  pitchKitContentBandClasses,
  pitchKitContentClasses,
  pitchKitHeaderCopyClasses,
  pitchKitHeaderSectionClasses,
  pitchKitIdentityAvatarSkeletonPx,
  pitchKitIdentityCopyClasses,
  pitchKitIdentityNameClasses,
  pitchKitIdentityNameplateClasses,
  pitchKitIdentityRowClasses,
  pitchKitIdentitySkeletonCopyClasses,
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

export interface PitchKitCreatorIdentityExampleProps {
  identityState?: PitchKitCreatorIdentityState;
  chrome?: "public" | "owner";
}

const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function CreatorIdentityStrip({
  identity,
  nameAs = "h1",
  showProfessionalChip = false,
}: {
  identity: PitchKitCreatorIdentity;
  nameAs?: "h1" | "p";
  showProfessionalChip?: boolean;
}) {
  const NameTag = nameAs;
  const avatarName = identity.displayName ?? identity.handle;
  const handleLabel = pitchKitHandleLabel(identity.handle);
  const followerLabel =
    identity.followersCount == null
      ? null
      : `${compactNumber.format(identity.followersCount)} followers`;
  const meta = [handleLabel, followerLabel].filter(Boolean).join(" · ");
  const showTitleRow =
    identity.displayName != null ||
    (showProfessionalChip && identity.professionalAccount != null);

  return (
    <div className={pitchKitIdentityRowClasses}>
      <Avatar
        name={avatarName}
        src={identity.profilePictureUrl}
        size="lg"
      />
      <div className={pitchKitIdentityCopyClasses}>
        {showTitleRow ? (
          <div className={pitchKitIdentityTitleRowClasses}>
            {identity.displayName != null ? (
              <NameTag className={pitchKitIdentityNameClasses}>
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
        <p className={pitchKitSupportingClasses}>{meta}</p>
      </div>
    </div>
  );
}

export function CreatorIdentityStripSkeleton() {
  return (
    <div className={pitchKitIdentityRowClasses} aria-hidden>
      <Skeleton
        width={pitchKitIdentityAvatarSkeletonPx}
        height={pitchKitIdentityAvatarSkeletonPx}
        radius="full"
        index={0}
      />
      <div className={pitchKitIdentitySkeletonCopyClasses}>
        <Skeleton width={168} height={20} radius="inner" index={1} />
        <Skeleton width={220} height={14} radius="inner" index={2} />
      </div>
    </div>
  );
}

function copyShareKitPath(handle: string) {
  const path = pitchKitShareKitPath(handle);
  void navigator.clipboard?.writeText(path).catch(() => undefined);
  toast.add({
    title: "Kit URL copied",
    description: path,
    tone: "success",
  });
}

function OwnerShareKit({ identity }: { identity: PitchKitCreatorIdentity }) {
  const path = pitchKitShareKitPath(identity.handle);

  return (
    <div className={pitchKitShareKitStackClasses}>
      <span className={pitchKitSectionEyebrowClasses}>Share kit</span>
      <div className={pitchKitShareKitActionsClasses}>
        <TextLink href={path}>{path}</TextLink>
        <Button
          role="secondary"
          size="sm"
          icon={<Copy />}
          onClick={() => copyShareKitPath(identity.handle)}
        >
          Copy
        </Button>
      </div>
    </div>
  );
}

function OwnerShareKitSkeleton() {
  return (
    <div className={pitchKitShareKitStackClasses} aria-hidden>
      <Skeleton width={72} height={10} radius="inner" index={3} />
      <div className={pitchKitShareKitActionsClasses}>
        <Skeleton width={140} height={16} radius="inner" index={4} />
        <Skeleton width={72} height={28} radius="full" index={5} />
      </div>
    </div>
  );
}

function PublicNameplate({
  identityState,
}: {
  identityState: PitchKitCreatorIdentityState;
}) {
  const identity = identityFromState(identityState);

  if (identity == null) {
    return (
      <section
        className={pitchKitIdentityNameplateClasses}
        aria-busy="true"
        aria-label="Loading creator identity"
      >
        <CreatorIdentityStripSkeleton />
      </section>
    );
  }

  return (
    <section className={pitchKitIdentityNameplateClasses}>
      <CreatorIdentityStrip
        identity={identity}
        nameAs="h1"
        showProfessionalChip
      />
    </section>
  );
}

function OwnerSettingsCard({
  identityState,
}: {
  identityState: PitchKitCreatorIdentityState;
}) {
  const identity = identityFromState(identityState);
  const loading = identity == null;

  return (
    <Card
      variant="outlined"
      shape="rounded"
      bodyTerminal
      className={pitchKitSettingsCardClasses}
      aria-busy={loading || undefined}
      aria-label={loading ? "Loading connected Instagram" : undefined}
    >
      <Card.Header
        start={<h2 className={cardTitleClasses}>Connected Instagram</h2>}
        end={
          loading ? (
            <Skeleton width={88} height={28} radius="full" index={6} />
          ) : identity.connected ? (
            <Badge variant="success" emphasis="muted" size="sm">
              Connected
            </Badge>
          ) : null
        }
      />
      <Card.Body>
        <div className={pitchKitSettingsBodyClasses}>
          {loading ? (
            <>
              <CreatorIdentityStripSkeleton />
              <OwnerShareKitSkeleton />
              <Skeleton width={200} height={12} radius="inner" index={7} />
            </>
          ) : (
            <>
              <CreatorIdentityStrip
                identity={identity}
                nameAs="p"
                showProfessionalChip
              />
              <OwnerShareKit identity={identity} />
              {identity.lastSyncedLabel != null ? (
                <p className={pitchKitConnectionMetaClasses}>
                  Last synced {identity.lastSyncedLabel}
                </p>
              ) : null}
            </>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export function IdentityExampleShell({
  topbarEnd,
  children,
}: {
  topbarEnd?: ReactNode;
  children: ReactNode;
}) {
  const [gridVisible, setGridVisible] = useState(false);
  const [theme, setTheme] = useState<DisplayControlThemeMode>("auto");
  const [gridMax, setGridMax] = useState(1140);
  const [columnGap, setColumnGap] = useState(8);
  const pageStyle = useMemo(
    () =>
      ({
        "--grid-max": `${gridMax}px`,
        "--grid-column-gap": `${columnGap}px`,
      }) as CSSProperties,
    [columnGap, gridMax],
  );

  useEffect(() => {
    const root = document.documentElement;
    const previousTheme = root.getAttribute("data-theme");
    if (theme === "auto") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", theme);
    }
    return () => {
      if (previousTheme == null) root.removeAttribute("data-theme");
      else root.setAttribute("data-theme", previousTheme);
    };
  }, [theme]);

  return (
    <main
      data-theme={theme === "auto" ? undefined : theme}
      className={pitchKitPageClasses}
      style={pageStyle}
    >
      <GridOverlay
        visible={gridVisible}
        onVisibleChange={setGridVisible}
        keyboardShortcut={false}
      />

      <div className={pitchKitTopbarBandClasses}>
        <header className={pitchKitTopbarClasses}>
          <span className={pitchKitBrandClasses}>PitchKit</span>
          {topbarEnd}
        </header>
      </div>

      <div className={pitchKitContentBandClasses}>
        <div className={pitchKitContentClasses}>{children}</div>
      </div>

      <ExampleGridControls
        gridVisible={gridVisible}
        onGridVisibleChange={setGridVisible}
        theme={theme}
        onThemeChange={setTheme}
        maxWidth={gridMax}
        onMaxWidthChange={setGridMax}
        columnGap={columnGap}
        onColumnGapChange={setColumnGap}
        defaultMaxWidth={1140}
        defaultColumnGap={8}
      />
    </main>
  );
}

export function PitchKitCreatorIdentityPublicExample({
  identityState = "resolved",
}: PitchKitCreatorIdentityExampleProps) {
  return (
    <IdentityExampleShell>
      <PublicNameplate identityState={identityState} />
    </IdentityExampleShell>
  );
}

export function PitchKitCreatorIdentityExample({
  identityState = "resolved",
  chrome = "public",
}: PitchKitCreatorIdentityExampleProps) {
  return chrome === "owner" ? (
    <PitchKitCreatorIdentityOwnerExample identityState={identityState} />
  ) : (
    <PitchKitCreatorIdentityPublicExample identityState={identityState} />
  );
}

export function PitchKitCreatorIdentityOwnerExample({
  identityState = "resolved",
}: PitchKitCreatorIdentityExampleProps) {
  const identity = identityFromState(identityState);
  const topbarName = identity?.displayName ?? pitchKitCreatorIdentity.handle;

  return (
    <IdentityExampleShell
      topbarEnd={
        <>
          <span />
          <span className={pitchKitTopbarEndClasses}>
            <Avatar
              name={topbarName}
              src={identity?.profilePictureUrl}
              size="md"
            />
          </span>
        </>
      }
    >
      <section className={pitchKitHeaderSectionClasses}>
        <PageHeader variant="page" title="Settings" />
        <div className={pitchKitHeaderCopyClasses}>
          <p className={pitchKitSupportingClasses}>
            Instagram connection for this PitchKit.
          </p>
        </div>
      </section>
      <OwnerSettingsCard identityState={identityState} />
      <Toaster position="bottom-right" />
    </IdentityExampleShell>
  );
}
