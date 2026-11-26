const IRAN_KHODRO = ['پژو', 'سمند', 'دنا', 'رانا', 'تارا', 'پیکان', 'ری‌ را', 'هایما'];
const SAIPA = ['سایپا', 'پراید', 'شاهین', 'اطلس', 'زامیاد', 'آریسان', 'چانگان'];
const MODIRAN = ['ام‌وی‌ام', 'چری', 'فونیکس', 'اکستریم'];
const BAHMAN = ['بستیون', 'کارا', 'مزدا'];
const KERMAN = ['جک', 'کی‌ام‌سی'];

const DOMESTIC = [...IRAN_KHODRO.filter((name) => name !== 'هایما'), 'سایپا', 'پراید', 'شاهین', 'اطلس', 'زامیاد', 'آریسان', 'سانیار موتور', 'کارا', 'پادرا موتور', 'مارس'];

const CHINESE = [
  'چری', 'ام‌وی‌ام', 'فونیکس', 'اکستریم', 'جک', 'کی‌ام‌سی', 'لیفان', 'جیلی', 'دانگ فنگ', 'دانگ فنگ سوکون',
  'هاوال', 'گریت وال', 'بی وای دی', 'چانگان', 'هونگچی', 'زیکر', 'آواتار', 'لی اتو', 'اکسپنگ', 'نیو',
  'جتور', 'بستیون', 'بایک', 'اس دبلیو ام', 'وی جی وی', 'بیسو', 'دایون', 'لاماری', 'هایما', 'ونوسیا',
  'روئوه', 'اوشان', 'کینگ لانگ', 'ریگان', 'سوئیست', 'نامی', 'لوکسژن',
];

export const GROUP_LOGO_BRAND = {
  'iran-khodro': 'دنا',
  saipa: 'سایپا',
  modiran: 'ام‌وی‌ام',
  bahman: 'بستیون',
  kerman: 'کی‌ام‌سی',
};

export const MAKER_OF = {
  پراید: 'سایپا',
  شاهین: 'سایپا',
  اطلس: 'سایپا',
};

const normalize = (value) => String(value || '').replace(/\s+/g, ' ').trim();
const inList = (list) => (brand) => list.includes(normalize(brand));

export const CAR_PRICE_GROUPS = [
  { key: 'all', label: 'همه', match: () => true },
  { key: 'iran-khodro', label: 'ایران‌خودرو', match: inList(IRAN_KHODRO) },
  { key: 'saipa', label: 'سایپا', match: inList(SAIPA) },
  { key: 'modiran', label: 'مدیران خودرو', match: inList(MODIRAN) },
  { key: 'bahman', label: 'بهمن موتور', match: inList(BAHMAN) },
  { key: 'kerman', label: 'کرمان موتور', match: inList(KERMAN) },
  { key: 'domestic', label: 'خودروهای داخلی', match: inList(DOMESTIC) },
  { key: 'foreign', label: 'خودروهای خارجی', match: (brand) => !inList(DOMESTIC)(brand) && !inList(CHINESE)(brand) },
  { key: 'chinese', label: 'خودروهای چینی', match: inList(CHINESE) },
];

export const filterByGroup = (items, key) => {
  const group = CAR_PRICE_GROUPS.find((entry) => entry.key === key) || CAR_PRICE_GROUPS[0];
  return items.filter((item) => group.match(item.brand));
};
