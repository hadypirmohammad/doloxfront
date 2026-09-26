import { getBrands } from '@/utils/Request';
import { resolveBackendMediaUrl } from '@/utils/media';
import { normalizeSearchTerm } from '@/utils/Cal';
import Image from 'next/image';
import React, { useState, useEffect, useMemo } from 'react';

const BRAND_IMAGE_FALLBACK = '/media/images/samplebrand.png';
const PAGE_SIZE = 12;

const normalizeName = (value) => normalizeSearchTerm(value).replace(/ /g, '').toLowerCase();

const BrandIcon = ({ image, name }) => {
  const [src, setSrc] = useState(() => resolveBackendMediaUrl(image, BRAND_IMAGE_FALLBACK));

  useEffect(() => {
    setSrc(resolveBackendMediaUrl(image, BRAND_IMAGE_FALLBACK));
  }, [image]);

  return (
    <Image
      className="h-8 w-11 object-contain"
      src={src}
      alt={name || 'brand icon'}
      width={44}
      height={32}
      onError={() => setSrc(BRAND_IMAGE_FALLBACK)}
    />
  );
};

const Brands = ({ brands = [], brandsByCategory = {}, setBrand, setStep, step, category, setCategory, categories = [] }) => {
  const [fetchedBrands, setFetchedBrands] = useState({});
  const [failedCategoryId, setFailedCategoryId] = useState(null);
  const [retryKey, setRetryKey] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const categoryId = category?.BrandId;

  const initialBrands =
    categoryId === categories[0]?.BrandId && Array.isArray(brands) && brands.some((b) => b?.BrandId)
      ? brands
      : undefined;

  const brandsData = Array.isArray(brandsByCategory[categoryId])
    ? brandsByCategory[categoryId]
    : fetchedBrands[categoryId] || initialBrands;

  const isLoading = categoryId !== undefined && !Array.isArray(brandsData) && failedCategoryId !== categoryId;

  useEffect(() => {
    if (categoryId === undefined || Array.isArray(brandsData)) return;

    let active = true;
    setFailedCategoryId(null);

    getBrands(categoryId).then((result) => {
      if (Array.isArray(result)) {
        setFetchedBrands((prev) => ({ ...prev, [categoryId]: result }));
      } else if (active) {
        setFailedCategoryId(categoryId);
      }
    });

    return () => {
      active = false;
    };
  }, [categoryId, retryKey]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [categoryId, searchInput]);

  const visibleBrands = useMemo(() => {
    const list = Array.isArray(brandsData) ? brandsData : [];
    const term = normalizeName(searchInput);
    if (!term) return list;
    return list.filter((brand) => normalizeName(brand?.Name).includes(term));
  }, [brandsData, searchInput]);

  if (step !== 0) return <></>;

  return (
    <div dir="rtl" className="px-4 pt-5 sm:px-5">
      <div className="mx-auto flex max-w-xl rounded-[50px] bg-gradient-orange p-1.5 text-white">
        {categories.map((cat, index) => (
          <div
            key={cat.BrandId || index}
            className={`w-full cursor-pointer rounded-full py-2.5 text-center text-sm font-["vazir-bold"] transition-colors ${
              categoryId === cat.BrandId ? 'bg-white text-secondary' : ''
            }`}
            onClick={() => setCategory(cat)}
          >
            {cat.Name}
          </div>
        ))}
      </div>

      <label className="mx-auto mt-4 flex max-w-xl items-center gap-3 rounded-2xl border border-[#EAEEF4] bg-white px-4 py-3.5 focus-within:border-primary">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14243F" strokeWidth="1.8" strokeLinecap="round" className="flex-none">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.6-3.6" />
        </svg>
        <input
          type="text"
          className="min-w-0 flex-1 border-0 bg-transparent text-right text-sm text-secondary outline-none font-['vazir'] placeholder:text-[#A3ADBC]"
          placeholder="جست و جو برند"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </label>

      {isLoading && (
        <div className="flex justify-center py-10">
          <span className="loading loading-spinner loading-md text-primary" />
        </div>
      )}

      {failedCategoryId === categoryId && !Array.isArray(brandsData) && (
        <div className="flex flex-col items-center gap-3 py-10 text-center font-['vazir']">
          <p className="text-sm text-secondary">دریافت برندها ناموفق بود</p>
          <button
            type="button"
            className="btn btn-sm border-none bg-primary text-white"
            onClick={() => setRetryKey((key) => key + 1)}
          >
            تلاش مجدد
          </button>
        </div>
      )}

      {Array.isArray(brandsData) && visibleBrands.length === 0 && (
        <p className="py-10 text-center font-['vazir'] text-sm text-[#8A8A8A]">برندی یافت نشد</p>
      )}

      <div className="mx-auto mt-4 grid max-w-xl grid-cols-3 gap-2.5">
        {visibleBrands.slice(0, visibleCount).map((brand, index) => (
          <div
            key={brand.BrandId || index}
            className="flex cursor-pointer flex-col items-center gap-2.5 rounded-2xl border border-[#EEF1F6] bg-white px-2 py-4 transition-colors hover:border-primary"
            onClick={() => {
              setBrand(brand);
              setStep(1);
            }}
          >
            <BrandIcon image={brand.Image} name={brand.Name} />
            <span className="text-center text-[13px] font-semibold text-secondary">{brand.Name}</span>
          </div>
        ))}
      </div>

      {visibleBrands.length > visibleCount && (
        <div className="mx-auto mt-4 flex max-w-xl justify-center">
          <button
            type="button"
            className="flex items-center gap-2 rounded-2xl border border-[#EAEEF4] bg-white px-9 py-3 text-[13px] font-semibold text-[#42536B]"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
            نمایش بیشتر
          </button>
        </div>
      )}

      <div className="mx-auto mt-5 flex max-w-xl items-center gap-4 rounded-[22px] border border-[#EAEEF4] bg-[#F7F9FC] p-4">
        <div className="flex-1">
          <p className="m-0 text-[15px] font-bold text-secondary">برند مورد نظر شما نیست؟</p>
          <p className="m-0 pt-1.5 text-[12.5px] leading-[1.9] text-[#7D889A]">
            اگر برند خودروی شما در لیست نیست، از طریق پشتیبانی ثبتش کنید.
          </p>
        </div>
        <span className="flex h-24 w-24 flex-none items-center justify-center rounded-full bg-gradient-orange">
          <Image
            src="/media/images/default-ad.webp"
            alt="خودرو"
            width={74}
            height={74}
            className="h-[74px] w-[74px] rounded-full object-cover"
          />
        </span>
      </div>
    </div>
  );
};

export default Brands;
