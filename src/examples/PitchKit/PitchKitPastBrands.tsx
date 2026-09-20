import { useState } from "react";
import { ChevronDown, ChevronUp, GripVertical, Pencil, Trash2 } from "lucide-react";
import { Avatar } from "../../components/atoms/Avatar/Avatar";
import { Button } from "../../components/atoms/Button/Button";
import { ButtonIcon } from "../../components/atoms/Button/ButtonIcon";
import { IconButton } from "../../components/atoms/IconButton/IconButton";
import { Input } from "../../components/atoms/Input/Input";
import {
  Card,
  cardTitleClasses,
} from "../../components/molecules/Card/Card";
import { Dialog } from "../../components/organisms/Dialog/Dialog";
import { dialogFooterActionsClasses } from "../../components/organisms/Dialog/dialogStyles";
import { MoreMenu } from "../../components/organisms/MoreMenu/MoreMenu";
import {
  IdentityExampleShell,
  CreatorIdentityStrip,
} from "./PitchKitCreatorIdentity";
import {
  PITCHKIT_BRANDS_MAX,
  PITCHKIT_BRAND_NAME_MAX,
  identityFromState,
  movePastBrand,
  pastBrandIdFromName,
  pastBrandsFromState,
  pitchKitCreatorIdentity,
  reorderPastBrand,
  type PitchKitCreatorIdentityState,
  type PitchKitPastBrand,
  type PitchKitPastBrandState,
} from "./pitchKitData";
import {
  pitchKitBrandCardClasses,
  pitchKitBrandListClasses,
  pitchKitBrandNameClasses,
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

function BrandMark({ name }: { name: string }) {
  return <Avatar name={name} size="sm" />;
}

export function PublicPastBrands({ brands }: { brands: readonly PitchKitPastBrand[] }) {
  if (brands.length === 0) return null;

  return (
    <section className={pitchKitPostsSectionClasses}>
      <div className={pitchKitPostsHeaderClasses}>
        <h2 className={cardTitleClasses}>Past brands</h2>
      </div>
      <div className={pitchKitBrandListClasses}>
        {brands.map((brand) => (
          <Card
            key={brand.id}
            variant="outlined"
            shape="rounded"
            className={pitchKitBrandCardClasses}
          >
            <Card.Header
              start={
                <div className={pitchKitBrandRowStartClasses}>
                  <BrandMark name={brand.name} />
                  <h3 className={pitchKitBrandNameClasses}>{brand.name}</h3>
                </div>
              }
            />
          </Card>
        ))}
      </div>
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const atMax = brands.length >= PITCHKIT_BRANDS_MAX;
  const canAdd = !atMax;
  const trimmedDraft = draftName.trim();
  const canSubmit = trimmedDraft.length > 0;

  function openAdd() {
    if (!canAdd) return;
    setEditingId(null);
    setDraftName("");
    setDialogOpen(true);
  }

  function openEdit(brand: PitchKitPastBrand) {
    setEditingId(brand.id);
    setDraftName(brand.name);
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditingId(null);
    setDraftName("");
  }

  function submitBrand() {
    if (!canSubmit) return;
    if (editingId == null) {
      if (!canAdd) return;
      const id = pastBrandIdFromName(
        trimmedDraft,
        brands.map((brand) => brand.id),
      );
      onBrandsChange([...brands, { id, name: trimmedDraft }]);
    } else {
      onBrandsChange(
        brands.map((brand) =>
          brand.id === editingId ? { ...brand, name: trimmedDraft } : brand,
        ),
      );
    }
    closeDialog();
  }

  function handleAction(brand: PitchKitPastBrand, actionId: string) {
    if (actionId === "edit") openEdit(brand);
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
          {brands.map((brand, index) => (
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
                    <BrandMark name={brand.name} />
                    <h3 className={pitchKitBrandNameClasses}>{brand.name}</h3>
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
          ))}
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
          <Input
            label="Brand name"
            value={draftName}
            maxLength={PITCHKIT_BRAND_NAME_MAX}
            onChange={(event) => setDraftName(event.target.value)}
          />
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
