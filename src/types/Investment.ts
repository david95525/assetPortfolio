export interface Investment {
  id: string;
  symbol: string;      // 股票代號
  price: number;       // 單價
  shares: number;      // 張數 / 股數
  date: string;        // 購買日期（ISO string）
}
