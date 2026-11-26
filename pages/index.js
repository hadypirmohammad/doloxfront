import { useState } from 'react';
import AdsSection from '@/components/Home/AdsSection';
import SectionShell from '@/components/HomeV2/SectionShell';
import NewsV2 from '@/components/HomeV2/NewsV2';
import AuctionsV2 from '@/components/HomeV2/AuctionsV2';
import GalleriesBannerV2 from '@/components/HomeV2/GalleriesBannerV2';
import HeroV2 from '@/components/HomeV2/HeroV2';
import PopularBrandsV2 from '@/components/HomeV2/PopularBrandsV2';
import VehicleTypesV2 from '@/components/HomeV2/VehicleTypesV2';
import { getToken } from '@/utils/Auth';
import CarPricesV2 from '@/components/HomeV2/CarPricesV2';
import { getPricedCars } from '@/utils/services/carPriceIndex';
import { withProvinceNames } from '@/utils/cities';
import HomePopups from '@/components/HomeV2/HomePopups';
import { getAuctions, getBlogs, getBodyTypes, getcities } from '@/utils/Request';
import { useHomeData } from '@/hooks/useHomeData';

const HEAD_BRANDS = [5, 6, 7];

export async function getServerSideProps(context) {
  const token = await getToken(context);

  const [blogs, cities, auctions, carPrices, bodyTypes] = await Promise.all([
    getBlogs(4).catch(() => []),
    getcities().catch(() => []),
    getAuctions(token || '', '', '', '', undefined, undefined, undefined, 1, 6).catch(() => []),
    getPricedCars({ waitMs: 6000 }).catch(() => []),
    getBodyTypes().catch(() => []),
  ]);

  return {
    props: {
      blogs: Array.isArray(blogs) ? blogs : [],
      cities: Array.isArray(cities) ? cities : [],
      auctions: Array.isArray(auctions) ? auctions.slice(0, 6) : [],
      hasSubscription: Boolean(token),
      carPrices,
      bodyTypes,
    },
  };
}

const Home = ({ blogs, cities, auctions, hasSubscription, carPrices = [], bodyTypes = [] }) => {
  const [headBrandId, setHeadBrandId] = useState(5);
  const { ads, brands, loading } = useHomeData(headBrandId);

  const adsWithProvince = withProvinceNames(ads, cities);

  const brandLogos = Object.fromEntries(
    brands.filter((brand) => brand.headBrandId === headBrandId).map((brand) => [brand.Name.trim(), brand.Image])
  );

  const brandIndex = Object.fromEntries(
    brands.map((brand) => [brand.BrandId, { name: brand.Name, image: brand.Image }])
  );

  const filteredBrands = brands.filter((brand) => brand.headBrandId === headBrandId);

  return (
  <div dir="rtl" className="relative min-h-screen overflow-hidden bg-[#EEF2F7] text-secondary">
    <span className="pointer-events-none absolute -right-40 top-[18%] h-[520px] w-[520px] rounded-full bg-[#FF5E00]/10 blur-[120px]" />
    <span className="pointer-events-none absolute -left-48 top-[48%] h-[560px] w-[560px] rounded-full bg-[#2BA8D6]/14 blur-[130px]" />
    <span className="pointer-events-none absolute right-[22%] bottom-[8%] h-[460px] w-[460px] rounded-full bg-[#1E2A3A]/8 blur-[120px]" />
    <HomePopups />
    <div className="relative">
      <HeroV2
        brands={brands}
        cities={cities}
        headBrandId={headBrandId}
        onCategoryChange={setHeadBrandId}
      />
    <VehicleTypesV2 headBrandId={headBrandId} bodyTypes={bodyTypes} connect={false} />
    <SectionShell title="آخرین آگهی ها" href="/ads" plain>
        <AdsSection ads={adsWithProvince} surface="" bare brandIndex={brandIndex} />
      </SectionShell>
    <AuctionsV2 auctions={auctions} hasSubscription={hasSubscription} />
    <GalleriesBannerV2 />
    <PopularBrandsV2 brands={filteredBrands} />
    <CarPricesV2 items={carPrices} logos={brandLogos} />
    <SectionShell title="آخرین اخبار" href="https://blog.dolox.ir">
        <NewsV2 blogs={blogs} />
      </SectionShell>
      </div>
    </div>
  );
};

export default Home;
