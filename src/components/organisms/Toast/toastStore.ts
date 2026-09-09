import type { ReactNode } from "react";

export const toastTones = [
  "neutral",
  "success",
  "info",
  "warning",
  "error",
] as const;

export type ToastTone = (typeof toastTones)[number];
export type ToastId = string;

export interface ToastAction {
  label: string;
  onClick: (id: ToastId) => void;
  /** Close after the action runs. Default `true`. */
  dismiss?: boolean;
}

export interface ToastOptions {
  id?: ToastId;
  title: ReactNode;
  description?: ReactNode;
  tone?: ToastTone;
  action?: ToastAction;
  /** Auto-dismiss delay in milliseconds. `null` keeps the toast open. Default `5000`. */
  duration?: number | null;
  /** Show the dismiss IconButton. Default `true`. */
  dismissible?: boolean;
}

export interface ToastRecord
  extends Omit<ToastOptions, "id" | "tone" | "duration" | "dismissible"> {
  id: ToastId;
  tone: ToastTone;
  duration: number | null;
  dismissible: boolean;
}

type ToastListener = () => void;

let nextToastId = 0;
let records: ToastRecord[] = [];
const listeners = new Set<ToastListener>();
const timers = new Map<ToastId, ReturnType<typeof setTimeout>>();
const emptyServerSnapshot: ToastRecord[] = [];

function emit() {
  listeners.forEach((listener) => listener());
}

function scheduleDismiss(record: ToastRecord) {
  const currentTimer = timers.get(record.id);
  if (currentTimer != null) clearTimeout(currentTimer);
  timers.delete(record.id);

  if (record.duration == null || record.duration <= 0) return;

  timers.set(
    record.id,
    setTimeout(() => {
      dismiss(record.id);
    }, record.duration),
  );
}

function add(options: ToastOptions): ToastId {
  const id = options.id ?? `wmds-toast-${++nextToastId}`;
  const record: ToastRecord = {
    id,
    title: options.title,
    description: options.description,
    tone: options.tone ?? "neutral",
    action: options.action,
    duration: options.duration === undefined ? 5000 : options.duration,
    dismissible: options.dismissible ?? true,
  };
  const existingIndex = records.findIndex((item) => item.id === id);

  records =
    existingIndex === -1
      ? [...records, record]
      : records.map((item) => (item.id === id ? record : item));
  scheduleDismiss(record);
  emit();
  return id;
}

function dismiss(id?: ToastId) {
  if (id == null) {
    timers.forEach((timer) => clearTimeout(timer));
    timers.clear();
  } else {
    const timer = timers.get(id);
    if (timer != null) clearTimeout(timer);
    timers.delete(id);
  }
  records =
    id == null ? [] : records.filter((record) => record.id !== id);
  emit();
}

function update(id: ToastId, options: Partial<Omit<ToastOptions, "id">>) {
  records = records.map((record) =>
    record.id === id
      ? {
          ...record,
          ...options,
          id,
          tone: options.tone ?? record.tone,
          duration:
            options.duration === undefined ? record.duration : options.duration,
          dismissible: options.dismissible ?? record.dismissible,
        }
      : record,
  );
  const updated = records.find((record) => record.id === id);
  if (updated != null) scheduleDismiss(updated);
  emit();
}

export const toast = {
  add,
  dismiss,
  update,
};

export function subscribeToToasts(listener: ToastListener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getToastSnapshot() {
  return records;
}

export function getServerToastSnapshot(): ToastRecord[] {
  return emptyServerSnapshot;
}
