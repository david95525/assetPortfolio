import {useEffect} from 'react';
import {useAssetPriceStore} from '../store/assetPriceStore';

export const useAssetPrice = (symbol: string) => {
  const price = useAssetPriceStore((s) => s.prices[symbol]);
  const fetchPrice = useAssetPriceStore((s) => s.fetchPrice);

  useEffect(() => {
    fetchPrice(symbol);
  }, [symbol]);

  return price ?? null;
};
