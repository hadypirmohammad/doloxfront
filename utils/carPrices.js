import { convertToShamsiAndGregorian, formatPrice, toPersianDigits } from '@/utils/Cal';
import { resolveBackendMediaUrl } from '@/utils/media';

export const CAR_PRICE_PAGE_SIZE = 24;

/* API directions are: increase | decrease | new | none (legacy values: up/down) */
export function normalizeDirection(raw) {
  const value = String(raw || '').toLowerCase();
  if (value === 'increase' || value === 'up') return 'increase';
  if (value === 'decrease' || value === 'down') return 'decrease';
  if (value === 'new') return 'new';
  return 'none';
}

/* The car-prices API sometimes responds with a JSON-encoded string
 * instead of a plain object; normalize it before use. */
export function safeParseCarPrices(data) {
  if (data == null) return null;
  if (typeof data !== 'string') return data;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

/* Formats an API date as a Shamsi (Persian) date string.
 * Always called server-side (getServerSideProps) so SSR and
 * hydration agree on the rendered value. */
export function formatShamsiDate(dateString) {
  if (!dateString) return null;
  const { shamsi } = convertToShamsiAndGregorian(dateString);
  if (!shamsi?.year) return null;
  const month = String(shamsi.month).padStart(2, '0');
  const day = String(shamsi.day).padStart(2, '0');
  return toPersianDigits(`${shamsi.year}/${month}/${day}`);
}

/* "+3.56%" -> "+۳.۵۶٪" */
export function formatPercentText(percentText) {
  if (!percentText) return null;
  return toPersianDigits(String(percentText).replace('%', '٪'));
}

const PRICE_TYPE_LABELS = {
  base: 'قیمت پایه',
  zerokilometer: 'صفر کیلومتر',
  zero: 'صفر کیلومتر',
  factory: 'قیمت کارخانه',
  used: 'کارکرده',
};

/* priceTypeText coming from the API is often English ("Zero Kilometer",
 * "Unknown"), so map known types to proper Persian labels. */
export function priceTypeLabel(type, fallbackText) {
  const key = String(type || '').trim().toLowerCase();
  if (PRICE_TYPE_LABELS[key]) return PRICE_TYPE_LABELS[key];

  const fallback = String(fallbackText || '').trim();
  if (fallback && fallback.toLowerCase() !== 'unknown') return fallback;

  return 'قیمت';
}

/* Maps a /CarPrices list item into the view model used by /car-prices.
 * Date formatting happens server-side to avoid hydration mismatches. */
export function mapCarPriceListItem(item) {
  const change = item?.priceChange || {};
  return {
    brandId: item.brandId,
    name: [item.parentBrand, item.carName].filter(Boolean).join(' ').trim() || 'خودرو',
    rootBrand: (item.rootBrand || '').trim(),
    price: item.currentPriceToman ?? null,
    percentText: change.percentText || null,
    direction: normalizeDirection(change.direction || change.changeDirection),
    activePricesCount: item.activePricesCount ?? 0,
    updatedAtShamsi: formatShamsiDate(item.currentPriceUpdatedAt),
    image: resolveBackendMediaUrl(item.carImage),
  };
}

export function buildCarPricesUrl({ search = '', hasPrice = true, page = 1 }) {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (!hasPrice) params.set('hasPrice', 'false');
  if (page > 1) params.set('page', String(page));
  const query = params.toString();
  return query ? `/car-prices?${query}` : '/car-prices';
}

export function formatTotalCount(value) {
  return toPersianDigits(formatPrice(value ?? 0));
}
