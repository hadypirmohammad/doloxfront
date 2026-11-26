/**
 * Auto gallery search service
 *
 * Uses existing GET /GetGalleries?page=&count=
 * Search/city filters are applied client-side until a real search API exists.
 */

import { getAutogalleriesall, getcities } from '@/utils/Request'

function parsePositiveInt(value, fallback) {
  const n = Number.parseInt(value, 10)
  return Number.isFinite(n) && n > 0 ? n : fallback
}

function cleanManagerName(value) {
  const words = String(value || '').trim().split(/\s+/).filter(Boolean)
  const unique = words.filter((word, index) => word !== words[index - 1])
  return unique.join(' ')
}

function normalizeGalleryItem(item) {
  return {
    GalleryId: item.GalleryId,
    Name: item.Name || '',
    Describe: item.Describe || '',
    Adress: item.Adress || '',
    Profile: item.Profile || '',
    Cover: item.Cover || '',
    CityId: item.CityId ?? null,
    CityName: item.CityName ?? null,
    ProvinceName: item.ProvinceName ?? null,
    ManagerName: cleanManagerName(item.ManagerName ?? item.Manager ?? ''),
    GalleryType: item.GalleryType ?? item.Type ?? '',
    Mobile: item.Mobile ?? '',
    Phone: item.Phone ?? '',
    Email: item.Email ?? '',
    IsActive: item.IsActive !== false,
    IsFavorite: item.IsFavorite ?? null,
    IsVerified: Boolean(item.IsVerified ?? item.IsPremium ?? item.Verified),
    IsApproved: Boolean(item.AdminApprovedAt ?? item.IsApproved ?? item.IsConfirmed ?? item.ApprovedAt),
  }
}

export const GALLERY_STATUSES = [
  { id: '', label: 'همه گالری‌ها' },
  { id: 'verified', label: 'معتبر' },
  { id: 'approved', label: 'تایید شده' },
]

export const GALLERY_TYPE_NAMES = [
  'اتوگالری',
  'گالری موتور سیکلت',
  'گالری خودرو سنگین',
  'نمایندگی',
  'دفتر فروش',
  'شرکت خودرویی',
]

export const GALLERY_TYPES = [
  { id: '', label: 'همه گالری ها' },
  ...GALLERY_TYPE_NAMES.map((name) => ({ id: name, label: name })),
]

export function galleryCityLabel(gallery) {
  const city = gallery?.CityName || gallery?.city
  if (city) return city

  const first = String(gallery?.Adress || '').split('،')[0].trim()
  return first ? first.split(' ')[0] : ''
}

export function galleryBadge(item) {
  if (item?.IsVerified) return 'معتبر'
  if (item?.IsApproved) return 'تایید شده'
  return ''
}

export function adGalleryBadge(ad) {
  const name = ad?.GalleryName ?? ad?.Gallery?.Name ?? ''
  if (!name) return null

  const verified = Boolean(ad?.IsGalleryVerified ?? ad?.Gallery?.IsVerified)
  const approved = Boolean(ad?.IsGalleryApproved ?? ad?.Gallery?.AdminApprovedAt)
  if (!verified && !approved) return null

  return { name, tone: verified ? 'gold' : 'orange' }
}

function matchesStatus(item, status) {
  if (!status) return true
  if (status === 'verified') return Boolean(item.IsVerified)
  if (status === 'approved') return Boolean(item.IsApproved)
  return true
}

function matchesType(item, type) {
  if (!type) return true
  const index = Number(item.GalleryType)
  const label = Number.isFinite(index) ? GALLERY_TYPE_NAMES[index - 1] || '' : String(item.GalleryType || '')
  return label === type
}

function paginateItems(items, page, pageSize) {
  const totalCount = items.length
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize) || 1)
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * pageSize

  return {
    Items: items.slice(start, start + pageSize),
    Page: currentPage,
    PageSize: pageSize,
    TotalPages: totalPages,
    TotalCount: totalCount,
  }
}

function matchesSearch(item, search) {
  if (!search) return true
  const haystack = `${item.Name} ${item.Describe} ${item.Adress} ${item.CityName || ''}`.toLowerCase()
  return haystack.includes(search)
}

function matchesCity(item, cityId, cityName) {
  if (!cityId && !cityName) return true

  if (item.CityId != null && cityId != null && cityId !== '') {
    return String(item.CityId) === String(cityId)
  }

  if (cityName) {
    return String(item.Adress || '')
      .toLowerCase()
      .includes(String(cityName).toLowerCase())
  }

  return true
}

function flattenCities(cities) {
  if (!Array.isArray(cities)) return []

  const result = []
  for (const city of cities) {
    if (!city) continue
    result.push({ CityId: city.CityId, CityName: city.CityName })
    if (Array.isArray(city.ChildrenCities)) {
      for (const child of city.ChildrenCities) {
        if (!child) continue
        result.push({ CityId: child.CityId, CityName: child.CityName })
      }
    }
  }
  return result
}

/**
 * Cities for the gallery filter UI (from GetCities).
 */
export async function getAutoGalleryFilterCities() {
  try {
    const cities = await getcities()
    const flat = flattenCities(cities)
    if (flat.length > 0) return flat
  } catch (error) {
    console.error('Failed to load cities for gallery filter:', error)
  }
  return []
}

/**
 * Search / list auto galleries from GetGalleries.
 *
 * @param {{ cityId?: number|string|null, cityName?: string|null, search?: string, status?: string, type?: string, page?: number, pageSize?: number }} params
 */
export async function searchAutoGalleries({
  cityId = null,
  cityName = null,
  search = '',
  status = '',
  type = '',
  page = 1,
  pageSize = 12,
} = {}) {
  const safePage = parsePositiveInt(page, 1)
  const safePageSize = parsePositiveInt(pageSize, 12)
  const normalizedSearch = String(search || '')
    .trim()
    .toLowerCase()
  const hasFilter = Boolean(normalizedSearch || cityName || cityId || status || type)

  // No filters → use GetGalleries pagination as-is
  if (!hasFilter) {
    const data = await getAutogalleriesall(safePage, safePageSize)
    return {
      Items: (data?.Items || []).map(normalizeGalleryItem),
      Page: data?.PageNumber ?? safePage,
      PageSize: data?.PageSize ?? safePageSize,
      TotalPages: data?.TotalPages ?? 1,
      TotalCount: data?.TotalCount ?? (data?.Items?.length || 0),
    }
  }

  // Filters → load a larger batch from GetGalleries, filter, then paginate
  const data = await getAutogalleriesall(1, 200)
  const filtered = (data?.Items || [])
    .map(normalizeGalleryItem)
    .filter(
      (item) =>
        matchesSearch(item, normalizedSearch) &&
        matchesCity(item, cityId, cityName) &&
        matchesStatus(item, status) &&
        matchesType(item, type)
    )

  return paginateItems(filtered, safePage, safePageSize)
}
