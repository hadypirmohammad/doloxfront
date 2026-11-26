import { BackendURL } from './URL';

export const DEFAULT_AD_IMAGE = '/media/images/default-ad.webp';
export const DEFAULT_AD_IMAGE_MOTORCYCLE = '/media/images/default-ad-motorcycle.webp';
export const DEFAULT_AD_IMAGE_HEAVY = '/media/images/default-ad-heavy.webp';

const MOTORCYCLE_HEAD_BRAND_ID = 6;
const HEAVY_HEAD_BRAND_ID = 7;
const CATEGORY_IDS = [5, MOTORCYCLE_HEAD_BRAND_ID, HEAVY_HEAD_BRAND_ID];

export const defaultAdImage = (ad) => {
  const headId = [
    ad?.HeadCategoryId,
    ad?.HeadBrandId,
    ad?.HeadBrand?.BrandId,
    ad?.Brand?.ParentBrand?.ParentId,
    ad?.Brand?.ParentBrand?.ParentBrand?.BrandId,
  ]
    .map(Number)
    .find((id) => CATEGORY_IDS.includes(id));
  if (headId === MOTORCYCLE_HEAD_BRAND_ID) return DEFAULT_AD_IMAGE_MOTORCYCLE;
  if (headId === HEAVY_HEAD_BRAND_ID) return DEFAULT_AD_IMAGE_HEAVY;

  const headName = String(ad?.HeadBrand?.Name ?? ad?.HeadBrand ?? '');
  if (headName.includes('موتور')) return DEFAULT_AD_IMAGE_MOTORCYCLE;
  if (headName.includes('سنگین')) return DEFAULT_AD_IMAGE_HEAVY;

  return DEFAULT_AD_IMAGE;
};

export const resolveAdImage = (path, ad) => {
  const value = String(path || '').trim();
  if (!value || value === 'default') return defaultAdImage(ad);
  if (value.startsWith('http') || value.startsWith('/media')) return value;
  if (!value.startsWith('/')) return defaultAdImage(ad);
  return `${BackendURL.slice(0, -1)}${value}`;
};
