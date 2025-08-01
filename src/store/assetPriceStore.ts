import {create} from 'zustand';

interface PriceState {
  prices: Record<string, number>;
  fetchPrice: (symbol: string) => Promise<void>;
}

export const useAssetPriceStore = create<PriceState>((set, get) => ({
  prices: {},
  fetchPrice: async (symbol: string) => {
    if (get().prices[symbol] != null) return; // 已有價格，不重抓
    const price = await getPriceAPI(symbol); // 同你原本的 API
    set((state) => ({
      prices: {
        ...state.prices,
        [symbol]: price,
      },
    }));
  },
}));

const getPriceAPI = async (symbol: string): Promise<number> => {
  await new Promise((r) => setTimeout(r, 300));
  return 119; // 模擬價格
};