import { creatorIdentityStripCopySource } from "./creatorIdentityCopySource";
import { ownerAccountChromeCopySource } from "./ownerChromeCopySource";
import {
  pitchKitBrandClasses,
  pitchKitPageClasses,
  pitchKitTopbarBandClasses,
  pitchKitTopbarClasses,
  pitchKitTopbarEndClasses,
} from "./pitchKitStyles";

export const userSettingsOwnerCopySource = `
import { useState } from "react";
import {
  AlertDialog,
  Avatar,
  Badge,
  Button,
  Card,
  Chip,
  Dialog,
  Dropdown,
  TextLink,
  Toaster,
  cardTitleClasses,
  toast,
} from "@whatmatters/wmds";

${creatorIdentityStripCopySource}
${ownerAccountChromeCopySource}

export function AccountSettingsOwnerPage({ identity }) {
  return (
    <main className="${pitchKitPageClasses}">
      <div className="${pitchKitTopbarBandClasses}">
        <header className="${pitchKitTopbarClasses}">
          <span className="${pitchKitBrandClasses}">PitchKit</span>
          <span />
          <span className="${pitchKitTopbarEndClasses}">
            <OwnerAccountMenu identity={identity} />
          </span>
        </header>
      </div>
      <PitchKitPageFooter />
      <Toaster position="bottom-right" />
    </main>
  );
}
`;
