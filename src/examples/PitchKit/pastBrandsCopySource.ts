import { creatorIdentityStripCopySource } from "./creatorIdentityCopySource";
import {
  pitchKitBrandCardClasses,
  pitchKitBrandClasses,
  pitchKitBrandListClasses,
  pitchKitBrandNameClasses,
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

export const pastBrandsOwnerCopySource = `
import { useState } from "react";
import { ChevronDown, ChevronUp, GripVertical, Pencil, Trash2 } from "lucide-react";
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
  cardTitleClasses,
  dialogFooterActionsClasses,
} from "@whatmatters/wmds";

const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const PITCHKIT_BRANDS_MAX = 8;
const PITCHKIT_BRAND_NAME_MAX = 40;

${creatorIdentityStripCopySource}

function BrandMark({ name }) {
  return <Avatar name={name} size="sm" />;
}

function OwnerPastBrands({ brands, onBrandsChange }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const canAdd = brands.length < PITCHKIT_BRANDS_MAX;
  const trimmedDraft = draftName.trim();
  const canSubmit = trimmedDraft.length > 0;

  function openAdd() {
    if (!canAdd) return;
    setEditingId(null);
    setDraftName("");
    setDialogOpen(true);
  }

  function openEdit(brand) {
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
      onBrandsChange([...brands, { id: crypto.randomUUID(), name: trimmedDraft }]);
    } else {
      onBrandsChange(
        brands.map((brand) =>
          brand.id === editingId ? { ...brand, name: trimmedDraft } : brand,
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
          {brands.map((brand, index) => (
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
                    <BrandMark name={brand.name} />
                    <h3 className="${pitchKitBrandNameClasses}">{brand.name}</h3>
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
                      if (actionId === "edit") openEdit(brand);
                      if (actionId === "remove") {
                        onBrandsChange(brands.filter((item) => item.id !== brand.id));
                      }
                    }}
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
              size="sm"
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
import { Avatar, Card, Chip, cardTitleClasses } from "@whatmatters/wmds";

const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

${creatorIdentityStripCopySource}

function PublicPastBrands({ brands }) {
  if (brands.length === 0) return null;

  return (
    <section className="${pitchKitPostsSectionClasses}">
      <div className="${pitchKitPostsHeaderClasses}">
        <h2 className={cardTitleClasses}>Past brands</h2>
      </div>
      <div className="${pitchKitBrandListClasses}">
        {brands.map((brand) => (
          <Card
            key={brand.id}
            variant="outlined"
            shape="rounded"
            className="${pitchKitBrandCardClasses}"
          >
            <Card.Header
              start={
                <div className="${pitchKitBrandRowStartClasses}">
                  <Avatar name={brand.name} size="sm" />
                  <h3 className="${pitchKitBrandNameClasses}">{brand.name}</h3>
                </div>
              }
            />
          </Card>
        ))}
      </div>
    </section>
  );
}

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
