import CarPriceGroupTiles from '@/components/HomeV2/CarPriceGroupTiles';
import CarSpecButton from '@/components/HomeV2/CarSpecButton';
import SectionShell from '@/components/HomeV2/SectionShell';
import { formatPrice, toPersianDigits } from '@/utils/Cal';
import { getCarPriceDetail, getCarPrices } from '@/utils/Request';
import { filterByGroup } from '@/utils/services/carPriceGroups';
import { shapeCarPrice } from '@/utils/services/carPriceShape';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const PASSENGER_HEAD_BRAND_ID = 5;
const HOME_LIMIT = 5;
const COLLAPSED = 3;

const ROW_GRID = 'lg:grid lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_260px] lg:items-center lg:gap-5';

const PriceValue = ({ label, value, change }) => (
  <div className="flex min-w-0 flex-col gap-0.5">
    <span className="text-[12px] text-[#8B94A5] lg:hidden">{label}</span>
    {value != null && value > 0 ? (
      <span className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
        <span className="font-soft whitespace-nowrap text-[16px] text-secondary sm:text-[17px]">{toPersianDigits(formatPrice(value))}</span>
        <span className="text-[11.5px] text-[#8B94A5]">تومان</span>
        {typeof change === 'number' && change !== 0 && (
          <span className={`whitespace-nowrap text-[12.5px] ${change > 0 ? 'text-[#22A45D]' : 'text-[#E03A3A]'}`} dir="ltr">
            {change > 0 ? '↑' : '↓'} {toPersianDigits(Math.abs(change).toFixed(2))}٪
          </span>
        )}
      </span>
    ) : (
      <span className="text-[13px] text-[#B5BCC7]">—</span>
    )}
  </div>
);

const CarRow = ({ item }) => (
  <article className={`px-4 py-3.5 transition-colors hover:bg-[#FAFBFC] ${ROW_GRID}`}>
    <div className="flex min-w-0 items-center gap-3">
      <span className="relative flex h-10 w-10 flex-none items-center justify-center overflow-hidden rounded-full border border-[#EEF0F4] bg-white">
        {item.image ? (
          <Image src={item.image} alt={item.brand} fill sizes="40px" className="object-contain p-1.5" />
        ) : (
          <span className="font-soft text-[14px] text-[#5B6575]">{item.brand.charAt(0)}</span>
        )}
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-[12.5px] text-[#8B94A5]">
          {item.brand}
          {item.year ? ` · ${toPersianDigits(item.year)}` : ''}
        </span>
        <span className="font-soft line-clamp-2 text-[16px] leading-[1.6] text-secondary">{item.model}</span>
      </div>
    </div>

    <div className="mt-3 grid grid-cols-2 gap-3 border-t border-dashed border-[#EEF0F4] pt-3 lg:contents">
      <PriceValue label="کارخانه" value={item.factory} change={item.market ? null : item.change} />
      <PriceValue label="بازار" value={item.market} change={item.market ? item.change : null} />
    </div>

    <div className="mt-3 grid grid-cols-2 gap-2 lg:mt-0">
      <Link
        href={{ pathname: '/ads', query: { headBrandId: PASSENGER_HEAD_BRAND_ID, brandId: item.brandId } }}
        className="font-soft flex h-9 items-center justify-center rounded-xl bg-gradient-orange text-[12.5px] text-white"
      >
        آگهی‌های این خودرو
      </Link>
      <CarSpecButton item={item} />
    </div>
  </article>
);

const ListHeader = () => (
  <div className={`hidden border-b border-[#EEF0F4] bg-[#F8F9FB] px-4 py-2.5 text-[13px] text-[#8B94A5] ${ROW_GRID}`}>
    <span>خودرو</span>
    <span>قیمت کارخانه</span>
    <span>قیمت بازار</span>
    <span />
  </div>
);

const CarPricesV2 = ({ items = [], logos = {} }) => {
  const [list, setList] = useState(items);
  const [group, setGroup] = useState('all');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    if (items.length) {
      setList(items);
      return undefined;
    }
    let alive = true;
    (async () => {
      const collected = [];
      for (let page = 1; page <= 5; page += 1) {
        const data = await getCarPrices({ page, pageSize: 100, rootBrandId: PASSENGER_HEAD_BRAND_ID, hasPrice: true }).catch(() => null);
        collected.push(...(data?.items || []));
        if (!data?.pagination?.hasNext) break;
      }
      if (alive) setList(collected.map((entry) => shapeCarPrice(entry)));
    })();
    return () => {
      alive = false;
    };
  }, [items]);

  useEffect(() => {
    const term = query.trim();
    if (!term) {
      setResults(null);
      return undefined;
    }
    clearTimeout(timer.current);
    let alive = true;
    timer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await getCarPrices({ page: 1, pageSize: 12, search: term });
        const list = data?.items || [];
        const details = await Promise.all(list.map((entry) => getCarPriceDetail(entry.brandId).catch(() => null)));
        if (alive) setResults(list.map((entry, index) => shapeCarPrice(entry, details[index])));
      } catch (error) {
        if (alive) setResults([]);
      } finally {
        if (alive) setLoading(false);
      }
    }, 400);
    return () => {
      alive = false;
      clearTimeout(timer.current);
    };
  }, [query]);

  const searching = results !== null;
  const filtered = filterByGroup(results ?? list, group);
  const rows = searching ? filtered : filtered.slice(0, HOME_LIMIT);
  const visible = expanded ? rows : rows.slice(0, COLLAPSED);

  const selectGroup = (key) => {
    setGroup(key);
    setExpanded(false);
  };

  return (
    <SectionShell title="قیمت روز خودرو" href="/car-prices">
      <div className="flex flex-col gap-3">
        <label className="flex h-[48px] items-center gap-2 rounded-xl border border-[#E6E8EC] bg-white px-3.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B94A5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="نام مدل را جستجو کنید… مثل ۲۰۷"
            className="h-full w-full bg-transparent text-[14px] text-secondary outline-none placeholder:text-[#A7AEBA]"
          />
          {loading && <span className="loading loading-spinner loading-xs text-primary" />}
        </label>

        <CarPriceGroupTiles items={list} logos={logos} active={group} onSelect={selectGroup} />

        {rows.length === 0 ? (
          <p className="m-0 rounded-2xl bg-white/70 py-8 text-center text-[13px] text-[#8B94A5]">
            {searching ? 'خودرویی با این نام پیدا نشد' : 'برای این دسته هنوز قیمتی ثبت نشده است'}
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="overflow-hidden rounded-2xl border border-[#EEF0F4] bg-white">
              <ListHeader />
              <div className="divide-y divide-[#EEF0F4]">
                {visible.map((item) => (
                  <CarRow key={item.brandId} item={item} />
                ))}
              </div>
            </div>
            {rows.length > COLLAPSED && (
              <button
                type="button"
                onClick={() => setExpanded((value) => !value)}
                className="font-soft mx-auto flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] text-secondary transition-colors hover:bg-white"
              >
                {expanded ? 'کمتر' : 'بیشتر'}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={expanded ? 'rotate-180' : ''}>
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </SectionShell>
  );
};

export default CarPricesV2;
