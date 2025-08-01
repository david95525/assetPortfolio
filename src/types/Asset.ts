export interface Investment {
  id: string;
  symbol: string;
  price: number;
  shares: number;
  date: string;
}
export const AssetType = {
  Investment: 'Investment',
  Cash: 'Cash',
  Insurance: 'Insurance',
  Gold: 'Gold',
  Margin: 'Margin',
} as const;

export type AssetType = typeof AssetType[keyof typeof AssetType];

export interface Asset {
  id: string;
  type: AssetType;
  amount: number;
}

