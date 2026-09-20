import { creatorIdentityStripCopySource } from "./creatorIdentityCopySource";
import {
  pitchKitBrandCardClasses,
  pitchKitBrandClasses,
  pitchKitBrandDialogFieldsClasses,
  pitchKitBrandListClasses,
  pitchKitBrandMarkClasses,
  pitchKitBrandMarqueeTrackClasses,
  pitchKitBrandMarqueeViewportClasses,
  pitchKitBrandNameClasses,
  pitchKitBrandRailCardClasses,
  pitchKitBrandRailHostClasses,
  pitchKitBrandRailMeasureClasses,
  pitchKitBrandRailRowClasses,
  pitchKitBrandRailWrapClasses,
  pitchKitBrandReorderClasses,
  pitchKitBrandRowStartClasses,
  pitchKitContentBandClasses,
  pitchKitContentClasses,
  pitchKitIdentityNameplateClasses,
  pitchKitIntroStackClasses,
  pitchKitPageClasses,
  pitchKitPostsHeaderClasses,
  pitchKitPostsSectionClasses,
  pitchKitTopbarBandClasses,
  pitchKitTopbarClasses,
  pitchKitTopbarEndClasses,
} from "./pitchKitStyles";

const pastBrandsHelpersCopySource = `
const PITCHKIT_BRAND_RESULT_MAX = 24;
const PITCHKIT_BRAND_LOGO_LETTER = "letter";

const pitchKitBrandLogoKeys = [
  "nike", "adidas", "apple", "google", "meta", "amazon", "spotify", "netflix",
  "sephora", "glossier", "nordstrom", "target", "walmart", "starbucks",
  "coca-cola", "pepsi", "samsung", "microsoft", "adobe", "shopify",
  "uber", "airbnb", "disney", "lululemon", "reebok", "puma",
  "dior", "chanel", "bmw", "ford", "chase", "visa",
];

const pastBrandLogoKeySet = new Set(pitchKitBrandLogoKeys);

function resolvePastBrandLogoKey(logoKey) {
  if (logoKey == null || logoKey === "" || logoKey === PITCHKIT_BRAND_LOGO_LETTER) {
    return undefined;
  }
  return pastBrandLogoKeySet.has(logoKey) ? logoKey : undefined;
}

function pastBrandLogoMonogram(logoKey) {
  const parts = logoKey.split("-");
  if (parts.length > 1) {
    return parts.map((part) => part.charAt(0).toUpperCase()).join("").slice(0, 2);
  }
  return logoKey.slice(0, 1).toUpperCase();
}

function normalizePastBrandResult(value) {
  const trimmed = value?.trim() ?? "";
  if (trimmed.length === 0) return undefined;
  return trimmed.slice(0, PITCHKIT_BRAND_RESULT_MAX);
}

function BrandMark({ name, logoKey }) {
  const resolved = resolvePastBrandLogoKey(logoKey);
  if (resolved == null) {
    return <Avatar name={name} size="sm" />;
  }

  return (
    <span className="${pitchKitBrandMarkClasses}" role="img" aria-label={name}>
      <span aria-hidden>{pastBrandLogoMonogram(resolved)}</span>
    </span>
  );
}

function BrandResultChip({ label }) {
  const result = normalizePastBrandResult(label);
  if (result == null) return null;
  return <Chip readOnly size="sm">{result}</Chip>;
}

function BrandLockup({ brand }) {
  return (
    <div className="${pitchKitBrandRowStartClasses}">
      <BrandMark name={brand.name} logoKey={brand.logo_key} />
      <h3 className="${pitchKitBrandNameClasses}">{brand.name}</h3>
      <BrandResultChip label={brand.result_label} />
    </div>
  );
}

function PastBrandCard({ brand, className }) {
  return (
    <Card variant="outlined" shape="rounded" className={className}>
      <Card.Header start={<BrandLockup brand={brand} />} />
    </Card>
  );
}

function PastBrandsRail({ brands }) {
  const hostRef = useRef(null);
  const measureRef = useRef(null);
  const [overflows, setOverflows] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useLayoutEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReduceMotion(media.matches);
    updateMotion();
    media.addEventListener("change", updateMotion);
    return () => media.removeEventListener("change", updateMotion);
  }, []);

  useLayoutEffect(() => {
    const host = hostRef.current;
    const measure = measureRef.current;
    if (host == null || measure == null) return;

    const update = () => {
      setOverflows(measure.scrollWidth > host.clientWidth + 1);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(host);
    observer.observe(measure);
    return () => observer.disconnect();
  }, [brands]);

  const duration = Math.max(16, brands.length * 4);
  const showMarquee = overflows && !reduceMotion;

  return (
    <div
      ref={hostRef}
      className="${pitchKitBrandRailHostClasses}"
      data-overflow={showMarquee ? "true" : "false"}
    >
      <ul ref={measureRef} className="${pitchKitBrandRailMeasureClasses}" aria-hidden>
        {brands.map((brand) => (
          <li key={\`\${brand.id}-measure\`}>
            <PastBrandCard brand={brand} className="${pitchKitBrandRailCardClasses}" />
          </li>
        ))}
      </ul>
      {reduceMotion ? (
        <ul className="${pitchKitBrandRailWrapClasses}" aria-label="Past brands">
          {brands.map((brand) => (
            <li key={brand.id}>
              <PastBrandCard brand={brand} className="${pitchKitBrandRailCardClasses}" />
            </li>
          ))}
        </ul>
      ) : showMarquee ? (
        <>
          <ul className="sr-only" aria-label="Past brands">
            {brands.map((brand) => {
              const result = normalizePastBrandResult(brand.result_label);
              return (
                <li key={brand.id}>
                  {result == null ? brand.name : \`\${brand.name}, \${result}\`}
                </li>
              );
            })}
          </ul>
          <div className="${pitchKitBrandMarqueeViewportClasses}" aria-hidden>
            <div
              className="${pitchKitBrandMarqueeTrackClasses}"
              style={{ "--marquee-duration": \`\${duration}s\` }}
            >
              <ul className="${pitchKitBrandRailRowClasses}">
                {brands.map((brand) => (
                  <li key={\`\${brand.id}-loop-a\`}>
                    <PastBrandCard brand={brand} className="${pitchKitBrandRailCardClasses}" />
                  </li>
                ))}
              </ul>
              <ul className="${pitchKitBrandRailRowClasses}">
                {brands.map((brand) => (
                  <li key={\`\${brand.id}-loop-b\`}>
                    <PastBrandCard brand={brand} className="${pitchKitBrandRailCardClasses}" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      ) : (
        <ul className="${pitchKitBrandRailRowClasses}" aria-label="Past brands">
          {brands.map((brand) => (
            <li key={brand.id}>
              <PastBrandCard brand={brand} className="${pitchKitBrandRailCardClasses}" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PublicPastBrands({ brands }) {
  if (brands.length === 0) return null;

  return (
    <section className="${pitchKitPostsSectionClasses}">
      <div className="${pitchKitPostsHeaderClasses}">
        <h2 className={cardTitleClasses}>Past brands</h2>
      </div>
      <PastBrandsRail brands={brands} />
    </section>
  );
}
`;

export const publicPastBrandsCopySource = pastBrandsHelpersCopySource;

export const pastBrandsOwnerCopySource = `
import { useLayoutEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import {
  Avatar,
  Button,
  ButtonIcon,
  Card,
  Chip,
  Dialog,
  IconButton,
  Input,
  MoreMenu,
  Select,
  cardTitleClasses,
  dialogFooterActionsClasses,
} from "@whatmatters/wmds";

const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

${creatorIdentityStripCopySource}
${pastBrandsHelpersCopySource}

const PITCHKIT_BRANDS_MAX = 8;
const PITCHKIT_BRAND_NAME_MAX = 40;
const PITCHKIT_BRAND_RESULT_HINTS =
  "+12% CTR · 3.2x ROAS · 1.4M views · Sold out in 48h · Series A launch";

function pastBrandLogoKeyLabel(logoKey) {
  return logoKey
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("-");
}

function pastBrandResultIssues(value) {
  if (/[\\n\\r]/.test(value)) return "Keep the result on one line.";
  if (/https?:\\/\\/|www\\./i.test(value)) return "Links are not allowed in a result.";
  if (/(^|[\\s])@[a-z0-9._]+/i.test(value)) return "@handles are not allowed in a result.";
  const emojiCount = value.match(/\\p{Extended_Pictographic}/gu)?.length ?? 0;
  if (emojiCount >= 3) return "Skip emoji spam — use a short phrase.";
  return undefined;
}

function OwnerPastBrands({ brands, onBrandsChange }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftResult, setDraftResult] = useState("");
  const [draftLogoKey, setDraftLogoKey] = useState(PITCHKIT_BRAND_LOGO_LETTER);
  const [editingId, setEditingId] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const canAdd = brands.length < PITCHKIT_BRANDS_MAX;
  const trimmedDraft = draftName.trim();
  const resultIssue = pastBrandResultIssues(draftResult);
  const canSubmit = trimmedDraft.length > 0 && resultIssue == null;

  function openAdd() {
    if (!canAdd) return;
    setEditingId(null);
    setDraftName("");
    setDraftResult("");
    setDraftLogoKey(PITCHKIT_BRAND_LOGO_LETTER);
    setDialogOpen(true);
  }

  function openEdit(brand) {
    setEditingId(brand.id);
    setDraftName(brand.name);
    setDraftResult(brand.result_label ?? "");
    setDraftLogoKey(resolvePastBrandLogoKey(brand.logo_key) ?? PITCHKIT_BRAND_LOGO_LETTER);
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditingId(null);
    setDraftName("");
    setDraftResult("");
    setDraftLogoKey(PITCHKIT_BRAND_LOGO_LETTER);
  }

  function nextBrandFields() {
    const logo_key = resolvePastBrandLogoKey(draftLogoKey);
    const result_label = normalizePastBrandResult(draftResult);
    return {
      name: trimmedDraft,
      ...(logo_key == null ? {} : { logo_key }),
      ...(result_label == null ? {} : { result_label }),
    };
  }

  function submitBrand() {
    if (!canSubmit) return;
    const fields = nextBrandFields();
    if (editingId == null) {
      if (!canAdd) return;
      onBrandsChange([...brands, { id: crypto.randomUUID(), ...fields }]);
    } else {
      onBrandsChange(
        brands.map((brand) =>
          brand.id === editingId ? { ...brand, ...fields } : brand,
        ),
      );
    }
    closeDialog();
  }

  function moveBrand(id, direction) {
    const index = brands.findIndex((brand) => brand.id === id);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= brands.length) return;
    const next = [...brands];
    const [item] = next.splice(index, 1);
    next.splice(nextIndex, 0, item);
    onBrandsChange(next);
  }

  function reorderBrand(sourceId, targetId) {
    if (sourceId === targetId) return;
    const from = brands.findIndex((brand) => brand.id === sourceId);
    const to = brands.findIndex((brand) => brand.id === targetId);
    if (from < 0 || to < 0) return;
    const next = [...brands];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onBrandsChange(next);
  }

  return (
    <section className="${pitchKitPostsSectionClasses}">
      <div className="${pitchKitPostsHeaderClasses}">
        <h2 className={cardTitleClasses}>Past brands</h2>
        {brands.length > 0 && canAdd ? (
          <Button role="secondary" size="sm" onClick={openAdd}>
            Add
          </Button>
        ) : null}
      </div>
      {brands.length === 0 ? (
        <Button role="ghost" onClick={openAdd}>
          Add brands you've worked with
        </Button>
      ) : (
        <div className="${pitchKitBrandListClasses}">
          {brands.map((brand, index) => {
            const hasResult = normalizePastBrandResult(brand.result_label) != null;
            return (
              <Card
                key={brand.id}
                variant="outlined"
                shape="rounded"
                className="${pitchKitBrandCardClasses}"
                draggable
                onDragStart={() => setDraggingId(brand.id)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => {
                  if (draggingId != null) reorderBrand(draggingId, brand.id);
                  setDraggingId(null);
                }}
                onDragEnd={() => setDraggingId(null)}
              >
                <Card.Header
                  start={
                    <div className="${pitchKitBrandRowStartClasses}">
                      <span className="${pitchKitBrandReorderClasses}">
                        <ButtonIcon size="sm">
                          <GripVertical />
                        </ButtonIcon>
                        <IconButton
                          size="xs"
                          icon={<ChevronUp />}
                          aria-label={\`Move \${brand.name} up\`}
                          disabled={index === 0}
                          onClick={() => moveBrand(brand.id, -1)}
                        />
                        <IconButton
                          size="xs"
                          icon={<ChevronDown />}
                          aria-label={\`Move \${brand.name} down\`}
                          disabled={index === brands.length - 1}
                          onClick={() => moveBrand(brand.id, 1)}
                        />
                      </span>
                      <BrandMark name={brand.name} logoKey={brand.logo_key} />
                      <h3 className="${pitchKitBrandNameClasses}">{brand.name}</h3>
                      <BrandResultChip label={brand.result_label} />
                    </div>
                  }
                  end={
                    <MoreMenu
                      aria-label={\`Manage \${brand.name}\`}
                      size="xs"
                      items={[
                        {
                          id: "edit",
                          label: "Edit",
                          start: (
                            <ButtonIcon size="sm">
                              <Pencil />
                            </ButtonIcon>
                          ),
                        },
                        hasResult
                          ? { id: "clear-result", label: "Clear result" }
                          : {
                              id: "add-result",
                              label: "Add result",
                              start: (
                                <ButtonIcon size="sm">
                                  <Plus />
                                </ButtonIcon>
                              ),
                            },
                        {
                          id: "remove",
                          label: "Remove",
                          start: (
                            <ButtonIcon size="sm">
                              <Trash2 />
                            </ButtonIcon>
                          ),
                        },
                      ]}
                      onAction={(actionId) => {
                        if (actionId === "edit" || actionId === "add-result") openEdit(brand);
                        if (actionId === "clear-result") {
                          onBrandsChange(
                            brands.map((item) => {
                              if (item.id !== brand.id) return item;
                              const { result_label, ...rest } = item;
                              return rest;
                            }),
                          );
                        }
                        if (actionId === "remove") {
                          onBrandsChange(brands.filter((item) => item.id !== brand.id));
                        }
                      }}
                    />
                  }
                />
              </Card>
            );
          })}
        </div>
      )}
      <Dialog open={dialogOpen} onOpenChange={(open) => (open ? setDialogOpen(true) : closeDialog())}>
        <Dialog.Content
          title="Past brands"
          footer={
            <div className={dialogFooterActionsClasses}>
              <Button size="sm" role="secondary" onClick={closeDialog}>
                Cancel
              </Button>
              <Button
                size="sm"
                role="primary"
                disabled={!canSubmit}
                onClick={submitBrand}
              >
                {editingId == null ? "Add" : "Save"}
              </Button>
            </div>
          }
        >
          <div className="${pitchKitBrandDialogFieldsClasses}">
            <Input
              label="Brand name"
              value={draftName}
              maxLength={PITCHKIT_BRAND_NAME_MAX}
              onChange={(event) => setDraftName(event.target.value)}
            />
            <Input
              label="Result"
              description={PITCHKIT_BRAND_RESULT_HINTS}
              placeholder="Optional short phrase"
              value={draftResult}
              maxLength={PITCHKIT_BRAND_RESULT_MAX}
              status={resultIssue == null ? undefined : "error"}
              message={resultIssue}
              onChange={(event) => setDraftResult(event.target.value)}
            />
            <Select
              label="Logo"
              description="Optional curated mark. Missing or unknown keys use a letter Avatar."
              options={[
                { value: PITCHKIT_BRAND_LOGO_LETTER, label: "Letter avatar" },
                ...pitchKitBrandLogoKeys.map((key) => ({
                  value: key,
                  label: pastBrandLogoKeyLabel(key),
                })),
              ]}
              value={draftLogoKey}
              onValueChange={setDraftLogoKey}
            />
          </div>
        </Dialog.Content>
      </Dialog>
    </section>
  );
}

export function PastBrandsOwnerPage({ identity, brands, onBrandsChange }) {
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
              size="md"
            />
          </span>
        </header>
      </div>

      <div className="${pitchKitContentBandClasses}">
        <div className="${pitchKitContentClasses}">
          <section className="${pitchKitIdentityNameplateClasses}">
            <div className="${pitchKitIntroStackClasses}">
              <CreatorIdentityStrip
                identity={identity}
                nameAs="h1"
                showProfessionalChip
              />
            </div>
          </section>
          <OwnerPastBrands brands={brands} onBrandsChange={onBrandsChange} />
        </div>
      </div>
    </main>
  );
}
`;

export const pastBrandsPublicCopySource = `
import { useLayoutEffect, useRef, useState } from "react";
import { Avatar, Card, Chip, cardTitleClasses } from "@whatmatters/wmds";

const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

${creatorIdentityStripCopySource}
${pastBrandsHelpersCopySource}

export function PastBrandsPublicPage({ identity, brands }) {
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
            <div className="${pitchKitIntroStackClasses}">
              <CreatorIdentityStrip
                identity={identity}
                nameAs="h1"
                showProfessionalChip
              />
            </div>
          </section>
          <PublicPastBrands brands={brands} />
        </div>
      </div>
    </main>
  );
}
`;
