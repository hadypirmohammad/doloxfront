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
    IsActive: item.IsActive !== false,
  }
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
 * @param {{ cityId?: number|string|null, cityName?: string|null, search?: string, page?: number, pageSize?: number }} params
 */
export async function searchAutoGalleries({
  cityId = null,
  cityName = null,
  search = '',
  page = 1,
  pageSize = 12,
} = {}) {
  const safePage = parsePositiveInt(page, 1)
  const safePageSize = parsePositiveInt(pageSize, 12)
  const normalizedSearch = String(search || '')
    .trim()
    .toLowerCase()
  const hasFilter = Boolean(normalizedSearch || cityName || cityId)

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
        matchesCity(item, cityId, cityName)
    )

  return paginateItems(filtered, safePage, safePageSize)
}
