import FilterSelect from '@/components/HomeV2/FilterSelect';
import MultiCitySelect from '@/components/global/MultiCitySelect';
import { getModelsByBrand } from '@/utils/Request';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

const CATEGORIES = [
  { id: 5, label: 'خودرو', image: '/media/images/cat-car.webp' },
  { id: 6, label: 'موتورسیکلت', image: '/media/images/cat-motorcycle.webp' },
  { id: 7, label: 'سنگین', image: '/media/images/cat-heavy.webp' },
];

const PRICE_STEPS = [
  { value: '300000000', label: 'تا ۳۰۰ میلیون' },
  { value: '500000000', label: 'تا ۵۰۰ میلیون' },
  { value: '1000000000', label: 'تا ۱ میلیارد' },
  { value: '2000000000', label: 'تا ۲ میلیارد' },
  { value: '5000000000', label: 'تا ۵ میلیارد' },
];

const HeroV2 = ({ brands = [], cities = [], headBrandId = 5, onCategoryChange, banner = '/media/images/hero-showroom.webp' }) => {
  const router = useRouter();
  const [brandId, setBrandId] = useState('');
  const [modelId, setModelId] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [cityIds, setCityIds] = useState([]);

  const activeBrands = useMemo(
    () => brands.filter((brand) => Number(brand.headBrandId) === Number(headBrandId)),
    [brands, headBrandId]
  );

  const [models, setModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);

  useEffect(() => {
    if (!brandId) {
      setModels([]);
      return undefined;
    }

    let alive = true;
    setLoadingModels(true);

    getModelsByBrand({ BrandId: brandId })
      .then((list) => {
        if (!alive) return;
        setModels(Array.isArray(list) ? list : []);
      })
      .catch(() => {
        if (alive) setModels([]);
      })
      .finally(() => {
        if (alive) setLoadingModels(false);
      });

    return () => {
      alive = false;
    };
  }, [brandId]);

  const handleCategory = (id) => {
    onCategoryChange?.(id);
    setBrandId('');
    setModelId('');
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const query = { headBrandId };
    if (modelId) query.brandId = modelId;
    else if (brandId) query.brandId = brandId;
    if (priceMax) query.priceMax = priceMax;
    if (cityIds.length) query.cityId = cityIds;
    router.push({ pathname: '/ads', query });
  };

  const brandOptions = [
    { value: '', label: 'همه برندها' },
    ...activeBrands.map((brand) => ({ value: brand.BrandId, label: brand.Name })),
  ];

  const modelOptions = [
    { value: '', label: loadingModels ? 'در حال دریافت…' : 'همه مدل‌ها' },
    ...models.map((model) => ({ value: model.BrandId, label: model.Name || '' })),
  ];

  const priceOptions = [{ value: '', label: 'هر قیمتی' }, ...PRICE_STEPS];

  return (
    <section dir="rtl" className="relative z-30 bg-[#EEF1F5]">
      <Image src={banner} alt="" fill priority sizes="100vw" className="object-cover" />
      <span className="pointer-events-none absolute inset-0 bg-white/15" />

      <div className="relative mx-auto flex max-w-screen-xl justify-center px-3 py-8 sm:px-4 sm:py-12">
        <div className="flex w-full max-w-[980px] flex-col items-center gap-6 rounded-[26px] border border-white/70 bg-white/60 p-5 shadow-[0_20px_60px_rgba(30,42,58,.16)] backdrop-blur-2xl sm:gap-7 sm:p-8">
          <div className="flex flex-col items-center gap-2.5 text-center">
            <div className="flex items-center gap-3">
              <Image
                src="/media/images/dolox-logo.png"
                alt="دولوکس"
                width={150}
                height={40}
                className="h-7 w-auto object-contain sm:h-9"
              />
              <span className="font-soft text-[13px] text-[#C2410C] sm:text-[16px]">
                آسون بخر، راحت بفروش
              </span>
            </div>

            <h1 className="font-soft m-0 text-[21px] text-secondary sm:text-[32px]">
              خودروی ایده‌آل خود را پیدا کنید
            </h1>
          </div>

          <div className="grid w-full max-w-[400px] grid-cols-3 gap-2 sm:gap-3">
            {CATEGORIES.map((category) => {
              const active = category.id === headBrandId;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategory(category.id)}
                  className={`flex flex-col items-center overflow-hidden rounded-xl border bg-white transition-colors ${
                    active
                      ? 'border-primary shadow-[0_8px_22px_rgba(255,94,0,.18)]'
                      : 'border-white/70 hover:border-primary/45'
                  }`}
                >
                  <span className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.label}
                      fill
                      sizes="(max-width:768px) 30vw, 130px"
                      className="object-cover object-[35%_50%]"
                    />
                  </span>
                  <span
                    className={`font-soft w-full py-1.5 text-center text-[11.5px] transition-colors sm:text-[12.5px] ${
                      active ? 'bg-primary text-white' : 'bg-[#F4F6F9] text-secondary'
                    }`}
                  >
                    {category.label}
                  </span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSearch} className="w-full">
            <div className="hidden items-center gap-1 rounded-full bg-white p-2 shadow-[0_10px_30px_rgba(30,42,58,.14)] md:flex">
              <div className="min-w-0 flex-1 border-l border-[#E9EBEF]">
                <FilterSelect
                  label="برند"
                  value={brandId}
                  options={brandOptions}
                  placeholder="همه برندها"
                  onChange={(next) => {
                    setBrandId(next);
                    setModelId('');
                  }}
                />
              </div>

              <div className="min-w-0 flex-1 border-l border-[#E9EBEF]">
                <FilterSelect
                  label="مدل"
                  value={modelId}
                  options={modelOptions}
                  placeholder="همه مدل‌ها"
                  disabled={!brandId || loadingModels}
                  onChange={setModelId}
                />
              </div>

              <div className="min-w-0 flex-1 border-l border-[#E9EBEF]">
                <FilterSelect
                  label="حداکثر قیمت"
                  value={priceMax}
                  options={priceOptions}
                  placeholder="هر قیمتی"
                  onChange={setPriceMax}
                />
              </div>

              <div className="flex min-w-0 flex-[2]">
                <MultiCitySelect variant="bar" cities={cities} value={cityIds} onChange={setCityIds} />
              </div>

              <button
                type="submit"
                className="font-soft h-[58px] flex-none rounded-full bg-gradient-orange px-9 text-[15.5px] text-white transition-opacity hover:opacity-90"
              >
                جستجوی خودرو
              </button>
            </div>

            <div className="flex flex-col gap-3 rounded-[20px] bg-white p-4 shadow-[0_10px_30px_rgba(30,42,58,.14)] md:hidden">
              <label className="flex flex-col gap-1.5">
                <span className="font-soft text-[12.5px] text-secondary">برند</span>
                <FilterSelect
                  variant="stack"
                  value={brandId}
                  options={brandOptions}
                  placeholder="همه برندها"
                  onChange={(next) => {
                    setBrandId(next);
                    setModelId('');
                  }}
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="font-soft text-[12.5px] text-secondary">مدل</span>
                <FilterSelect
                  variant="stack"
                  value={modelId}
                  options={modelOptions}
                  placeholder="همه مدل‌ها"
                  disabled={!brandId || loadingModels}
                  onChange={setModelId}
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="font-soft text-[12.5px] text-secondary">حداکثر قیمت</span>
                <FilterSelect
                  variant="stack"
                  value={priceMax}
                  options={priceOptions}
                  placeholder="هر قیمتی"
                  onChange={setPriceMax}
                />
              </label>

              <div className="flex flex-col gap-1.5">
                <span className="font-soft text-[12.5px] text-secondary">استان و شهر</span>
                <MultiCitySelect cities={cities} value={cityIds} onChange={setCityIds} />
              </div>

              <button
                type="submit"
                className="font-soft mt-1 h-[52px] w-full rounded-xl bg-gradient-orange text-[15.5px] text-white transition-opacity hover:opacity-90"
              >
                جستجوی خودرو
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default HeroV2;
