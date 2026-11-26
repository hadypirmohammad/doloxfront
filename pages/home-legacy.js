import AdsSection from '@/components/Home/AdsSection';
import AuctionSection from '@/components/Home/AuctionSection';
import CategoryNav from '@/components/Home/CategoryNav';
import DailyPrices from '@/components/Home/DailyPrices';
import GallerySection from '@/components/Home/GallerySection';
import HeroBanner from '@/components/Home/HeroBanner';
import KhalafiSection from '@/components/Home/KhalafiSection';
import NewsSection from '@/components/Home/NewsSection';
import SearchBox from '@/components/Home/SearchBox';
import { getAuctions, getBlogs, getCarPrices, getLastads, getLastGallery } from '@/utils/Request';
import { getToken } from '@/utils/Auth';
import { resolveBackendMediaUrl } from '@/utils/media';

function mapHomePrices(items = []) {
  return items.slice(0, 6).map((item) => {
    const direction = item?.priceChange?.direction || item?.priceChange?.changeDirection || 'none';
    const changePct =
      item?.priceChange?.percent ??
      item?.priceChange?.changePercent ??
      item?.priceChange?.value ??
      null;

    return {
      brandId: item.brandId,
      name: [item.parentBrand, item.carName].filter(Boolean).join(' — ') || item.carName,
      price: item.currentPriceToman ?? item.price ?? item.latestPrice ?? null,
      change: typeof changePct === 'number' ? changePct : null,
      direction,
      icon: resolveBackendMediaUrl(item.carImage),
    };
  });
}

export async function getServerSideProps(context) {
  try {
    const token = await getToken(context);
    const [ads, autogalleries, blogs, carPrices, auctions] = await Promise.all([
      getLastads(),
      getLastGallery(),
      getBlogs(4),
      getCarPrices({ page: 1, pageSize: 6 }).catch(() => null),
      token ? getAuctions(token, '', '', '', undefined, undefined, undefined, 1, 10).catch(() => []) : [],
    ]);
    return {
      props: {
        ads: ads || [],
        autogalleries: autogalleries || [],
        blogs: blogs || [],
        dailyPrices: mapHomePrices(carPrices?.items || []),
        auctions: Array.isArray(auctions) ? auctions.slice(0, 10) : [],
      },
    };
  } catch {
    return { props: { ads: [], autogalleries: [], blogs: [], dailyPrices: [], auctions: [] } };
  }
}

const mockAds = [
  {
    Title: 'پژو ۲۰۶ تیپ ۲ مدل ۱۴۰۱',
    CityName: 'تهران',
    CoverImage: '/media/images/samplecar.png',
    BrandName: 'پژو',
    Price: 850000000,
    IsAgreement: false,
    isGest: false,
    isRent: false,
    Worked: 5000,
    Year: 1401,
    EnTitle: 'peugeot-206',
    AdFeatures: [
      {
        Feature: {
          ParentFeature: { FeatureName: 'نوع دنده ' },
          FeatureName: 'دستی',
        },
      },
    ],
  },
  {
    Title: 'پراید ۱۳۱ مدل ۱۴۰۰',
    CityName: 'اصفهان',
    CoverImage: '/media/images/samplecar.png',
    BrandName: 'سایپا',
    Price: 450000000,
    IsAgreement: true,
    isGest: true,
    isRent: false,
    Worked: 25000,
    Year: 1400,
    EnTitle: 'pride-131',
    AdFeatures: [
      {
        Feature: {
          ParentFeature: { FeatureName: 'نوع دنده ' },
          FeatureName: 'دستی',
        },
      },
    ],
  },
  {
    Title: 'سمند EF7 مدل ۱۴۰۲',
    CityName: 'مشهد',
    CoverImage: '/media/images/samplecar.png',
    BrandName: 'ایران خودرو',
    Price: 720000000,
    IsAgreement: false,
    isGest: true,
    isRent: false,
    Worked: 1200,
    Year: 1402,
    EnTitle: 'samand-ef7',
    AdFeatures: [
      {
        Feature: {
          ParentFeature: { FeatureName: 'نوع دنده ' },
          FeatureName: 'اتوماتیک',
        },
      },
    ],
  },
  {
    Title: 'دنا پلاس توربو',
    CityName: 'کرج',
    CoverImage: '/media/images/samplecar.png',
    BrandName: 'ایران خودرو',
    Price: 1150000000,
    IsAgreement: false,
    isGest: false,
    isRent: false,
    Worked: 8000,
    Year: 1402,
    EnTitle: 'dena-plus',
    AdFeatures: [
      {
        Feature: {
          ParentFeature: { FeatureName: 'نوع دنده ' },
          FeatureName: 'اتوماتیک',
        },
      },
    ],
  },
];

const mockAutos = [
  {
    company_name: 'پرشیا خودرو',
    city: 'تهران',
    logo: '/media/images/sampleautogallery.png',
  },
  {
    company_name: 'بازار خودرو پایتخت',
    city: 'تهران',
    logo: '/media/images/sampleautogallery.png',
  },
  {
    company_name: 'آژانس خودرو شرق',
    city: 'مشهد',
    logo: '/media/images/sampleautogallery.png',
  },
  {
    company_name: 'گالری خودرو البرز',
    city: 'کرج',
    logo: '/media/images/sampleautogallery.png',
  },
  {
    company_name: 'نمایندگی سایپا فردیس',
    city: 'کرج',
    logo: '/media/images/sampleautogallery.png',
  },
];

export default function Home({ ads, autogalleries, blogs, dailyPrices, auctions }) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-secondary" dir="rtl">
      <HeroBanner />
      <SearchBox />
      <CategoryNav />
      <AuctionSection auctions={auctions} />
      <AdsSection ads={ads?.length ? ads : mockAds} />
      <GallerySection galleries={autogalleries?.length ? autogalleries : mockAutos} />
      <KhalafiSection />
      <DailyPrices prices={dailyPrices} />
      <NewsSection blogs={blogs} />
    </div>
  );
}
