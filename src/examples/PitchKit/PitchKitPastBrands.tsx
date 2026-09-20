import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { ChevronDown, ChevronUp, GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { Avatar } from "../../components/atoms/Avatar/Avatar";
import { Button } from "../../components/atoms/Button/Button";
import { ButtonIcon } from "../../components/atoms/Button/ButtonIcon";
import { IconButton } from "../../components/atoms/IconButton/IconButton";
import { Input } from "../../components/atoms/Input/Input";
import {
  Card,
  cardTitleClasses,
} from "../../components/molecules/Card/Card";
import { Chip } from "../../components/molecules/Chip/Chip";
import { Select } from "../../components/molecules/Select/Select";
import { Dialog } from "../../components/organisms/Dialog/Dialog";
import { dialogFooterActionsClasses } from "../../components/organisms/Dialog/dialogStyles";
import { MoreMenu } from "../../components/organisms/MoreMenu/MoreMenu";
import {
  IdentityExampleShell,
  CreatorIdentityStrip,
} from "./PitchKitCreatorIdentity";
import {
  PITCHKIT_BRANDS_MAX,
  PITCHKIT_BRAND_LOGO_LETTER,
  PITCHKIT_BRAND_NAME_MAX,
  PITCHKIT_BRAND_RESULT_HINTS,
  PITCHKIT_BRAND_RESULT_MAX,
  identityFromState,
  movePastBrand,
  normalizePastBrandResult,
  pastBrandIdFromName,
  pastBrandLogoKeyLabel,
  pastBrandLogoMonogram,
  pastBrandResultIssues,
  pastBrandResultStatus,
  pastBrandsFromState,
  pitchKitBrandLogoKeys,
  pitchKitCreatorIdentity,
  reorderPastBrand,
  resolvePastBrandLogoKey,
  type PitchKitBrandLogoKey,
  type PitchKitCreatorIdentityState,
  type PitchKitPastBrand,
  type PitchKitPastBrandState,
} from "./pitchKitData";
import {
  pitchKitBrandCardClasses,
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
  pitchKitIdentityNameplateClasses,
  pitchKitIntroStackClasses,
  pitchKitPostsHeaderClasses,
  pitchKitPostsSectionClasses,
  pitchKitTopbarEndClasses,
} from "./pitchKitStyles";

export interface PitchKitPastBrandsExampleProps {
  identityState?: PitchKitCreatorIdentityState;
  brandState?: PitchKitPastBrandState;
  chrome?: "public" | "owner";
}

const pastBrandLogoOptions = [
  { value: PITCHKIT_BRAND_LOGO_LETTER, label: "Letter avatar" },
  ...pitchKitBrandLogoKeys.map((key) => ({
    value: key,
    label: pastBrandLogoKeyLabel(key),
  })),
];

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined" || window.matchMedia == null) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useLayoutEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

export function BrandMark({
  name,
  logoKey,
}: {
  name: string;
  logoKey?: string;
}) {
  const resolved = resolvePastBrandLogoKey(logoKey);
  if (resolved == null) {
    return <Avatar name={name} size="sm" />;
  }

  return (
    <span className={pitchKitBrandMarkClasses} role="img" aria-label={name}>
      <span aria-hidden>{pastBrandLogoMonogram(resolved)}</span>
    </span>
  );
}

export function BrandResultChip({ label }: { label?: string }) {
  const result = normalizePastBrandResult(label);
  if (result == null) return null;
  return (
    <Chip readOnly size="sm">
      {result}
    </Chip>
  );
}

function BrandLockup({ brand }: { brand: PitchKitPastBrand }) {
  return (
    <div className={pitchKitBrandRowStartClasses}>
      <BrandMark name={brand.name} logoKey={brand.logo_key} />
      <h3 className={pitchKitBrandNameClasses}>{brand.name}</h3>
      <BrandResultChip label={brand.result_label} />
    </div>
  );
}

function PastBrandCard({
  brand,
  className,
}: {
  brand: PitchKitPastBrand;
  className: string;
}) {
  return (
    <Card variant="outlined" shape="rounded" className={className}>
      <Card.Header start={<BrandLockup brand={brand} />} />
    </Card>
  );
}

function PastBrandsRail({ brands }: { brands: readonly PitchKitPastBrand[] }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLUListElement>(null);
  const [overflows, setOverflows] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

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
      className={pitchKitBrandRailHostClasses}
      data-overflow={showMarquee ? "true" : "false"}
    >
      <ul ref={measureRef} className={pitchKitBrandRailMeasureClasses} aria-hidden>
        {brands.map((brand) => (
          <li key={`${brand.id}-measure`}>
            <PastBrandCard brand={brand} className={pitchKitBrandRailCardClasses} />
          </li>
        ))}
      </ul>
      {reduceMotion ? (
        <ul className={pitchKitBrandRailWrapClasses} aria-label="Past brands">
          {brands.map((brand) => (
            <li key={brand.id}>
              <PastBrandCard brand={brand} className={pitchKitBrandRailCardClasses} />
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
                  {result == null ? brand.name : `${brand.name}, ${result}`}
                </li>
              );
            })}
          </ul>
          <div className={pitchKitBrandMarqueeViewportClasses} aria-hidden>
            <div
              className={pitchKitBrandMarqueeTrackClasses}
              style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
            >
              <ul className={pitchKitBrandRailRowClasses}>
                {brands.map((brand) => (
                  <li key={`${brand.id}-loop-a`}>
                    <PastBrandCard brand={brand} className={pitchKitBrandRailCardClasses} />
                  </li>
                ))}
              </ul>
              <ul className={pitchKitBrandRailRowClasses}>
                {brands.map((brand) => (
                  <li key={`${brand.id}-loop-b`}>
                    <PastBrandCard brand={brand} className={pitchKitBrandRailCardClasses} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      ) : (
        <ul className={pitchKitBrandRailRowClasses} aria-label="Past brands">
          {brands.map((brand) => (
            <li key={brand.id}>
              <PastBrandCard brand={brand} className={pitchKitBrandRailCardClasses} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function PublicPastBrands({ brands }: { brands: readonly PitchKitPastBrand[] }) {
  if (brands.length === 0) return null;

  return (
    <section className={pitchKitPostsSectionClasses}>
      <div className={pitchKitPostsHeaderClasses}>
        <h2 className={cardTitleClasses}>Past brands</h2>
      </div>
      <PastBrandsRail brands={brands} />
    </section>
  );
}

function OwnerPastBrands({
  brands,
  onBrandsChange,
}: {
  brands: PitchKitPastBrand[];
  onBrandsChange: (brands: PitchKitPastBrand[]) => void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftResult, setDraftResult] = useState("");
  const [draftLogoKey, setDraftLogoKey] = useState(PITCHKIT_BRAND_LOGO_LETTER);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const atMax = brands.length >= PITCHKIT_BRANDS_MAX;
  const canAdd = !atMax;
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

  function openEdit(brand: PitchKitPastBrand) {
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

  function nextBrandFields(): Pick<PitchKitPastBrand, "name" | "logo_key" | "result_label"> {
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
      const id = pastBrandIdFromName(
        trimmedDraft,
        brands.map((brand) => brand.id),
      );
      onBrandsChange([...brands, { id, ...fields }]);
    } else {
      onBrandsChange(
        brands.map((brand) =>
          brand.id === editingId ? { ...brand, ...fields } : brand,
        ),
      );
    }
    closeDialog();
  }

  function clearResult(brand: PitchKitPastBrand) {
    onBrandsChange(
      brands.map((item) => {
        if (item.id !== brand.id) return item;
        return {
          id: item.id,
          name: item.name,
          ...(item.logo_key == null ? {} : { logo_key: item.logo_key }),
        };
      }),
    );
  }

  function handleAction(brand: PitchKitPastBrand, actionId: string) {
    if (actionId === "edit" || actionId === "add-result") openEdit(brand);
    if (actionId === "clear-result") clearResult(brand);
    if (actionId === "remove") {
      onBrandsChange(brands.filter((item) => item.id !== brand.id));
    }
  }

  return (
    <section className={pitchKitPostsSectionClasses}>
      <div className={pitchKitPostsHeaderClasses}>
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
        <div className={pitchKitBrandListClasses}>
          {brands.map((brand, index) => {
            const hasResult = normalizePastBrandResult(brand.result_label) != null;
            return (
              <Card
                key={brand.id}
                variant="outlined"
                shape="rounded"
                className={pitchKitBrandCardClasses}
                draggable
                onDragStart={() => setDraggingId(brand.id)}
                onDragOver={(event) => {
                  event.preventDefault();
                }}
                onDrop={() => {
                  if (draggingId != null) {
                    onBrandsChange(reorderPastBrand(brands, draggingId, brand.id));
                  }
                  setDraggingId(null);
                }}
                onDragEnd={() => setDraggingId(null)}
              >
                <Card.Header
                  start={
                    <div className={pitchKitBrandRowStartClasses}>
                      <span className={pitchKitBrandReorderClasses}>
                        <ButtonIcon size="sm">
                          <GripVertical />
                        </ButtonIcon>
                        <IconButton
                          size="xs"
                          icon={<ChevronUp />}
                          aria-label={`Move ${brand.name} up`}
                          disabled={index === 0}
                          onClick={() =>
                            onBrandsChange(movePastBrand(brands, brand.id, -1))
                          }
                        />
                        <IconButton
                          size="xs"
                          icon={<ChevronDown />}
                          aria-label={`Move ${brand.name} down`}
                          disabled={index === brands.length - 1}
                          onClick={() =>
                            onBrandsChange(movePastBrand(brands, brand.id, 1))
                          }
                        />
                      </span>
                      <BrandMark name={brand.name} logoKey={brand.logo_key} />
                      <h3 className={pitchKitBrandNameClasses}>{brand.name}</h3>
                      <BrandResultChip label={brand.result_label} />
                    </div>
                  }
                  end={
                    <MoreMenu
                      aria-label={`Manage ${brand.name}`}
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
                          ? {
                              id: "clear-result",
                              label: "Clear result",
                            }
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
                      onAction={(actionId) => handleAction(brand, actionId)}
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
          <div className={pitchKitBrandDialogFieldsClasses}>
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
              status={pastBrandResultStatus(draftResult)}
              message={resultIssue}
              onChange={(event) => setDraftResult(event.target.value)}
            />
            <Select
              label="Logo"
              description="Optional curated mark. Missing or unknown keys use a letter Avatar."
              options={pastBrandLogoOptions}
              value={draftLogoKey}
              onValueChange={(value) =>
                setDraftLogoKey(value as PitchKitBrandLogoKey | typeof PITCHKIT_BRAND_LOGO_LETTER)
              }
            />
          </div>
        </Dialog.Content>
      </Dialog>
    </section>
  );
}

function PitchKitPastBrandsCanvas({
  identityState = "resolved",
  brandState = "filled",
  chrome = "public",
}: PitchKitPastBrandsExampleProps) {
  const [brands, setBrands] = useState(() => pastBrandsFromState(brandState));
  const identity = identityFromState(identityState);
  const topbarName =
    identity?.displayName ?? pitchKitCreatorIdentity.handle;

  return (
    <IdentityExampleShell
      topbarEnd={
        chrome === "owner" ? (
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
        ) : undefined
      }
    >
      {identity != null ? (
        <section className={pitchKitIdentityNameplateClasses}>
          <div className={pitchKitIntroStackClasses}>
            <CreatorIdentityStrip
              identity={identity}
              nameAs="h1"
              showProfessionalChip
            />
          </div>
        </section>
      ) : null}
      {chrome === "owner" ? (
        <OwnerPastBrands brands={brands} onBrandsChange={setBrands} />
      ) : (
        <PublicPastBrands brands={brands} />
      )}
    </IdentityExampleShell>
  );
}

export function PitchKitPastBrandsExample(props: PitchKitPastBrandsExampleProps) {
  return (
    <PitchKitPastBrandsCanvas
      key={`${props.chrome ?? "public"}-${props.brandState ?? "filled"}-${props.identityState ?? "resolved"}`}
      {...props}
    />
  );
}
