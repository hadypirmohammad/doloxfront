import { getBrands } from '@/utils/Request';

const HEAD_BRAND_IDS = [5, 6, 7];

export async function getBrandIndex() {
  const lists = await Promise.all(
    HEAD_BRAND_IDS.map((id) => getBrands(id, 1).catch(() => null))
  );

  const index = {};
  lists.forEach((list, position) => {
    (Array.isArray(list) ? list : []).forEach((brand) => {
      if (brand?.BrandId == null) return;
      index[brand.BrandId] = { name: brand.Name || '', image: brand.Image || '', headBrandId: HEAD_BRAND_IDS[position] };
    });
  });

  return index;
}

function parentOf(ad, index) {
  const parentId = ad?.Brand?.ParentId;
  if (index[parentId]) return index[parentId];

  const name = ad?.BrandName || ad?.Brand?.ParentBrand?.Name;
  if (!name) return null;
  return Object.values(index).find((brand) => brand.name === name) || null;
}

export function brandLogoOf(ad, index = {}) {
  return (
    ad?.Brand?.ParentBrand?.Image ||
    ad?.BrandIcon ||
    parentOf(ad, index)?.image ||
    index[ad?.BrandId]?.image ||
    ''
  );
}

export function brandNamesOf(ad, index = {}) {
  const model = ad?.Brand?.Name || ad?.BrandName || '';
  const parent = ad?.Brand?.ParentBrand?.Name || parentOf(ad, index)?.name || '';

  if (parent && parent !== model) return { brand: parent, model };
  return { brand: model, model: '' };
}

export function adCategoryOf(ad, index = {}) {
  return parentOf(ad, index)?.headBrandId ?? index[ad?.BrandId]?.headBrandId ?? null;
}
