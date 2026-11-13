/**
 * Whether a component should reduce its motion. The reader's OS setting wins, and
 * `MotionConfig reducedMotion="always"` also reduces. Motion's config is `"never"` when an app has no
 * `MotionConfig` at all, so `"never"` must not switch the reader's setting off: an app that never
 * heard of `MotionConfig` would otherwise animate for everyone.
 */
export function resolveReducedMotion(prefers: boolean | null | undefined, config: string | undefined): boolean {
  return config === "always" || prefers === true;
}
