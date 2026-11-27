import { formatPrice, toPersianDigits } from '@/utils/Cal';
import PriceChangeBadge from '@/components/CarPrices/PriceChangeBadge';
import { resolveBackendMediaUrl } from '@/utils/media';
import {
  CAR_PRICE_PAGE_SIZE,
  buildCarPricesUrl,
  formatTotalCount,
  mapCarPriceListItem,
  safeParseCarPrices,
} from '@/utils/carPrices';
import { getCarPrices } from '@/utils/Request';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export async function getServerSideProps(context) {
  const page = Math.max(1, Number(context.query.page) || 1);
  const search = String(context.query.search || '').trim().slice(0, 60);
  /* Only cars with an active price by default; toggle off with ?hasPrice=false */
  const hasPrice = context.query.hasPrice !== 'false';

  let items = [];
  let pagination = null;

  try {
    const raw = await getCarPrices({
      page,
      pageSize: CAR_PRICE_PAGE_SIZE,
      search,
      hasPrice: hasPrice || undefined,
    });
    const data = safeParseCarPrices(raw);

    if (Array.isArray(data?.items)) items = data.items.map(mapCarPriceListItem);
    if (data?.pagination) pagination = data.pagination;

    /* Clamp the page when the last page shrinks (e.g. after searching) */
    if (
      Array.isArray(data?.items) &&
      data.items.length === 0 &&
      data?.pagination?.totalPages > 0 &&
      page > data.pagination.totalPages
    ) {
      return {
        redirect: {
          destination: buildCarPricesUrl({ search, hasPrice, page: data.pagination.totalPages }),
          permanent: false,
        },
      };
    }
  } catch {
    /* API unreachable → graceful empty state */
  }

  return { props: { items, pagination, search, page, hasPrice } };
}

/* ---------- presentational components ---------- */

function CarPriceCard({ item }) {
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    setErrored(false);
  }, [item.image]);

  const src = errored ? resolveBackendMediaUrl(null) : item.image;

  return (
    <Link
      href={`/car-prices/${item.brandId}`}
      className="group block overflow-hidden rounded-2xl border border-[#F2F2F2] bg-white shadow-[0_6px_20px_rgba(36,59,83,0.06)] transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_12px_28px_rgba(36,59,83,0.12)]"
    >
      <div className="relative h-[132px] w-full bg-[#F7F7F7]">
        <Image
          src={src}
          alt={item.name}
          fill
          className="object-contain p-5 transition-transform duration-300 group-hover:scale-[1.06]"
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 300px"
          onError={() => setErrored(true)}
        />
        {item.rootBrand && (
          <span className="absolute right-3 top-3 max-w-[55%] truncate rounded-lg bg-[#1E2A3A]/85 px-2 py-1 text-[10.5px] text-white">
            {item.rootBrand}
          </span>
        )}
        <div className="absolute left-3 top-3">
          <PriceChangeBadge direction={item.direction} percentText={item.percentText} />
        </div>
      </div>

      <div className="p-3.5 text-right">
        <h3 className="line-clamp-1 text-[14.5px] font-bold text-secondary">{item.name}</h3>

        <div className="mt-2 flex items-baseline gap-1">
          {item.price != null ? (
            <>
              <span className="text-[15.5px] font-bold text-secondary">{formatPrice(item.price)}</span>
              <span className="text-[11px] text-[#8B8B8B]">تومان</span>
            </>
          ) : (
            <span className="text-[12.5px] text-[#8B8B8B]">قیمت ثبت نشده</span>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#F2F2F2] pt-2.5">
          <span className="flex min-w-0 items-center gap-1 text-[11px] text-[#8A8A8A]">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9AA3AE"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="flex-none"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7.5V12l3 2" />
            </svg>
            <span className="truncate">
              {item.updatedAtShamsi ? `بروزرسانی ${item.updatedAtShamsi}` : 'بروزرسانی نامشخص'}
            </span>
          </span>
          {item.activePricesCount > 0 && (
            <span className="shrink-0 rounded-md bg-secondary/5 px-1.5 py-0.5 text-[10.5px] text-secondary">
              {toPersianDigits(item.activePricesCount)} نوع قیمت
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function buildPageWindow(current, total) {
  const numbers = [];
  const push = (n) => {
    if (n >= 1 && n <= total && !numbers.includes(n)) numbers.push(n);
  };

  push(1);
  push(2);
  push(total - 1);
  push(total);
  for (let n = current - 2; n <= current + 2; n += 1) push(n);

  numbers.sort((a, b) => a - b);

  const entries = [];
  numbers.forEach((n, index) => {
    if (index > 0 && n - numbers[index - 1] > 1) entries.push('gap');
    entries.push(n);
  });
  return entries;
}

function Pagination({ page, totalPages, onNavigate }) {
  if (!totalPages || totalPages <= 1) return null;

  const go = (n) => {
    if (n >= 1 && n <= totalPages && n !== page) onNavigate(n);
  };

  const arrowBtn =
    'flex h-9 min-w-9 items-center justify-center rounded-xl border border-[#E8E8E8] bg-white px-2 text-secondary transition hover:border-primary/50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <div className="mt-9">
      <nav className="flex flex-wrap items-center justify-center gap-1.5" aria-label="صفحه‌بندی قیمت‌ها">
        <button type="button" className={arrowBtn} onClick={() => go(page - 1)} disabled={page <= 1} aria-label="صفحه قبل">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {buildPageWindow(page, totalPages).map((entry, index) =>
          entry === 'gap' ? (
            <span key={`gap-${index}`} className="flex h-9 w-6 items-center justify-center text-[13px] text-[#8A8A8A]">
              …
            </span>
          ) : (
            <button
              key={entry}
              type="button"
              onClick={() => go(entry)}
              className={`flex h-9 min-w-9 items-center justify-center rounded-xl px-2 text-[13px] transition ${
                entry === page
                  ? 'bg-primary font-bold text-white'
                  : 'border border-[#E8E8E8] bg-white text-secondary hover:border-primary/50 hover:text-primary'
              }`}
              aria-current={entry === page ? 'page' : undefined}
            >
              {toPersianDigits(entry)}
            </button>
          )
        )}

        <button type="button" className={arrowBtn} onClick={() => go(page + 1)} disabled={page >= totalPages} aria-label="صفحه بعد">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
      </nav>

      <p className="mt-3 text-center text-[12px] text-[#8A8A8A]">
        صفحه {toPersianDigits(page)} از {toPersianDigits(totalPages)}
      </p>
    </div>
  );
}

/* ---------- page ---------- */

const CarPricesPage = ({ items, pagination, search, page, hasPrice }) => {
  const router = useRouter();
  const [query, setQuery] = useState(search || '');

  const totalCount = pagination?.totalCount ?? 0;
  const totalPages = pagination?.totalPages ?? 1;

  const submitSearch = (event) => {
    event.preventDefault();
    router.push(buildCarPricesUrl({ search: query.trim(), hasPrice, page: 1 }));
  };

  const toggleHasPrice = () => {
    router.push(buildCarPricesUrl({ search, hasPrice: !hasPrice, page: 1 }));
  };

  const clearFilters = () => {
    setQuery('');
    router.push(buildCarPricesUrl({ search: '', hasPrice: true, page: 1 }));
  };

  return (
    <>
      <Head>
        <title>قیمت روز خودرو و موتورسیکلت | دولوکس</title>
        <meta
          name="description"
          content="قیمت لحظه‌ای خودرو و موتورسیکلت در بازار ایران؛ مشاهده قیمت روز، تغییرات و تاریخچه قیمت هر مدل خودرو."
        />
      </Head>

      <div className="min-h-screen bg-[#FAFAFA] px-3 pb-14 pt-6 text-secondary sm:px-4" dir="rtl">
        <div className="mx-auto max-w-screen-xl">
          {/* Hero */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-red px-5 py-9 sm:px-8 sm:py-12">
            <span className="pointer-events-none absolute -left-16 -top-24 h-64 w-64 rounded-full bg-white/10" aria-hidden="true" />
            <span className="pointer-events-none absolute -bottom-28 -right-12 h-72 w-72 rounded-full bg-white/10" aria-hidden="true" />

            <div className="relative">
              <h1 className="text-[22px] text-white sm:text-[28px]">قیمت روز خودروها</h1>
              <p className="mt-2 max-w-xl text-[13px] leading-6 text-white/85 sm:text-[14px]">
                قیمت لحظه‌ای خودرو و موتورسیکلت را ببینید، تغییرات روزانه را دنبال کنید و در خرید تصمیم بهتری بگیرید.
              </p>

              <form
                onSubmit={submitSearch}
                className="mt-6 flex items-center gap-1.5 rounded-2xl bg-white p-1.5 shadow-lg sm:gap-2 sm:p-2"
                role="search"
              >
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9AA3AE"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 flex-none sm:mr-3"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.5-3.5" />
                </svg>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="h-10 min-w-0 flex-1 bg-transparent text-[14px] text-secondary outline-none placeholder:text-[#9AA3AE]"
                  placeholder="جستجوی برند یا مدل؛ مثلاً پژو ۲۰۶"
                  aria-label="جستجوی خودرو"
                />
                <button
                  type="submit"
                  className="flex h-10 flex-none items-center rounded-xl bg-primary px-4 text-[13px] font-bold text-white transition hover:opacity-90 sm:px-6 sm:text-[13.5px]"
                >
                  جستجو
                </button>
              </form>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                <span className="flex items-center gap-1.5 text-[12px] text-white/85">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 19V9l8-5 8 5v10" />
                    <path d="M4 19h16M10 19v-5h4v5" />
                  </svg>
                  {formatTotalCount(totalCount)} مدل خودرو و موتورسیکلت
                </span>
                <span className="flex items-center gap-1.5 text-[12px] text-white/85">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7.5V12l3 2" />
                  </svg>
                  بروزرسانی روزانه
                </span>
              </div>
            </div>
          </section>

          {/* Toolbar */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={hasPrice}
              onClick={toggleHasPrice}
              className={`flex items-center gap-2.5 rounded-full border px-3.5 py-2 text-[13px] transition ${
                hasPrice
                  ? 'border-primary/30 bg-primary/10 text-primary'
                  : 'border-[#E8E8E8] bg-white text-[#8A8A8A] hover:border-[#D9D9D9]'
              }`}
            >
              <span className={`relative h-[18px] w-8 shrink-0 rounded-full transition ${hasPrice ? 'bg-primary' : 'bg-[#D4D6DB]'}`}>
                <span
                  className={`absolute top-[2px] h-[14px] w-[14px] rounded-full bg-white shadow transition-all ${
                    hasPrice ? 'left-[2px]' : 'right-[2px]'
                  }`
                />
              </span>
              فقط مدل‌های دارای قیمت
            </button>

            {search ? (
              <span className="flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3 py-1.5 text-[12px] text-primary">
                نتایج جستجوی «{search}»
                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex h-5 w-5 items-center justify-center transition hover:opacity-70"
                  aria-label="حذف جستجو"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </span>
            ) : (
              <p className="text-[12px] text-[#8A8A8A]">
                {hasPrice ? 'مدل‌های دارای قیمت فعال' : 'همه مدل‌ها (شامل مدل‌های بدون قیمت)'}
              </p>
            )}
          </div>

          {/* Grid */}
          {items.length === 0 ? (
            <div className="mt-4 rounded-3xl border border-[#F2F2F2] bg-white px-6 py-16 text-center">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-base-300">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9AA3AE" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.5-3.5" />
                </svg>
              </span>
              <p className="mt-4 text-[15px] font-bold text-secondary">موردی یافت نشد</p>
              <p className="mt-1.5 text-[13px] text-[#8A8A8A]">
                عبارت جستجو یا فیلترها را تغییر دهید و دوباره امتحان کنید.
              </p>
              {(search || !hasPrice) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 inline-flex h-10 items-center rounded-xl bg-primary px-5 text-[13px] font-bold text-white transition hover:opacity-90"
                >
                  حذف جستجو و فیلترها
                </button>
              )}
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((item) => (
                <CarPriceCard key={item.brandId} item={item} />
              ))}
            </div>
          )}

          <Pagination
            page={page}
            totalPages={totalPages}
            onNavigate={(n) => router.push(buildCarPricesUrl({ search, hasPrice, page: n }))}
          />
        </div>
      </div>
    </>
  );
};

export default CarPricesPage;
