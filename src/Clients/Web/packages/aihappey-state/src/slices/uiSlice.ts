import type { StateCreator } from "zustand";

export type UiSlice = {
  showActivities: boolean;
  toggleActivities: () => void;
  setActivities: (open: boolean) => void;

};

export const createUiSlice: StateCreator<
  any,
  [],
  [],
  UiSlice
> = (set, get, store) => ({
  showActivities: false,
  toggleActivities: () =>
    set((s: any) => ({
      showActivities: !s.showActivities,
    })),
  setActivities: (open: boolean) =>
    set(() => ({
      showActivities: open,
    })),
});
