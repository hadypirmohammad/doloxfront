import { pickField } from '@/utils/Cal';
import { GALLERY_TYPE_NAMES } from '@/utils/services/autoGalleries';

export function galleryTypeLabel(value) {
  if (value == null || value === '') return '';
  const index = Number(value);
  if (Number.isFinite(index)) {
    return GALLERY_TYPE_NAMES[index - 1] || '';
  }
  return String(value);
}

export function galleryTypeId(name) {
  const index = GALLERY_TYPE_NAMES.indexOf(name);
  return index >= 0 ? index + 1 : 0;
}

export function galleryTone(gallery) {
  if (!gallery) return '';
  if (gallery.IsVerified ?? gallery.IsPremium ?? gallery.Verified) return 'gold';
  if (gallery.AdminApprovedAt ?? gallery.IsApproved ?? gallery.IsConfirmed ?? gallery.ApprovedAt) {
    return 'orange';
  }
  return '';
}

export function adKey(ad) {
  return pickField(ad, ['AdId']);
}

export function adGalleryId(ad) {
  const own = pickField(ad, ['GalleryId']) ?? ad?.Gallery?.GalleryId;
  return Number(own) || 0;
}

export function hasGallery(ad) {
  return adGalleryId(ad) > 0 || Boolean(ad?.GalleryName || ad?.Gallery?.Name);
}

export function isGalleryAd(ad, gallery) {
  const galleryId = Number(gallery?.GalleryId ?? gallery) || 0;
  if (!galleryId) return false;
  if (adGalleryId(ad) === galleryId) return true;
  const name = gallery?.Name;
  return Boolean(name) && (ad?.GalleryName || ad?.Gallery?.Name) === name;
}
