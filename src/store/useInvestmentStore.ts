import {v4 as uuidv4} from 'uuid';
import {create} from 'zustand';
import {Investment} from '../types/Investment';

interface InvestmentStore {
  investments: Investment[];
  addInvestment: (inv: Omit<Investment, 'id'>) => void;
}

export const useInvestmentStore = create<InvestmentStore>((set) => ({
  investments: [],
  addInvestment: (inv) =>
    set((state) => ({
      investments: [...state.investments, { id: uuidv4(), ...inv }],
    })),
}));
