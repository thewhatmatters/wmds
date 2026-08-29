/** Package export surface — grows as Components ship. See src/package.manifest.ts for the full manifest. */
export { Badge, type BadgeLayoutClassName, type BadgeProps, type BadgeSize, type BadgeVariant, badgeVariants } from "./components/atoms/Badge/Badge";
export {
  Button,
  buttonRoles,
  type ButtonLayoutClassName,
  type ButtonProps,
  type ButtonRole,
  type ButtonSize,
  type ButtonStatus,
  defaultStatusLabels,
  getNextButtonStatus,
} from "./components/atoms/Button/Button";
export { StatusDot, statusDotVariants, type StatusDotLayoutClassName, type StatusDotProps, type StatusDotVariant } from "./components/atoms/StatusDot/StatusDot";
export { cn } from "./lib/cn";
export {
  motionTransition,
  motionTransitionProp,
  pressScaleClass,
  type MotionDuration,
  type MotionEase,
} from "./lib/motion";
