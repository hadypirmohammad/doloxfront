import AdsItem from '@/components/global/AdsItem'
import DoubleSlider from '@/components/global/DoubleSlider'
import MultiCitySelect from '@/components/global/MultiCitySelect'
import {
  HOME_CATEGORIES,
  PASSENGER_HEAD_BRAND_ID,
  ALL_CATEGORY_ID,
  getCategoryQuery,
} from '@/components/Home/CategoryNav'
import SearchBox from '@/components/Home/SearchBox'
import PhoneFilterOptions from '@/components/Search/PhoneFilterOptions';
import PhoneSortOptions from '@/components/Search/PhoneSortOptions';
import { getBodyTypes, getCities, searchAds, getBrands } from '@/utils/Request';
import { normalizeSearchTerm } from '@/utils/Cal';
import { withProvinceNames } from '@/utils/cities';
import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/router';
import Link from 'next/link';
import { bodyTypeName } from '@/utils/services/bodyTypes';

const VANET_CATEGORY_ID = 0;
const VANET_KEYWORD = 'وانت';

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
  const barId = query.barId || 1;
  const CityId = query.cityId ? [].concat(query.cityId) : null;
  const BrandId = query.brandId || null;
  const bodyTypeId = query.bodyTypeId || null;
  const yearMin = query.yearMin || null;
  const yearMax = query.yearMax || null;
  const workedMin = query.workedMin || null;
  const workedMax = query.workedMax || null;
  const priceMin = query.priceMin || null;
  const priceMax = query.priceMax || null;
  
  // Handle 'all' category - no headBrandId filter
  const isAllCategory = query.headBrandId === 'all';
  const headBrandId = isAllCategory ? 0 : Number(query.headBrandId) || PASSENGER_HEAD_BRAND_ID;

  const [ads, cities, brands, bodyTypes] = await Promise.all([
    searchAds(page, limit, search, barId, CityId, BrandId, yearMin, yearMax, workedMin, workedMax, priceMin, priceMax, headBrandId, bodyTypeId).catch(() => []),
    getCities().catch(() => []),
    getBrands(headBrandId || PASSENGER_HEAD_BRAND_ID).catch(() => []),
    bodyTypeId ? getBodyTypes().catch(() => []) : [],
  ]);

  return {
    props: {
      initialAds: withProvinceNames(ads || [], cities || []).map((ad) => ({ ...ad, HeadCategoryId: headBrandId })),
      cities: cities || [],
      brands: brands || [],
      headBrandId,
      isAllCategory,
      bodyTypeLabel: bodyTypeName(bodyTypes, bodyTypeId),
    },
  };
}

const Ads = ({ initialAds, cities, brands: initialBrands, headBrandId: initialHeadBrandId, isAllCategory = false, bodyTypeLabel = '' }) => {
  const router = useRouter();
  const vehicleType = router.query.type || router.query.headBrandId;
  const bodyType = router.query.bodyTypeId && bodyTypeLabel ? { label: bodyTypeLabel } : null;
  const pageTitle = isAllCategory ? 'همه آگهی‌ها' : (bodyType ? `آگهی‌های ${bodyType.label}` : 'آگهی های خودرو');
  const clearBodyTypeQuery = { ...router.query };
  delete clearBodyTypeQuery.bodyTypeId;
  const hasActiveFilters = Object.keys(router.query || {}).some(
    (key) => !['page', 'limit'].includes(key)
  );

  const [ads, setAds] = useState(initialAds);
  const [brands, setBrands] = useState(initialBrands);
  const [headBrandId, setHeadBrandId] = useState(initialHeadBrandId || PASSENGER_HEAD_BRAND_ID);
  const activeCategoryId = isAllCategory ? ALL_CATEGORY_ID : headBrandId;
  const [sortoption, setsortoption] = useState({ id: 1, label: "جدیدترین", value: "Newest" });
  const [filtersActive, setFiltersActive] = useState(false);
  const syncedOnce = useRef(false);
  const [filterResetKey, setFilterResetKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const [city, setCity] = useState([]);
  const [brand, setBrand] = useState(DEFAULT_BRAND);
  const [year, setYear] = useState();
  const [worked, setWorked] = useState({ min: 0, max: 1000000 });
  const [price, setPrice] = useState({ min: 0, max: 100000000000 });

  const [debouncedFilters, setDebouncedFilters] = useState({ city, brand, year, worked, price });

  useEffect(() => {
    setAds(initialAds);
    setBrands(initialBrands || []);
    setHeadBrandId(initialHeadBrandId || PASSENGER_HEAD_BRAND_ID);
    setPage(1);
    setHasMore(true);
  }, [initialAds, initialBrands, initialHeadBrandId]);

  useEffect(() => {
    setBrand(DEFAULT_BRAND);
  }, [initialHeadBrandId]);

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
        q.barId || 1,
        q.cityId ? [].concat(q.cityId) : null,
        q.brandId || null,
        q.yearMin || null,
        q.yearMax || null,
        q.workedMin || null,
        q.workedMax || null,
        q.priceMin || null,
        q.priceMax || null,
        headBrandId,
        q.bodyTypeId || null
      );

      if (!newAds || newAds.length === 0) {
        setHasMore(false);
      } else {
        setAds(prev => [...prev, ...newAds.map((ad) => ({ ...ad, HeadCategoryId: headBrandId }))]);
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

  const resetFilters = () => {
    setCity([]);
    setBrand(DEFAULT_BRAND);
    setYear({ min: 1380, max: 1404 });
    setWorked({ min: 0, max: 1000000 });
    setPrice({ min: 0, max: 100000000000 });
    setFilterResetKey((key) => key + 1);
  };

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
    if (!syncedOnce.current) {
      syncedOnce.current = true;
      return;
    }

    const { city, brand, year, worked, price } = debouncedFilters;
    const currentQuery = router.query;
    let newQuery = {};

    if (currentQuery.search) newQuery.search = currentQuery.search;
    if (currentQuery.bodyTypeId) newQuery.bodyTypeId = currentQuery.bodyTypeId;
    if (headBrandId) newQuery.headBrandId = headBrandId;
    if (currentQuery.type === VANET_CATEGORY_ID) newQuery.type = VANET_CATEGORY_ID;

    if (!filtersActive) {
      ['cityId', 'brandId', 'yearMin', 'yearMax', 'workedMin', 'workedMax', 'priceMin', 'priceMax']
        .forEach((key) => {
          if (currentQuery[key]) newQuery[key] = currentQuery[key];
        });
    }

    const defaults = { yearMin: 1380, yearMax: 1404, workedMin: 0, workedMax: 1000000, priceMin: 0, priceMax: 100000000000, barId: 1 };

    if (filtersActive) {
      if (city?.length) newQuery.cityId = city;
      if (brand?.BrandId != -1) newQuery.brandId = brand.BrandId;
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
          <div className="sticky top-24 rounded-2xl border border-[#F0F0F0] bg-white shadow-[0_6px_20px_rgba(36,59,83,0.05)]">
            <div className="border-b border-[#F0F0F0] px-4 py-4">
              <h2 className="text-lg text-secondary">فیلتر</h2>
            </div>

            <div className="px-3 py-2">
              <div className="px-1 py-3">
                <p className="mb-2 text-sm font-medium">دسته‌بندی</p>
                {categoryFilter}
              </div>

              <div className="h-px w-full bg-[#F0F0F0]" />

              <div className="collapse collapse-arrow [&:has(input:checked)]:overflow-visible">
                <input type="checkbox" />
                <div className="collapse-title text-sm font-medium">شهر</div>
                <div className="collapse-content">
                  <MultiCitySelect key={filterResetKey} cities={cities} value={city} onChange={setCity} />
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
                      placeholder=""
                      onChange={(e) => setYear({ ...year, min: parseInt(e.target.value) || 0 })}
                    />
                    <span>تا</span>
                    <input
                      className="h-10 w-full rounded-xl border border-[#E5E5E5] bg-white text-center text-secondary"
                      type="number"
                      placeholder=""
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
                  <div className="pb-3 pt-2">
                    <DoubleSlider
                      min="0"
                      max="1000000"
                      step={5000}
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
                  <div className="pb-3 pt-2">
                    <DoubleSlider
                      min="0"
                      max="100000000000"
                      step={100000000}
                      currentMin={price.min}
                      currentMax={price.max}
                      onChange={({ min, max }) => setPrice({ min, max })}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4 mt-2 flex gap-2">
                <button
                  type="button"
                  className="flex h-11 flex-1 items-center justify-center rounded-xl bg-primary text-sm text-white"
                  onClick={() => setFiltersActive(true)}
                >
                  اعمال فیلتر
                </button>
                {filtersActive && (
                  <button
                    type="button"
                    className="flex h-11 items-center justify-center rounded-xl border border-[#E5E5E5] bg-white px-4 text-sm text-secondary"
                    onClick={() => {
                      resetFilters();
                      setFiltersActive(false);
                      router.push('/ads');
                    }}
                  >
                    حذف فیلتر ها
                  </button>
                )}
              </div>
              <div className="mx-auto mt-auto h-4 w-24 rounded-t-3xl bg-[#FAFAFA]" />
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <h1 className="mb-4 hidden text-2xl text-secondary lg:block">{pageTitle}{bodyType && (
            <Link href={{ pathname: '/ads', query: clearBodyTypeQuery }} className="mr-2 inline-flex items-center gap-1 rounded-full bg-[#FFF1E8] px-2.5 py-1 align-middle text-[12px] text-[#C2410C]">
              حذف نوع
              <svg width="10" height="10" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 2l10 10M12 2 2 12" /></svg>
            </Link>
          )}</h1>

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
              onResetFilters={resetFilters}
              resetKey={filterResetKey}
            />
          </div>

          <h1 className="mb-4 text-lg text-secondary lg:hidden">{pageTitle}{bodyType && (
            <Link href={{ pathname: '/ads', query: clearBodyTypeQuery }} className="mr-2 inline-flex items-center gap-1 rounded-full bg-[#FFF1E8] px-2.5 py-1 align-middle text-[12px] text-[#C2410C]">
              حذف نوع
              <svg width="10" height="10" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 2l10 10M12 2 2 12" /></svg>
            </Link>
          )}</h1>

          <div className="grid min-h-screen auto-rows-min content-start grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
              <div className="col-span-full flex flex-col items-center gap-3 py-16 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF1E8] text-primary">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5M8.5 11h5" />
                  </svg>
                </span>

                <p className="m-0 text-[16px] text-secondary sm:text-[18px]">
                  آگهی‌ای با این مشخصات پیدا نشد
                </p>

                <p className="m-0 max-w-sm text-[13px] leading-[2] text-[#8A8A8A] sm:text-[14px]">
                  هیچ آگهی‌ای با فیلترهای انتخاب‌شده مطابقت ندارد. می‌توانید فیلترها را تغییر دهید یا
                  همه آگهی‌ها را ببینید.
                </p>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={() => router.push('/ads')}
                    className="mt-2 flex h-11 items-center justify-center rounded-xl bg-gradient-orange px-7 text-[14.5px] text-white transition-opacity hover:opacity-90"
                  >
                    حذف فیلترها
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Ads
