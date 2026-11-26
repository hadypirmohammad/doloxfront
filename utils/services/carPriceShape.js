import { resolveBackendMediaUrl } from '@/utils/media';

const yearLabel = (value) => {
  if (value == null) return '';
  if (typeof value === 'object') return String(value.Name || value.Title || value.name || value.title || '');
  return String(value);
};

export const shapeCarPrice = (item, detail) => {
  const car = detail?.car || {};
  const prices = detail?.activePrices?.length
    ? detail.activePrices
    : item?.currentPriceType && Number(item?.currentPriceToman) > 0
      ? [{ priceType: item.currentPriceType, price: item.currentPriceToman }]
      : [];
  const factoryEntry = prices.find((entry) => entry.priceType === 'Base' || entry.priceType === 'Factory') || null;
  const marketEntry = prices.find((entry) => entry.priceType === 'ZeroKilometer') || null;
  const change = detail?.priceChange?.percent ?? item?.priceChange?.percent;

  let factory = factoryEntry?.price ?? null;
  let market = marketEntry?.price ?? null;

  if (factory == null && market == null && Number(item?.currentPriceToman) > 0) {
    if (item?.currentPriceType === 'Factory' || item?.currentPriceType === 'Base') {
      factory = item.currentPriceToman;
    } else {
      market = item.currentPriceToman;
    }
  }

  return {
    brandId: item?.brandId ?? car.brandId,
    brand: String(item?.parentBrand ?? car.parentBrand ?? '').trim(),
    model: String(item?.carName ?? car.carName ?? '').trim(),
    image: resolveBackendMediaUrl(item?.carImage || car.carImage, ''),
    year: yearLabel(marketEntry?.Year ?? factoryEntry?.Year),
    factory,
    market,
    change: typeof change === 'number' ? change : null,
  };
};
