import { pickField } from '@/utils/Cal';

export const AD_EDIT_WINDOW_DAYS = 7;

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function publishedAt(ad) {
  const raw = pickField(ad, ['PublishDate', 'CreateDate', 'CreatedAt']);
  if (!raw) return null;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function adEditDaysLeft(ad) {
  const date = publishedAt(ad);
  if (!date) return AD_EDIT_WINDOW_DAYS;
  const passed = (Date.now() - date.getTime()) / MS_PER_DAY;
  return Math.ceil(AD_EDIT_WINDOW_DAYS - passed);
}

export function canEditAd(ad) {
  return adEditDaysLeft(ad) > 0;
}
