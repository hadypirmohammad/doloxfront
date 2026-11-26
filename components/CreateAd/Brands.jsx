import { getBrands, getModelsByBrand } from '@/utils/Request';
import { resolveBackendMediaUrl } from '@/utils/media';
import { normalizeSearchTerm } from '@/utils/Cal';
import Image from 'next/image';
import React, { useState, useEffect, useMemo, useRef } from 'react';

const BRAND_IMAGE_FALLBACK = '/media/images/samplebrand.png';
const PAGE_SIZE = 18;
const MODEL_SEARCH_MIN = 2;
const MODEL_SEARCH_CONCURRENCY = 8;

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
  const [modelsByBrand, setModelsByBrand] = useState({});
  const [searchingModels, setSearchingModels] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const loaderRef = useRef(null);

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

  const term = normalizeName(searchInput);

  const brandMatches = useMemo(() => {
    const list = Array.isArray(brandsData) ? brandsData : [];
    if (!term) return list;
    return list.filter((brand) => normalizeName(brand?.Name).includes(term));
  }, [brandsData, term]);

  useEffect(() => {
    const list = Array.isArray(brandsData) ? brandsData : [];
    if (term.length < MODEL_SEARCH_MIN || brandMatches.length || !list.length) return;

    let active = true;
    const pending = list.filter((brand) => !modelsByBrand[brand.BrandId]);
    if (!pending.length) return;

    setSearchingModels(true);
    let index = 0;
    const loadNext = async () => {
      while (index < pending.length) {
        const brand = pending[index++];
        const result = await getModelsByBrand(brand).catch(() => null);
        if (!active) return;
        setModelsByBrand((prev) => ({ ...prev, [brand.BrandId]: Array.isArray(result) ? result : [] }));
      }
    };

    Promise.all(Array.from({ length: MODEL_SEARCH_CONCURRENCY }, loadNext)).finally(() => {
      if (active) setSearchingModels(false);
    });

    return () => {
      active = false;
    };
  }, [term, brandMatches.length, brandsData]);

  const visibleBrands = useMemo(() => {
    if (!term || brandMatches.length) return brandMatches;
    const list = Array.isArray(brandsData) ? brandsData : [];
    return list
      .map((brand) => {
        const model = (modelsByBrand[brand.BrandId] || []).find((item) => normalizeName(item?.Name).includes(term));
        return model ? { ...brand, matchedModel: model.Name } : null;
      })
      .filter(Boolean);
  }, [brandMatches, brandsData, modelsByBrand, term]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [categoryId, term]);

  useEffect(() => {
    const node = loaderRef.current;
    if (!node) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) setVisibleCount((count) => count + PAGE_SIZE);
    }, { rootMargin: '200px' });

    observer.observe(node);
    return () => observer.disconnect();
  }, [visibleBrands.length, visibleCount, step]);

  if (step !== 0) return <></>;

  return (
    <div dir="rtl" className="px-3 pt-5 sm:px-5">
      <div className="mx-auto flex max-w-xl overflow-hidden rounded-[50px] bg-gradient-orange p-1.5 text-white">
        {categories.map((cat, index) => (
          <div
            key={cat.BrandId || index}
            className={`min-w-0 flex-1 cursor-pointer truncate rounded-full px-1 py-2.5 text-center text-[12.5px] font-["vazir-bold"] transition-colors sm:text-sm ${
              categoryId === cat.BrandId ? 'bg-white text-secondary' : ''
            }`}
            onClick={() => setCategory(cat)}
          >
            {String(cat.Name || '').trim()}
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

      {searchingModels && !visibleBrands.length && (
        <p className="py-10 text-center font-['vazir'] text-sm text-[#8A8A8A]">در حال جست و جو بین مدل ها...</p>
      )}

      {Array.isArray(brandsData) && !searchingModels && visibleBrands.length === 0 && (
        <p className="py-10 text-center font-['vazir'] text-sm text-[#8A8A8A]">موردی یافت نشد</p>
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
            {brand.matchedModel && (
              <span className="text-center text-[11px] text-primary">{brand.matchedModel}</span>
            )}
          </div>
        ))}
      </div>

      {visibleBrands.length > visibleCount && (
        <div ref={loaderRef} className="flex justify-center py-6">
          <span className="loading loading-spinner loading-md text-primary" />
        </div>
      )}
    </div>
  );
};

export default Brands;
