import type { StateCreator } from "zustand";

export type ServerConfig = { type: string; url: string; headers?: Record<string, string> };

export type ServersSlice = {
  servers: Record<string, ServerConfig>;
  selected: string[];
  selectedServers: string[]; // legacy alias
  addServer: (name: string, cfg: ServerConfig) => void;
  removeServer: (name: string) => void;
  selectServers: (names: string[]) => void;
  resetServers: () => void;
};

export const createServersSlice: StateCreator<
  any,
  [],
  [],
  ServersSlice
> = (set, get, store) => ({
  servers: {},
  selected: [],
  selectedServers: [],
  addServer: (name, cfg) =>
    set((s: any) => ({
      servers: { ...s.servers, [name]: cfg },
    })),
  removeServer: (name) =>
    set((s: any) => {
      const { [name]: _, ...rest } = s.servers;
      const filtered = s.selected.filter((n: string) => n !== name);
      return {
        servers: rest,
        selected: filtered,
        selectedServers: filtered,
      };
    }),
  selectServers: (names) =>
    set(() => ({
      selected: names,
      selectedServers: names,
    })),
  resetServers: () =>
    set(() => ({
      servers: {},
      selected: [],
      selectedServers: [],
    })),
});
