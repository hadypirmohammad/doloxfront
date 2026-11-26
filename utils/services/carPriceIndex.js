import { getBrands, getCarPriceDetail, getCarPrices } from '@/utils/Request';
import { resolveBackendMediaUrl } from '@/utils/media';
import { MAKER_OF } from '@/utils/services/carPriceGroups';
import { shapeCarPrice } from '@/utils/services/carPriceShape';

const PASSENGER_ROOT_ID = 5;
const PAGE_SIZE = 100;
const MAX_PAGES = 20;
const TTL_MS = 60 * 60 * 1000;
const DETAIL_BATCH = 4;

const cache = globalThis.__doloxCarPriceIndex || (globalThis.__doloxCarPriceIndex = { items: [], builtAt: 0, building: null });

async function build() {
  const found = [];
  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const data = await getCarPrices({ page, pageSize: PAGE_SIZE, rootBrandId: PASSENGER_ROOT_ID, hasPrice: true });
    found.push(...(data?.items || []));
    if (!data?.pagination?.hasNext) break;
  }

  const details = new Map();
  const multi = found.filter((item) => Number(item.activePricesCount) > 1);
  for (let index = 0; index < multi.length; index += DETAIL_BATCH) {
    const chunk = multi.slice(index, index + DETAIL_BATCH);
    const results = await Promise.all(chunk.map((item) => getCarPriceDetail(item.brandId).catch(() => null)));
    chunk.forEach((item, position) => details.set(item.brandId, results[position]));
  }

  const brands = await getBrands(PASSENGER_ROOT_ID, 1).catch(() => []);
  const logos = new Map((Array.isArray(brands) ? brands : []).map((brand) => [String(brand.Name || '').trim(), brand.Image]));
  const logoOf = (name) => resolveBackendMediaUrl(logos.get(name) || logos.get(MAKER_OF[name]) || '', '');

  return found
    .map((item) => shapeCarPrice(item, details.get(item.brandId)))
    .map((item) => (item.image ? item : { ...item, image: logoOf(item.brand) }))
    .sort((a, b) => a.brand.localeCompare(b.brand, 'fa') || a.model.localeCompare(b.model, 'fa'));
}

function refresh() {
  if (!cache.building) {
    cache.building = build()
      .then((items) => {
        cache.items = items;
        cache.builtAt = Date.now();
      })
      .catch(() => {})
      .finally(() => {
        cache.building = null;
      });
  }
  return cache.building;
}

export async function getPricedCars({ waitMs = 0 } = {}) {
  if (Date.now() - cache.builtAt > TTL_MS) {
    const pending = refresh();
    if (!cache.builtAt && waitMs > 0) {
      await Promise.race([pending, new Promise((resolve) => setTimeout(resolve, waitMs))]);
    }
  }
  return cache.items;
}
