import AdsItem from '@/components/global/AdsItem'
import DoubleSlider from '@/components/global/DoubleSlider'
import StateCitySelect from '@/components/global/StateCitySelect'
import {
  HOME_CATEGORIES,
  PASSENGER_HEAD_BRAND_ID,
  VANET_CATEGORY_ID,
  VANET_KEYWORD,
  getCategoryQuery,
} from '@/components/Home/CategoryNav'
import SearchBox from '@/components/Home/SearchBox'
import PhoneFilterOptions from '@/components/Search/PhoneFilterOptions';
import PhoneSortOptions from '@/components/Search/PhoneSortOptions';
import { getCities, searchAds, getBrands } from '@/utils/Request';
import { normalizeSearchTerm } from '@/utils/Cal';
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useRouter } from 'next/router';

const DEFAULT_BRAND = {
  BrandId: -1,
  Image: '/img/BrandIcon/BMW.jpeg',
  Name: 'انتخاب کنید',
  ParentId: -1,
};

export async function getServerSideProps(context) {
  const { query } = context;
  const page = query.page || 1;
  const limit = query.limit || 20;
  const search = query.search || null;
  const barId = query.barId || null;
  const CityId = query.cityId || null;
  const BrandId = query.brandId || null;
  const yearMin = query.yearMin || null;
  const yearMax = query.yearMax || null;
  const workedMin = query.workedMin || null;
  const workedMax = query.workedMax || null;
  const priceMin = query.priceMin || null;
  const priceMax = query.priceMax || null;
  const vehicleType = query.type === VANET_CATEGORY_ID ? VANET_CATEGORY_ID : null;
  const headBrandId = vehicleType ? PASSENGER_HEAD_BRAND_ID : Number(query.headBrandId) || PASSENGER_HEAD_BRAND_ID;
  const searchTerm = search || (vehicleType ? VANET_KEYWORD : null);

  const ads = await searchAds(page, limit, searchTerm, barId, CityId, BrandId, yearMin, yearMax, workedMin, workedMax, priceMin, priceMax, headBrandId);
  const cities = await getCities()
  const brands = await getBrands(headBrandId)

  return {
    props: {
      initialAds: ads || [],
      cities: cities || [],
      brands: brands || [],
      headBrandId,
      vehicleType,
    },
  };
}

const Ads = ({ initialAds, cities, brands: initialBrands, headBrandId: initialHeadBrandId, vehicleType = null }) => {
  const router = useRouter();

  const [ads, setAds] = useState(initialAds);
  const [brands, setBrands] = useState(initialBrands);
  const [headBrandId, setHeadBrandId] = useState(initialHeadBrandId || PASSENGER_HEAD_BRAND_ID);
  const activeCategoryId = vehicleType === VANET_CATEGORY_ID ? VANET_CATEGORY_ID : headBrandId;
  const [sortoption, setsortoption] = useState({ id: 1, label: "جدیدترین", value: "Newest" });
  const [filtersActive, setFiltersActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const [city, setCity] = useState(cities[0]);
  const [brand, setBrand] = useState(DEFAULT_BRAND);
  const [year, setYear] = useState({ min: 1380, max: 1404 });
  const [worked, setWorked] = useState({ min: 0, max: 1000000 });
  const [price, setPrice] = useState({ min: 0, max: 1000000 });

  const [debouncedFilters, setDebouncedFilters] = useState({ city, brand, year, worked, price });

  useEffect(() => {
    setAds(initialAds);
    setBrands(initialBrands || []);
    setHeadBrandId(initialHeadBrandId || PASSENGER_HEAD_BRAND_ID);
    setBrand(DEFAULT_BRAND);
    setPage(1);
    setHasMore(true);
  }, [initialAds, initialBrands, initialHeadBrandId]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters({ city, brand, year, worked, price });
    }, 500);
    return () => clearTimeout(handler);
  }, [city, brand, year, worked, price]);

  const fetchMoreAds = useCallback(async (nextPage) => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const q = router.query;
      const limit = 6;

      const newAds = await searchAds(
        nextPage,
        limit,
        q.search || (vehicleType ? VANET_KEYWORD : null),
        q.barId || null,
        q.cityId || null,
        q.brandId || null,
        q.yearMin || null,
        q.yearMax || null,
        q.workedMin || null,
        q.workedMax || null,
        q.priceMin || null,
        q.priceMax || null,
        headBrandId
      );

      if (!newAds || newAds.length === 0) {
        setHasMore(false);
      } else {
        setAds(prev => [...prev, ...newAds]);
        setPage(nextPage);

        if (newAds.length < limit) {
          setHasMore(false);
        }
      }
    } catch (err) {
      console.error("Error loading more ads", err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, router.query, vehicleType, headBrandId]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 400) {
        if (hasMore && !loading) {
          fetchMoreAds(page + 1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading, page, fetchMoreAds]);

  const changeCategory = (id) => {
    if (id === activeCategoryId) return;
    const nextQuery = { ...router.query, ...getCategoryQuery(id) };
    if (id !== VANET_CATEGORY_ID) delete nextQuery.type;
    delete nextQuery.brandId;
    delete nextQuery.page;
    setBrand(DEFAULT_BRAND);
    router.push({ pathname: '/ads', query: nextQuery });
  };

  const visibleAds = useMemo(() => {
    return ads.filter((ad) => {
      const isVanet = normalizeSearchTerm(ad?.Title).includes(VANET_KEYWORD);

      if (vehicleType === VANET_CATEGORY_ID && !isVanet) return false;
      if (vehicleType !== VANET_CATEGORY_ID && headBrandId === PASSENGER_HEAD_BRAND_ID && isVanet) return false;

      return true;
    });
  }, [ads, vehicleType, headBrandId]);

  useEffect(() => {
    const { city, brand, year, worked, price } = debouncedFilters;
    const currentQuery = router.query;
    let newQuery = {};

    if (currentQuery.search) newQuery.search = currentQuery.search;
    if (headBrandId) newQuery.headBrandId = headBrandId;
    if (currentQuery.type === VANET_CATEGORY_ID) newQuery.type = VANET_CATEGORY_ID;

    const defaults = { yearMin: 1380, yearMax: 1404, workedMin: 0, workedMax: 1000000, priceMin: 0, priceMax: 1000000, barId: 1 };

    if (filtersActive) {
      if (city?.CityId) newQuery.cityId = city.CityId;
      if (brand?.BrandId != -1) newQuery.brandId = brand.BrandId;
      if (year.min !== defaults.yearMin) newQuery.yearMin = year.min;
      if (year.max !== defaults.yearMax) newQuery.yearMax = year.max;
      if (worked.min !== defaults.workedMin) newQuery.workedMin = worked.min;
      if (worked.max !== defaults.workedMax) newQuery.workedMax = worked.max;
      if (price.min !== defaults.priceMin) newQuery.priceMin = price.min;
      if (price.max !== defaults.priceMax) newQuery.priceMax = price.max;
    }

    if (sortoption?.id && sortoption.id !== defaults.barId) {
      newQuery.barId = sortoption.id;
    }

    router.push({ pathname: "/ads", query: newQuery });
  }, [sortoption, filtersActive, debouncedFilters, headBrandId]);

  const sortlist = [
    { id: 1, label: "جدیدترین", value: "Newest" },
    { id: 2, label: "قدیمی‌ترین", value: "Oldest" },
    { id: 3, label: "ارزان‌ترین", value: "Cheapest" },
    { id: 4, label: "گران‌ترین", value: "Expensive" },
    { id: 5, label: "بیشترین کارکرد", value: "MostWorked" },
    { id: 6, label: "کمترین کارکرد", value: "LeastWorked" },
    { id: 7, label: "فوری", value: "Fouri" },
  ];

  const categoryFilter = (
    <div className="grid grid-cols-2 gap-2">
      {HOME_CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => changeCategory(cat.id)}
          className={`rounded-xl border px-2 py-2 text-[11px] transition sm:text-[12px] ${
            activeCategoryId === cat.id
              ? 'border-primary bg-primary/10 font-bold text-primary'
              : 'border-[#E5E5E5] bg-white text-secondary hover:border-primary/40'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-secondary" dir="rtl">
      <SearchBox className="bg-[#FAFAFA] px-3 pt-4 sm:px-4 sm:pt-6" />

      <div className="mx-auto flex max-w-screen-xl gap-4 px-3 py-6 sm:px-4 sm:py-8 lg:gap-6">
        <aside className="hidden w-full max-w-[280px] shrink-0 lg:block">
          <div className="sticky top-24 overflow-hidden rounded-2xl border border-[#F0F0F0] bg-white shadow-[0_6px_20px_rgba(36,59,83,0.05)]">
            <div className="border-b border-[#F0F0F0] px-4 py-4">
              <h2 className="text-lg text-secondary">فیلتر</h2>
            </div>

            <div className="px-3 py-2">
              <div className="px-1 py-3">
                <p className="mb-2 text-sm font-medium">دسته‌بندی</p>
                {categoryFilter}
              </div>

              <div className="h-px w-full bg-[#F0F0F0]" />

              <div className="collapse collapse-arrow">
                <input type="checkbox" />
                <div className="collapse-title text-sm font-medium">شهر</div>
                <div className="collapse-content">
                  <StateCitySelect
                    cities={cities}
                    value={city}
                    returnObject
                    onChange={(selectedCity) => setCity(selectedCity)}
                  />
                </div>
              </div>

              <div className="h-px w-full bg-[#F0F0F0]" />

              <div className="collapse collapse-arrow">
                <input type="checkbox" defaultChecked />
                <div className="collapse-title text-sm font-medium">برند</div>
                <div className="collapse-content">
                  <select
                    className="select select-bordered w-full border-[#E5E5E5] bg-white text-secondary"
                    onChange={(e) => {
                      const selectedBrand = brands.find((b) => b.BrandId === parseInt(e.target.value));
                      setBrand(selectedBrand || DEFAULT_BRAND);
                    }}
                    value={brand?.BrandId > 0 ? brand.BrandId : ''}
                  >
                    <option disabled value="">انتخاب برند</option>
                    {brands?.map((b, index) => (
                      <option key={index} value={b.BrandId}>{b.Name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="h-px w-full bg-[#F0F0F0]" />

              <div className="collapse collapse-arrow">
                <input type="checkbox" />
                <div className="collapse-title text-sm font-medium">سال تولید</div>
                <div className="collapse-content">
                  <div className="flex h-20 items-center justify-center gap-3">
                    <span>از</span>
                    <input
                      className="h-10 w-full rounded-xl border border-[#E5E5E5] bg-white text-center text-secondary"
                      type="number"
                      placeholder="1380"
                      value={year.min}
                      onChange={(e) => setYear({ ...year, min: parseInt(e.target.value) || 0 })}
                    />
                    <span>تا</span>
                    <input
                      className="h-10 w-full rounded-xl border border-[#E5E5E5] bg-white text-center text-secondary"
                      type="number"
                      placeholder="1404"
                      value={year.max}
                      onChange={(e) => setYear({ ...year, max: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </div>

              <div className="h-px w-full bg-[#F0F0F0]" />

              <div className="collapse collapse-arrow">
                <input type="checkbox" />
                <div className="collapse-title text-sm font-medium">کارکرد</div>
                <div className="collapse-content">
                  <div className="flex h-20 justify-center">
                    <DoubleSlider
                      min="0"
                      max="1000000"
                      currentMin={worked.min}
                      currentMax={worked.max}
                      onChange={({ min, max }) => setWorked({ min, max })}
                    />
                  </div>
                </div>
              </div>

              <div className="h-px w-full bg-[#F0F0F0]" />

              <div className="collapse collapse-arrow">
                <input type="checkbox" />
                <div className="collapse-title text-sm font-medium">قیمت ها</div>
                <div className="collapse-content">
                  <div className="flex h-20 justify-center">
                    <DoubleSlider
                      min="0"
                      max="1000000"
                      currentMin={price.min}
                      currentMax={price.max}
                      onChange={({ min, max }) => setPrice({ min, max })}
                    />
                  </div>
                </div>
              </div>

              <button
                className="mb-4 mt-2 flex h-11 w-full items-center justify-center rounded-xl bg-primary text-sm text-white"
                onClick={() => setFiltersActive((prev) => !prev)}
              >
                {!filtersActive ? 'اعمال فیلتر' : 'حذف فیلتر ها'}
              </button>
              <div className="mx-auto mt-auto h-4 w-24 rounded-t-3xl bg-[#FAFAFA]" />
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <h1 className="mb-4 hidden text-2xl text-secondary lg:block">آگهی های خودرو</h1>

          <div className="mb-3 hidden flex-wrap gap-3 border-b border-[#EAEAEA] pb-3 text-sm lg:flex">
            {sortlist.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setsortoption(item)}
                className={`rounded-lg px-3 py-1.5 transition ${
                  item.label === sortoption.label
                    ? 'bg-primary text-white'
                    : 'bg-white text-secondary hover:bg-primary/10'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mb-3 flex w-full justify-between lg:hidden">
            <PhoneSortOptions currentSortOption={sortoption} sortlist={sortlist} setSortoption={setsortoption} />
            <PhoneFilterOptions
              cities={cities}
              brands={brands}
              city={city}
              setCity={setCity}
              brand={brand}
              setBrand={setBrand}
              year={year}
              setYear={setYear}
              worked={worked}
              setWorked={setWorked}
              price={price}
              setPrice={setPrice}
              setFilter={setFiltersActive}
              filtersActive={filtersActive}
              headBrandId={activeCategoryId}
              onCategoryChange={changeCategory}
            />
          </div>

          <h1 className="mb-4 text-lg text-secondary lg:hidden">آگهی های خودرو</h1>

          <div className="grid min-h-screen grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visibleAds.map((ad, index) => (
              <AdsItem key={ad.AdId || index} ad={ad} />
            ))}

            {loading && (
              <div className="col-span-full flex justify-center py-6">
                <span className="loading loading-spinner loading-md text-primary" />
              </div>
            )}

            {!hasMore && visibleAds.length > 0 && (
              <div className="col-span-full py-10 text-center text-[#8A8A8A]">
                تمام آگهی‌ها نمایش داده شد
              </div>
            )}

            {visibleAds.length === 0 && !loading && (
              <div className="col-span-full py-16 text-center text-lg text-secondary">
                نتیجه‌ای یافت نشد
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Ads
