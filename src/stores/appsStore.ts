import { create } from "zustand";
import apiClient from "../services/apiClient";

export interface AppInfo {
  idx: number;
  path: string;
  name: string;
}

interface AppsState {
  apps: AppInfo[];
  loaded: boolean;
  fetchApps: () => Promise<void>;
  clear: () => void;
}

export const useAppsStore = create<AppsState>((set) => ({
  apps: [],
  loaded: false,

  fetchApps: async () => {
    try {
      const res = await apiClient.get<{ apps: AppInfo[] }>("/api/app/me");
      set({ apps: res.data.apps, loaded: true });
    } catch {
      set({ apps: [], loaded: true });
    }
  },

  clear: () => set({ apps: [], loaded: false }),
}));
