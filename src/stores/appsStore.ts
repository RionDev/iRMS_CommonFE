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
  /** 목록 요청이 실패했는지 — 실패를 "권한 없음" 으로 오인하지 않게 구분한다 */
  failed: boolean;
  fetchApps: () => Promise<void>;
  clear: () => void;
}

export const useAppsStore = create<AppsState>((set) => ({
  apps: [],
  loaded: false,
  failed: false,

  fetchApps: async () => {
    try {
      const res = await apiClient.get<{ apps: AppInfo[] }>("/api/app/me");
      set({ apps: res.data.apps, loaded: true, failed: false });
    } catch {
      set({ apps: [], loaded: true, failed: true });
    }
  },

  clear: () => set({ apps: [], loaded: false, failed: false }),
}));
