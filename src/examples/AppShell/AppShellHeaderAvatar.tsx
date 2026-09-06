import { Avatar, avatarSizeForCluster } from "../../components/atoms/Avatar/Avatar";
import { appShellHeaderClusterTier } from "./appShellStyles";

/** Default app-header identity affordance — page title + account avatar. */
export function AppShellHeaderAvatar() {
  return (
    <Avatar
      name="Alex Rivera"
      size={avatarSizeForCluster(appShellHeaderClusterTier)}
      presence={{ tone: "success", label: "Online" }}
    />
  );
}
