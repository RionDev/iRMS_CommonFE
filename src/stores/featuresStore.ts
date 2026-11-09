import { create } from "zustand";
import apiClient from "../services/apiClient";

/**
 * 앱별 "내가 쓸 수 있는 기능 키" 캐시.
 * BE `GET /api/app/me/features?path=` 결과를 path 단위로 한 번만 불러온다.
 * 버튼·메뉴 노출용이며 실제 차단은 BE(feature_dependency)가 한다.
 */
export interface FeatureEntry {
  keys: string[];
  loaded: boolean;
}

interface FeaturesState {
  byPath: Record<string, FeatureEntry>;
  fetchFeatures: (appPath: string) => Promise<void>;
  clear: () => void;
}

export const useFeaturesStore = create<FeaturesState>((set, get) => ({
  byPath: {},

  fetchFeatures: async (appPath: string) => {
    // 이미 불러왔거나 불러오는 중이면 다시 요청하지 않는다
    if (get().byPath[appPath]) return;
    set((s) => ({ byPath: { ...s.byPath, [appPath]: { keys: [], loaded: false } } }));
    try {
      const res = await apiClient.get<{ path: string; features: string[] }>(
        "/api/app/me/features",
        { params: { path: appPath } },
      );
      set((s) => ({
        byPath: { ...s.byPath, [appPath]: { keys: res.data.features, loaded: true } },
      }));
    } catch {
      // 실패 시 기본 차단 — 아무 기능도 노출하지 않는다
      set((s) => ({ byPath: { ...s.byPath, [appPath]: { keys: [], loaded: true } } }));
    }
  },

  clear: () => set({ byPath: {} }),
}));
