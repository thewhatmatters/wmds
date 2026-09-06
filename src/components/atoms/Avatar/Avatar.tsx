import { useState, type ImgHTMLAttributes } from "react";
import { User } from "lucide-react";
import { cn } from "../../../lib/cn";
import {
  statusDotBaseClasses,
  statusDotPulseClass,
  statusDotToneClasses,
  type StatusTone,
} from "../Status/statusDotStyles";
import {
  avatarFallbackShellClasses,
  avatarIconClasses,
  avatarImageClasses,
  avatarInitialsClasses,
  avatarInitialsFromName,
  avatarPresenceAnchorClasses,
  avatarPresenceRingClasses,
  avatarRootClasses,
  avatarShellSizeClasses,
  type AvatarSize,
} from "./avatarStyles";

export type { AvatarSize } from "./avatarStyles";
export { avatarSizeForCluster, avatarSizePx, avatarSizes } from "./avatarStyles";

/** Layout-only — not for size or surface overrides. */
export type AvatarLayoutClassName = string;

export interface AvatarPresence {
  tone: StatusTone;
  /** Screen reader label — e.g. "Online", "Busy". */
  label: string;
  pulsing?: boolean;
}

export interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "alt" | "children"> {
  /** Display name — alt text, initials source, and accessible name. */
  name: string;
  size?: AvatarSize;
  presence?: AvatarPresence;
  className?: AvatarLayoutClassName;
}

export function Avatar({
  name,
  src,
  size = "md",
  presence,
  className,
  onError,
  ...imgProps
}: AvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const initials = avatarInitialsFromName(name);
  const showImage = src != null && src.length > 0 && !imageFailed;
  const showInitials = !showImage && initials.length > 0;

  return (
    <span
      className={cn(avatarRootClasses, avatarShellSizeClasses[size], className)}
      data-size={size}
    >
      {showImage ? (
        <img
          {...imgProps}
          src={src}
          alt={name}
          className={avatarImageClasses}
          onError={(event) => {
            setImageFailed(true);
            onError?.(event);
          }}
        />
      ) : showInitials ? (
        <span className={avatarFallbackShellClasses} role="img" aria-label={name}>
          <span className={avatarInitialsClasses[size]} aria-hidden>
            {initials}
          </span>
        </span>
      ) : (
        <span className={avatarFallbackShellClasses} role="img" aria-label={name}>
          <User strokeWidth={2} className={avatarIconClasses[size]} aria-hidden />
        </span>
      )}

      {presence != null ? (
        <span className={avatarPresenceAnchorClasses}>
          <span
            role="img"
            aria-label={presence.label}
            title={presence.label}
            className={cn(
              avatarPresenceRingClasses,
              statusDotBaseClasses,
              statusDotToneClasses[presence.tone],
              presence.pulsing ? statusDotPulseClass : undefined,
            )}
          />
        </span>
      ) : null}
    </span>
  );
}
