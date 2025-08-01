import {v4 as uuidv4} from 'uuid';
import {create} from 'zustand';
import {Asset, AssetType, Investment} from '../types/Asset';

interface AssetStore {
  investments: Investment[];
  assets: Asset[];

  addInvestment: (inv: Omit<Investment, 'id'>) => void;
  removeInvestment: (id: string) => void;
  updateInvestment: (id: string, updated: Partial<Investment>) => void;

  addAsset: (asset: Omit<Asset, 'id'>) => void;
  removeAsset: (id: string) => void;
  updateAsset: (id: string, updated: Partial<Asset>) => void;
}

export const useAssetStore = create<AssetStore>((set, get) => ({
  investments: [],
  assets: [],

  addInvestment: (inv) => {
    const newInv = {id: uuidv4(), ...inv};
    set((state) => ({
      investments: [...state.investments, newInv],
    }));
    updateInvestmentAsset();
  },

  removeInvestment: (id) => {
    set((state) => ({
      investments: state.investments.filter((i) => i.id !== id),
    }));
    updateInvestmentAsset();
  },

  updateInvestment: (id, updated) => {
    set((state) => ({
      investments: state.investments.map((i) =>
        i.id === id ? {...i, ...updated} : i
      ),
    }));
    updateInvestmentAsset();
  },

  addAsset: (asset) =>
    set((state) => ({
      assets: [...state.assets, {id: uuidv4(), ...asset}],
    })),

  removeAsset: (id) =>
    set((state) => ({
      assets: state.assets.filter((a) => a.id !== id),
    })),

  updateAsset: (id, updated) =>
    set((state) => ({
      assets: state.assets.map((a) =>
        a.id === id ? {...a, ...updated} : a
      ),
    })),
}));

// === 投資資產金額同步工具函數 ===

function updateInvestmentAsset() {
  const {investments, assets} = useAssetStore.getState();

  const total = investments.reduce(
    (sum, inv) => sum + inv.price * inv.shares,
    0
  );

  const existingAsset = assets.find((a) => a.type === AssetType.Investment);

  if (existingAsset) {
    useAssetStore.setState({
      assets: assets.map((a) =>
        a.type ===  AssetType.Investment ? {...a, amount: total} : a
      ),
    });
  } else {
    useAssetStore.setState((state) => ({
      assets: [
        ...state.assets,
        {id: uuidv4(), type:  AssetType.Investment, amount: total},
      ],
    }));
  }
}


