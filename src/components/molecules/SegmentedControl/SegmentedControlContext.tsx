import { createContext, useContext, type ReactNode } from "react";

import type { SegmentedControlLayout, SegmentedControlSize } from "./segmentedControlStyles";

export type SegmentedControlContextValue = {
  layoutId: string;
  size: SegmentedControlSize;
  layout: SegmentedControlLayout;
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
};

const SegmentedControlContext = createContext<SegmentedControlContextValue | null>(null);

export function SegmentedControlProvider({
  value,
  children,
}: {
  value: SegmentedControlContextValue;
  children: ReactNode;
}) {
  return (
    <SegmentedControlContext.Provider value={value}>{children}</SegmentedControlContext.Provider>
  );
}

export function useSegmentedControl() {
  const context = useContext(SegmentedControlContext);
  if (context == null) {
    throw new Error("SegmentedControl.Item must be used within SegmentedControl.");
  }
  return context;
}
