import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Avatar } from "../../components/atoms/Avatar/Avatar";
import { Badge } from "../../components/atoms/Badge/Badge";
import { Button } from "../../components/atoms/Button/Button";
import { TextLink } from "../../components/atoms/TextLink/TextLink";
import {
  Card,
  cardTitleClasses,
} from "../../components/molecules/Card/Card";
import { Chip } from "../../components/molecules/Chip/Chip";
import type { DisplayControlThemeMode } from "../../components/molecules/DisplayControls/DisplayControls";
import { Stat } from "../../components/molecules/Stat/Stat";
import { GridOverlay } from "../../lib/GridOverlay";
import { ExampleGridControls } from "../ExampleGridControls/ExampleGridControls";
import {
  pitchKitBrands,
  pitchKitContact,
  pitchKitCreator,
  pitchKitSelectedPosts,
  pitchKitSummary,
  type PitchKitBrand,
  type PitchKitPost,
} from "./pitchKitData";
import {
  pitchKitBrandBodyClasses,
  pitchKitBrandClasses,
  pitchKitCalloutActionsClasses,
  pitchKitCalloutBodyClasses,
  pitchKitCalloutCardClasses,
  pitchKitContactCardClasses,
  pitchKitContactRowClasses,
  pitchKitContactRowsClasses,
  pitchKitContentBandClasses,
  pitchKitContentClasses,
  pitchKitIdentityCopyClasses,
  pitchKitIdentityNameClasses,
  pitchKitIdentityRowClasses,
  pitchKitIdentitySectionClasses,
  pitchKitIdentityTitleRowClasses,
  pitchKitKitPostMetricsClasses,
  pitchKitKitStatClasses,
  pitchKitPageClasses,
  pitchKitPostCardClasses,
  pitchKitPostImageClasses,
  pitchKitPostMetricClasses,
  pitchKitPostMetricLabelClasses,
  pitchKitPostMetricValueClasses,
  pitchKitPostsHeaderClasses,
  pitchKitPostsPanelClasses,
  pitchKitPostsSectionClasses,
  pitchKitSectionEyebrowClasses,
  pitchKitStatsBandClasses,
  pitchKitSupportingClasses,
  pitchKitTopbarBandClasses,
  pitchKitTopbarClasses,
} from "./pitchKitStyles";

const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export interface ShareablePitchKitProps {
  posts?: readonly PitchKitPost[];
  contact?: typeof pitchKitContact;
  brands?: readonly PitchKitBrand[];
  /**
   * Unsigned visitor who is not the kit owner.
   * Omit for the kit owner and for signed-in viewers of someone else's kit.
   */
  showCreateBand?: boolean;
}

export function PublicCreatePitchkitBand() {
  return (
    <Card
      variant="outlined"
      shape="rounded"
      bodyTerminal
      className={pitchKitCalloutCardClasses}
    >
      <Card.Header
        start={<h2 className={cardTitleClasses}>Create your Pitchkit</h2>}
      />
      <Card.Body>
        <div className={pitchKitCalloutBodyClasses}>
          <p className={pitchKitSupportingClasses}>
            Turn your Instagram into a shareable media kit.
          </p>
          <div className={pitchKitCalloutActionsClasses}>
            <Button role="primary">Continue with Instagram</Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export function ShareablePitchKit({
  posts = pitchKitSelectedPosts,
  contact = pitchKitContact,
  brands = pitchKitBrands,
  showCreateBand = true,
}: ShareablePitchKitProps) {
  return (
    <>
      <section className={pitchKitIdentitySectionClasses}>
        <div className={pitchKitIdentityRowClasses}>
          <Avatar name={pitchKitCreator.name} size="lg" />
          <div className={pitchKitIdentityCopyClasses}>
            <div className={pitchKitIdentityTitleRowClasses}>
              <h1 className={pitchKitIdentityNameClasses}>{pitchKitCreator.name}</h1>
              <Badge variant="success" emphasis="muted" size="sm">
                Verified
              </Badge>
              <Chip readOnly size="sm">
                {pitchKitCreator.platform}
              </Chip>
            </div>
            <p className={pitchKitSupportingClasses}>{pitchKitCreator.handle}</p>
          </div>
        </div>
      </section>

      <div
        role="group"
        aria-label="Verified Instagram summary"
        className={pitchKitStatsBandClasses}
      >
        <Stat
          className={pitchKitKitStatClasses}
          label="Followers"
          value={pitchKitSummary.followers}
        />
        <Stat
          className={pitchKitKitStatClasses}
          label="Engagement rate"
          value={pitchKitSummary.engagementRate}
        />
      </div>

      <section className={pitchKitPostsSectionClasses}>
        <div className={pitchKitPostsHeaderClasses}>
          <div>
            <h2 className={cardTitleClasses}>Selected posts</h2>
            <p className={pitchKitSupportingClasses}>
              Proof from the current Instagram set.
            </p>
          </div>
        </div>
        <div className={pitchKitPostsPanelClasses}>
          {posts.map((post) => (
            <Card
              key={post.id}
              variant="outlined"
              shape="rounded"
              className={pitchKitPostCardClasses}
            >
              <Card.Body>
                <img
                  className={pitchKitPostImageClasses}
                  src={post.imageUrl}
                  alt={post.imageAlt}
                />
              </Card.Body>
              <Card.Footer>
                <div className={pitchKitKitPostMetricsClasses}>
                  {[
                    ["Likes", post.likes],
                    ["Comments", post.comments],
                  ].map(([label, value]) => (
                    <span key={label} className={pitchKitPostMetricClasses}>
                      <span className={pitchKitPostMetricLabelClasses}>{label}</span>
                      <span className={pitchKitPostMetricValueClasses}>
                        {compactNumber.format(value as number)}
                      </span>
                    </span>
                  ))}
                </div>
              </Card.Footer>
            </Card>
          ))}
        </div>
      </section>

      <section className={pitchKitPostsSectionClasses}>
        <div className={pitchKitPostsHeaderClasses}>
          <div>
            <h2 className={cardTitleClasses}>Contact</h2>
            <p className={pitchKitSupportingClasses}>
              Creator-entered details for brand outreach.
            </p>
          </div>
        </div>
        <Card
          variant="outlined"
          padding="md"
          shape="rounded"
          className={pitchKitContactCardClasses}
        >
          <div className={pitchKitContactRowsClasses}>
            <div className={pitchKitContactRowClasses}>
              <span className={pitchKitSectionEyebrowClasses}>Email</span>
              <TextLink href={`mailto:${contact.email}`}>{contact.email}</TextLink>
            </div>
            <div className={pitchKitContactRowClasses}>
              <span className={pitchKitSectionEyebrowClasses}>Website</span>
              <TextLink href={contact.websiteHref} external>
                {contact.websiteLabel}
              </TextLink>
            </div>
            <div className={pitchKitContactRowClasses}>
              <span className={pitchKitSectionEyebrowClasses}>Location</span>
              <span className={pitchKitSupportingClasses}>{contact.location}</span>
            </div>
          </div>
        </Card>
      </section>

      <section className={pitchKitPostsSectionClasses}>
        <div className={pitchKitPostsHeaderClasses}>
          <div>
            <h2 className={cardTitleClasses}>Past brands</h2>
            <p className={pitchKitSupportingClasses}>
              Campaigns already shipped with this creator.
            </p>
          </div>
        </div>
        <div className={pitchKitPostsPanelClasses}>
          {brands.map((brand) => (
            <Card
              key={brand.id}
              variant="outlined"
              shape="rounded"
              className={pitchKitPostCardClasses}
            >
              <Card.Header
                start={<h3 className={cardTitleClasses}>{brand.name}</h3>}
                end={
                  <Badge variant="neutral" emphasis="muted" size="sm">
                    {brand.year}
                  </Badge>
                }
              />
              <Card.Body>
                <p className={pitchKitBrandBodyClasses}>{brand.summary}</p>
              </Card.Body>
            </Card>
          ))}
        </div>
      </section>

      {showCreateBand ? <PublicCreatePitchkitBand /> : null}
    </>
  );
}

export function PitchKitShareableExample() {
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
        </header>
      </div>

      <div className={pitchKitContentBandClasses}>
        <div className={pitchKitContentClasses}>
          <ShareablePitchKit />
        </div>
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
