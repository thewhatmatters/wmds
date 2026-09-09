import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getToastSnapshot,
  toast,
} from "./toastStore";

afterEach(() => {
  toast.dismiss();
  vi.useRealTimers();
});

describe("toast manager", () => {
  it("adds, updates, and dismisses a notification", () => {
    const id = toast.add({
      title: "Saved",
      duration: null,
    });

    expect(getToastSnapshot()).toMatchObject([
      {
        id,
        title: "Saved",
        tone: "neutral",
        duration: null,
        dismissible: true,
      },
    ]);

    toast.update(id, { title: "Published", tone: "success" });
    expect(getToastSnapshot()[0]).toMatchObject({
      id,
      title: "Published",
      tone: "success",
    });

    toast.dismiss(id);
    expect(getToastSnapshot()).toEqual([]);
  });

  it("auto-dismisses after the supplied duration", () => {
    vi.useFakeTimers();

    toast.add({ title: "Copied", duration: 1200 });
    expect(getToastSnapshot()).toHaveLength(1);

    vi.advanceTimersByTime(1200);
    expect(getToastSnapshot()).toEqual([]);
  });

  it("replaces a toast with the same stable id", () => {
    toast.add({ id: "sync", title: "Syncing", duration: null });
    toast.add({
      id: "sync",
      title: "Synced",
      tone: "success",
      duration: null,
    });

    expect(getToastSnapshot()).toHaveLength(1);
    expect(getToastSnapshot()[0]).toMatchObject({
      id: "sync",
      title: "Synced",
      tone: "success",
    });
  });
});
