import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  storyMetaDocsDefaults,
  withStoryCopySource,
} from "../../lib/storyCopySource";
import {
  PitchKitInsightsExample,
  PitchKitOwnerExample,
  type PitchKitDataState,
  type PitchKitLoadingPhase,
} from "./PitchKitExample";
import {
  creatorInsightsLoadingPageCopySource,
  creatorInsightsPageCopySource,
  insufficientAudiencePageCopySource,
  insufficientReachAndAudiencePageCopySource,
  insufficientReachPageCopySource,
} from "./insightsCopySource";
import { ownerPitchKitPageCopySource } from "./ownerPitchKitCopySource";
import { PitchKitShareableExample } from "./PitchKitShareable";
import { shareablePitchKitPageCopySource } from "./shareablePitchKitCopySource";

const dataStates = [
  "resolved",
  "unavailable",
  "insufficientReach",
  "insufficientAudience",
  "insufficientReachAndAudience",
  "loading",
] as const satisfies readonly PitchKitDataState[];
const loadingPhases = [
  "skeleton",
  "retrieving",
] as const satisfies readonly PitchKitLoadingPhase[];

const meta = {
  title: "Examples/PitchKit",
  component: PitchKitInsightsExample,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  argTypes: {
    dataState: {
      control: "select",
      options: dataStates,
    },
    loadingPhase: {
      control: "select",
      options: loadingPhases,
      table: { disable: true },
    },
  },
  args: {
    dataState: "resolved",
    loadingPhase: "skeleton",
  },
  parameters: {
    wmdsLayout: "fullscreen",
    docs: {
      description: {
        component: `
## Usage

Authenticated PitchKit at a frozen 1140px grid maximum. The single top-level **SegmentedControl** switches between owner **Insights** and owner **PitchKit**.

Identity is one shared strip composed into two surrounding chromes — copy these before kit body or Insights:

1. **Pattern — creator identity (public)** — \`/k/[handle]\` brand nameplate (avatar, Graph name when present, frozen @handle, follower context, optional professional **Chip**).
2. **Pattern — creator identity (owner settings)** — Settings → **Connected Instagram** card (same strip + professional **Chip** + Share kit \`/k/[handle]\` + Copy + connected / last sync).
3. **Pattern — account settings (owner)** — topbar **Avatar** \`md\` opens a **Dropdown** titled **My account**. Items: **Account settings** / **Share kit**, then **Sign out** / **Disconnect** / **Delete** last. Account settings opens **Dialog** (Connected Instagram only). Delete confirms with **AlertDialog** “Delete your Pitchkit account?”. Footer is **Privacy** + **Support** only — not delete.

Then copy **Pattern — creator Insights** for the authenticated owner dashboard (Recent proof is read-only), **Pattern — owner PitchKit** for the authenticated PitchKit tab (**Your Pitchkit** / **Edit what brands see**, Graph KPIs + hide/restore on selected posts), **Pattern — shareable PitchKit** for the public kit **body**, and **Pattern — theme picker (owner)** for a Settings/account Theme surface (Light | Dark | Soft + **Save theme**). Theme is not PitchKit tab chrome. Do not lift kit Stats, charts, bio, website, rates, geo, or contact onto the identity Patterns.

**Show code** on each **Pattern** story is the product contract — a literal freeze of that canvas (layout, chrome, spacing, typography). Copy that source into PitchKit. Do not reconstruct the page from Storybook-only \`PitchKitExample\` / \`PitchKitOwner\` / \`PitchKitShareable\` / \`PitchKitCreatorIdentity\` / \`pitchKitStyles\`, and do not ship **ExampleGridControls**.

The Insights dashboard answers four questions in order:

1. **Scale and response** — **Stat** tiles on the page subgrid for followers, labeled engagement rate, typical reach, and saves.
2. **Consistency** — one 30-day **Chart.Cartesian** comparing typical and daily reach, including visible spikes.
3. **Audience fit** — **Chart.RankedBars** for Graph-supplied country, city, age, and gender percentages.
4. **Proof** — six recent **Card** items with secondary **Tab** ranking by reach, engagement (likes + comments), or saves. Read-only — no Manage kebab, Swap, Hide, or undo.

The public kit answers these questions in order on **Pattern — shareable PitchKit** (do not fork a second public kit):

1. **Who** — **CreatorIdentityStrip** / public nameplate. Unlocked Graph / derived fields only: **Avatar** (\`profile_picture_url\`), Graph \`name\` (hide if missing), frozen @handle, \`followers_count\` as supporting context (not a hero **Stat**), optional professional **Chip** (Business / Creator). Optional Pitchkit-owned \`intro\` sits under that nameplate — copy **Pattern — intro (public)**. Omit the intro block when empty. Never treat \`intro\` as Instagram biography.
2. **Scale** — Graph-only **Stat** tiles: Followers · Engagement rate (**hide if no reach**) · Typical reach · Typical saves. Same figures as Insights; no owner trends. Compact 30-day **Chart.Cartesian** reuses the Insights reach Pattern (keep the Reach **Card** + empty well when the series cannot be plotted). **Top 3 countries** only (**Chart.RankedBars**); omit the band when Graph has no country series. Do not invent EXAMPLE %, impressions, heatmaps, or metrics beyond this list.
3. **Selected posts** — the current Instagram proof set as **Card** images with likes and comments only, cap **6**.
4. **Outreach** — creator-entered **Contact** (**TextLink** for email and website) and **Past brands**. Public Past brands copy **Pattern — past brands (public)** — ordered \`{ id, name, logo_key?, result_label? }\`, letter **Avatar** when \`logo_key\` is missing or unknown, **Chip** only when \`result_label\` is non-empty after trim. Static row when the set fits; marquee only on overflow (pause on hover/focus; reduced motion wraps). Omit the section when empty. Do not invent year, summary, Graph results, or scraped logos.
5. **Unsigned conversion** — when the visitor is not the kit owner and is not signed in: **Create your Pitchkit** band + one **Continue with Instagram** Button. Omit the band for the owner and for signed-in viewers of someone else's kit (\`showCreateBand={false}\`).
6. **Theme** — owner picks Light | Dark | Soft on **Pattern — theme picker (owner)** (Settings/account surface — not the PitchKit tab). The kit body sits on this same page (no nested preview frame or inner PitchKit wordmark) and stays 1:1 with the public kit. **Save theme** persists the draft (fixtures until persist lands). Do not auto-save on pick.

The authenticated owner kit answers the same questions, with Graph identity and hide/restore:

1. **Header** — **Your Pitchkit** / **Edit what brands see**.
2. **Who** — **CreatorIdentityStrip** on **Pattern — owner PitchKit** (same Graph fields as the creator-identity Patterns). Display-only \`intro\` copies **Pattern — intro (public)** (omit if empty). Owner \`intro\` edit stays on **Pattern — intro (owner)**.
3. **Scale** — Graph-only **Stat** tiles: Followers · Engagement rate (**hide if no reach**) · Typical reach · Typical saves. Full-width compact 30-day reach + top 3 countries — same composition as **Pattern — shareable PitchKit**.
4. **Selected posts** — the same proof cards, plus **MoreMenu** hide/restore (**AlertDialog** + Undo toast). No swap-post on this surface.
5. **Outreach** — display-only **Contact** on **Pattern — owner PitchKit**. Past brands display copies **Pattern — past brands (public)**. Add / edit / reorder copies **Pattern — past brands (owner)** — max 8, **Brand name** ~40, optional **Result** (max 24) and curated \`logo_key\`, drag or up/down, **MoreMenu** in **Card.Header** \`end\`. Owner empty: **Add brands you've worked with**.

## Data contract

- Engagement rate is exactly **(likes + comments) ÷ followers**.
- Missing values render as em dashes, never invented zero. Honest \`0\` only when Graph returned zero. Do not invent example percentages for missing demographics.
- **Unavailable** — Graph omitted optional chart, audience, and post regions. Copy **State — Graph data unavailable**: required **Stat** tiles stay empty (em dash); omit those optional bands. Do not invent a chart.
- **Insufficient reach** — The **reach series** cannot be plotted (missing, too thin, or all-zero — no usable reach to chart). Audience, Stats, and proof may still show. This is not whole-page Graph unavailable. Copy **State — insufficient reach data**: keep the Reach **Card** in the dashboard grid with the same header; **Card.Body** is the empty Pattern (muted **Badge** “No data” → title → body). Do not hide the band, do not draw zeros, and do not invent an empty chart.
- **In-series reach gaps** — some days in an otherwise plottable series are \`null\`. Copy **Components/Data display/Chart → Pattern — Cartesian no-data gaps** (ADR-0027). That hatch is not the Reach empty body and not **Chart.Loading**.
- **Insufficient audience** — Graph returned Insights, but demographic series are missing or empty (no country, city, age, or gender breakdown to rank). Reach, Stats, and proof may still show. Copy **State — insufficient audience data**: keep the Audience **Card** in the dashboard grid with the same header (“Audience fit” / supporting copy); **Card.Body** is the empty Pattern (same **Badge** stack). Do not hide the band, do not invent example %, and do not draw **Chart.RankedBars** from an empty series.
- **Insufficient reach and audience** — both series are unusable. Keep both Cards. Copy **State — insufficient reach and audience data** (or each empty Pattern). Never omit a chart/card band because Graph has no series.
- **Loading** — Graph connect/refresh is in flight. Copy **Pattern — creator Insights (loading)** for the initial skeleton screen (**Stat** \`loading\`, **Skeleton** wells that mirror resolved chrome, proof placeholders). If chrome is already up and a fetch is in flight, keep **Card.Header** mounted and swap the well for **Chart.Loading**. Do not use the unavailable Pattern, insufficient-data empties, or zeros as loading. Controls → **Loading phase** on that story previews skeleton vs retrieving; Show code freezes the skeleton page.
- Creator-entered contact, Pitchkit-owned \`intro\`, and past-brand content belong on the kit (public and owner), not Insights. \`intro\` extends the identity nameplate — copy **Pattern — intro (owner)** / **Pattern — intro (public)**. Past brands editing copies **Pattern — past brands (owner)**; public show/omit copies **Pattern — past brands (public)**. Owner kit **Contact** stays display-only on **Pattern — owner PitchKit**.
- \`intro\` is a Pitchkit-owned string (not Instagram biography). Soft **160** / hard **280**. Owner label **Intro**; helper **Shown on your Pitchkit. This is not your Instagram bio.**; placeholder **What you create and who you create it for**. Owner empty: ghost **Add an intro**. Public empty: omit the block.
- Past brands items are ordered \`{ id, name, logo_key?, result_label? }\` — \`name\` required, max **8**, **Brand name** max ~**40**. Missing or unknown \`logo_key\` uses a letter **Avatar**; curated keys use a WMDS knockout mark (not creator upload, not scraped SVGs). \`result_label\` is a creator-entered phrase (max **24**); empty/whitespace omits the **Chip** — never an empty slot, em dash, or public Add result. Disallow URLs, @handles, emoji spam, and multiline. No year, summary, or Graph KPIs.
- Identity fails closed: hide Graph \`name\` when missing; **Avatar** falls back when \`profile_picture_url\` is omitted; omit follower context when \`followers_count\` is omitted. Never invent a bio, website, or display name.
- Owner connection state (Connected / last sync) belongs on **Pattern — creator identity (owner settings)** and **Pattern — account settings (owner)** Dialog. Share kit Copy is the Avatar menu item and the Connected Instagram card on owner settings.
- Account settings belong on **Pattern — account settings (owner)** — Avatar → **Dropdown** (**My account**) → Account settings **Dialog** (Connected Instagram) and Delete **AlertDialog**. Footer is Privacy + Support only.
- The public kit has no owner edit toggle, **MoreMenu**, hide, or swap controls.
- Insights Recent proof is read-only. Owner PitchKit post edit affordance is hide/restore on selected posts only. Intro and Past brands editors live on **Pattern — intro (owner)** and **Pattern — past brands (owner)** — not bio, website, rates, geo, contact, or section-visibility editors.
- Public kit theme is \`light\` | \`dark\` | \`soft\`, default \`light\`. Copy **Pattern — theme picker (owner)** as a Settings/account surface — not PitchKit tab chrome. Pick updates the in-page kit only; **Save theme** applies the fixture. Soft remaps the same semantic color roles to a warmer paper floor (\`[data-theme="soft"]\`). Do not nest a preview frame or a second PitchKit wordmark.
- No rates editors, Stories, logo scraping, always-on marquees, donuts, online heatmap, impressions, EXAMPLE %, or second Instagram connection path. Past brands marquee only when the public rail overflows.
- The authenticated PitchKit tab is **Pattern — owner PitchKit**, not a Coming soon placeholder and not the theme picker.

## Component map

- Page layout — \`grid-page\`, \`band\`, \`--grid-max:1140px\`, \`--grid-column-gap:8px\`
- Creator identity — shared strip (**Avatar** \`lg\`, Graph name, @handle, follower context, optional **Chip**); public nameplate vs owner **Card** + **PageHeader** Settings; optional \`intro\` under the nameplate (**TextArea** on owner, omit on public when empty)
- Owner chrome — **SegmentedControl** + **Avatar** \`md\` on Insights and owner PitchKit; Settings / Theme keep the PitchKit wordmark + **Avatar**; **Avatar** opens **Dropdown** (**My account**); public kit keeps the PitchKit wordmark only
- Page and card chrome — **PageHeader**, **Card**, **Badge**, **Avatar**, **Button**, **Chip**, **TextLink**
- Metrics and charts — **Stat**, **Chart.Cartesian**, **Chart.Legend**, **Chart.RankedBars**; public and owner kits use the same reach empty contract at a compact height; loading uses **Stat** \`loading\`, **Skeleton**, and **Chart.Loading**
- Kit theme — **SegmentedControl** Light | Dark | Soft + **Save theme** **Button** on **Pattern — theme picker (owner)** (Settings surface); in-page kit body composes **Pattern — shareable PitchKit** (no nested preview frame)
- Proof ranking — **Tab.Group** + **Tab** on Insights only; one selected metric reorders the same supplied posts
- Post management — **MoreMenu** with **ButtonIcon** on owner PitchKit selected posts only; **AlertDialog** confirms hiding a post
- Public outreach — **TextLink** contact rows; past-brand rail (\`name\` + letter **Avatar** or curated knockout mark + optional result **Chip**; static row or overflow marquee); unsigned **Create your Pitchkit** band on **Pattern — shareable PitchKit**
- Account menu — **Dropdown.Menu** / **Dropdown.Item**; Account settings **Dialog**; **AlertDialog** \`confirmRole="destructive"\` for Delete
- Intro editor — **TextArea** / ghost **Button** on **Pattern — intro (owner)**
- Past brands editor — **Dialog** + **Input** **Brand name** / optional **Result** + **Select** curated **Logo** + **MoreMenu** + up/down **IconButton** on **Pattern — past brands (owner)**
- Footer — centered **Privacy** + **Support** **TextLink** on owner Insights / PitchKit / Settings / Theme shells
- Outcome feedback — **Toaster** + **toast**; Undo restores a hidden owner-kit post; Share kit copies \`/k/[handle]\`
- Storybook development only — **ExampleGridControls** + **GridOverlay**

## Best practices

- **Do** treat **Show code** as the implementation contract; re-copy it when the canvas changes.
- **Do** preserve the visual difference between typical performance and a spike.
- **Do** keep hide/restore on owner PitchKit selected posts — never on Insights Recent proof or the public kit.
- **Do** confirm owner-kit post visibility changes with **AlertDialog** before mutating the selected set.
- **Do** pair the completed hide mutation with an actionable Undo toast.
- **Do** use **Tab** for Insights proof ranking because the page already uses one primary **SegmentedControl**.
- **Do** freeze approved grid values into implementation code.
- **Do** copy **Pattern — creator identity (public)** for the \`/k/[handle]\` header and **Pattern — creator identity (owner settings)** for Settings → Connected Instagram.
- **Do** copy **Pattern — account settings (owner)** for Avatar → **My account** **Dropdown**, Account settings **Dialog**, and Delete account **AlertDialog**. Footer is Privacy + Support only.
- **Do** copy **Pattern — intro (public)** / **Pattern — intro (owner)** for the Pitchkit-owned \`intro\` under the nameplate.
- **Do** copy **Pattern — past brands (public)** / **Pattern — past brands (owner)** for \`{ id, name, logo_key?, result_label? }\` proof — not the older campaign-card fields.
- **Do** copy **Pattern — shareable PitchKit** for the public kit body (Graph KPIs, compact reach, top 3 countries, ≤6 posts, intro / past brands omit-if-empty, unsigned **Create your Pitchkit** band). **Pattern — theme picker (owner)** for Light | Dark | Soft + **Save theme** on a Settings surface. **Pattern — owner PitchKit** for the authenticated PitchKit tab, and **Pattern — creator Insights** for the owner Insights app. Do not fork a second public-kit Pattern.
- **Do** keep the Reach band when the reach series cannot be plotted — same shell and header, empty **Card.Body** (muted **Badge** “No data” → title → body). Audience, Stats, and proof may still show.
- **Do** keep the Audience band when demographics cannot be ranked — same shell and header, empty **Card.Body** (same **Badge** stack). Reach, Stats, and proof may still show.
- **Do** copy **Pattern — creator Insights (loading)** for in-flight Graph; use **Skeleton** for the first layout and **Chart.Loading** only after chrome is up.
- **Don't** copy **ExampleGridControls** into PitchKit production UI.
- **Don't** put Instagram biography, website, rates, geo, contact CTAs, heatmaps, example percentages, or kit **Stat** / chart tiles on the identity Patterns. \`intro\` is Pitchkit-owned and lives on the intro Patterns only.
- **Don't** expose owner edit state or management controls on the public kit or Insights Recent proof.
- **Don't** put Share kit on the Insights **PageHeader**, and do not put Delete in the app footer.
- **Don't** invent bio, rates, website, impressions, EXAMPLE %, or KPI metrics beyond Followers / Engagement rate / Typical reach / Typical saves on the public kit, owner PitchKit, Account settings, or the public CTA band.
- **Don't** auto-save the kit theme on pick — **Save theme** is required.
- **Don't** put theme Light | Dark | Soft on the PitchKit tab — that surface is **Pattern — owner PitchKit**.
- **Don't** hide the Reach card when the reach series cannot be plotted, and do not use **Skeleton** or **Chart.Loading** for that empty.
- **Don't** hide the Audience card when Graph has no demographic series, invent example percentages, or use **Skeleton** / **Chart.Loading** for that empty.
- **Don't** treat Graph-unavailable (omit optional regions), insufficient-data empties, or zeros as the loading page.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof PitchKitInsightsExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CreatorInsights: Story = {
  name: "Pattern — creator Insights",
  render: (args) => <PitchKitInsightsExample {...args} />,
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Show code is the product contract — a literal freeze of this canvas (layout, chrome, spacing, typography). Recent proof is read-only. Share kit lives on the Avatar menu, not the Insights PageHeader. Copy that source into PitchKit. Do not reconstruct from PitchKitExample / pitchKitStyles, and do not ship ExampleGridControls.",
        },
      },
    },
    creatorInsightsPageCopySource,
  ),
};

export const GraphDataUnavailable: Story = {
  name: "State — Graph data unavailable",
  args: {
    dataState: "unavailable",
  },
  render: (args) => <PitchKitInsightsExample {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          "Required metrics remain explicitly empty. Optional chart, audience, and post regions are absent because Graph did not return them. This is not insufficient reach or insufficient audience — those keep the Reach or Audience band with an empty body.",
      },
    },
  },
};

export const InsufficientReachData: Story = {
  name: "State — insufficient reach data",
  args: {
    dataState: "insufficientReach",
  },
  render: (args) => <PitchKitInsightsExample {...args} />,
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Show code is the product contract when the reach series cannot be plotted — missing, too thin, or all-zero (no usable reach to chart). Audience, Stats, and proof may still show. This is not whole-page Graph unavailable. Keep the Reach Card in the Insights dashboard grid with the same header; the well is the empty Pattern (muted Badge “No data” → title → body). Do not hide the band, do not use Skeleton or Chart.Loading, and do not invent an empty chart. Copy that source into PitchKit. Do not reconstruct from PitchKitExample / pitchKitStyles, and do not ship ExampleGridControls.",
        },
      },
    },
    insufficientReachPageCopySource,
  ),
};

export const InsufficientAudienceData: Story = {
  name: "State — insufficient audience data",
  args: {
    dataState: "insufficientAudience",
  },
  render: (args) => <PitchKitInsightsExample {...args} />,
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Show code is the product contract when Graph returned Insights but demographic series are missing or empty — no country, city, age, or gender breakdown to rank. Reach, Stats, and proof may still show. This is not whole-page Graph unavailable. Keep the Audience Card in the Insights dashboard grid with the same header; the well is the empty Pattern (muted Badge “No data” → title → body). Do not hide the band, do not invent example percentages, do not use Skeleton or Chart.Loading, and do not draw RankedBars from an empty series. Honest 0 only when Graph returned zero. Copy that source into PitchKit. Do not reconstruct from PitchKitExample / pitchKitStyles, and do not ship ExampleGridControls.",
        },
      },
    },
    insufficientAudiencePageCopySource,
  ),
};

export const InsufficientReachAndAudienceData: Story = {
  name: "State — insufficient reach and audience data",
  args: {
    dataState: "insufficientReachAndAudience",
  },
  render: (args) => <PitchKitInsightsExample {...args} />,
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Show code is the product contract when both the reach series and demographic series are unusable. Keep both Cards in the Insights dashboard grid with the same headers; each well is that band’s empty Pattern (muted Badge “No data” → title → body). Do not omit either band, do not invent a chart or example percentages, and do not use Skeleton or Chart.Loading for these empties. Copy that source into PitchKit. Do not reconstruct from PitchKitExample / pitchKitStyles, and do not ship ExampleGridControls.",
        },
      },
    },
    insufficientReachAndAudiencePageCopySource,
  ),
};

export const CreatorInsightsLoading: Story = {
  name: "Pattern — creator Insights (loading)",
  args: {
    dataState: "loading",
    loadingPhase: "skeleton",
  },
  argTypes: {
    loadingPhase: {
      control: "select",
      options: loadingPhases,
      table: { disable: false },
    },
  },
  render: (args) => <PitchKitInsightsExample {...args} />,
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Show code is the product contract for owner Insights while Graph connect/refresh is in flight — a literal freeze of the initial skeleton canvas (layout, chrome, spacing, typography). Stat tiles use loading. Reach and Audience Cards keep the dashboard grid with Skeleton wells that mirror the resolved bands. Recent proof uses six Skeleton cards. Controls → Loading phase can preview retrieving (Card.Header mounted + Chart.Loading); do not paste that as the first-layout freeze. Copy this source into PitchKit. Do not reconstruct from PitchKitExample / pitchKitStyles, do not ship ExampleGridControls, and do not use Graph-unavailable or zeros as loading.",
        },
      },
    },
    creatorInsightsLoadingPageCopySource,
  ),
};

export const ShareablePitchKit: Story = {
  name: "Pattern — shareable PitchKit",
  render: () => <PitchKitShareableExample />,
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Show code is the product contract for the public kit — a literal freeze of this canvas (layout, chrome, spacing, typography). Graph-only KPIs: Followers, Engagement rate (hide if no reach), Typical reach, Typical saves. Compact 30-day Chart.Cartesian reuses the Insights reach Pattern (keep the Reach Card + empty well when the series cannot be plotted). Top 3 countries only; omit when Graph has no country series. ≤6 proof posts. Intro and Past brands copy their public Patterns (omit if empty). For unsigned visitors who are not the kit owner, compose the Create your Pitchkit band (one Continue with Instagram Button). Omit the band for the kit owner and for signed-in viewers of someone else's kit (`showCreateBand={false}`). Do not invent KPI metrics, EXAMPLE %, impressions, or a heatmap. Copy that source into PitchKit. Do not reconstruct from Storybook-only example files, do not ship the grid inspector, and do not add owner management controls.",
        },
      },
    },
    shareablePitchKitPageCopySource,
  ),
};

export const ShareableInsufficientReach: Story = {
  name: "State — shareable insufficient reach",
  render: () => <PitchKitShareableExample reachState="insufficient" />,
  parameters: {
    docs: {
      description: {
        story:
          "Public kit when the reach series cannot be plotted. Keep the compact Reach Card with the Insights empty well (muted Badge “No data” → title → body). Hide Engagement rate. Typical reach is an em dash. Followers, Typical saves, countries, proof, contact, and past brands may still show. Do not invent a chart, EXAMPLE %, or zeros.",
      },
    },
  },
};

export const OwnerPitchKit: Story = {
  name: "Pattern — owner PitchKit",
  render: (args) => <PitchKitOwnerExample {...args} />,
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Show code is the product contract for the authenticated PitchKit tab — a literal freeze of this canvas (layout, chrome, spacing, typography). PageHeader is Your Pitchkit / Edit what brands see. Graph KPIs match Pattern — shareable PitchKit (Followers · Engagement rate hide-if-no-reach · Typical reach · Typical saves) plus full-width compact 30-day reach and top 3 countries. Selected posts keep MoreMenu hide/restore. Contact and past brands stay display-only. Theme Light | Dark | Soft is not on this tab — copy Pattern — theme picker (owner). Copy that source into PitchKit. Do not reconstruct from Storybook-only example files, do not ship the grid inspector, and do not add bio, website, rates, geo, or contact editors.",
        },
      },
    },
    ownerPitchKitPageCopySource,
  ),
};
