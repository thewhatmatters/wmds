# ADR-0025 — Toast notifications

**Status:** Accepted  
**Date:** 2026-09-08

## Context

WMDS needs temporary, non-blocking feedback that can stack, offer an immediate action such as Undo, and surface in different corners or centered positions. Product implementations should not invent independent toast managers or notification chrome.

Production references consistently keep the action inside a compact notification surface: [Pinterest](https://mobbin.com/screens/70234394-ca14-4def-8aa4-e9784fdccae1), [Coda](https://mobbin.com/screens/580abcac-fdb0-4c72-b6ea-b529d42bfa1e), [Todoist](https://mobbin.com/screens/75c4093b-73e7-4344-b2e7-54e90d94e58c), and [Netflix](https://mobbin.com/screens/5211d5f6-c653-4210-aead-047adec26c9a). The shadcn Base UI Toast API establishes the familiar root-Toaster plus imperative-manager model.

## Decision

Ship **Toast** as an organism with:

- one root **`Toaster`** portal and imperative **`toast`** manager;
- `toast.add()`, `toast.update()`, and `toast.dismiss()`;
- semantic tones: `neutral`, `success`, `info`, `warning`, and `error`;
- optional description, action, dismiss control, duration, and stable caller-supplied ID;
- six positions: top/bottom × left/center/right;
- a configurable visible-stack limit, default five; the newest toast is interactive in front while older surfaces form a scaled, offset deck behind it;
- auto-dismiss after 5000ms by default; `duration: null` for persistent notifications;
- **Button** for actions, **IconButton** for dismiss, and **Badge iconOnly** for status marks;
- Motion `AnimatePresence` + layout transitions, with reduced-motion users receiving opacity-only changes;
- polite `status` announcements by default and assertive `alert` announcements for errors.

Top positions render the newest notification nearest the top edge. Bottom positions render the newest notification nearest the bottom edge.

## Non-goals for v1

- Blocking confirmation — use **AlertDialog**.
- Notification inbox/history.
- Promise helpers.
- Swipe-to-dismiss and hover-paused timers.
- Multiple independent Toasters in one application shell.

## Consequences

Apps mount one **`Toaster`** near the root and trigger notifications from event handlers without threading local display state through page components. Placement is an application-level choice; callers do not position individual items.

## References

- [shadcn Base UI Toast](https://ui.shadcn.com/docs/components/base/toast)
- [Motion stacked notifications](https://examples.motion.dev/react/toast-stack)
- [Motion notifications list](https://examples.motion.dev/react/notifications-list)
