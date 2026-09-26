/**
 * Local mock dataset + filter for GET /api/v1/auto-galleries/search
 * Shared by the Next.js mock route and the service layer (SSR-safe).
 */

export const MOCK_AUTO_GALLERIES = [
  {
    GalleryId: 101,
    Name: 'اتوگالری آریا',
    Describe: 'فروش خودروهای داخلی و خارجی با کارشناسی تخصصی و ضمانت اصالت.',
    Adress: 'تهران، خیابان ولیعصر',
    Profile: '/img/Gallery/user(2)/doona-019dc493-7e72-3ada49.webp',
    Cover: '/img/Gallery/user(2)/doona-019dc493-7e72-80268a.webp',
    CityId: 1,
    CityName: 'تهران',
    IsActive: true,
  },
  {
    GalleryId: 102,
    Name: 'نمایشگاه پارس خودرو',
    Describe: 'تنوع کامل محصولات چینی و مونتاژی با امکان اقساط.',
    Adress: 'اصفهان، خیابان چهارباغ',
    Profile: '/img/Gallery/user(2)/doona-019dc493-7e72-3ada49.webp',
    Cover: '/img/Gallery/user(2)/doona-019dc493-7e72-80268a.webp',
    CityId: 2,
    CityName: 'اصفهان',
    IsActive: true,
  },
  {
    GalleryId: 103,
    Name: 'گالری سپهر',
    Describe: 'خرید و فروش خودروهای صفر و کارکرده با کارشناسی رایگان.',
    Adress: 'مشهد، بلوار وکیل‌آباد',
    Profile: '/img/Gallery/user(2)/doona-019dc493-7e72-3ada49.webp',
    Cover: '/img/Gallery/user(2)/doona-019dc493-7e72-80268a.webp',
    CityId: 3,
    CityName: 'مشهد',
    IsActive: true,
  },
  {
    GalleryId: 104,
    Name: 'اتوگالری نوین',
    Describe: 'تخصص در خودروهای لوکس وارداتی و خدمات پس از فروش.',
    Adress: 'شیراز، خیابان زند',
    Profile: '/img/Gallery/user(2)/doona-019dc493-7e72-3ada49.webp',
    Cover: '/img/Gallery/user(2)/doona-019dc493-7e72-80268a.webp',
    CityId: 4,
    CityName: 'شیراز',
    IsActive: true,
  },
  {
    GalleryId: 105,
    Name: 'گالری آفتاب',
    Describe: 'معاملات شفاف، قیمت رقابتی و تحویل فوری.',
    Adress: 'کرج، میدان آزادی',
    Profile: '/img/Gallery/user(2)/doona-019dc493-7e72-3ada49.webp',
    Cover: '/img/Gallery/user(2)/doona-019dc493-7e72-80268a.webp',
    CityId: 5,
    CityName: 'کرج',
    IsActive: true,
  },
  {
    GalleryId: 106,
    Name: 'نمایشگاه رادین',
    Describe: 'خرید امن خودرو با گزارش کارشناسی کامل.',
    Adress: 'تبریز، خیابان امام',
    Profile: '/img/Gallery/user(2)/doona-019dc493-7e72-3ada49.webp',
    Cover: '/img/Gallery/user(2)/doona-019dc493-7e72-80268a.webp',
    CityId: 6,
    CityName: 'تبریز',
    IsActive: true,
  },
  {
    GalleryId: 107,
    Name: 'اتوگالری هما',
    Describe: 'ویژه خودروهای خانوادگی و اقتصادی.',
    Adress: 'تهران، جنت‌آباد',
    Profile: '/img/Gallery/user(2)/doona-019dc493-7e72-3ada49.webp',
    Cover: '/img/Gallery/user(2)/doona-019dc493-7e72-80268a.webp',
    CityId: 1,
    CityName: 'تهران',
    IsActive: true,
  },
  {
    GalleryId: 108,
    Name: 'گالری یاران',
    Describe: 'مشاوره تخصصی قبل از خرید و امکان معاوضه.',
    Adress: 'اصفهان، مرداویج',
    Profile: '/img/Gallery/user(2)/doona-019dc493-7e72-3ada49.webp',
    Cover: '/img/Gallery/user(2)/doona-019dc493-7e72-80268a.webp',
    CityId: 2,
    CityName: 'اصفهان',
    IsActive: true,
  },
  {
    GalleryId: 109,
    Name: 'نمایشگاه البرز',
    Describe: 'فروش اقساطی با کمترین پیش‌پرداخت.',
    Adress: 'کرج، عظیمیه',
    Profile: '/img/Gallery/user(2)/doona-019dc493-7e72-3ada49.webp',
    Cover: '/img/Gallery/user(2)/doona-019dc493-7e72-80268a.webp',
    CityId: 5,
    CityName: 'کرج',
    IsActive: true,
  },
  {
    GalleryId: 110,
    Name: 'اتوگالری نگین',
    Describe: 'انتخابی مطمئن برای خرید خودروهای کارکرده تمیز.',
    Adress: 'مشهد، هاشمیه',
    Profile: '/img/Gallery/user(2)/doona-019dc493-7e72-3ada49.webp',
    Cover: '/img/Gallery/user(2)/doona-019dc493-7e72-80268a.webp',
    CityId: 3,
    CityName: 'مشهد',
    IsActive: true,
  },
  {
    GalleryId: 111,
    Name: 'گالری ستاره',
    Describe: 'نمایندگی فروش خودروهای مونتاژی روز.',
    Adress: 'شیراز، معالی‌آباد',
    Profile: '/img/Gallery/user(2)/doona-019dc493-7e72-3ada49.webp',
    Cover: '/img/Gallery/user(2)/doona-019dc493-7e72-80268a.webp',
    CityId: 4,
    CityName: 'شیراز',
    IsActive: false,
  },
  {
    GalleryId: 112,
    Name: 'نمایشگاه آرمان',
    Describe: 'کارشناسی فنی، رنگ، و بدنه قبل از معامله.',
    Adress: 'تهران، سعادت‌آباد',
    Profile: '/img/Gallery/user(2)/doona-019dc493-7e72-3ada49.webp',
    Cover: '/img/Gallery/user(2)/doona-019dc493-7e72-80268a.webp',
    CityId: 1,
    CityName: 'تهران',
    IsActive: true,
  },
  {
    GalleryId: 113,
    Name: 'اتوگالری پردیس',
    Describe: 'تنوع بالا در شاسی‌بلند و کراس‌اوور.',
    Adress: 'تبریز، ولیعصر',
    Profile: '/img/Gallery/user(2)/doona-019dc493-7e72-3ada49.webp',
    Cover: '/img/Gallery/user(2)/doona-019dc493-7e72-80268a.webp',
    CityId: 6,
    CityName: 'تبریز',
    IsActive: true,
  },
  {
    GalleryId: 114,
    Name: 'گالری امید',
    Describe: 'خرید و فروش سریع با قیمت روز بازار.',
    Adress: 'اصفهان، سپاهان‌شهر',
    Profile: '/img/Gallery/user(2)/doona-019dc493-7e72-3ada49.webp',
    Cover: '/img/Gallery/user(2)/doona-019dc493-7e72-80268a.webp',
    CityId: 2,
    CityName: 'اصفهان',
    IsActive: true,
  },
  {
    GalleryId: 115,
    Name: 'نمایشگاه کارن',
    Describe: 'ویژه خودروهای اقتصادی و کارکرد پایین.',
    Adress: 'مشهد، احمدآباد',
    Profile: '/img/Gallery/user(2)/doona-019dc493-7e72-3ada49.webp',
    Cover: '/img/Gallery/user(2)/doona-019dc493-7e72-80268a.webp',
    CityId: 3,
    CityName: 'مشهد',
    IsActive: true,
  },
]

/** Cities available for the gallery search filter (matches mock CityId values). */
export const MOCK_AUTO_GALLERY_CITIES = [
  { CityId: 1, CityName: 'تهران' },
  { CityId: 2, CityName: 'اصفهان' },
  { CityId: 3, CityName: 'مشهد' },
  { CityId: 4, CityName: 'شیراز' },
  { CityId: 5, CityName: 'کرج' },
  { CityId: 6, CityName: 'تبریز' },
]

function parsePositiveInt(value, fallback) {
  const n = Number.parseInt(value, 10)
  return Number.isFinite(n) && n > 0 ? n : fallback
}

/**
 * Returns the future API response shape for auto-gallery search.
 */
export function mockSearchAutoGalleries({
  cityId = null,
  search = '',
  page = 1,
  pageSize = 12,
} = {}) {
  const safePage = parsePositiveInt(page, 1)
  const safePageSize = parsePositiveInt(pageSize, 12)
  const parsedCityId =
    cityId !== null && cityId !== undefined && cityId !== ''
      ? Number.parseInt(cityId, 10)
      : null
  const normalizedSearch = String(search || '')
    .trim()
    .toLowerCase()

  let filtered = MOCK_AUTO_GALLERIES.filter((item) => item.IsActive)

  if (Number.isFinite(parsedCityId)) {
    filtered = filtered.filter((item) => item.CityId === parsedCityId)
  }

  if (normalizedSearch) {
    filtered = filtered.filter((item) => {
      const haystack = `${item.Name} ${item.Describe} ${item.Adress} ${item.CityName || ''}`.toLowerCase()
      return haystack.includes(normalizedSearch)
    })
  }

  const totalCount = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalCount / safePageSize) || 1)
  const currentPage = Math.min(safePage, totalPages)
  const start = (currentPage - 1) * safePageSize

  return {
    Items: filtered.slice(start, start + safePageSize),
    Page: currentPage,
    PageSize: safePageSize,
    TotalPages: totalPages,
    TotalCount: totalCount,
  }
}
