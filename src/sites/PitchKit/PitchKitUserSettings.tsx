import { PitchKitExampleShell } from "./PitchKitExampleShell";
import { OwnerAccountMenu } from "./PitchKitOwnerChrome";
import { Toaster } from "../../components/organisms/Toast/Toast";
import { pitchKitTopbarEndClasses } from "./pitchKitStyles";

export {
  AccountSettingsDialog,
  copyPitchKitShareUrl,
} from "./PitchKitOwnerChrome";

export function PitchKitUserSettingsOwnerExample() {
  return (
    <PitchKitExampleShell
      topbarEnd={
        <>
          <span />
          <span className={pitchKitTopbarEndClasses}>
            <OwnerAccountMenu />
          </span>
        </>
      }
      overlay={<Toaster position="bottom-right" />}
    />
  );
}
