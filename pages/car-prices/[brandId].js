import { formatPrice, toPersianDigits } from '@/utils/Cal';
import PriceChangeBadge from '@/components/CarPrices/PriceChangeBadge';
import { resolveBackendMediaUrl } from '@/utils/media';
import {
  formatShamsiDate,
  normalizeDirection,
  priceTypeLabel,
  safeParseCarPrices,
} from '@/utils/carPrices';
import { getCarPriceDetail } from '@/utils/Request';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export async function getServerSideProps(context) {
  const { brandId } = context.params;

  try {
    const raw = await getCarPriceDetail(brandId);
    const detail = safeParseCarPrices(raw);
    const car = detail?.car;

    if (!car) return { props: { detail: null, brandId } };

    /* Price type cards: Base / ZeroKilometer / Factory / ... */
    const activePrices = (Array.isArray(detail?.activePrices) ? detail.activePrices : []).map((entry) => ({
      id: entry?.carPriceId ?? null,
      label: priceTypeLabel(entry?.priceType, entry?.priceTypeText),
      price: entry?.price ?? null,
      year: entry?.Year ?? entry?.yearId ?? null,
      description: entry?.description || null,
      updatedAtShamsi: formatShamsiDate(entry?.updatedAt),
    }));

    /* Newest-first history with the change direction vs the previous price */
    const historyRaw = Array.isArray(detail?.priceHistory) ? detail.priceHistory : [];
    const history = [...historyRaw]
      .sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')))
      .map((entry, index, list) => {
        const older = list[index + 1];
        const direction =
          older && older.price != null && entry?.price != null && entry.price !== older.price
            ? entry.price > older.price
              ? 'increase'
              : 'decrease'
            : 'none';

        return {
          price: entry?.price ?? null,
          isActive: Boolean(entry?.isActive),
          description: entry?.description || null,
          updatedAtShamsi: formatShamsiDate(entry?.updatedAt),
          direction,
        };
      });

    /* Latest updatedAt across all prices for the hero section */
    const latestUpdate =
      [
        ...(Array.isArray(detail?.activePrices) ? detail.activePrices : []).map((entry) => entry?.updatedAt),
        ...historyRaw.map((entry) => entry?.updatedAt),
      ]
        .filter(Boolean)
        .sort()
        .pop() || null;

    const pickPrice = (list, type) =>
      (Array.isArray(list) ? list.find((entry) => String(entry?.priceType || '').toLowerCase() === type)?.price : null);

    const firstActivePrice = Array.isArray(detail?.activePrices)
      ? detail.activePrices.find((entry) => entry?.price != null)?.price
      : null;

    return {
      props: {
        detail: {
          brandId: car.brandId ?? brandId,
          carName: car.carName || '',
          parentBrand: car.parentBrand || '',
          rootBrand: (car.rootBrand || '').trim(),
          image: resolveBackendMediaUrl(car.carImage),
          currentPrice:
            detail?.currentBasePrice ?? pickPrice(detail?.activePrices, 'base') ?? firstActivePrice ?? null,
          direction: normalizeDirection(detail?.priceChange?.direction || detail?.priceChange?.changeDirection),
          percentText: detail?.priceChange?.percentText || null,
          latestUpdateShamsi: formatShamsiDate(latestUpdate),
          activePrices,
          history,
        },
        brandId,
      },
    };
  } catch {
    return { props: { detail: null, brandId } };
  }
}

const CarPriceDetailPage = ({ detail }) => {
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    setErrored(false);
  }, [detail?.image]);

  if (!detail) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] px-3 py-16 text-secondary sm:px-4" dir="rtl">
        <div className="mx-auto max-w-screen-md rounded-3xl border border-[#F2F2F2] bg-white px-6 py-14 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-base-300">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9AA3AE" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v5M12 16.5v.01" />
            </svg>
          </span>
          <h1 className="mt-4 text-[17px]">اطلاعات این خودرو در دسترس نیست</h1>
          <p className="mt-2 text-[13px] text-[#8A8A8A]">
            خطایی در دریافت قیمت‌ها رخ داد. لطفاً کمی بعد دوباره تلاش کنید.
          </p>
          <Link
            href="/car-prices"
            className="mt-6 inline-flex h-11 items-center rounded-xl bg-primary px-6 text-[13.5px] font-bold text-white transition hover:opacity-90"
          >
            بازگشت به لیست قیمت‌ها
          </Link>
        </div>
      </div>
    );
  }

  const {
    carName,
    parentBrand,
    rootBrand,
    image,
    currentPrice,
    direction,
    percentText,
    latestUpdateShamsi,
    activePrices,
    history,
  } = detail;

  const name = [parentBrand, carName].filter(Boolean).join(' ').trim() || 'خودرو';
  const src = errored ? resolveBackendMediaUrl(null) : image;

  return (
    <>
      <Head>
        <title>{`قیمت ${name} | دولوکس`}</title>
        <meta name="description" content={`قیمت روز ${name}؛ قیمت پایه، صفر کیلومتر و کارخانه به‌همراه تاریخچه تغییرات قیمت.`} />
      </Head>

      <div className="min-h-screen bg-[#FAFAFA] px-3 pb-14 pt-6 text-secondary sm:px-4" dir="rtl">
        <div className="mx-auto max-w-screen-lg">
          <Link
            href="/car-prices"
            className="inline-flex items-center gap-1.5 text-[13px] text-primary transition hover:opacity-80"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
            بازگشت به لیست قیمت‌ها
          </Link>

          {/* Hero */}
          <section className="relative mt-4 overflow-hidden rounded-3xl bg-gradient-red p-5 sm:p-8">
            <span className="pointer-events-none absolute -left-16 -top-24 h-64 w-64 rounded-full bg-white/10" aria-hidden="true" />
            <span className="pointer-events-none absolute -bottom-28 -right-12 h-72 w-72 rounded-full bg-white/10" aria-hidden="true" />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="relative h-24 w-24 shrink-0 self-start overflow-hidden rounded-2xl bg-white p-2 shadow-lg sm:h-28 sm:w-28">
                <Image
                  src={src}
                  alt={name}
                  fill
                  className="object-contain"
                  sizes="112px"
                  onError={() => setErrored(true)}
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {rootBrand && (
                    <span className="rounded-lg bg-white/15 px-2 py-1 text-[11px] text-white">{rootBrand}</span>
                  )}
                  <PriceChangeBadge direction={direction} percentText={percentText} onDark />
                </div>
                <h1 className="mt-2 text-[20px] leading-8 text-white sm:text-[26px]">{name}</h1>
                {latestUpdateShamsi && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-[12px] text-white/75">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7.5V12l3 2" />
                    </svg>
                    آخرین بروزرسانی: {latestUpdateShamsi}
                  </p>
                )}
              </div>

              <div className="shrink-0 self-start rounded-2xl bg-white/10 px-5 py-4 backdrop-blur-sm">
                <p className="text-[11.5px] text-white/75">آخرین قیمت ثبت‌شده</p>
                {currentPrice != null ? (
                  <p className="mt-1.5 text-[19px] font-bold text-white sm:text-[24px]">
                    {formatPrice(currentPrice)}
                    <span className="ms-1.5 text-[12px] font-normal text-white/80">تومان</span>
                  </p>
                ) : (
                  <p className="mt-1.5 text-[16px] font-bold text-white/85">قیمت ثبت نشده</p>
                )}
              </div>
            </div>
          </section>

          {/* Price type cards */}
          {activePrices.length > 0 && (
            <section className="mt-6">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-[17px]">قیمت‌های فعال این مدل</h2>
                <span className="rounded-full bg-secondary/5 px-2.5 py-1 text-[11.5px] text-secondary">
                  {toPersianDigits(activePrices.length)} نوع قیمت
                </span>
              </div>

              <div className="mt-3 grid gap-3.5 sm:grid-cols-2">
                {activePrices.map((price, index) => (
                  <article
                    key={price.id ?? index}
                    className="rounded-2xl border border-[#F2F2F2] bg-white p-4 shadow-[0_6px_20px_rgba(36,59,83,0.05)] transition hover:border-primary/30"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex min-w-0 items-center gap-2.5">
                        <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0l-7-7A2 2 0 0 1 3 12.2V5a2 2 0 0 1 2-2h7.2a2 2 0 0 1 1.4.6l7 7a2 2 0 0 1 0 2.8z" />
                            <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" stroke="none" />
                          </svg>
                        </span>
                        <span className="truncate text-[14px] font-bold text-secondary">{price.label}</span>
                      </span>
                      {price.year != null && (
                        <span className="flex-none rounded-md bg-base-300 px-2 py-0.5 text-[11px] text-secondary">
                          مدل {toPersianDigits(price.year)}
                        </span>
                      )}
                    </div>

                    <p className="mt-3.5 flex items-baseline gap-1">
                      <span className="text-[19px] font-bold text-secondary">{formatPrice(price.price)}</span>
                      <span className="text-[11.5px] text-[#8B8B8B]">تومان</span>
                    </p>

                    {price.description && (
                      <p className="mt-2 line-clamp-2 text-[11.5px] leading-5 text-[#8A8A8A]">{price.description}</p>
                    )}

                    <p className="mt-3 flex items-center gap-1.5 border-t border-[#F2F2F2] pt-3 text-[11px] text-[#8A8A8A]">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9AA3AE" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="flex-none" aria-hidden="true">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7.5V12l3 2" />
                      </svg>
                      بروزرسانی {price.updatedAtShamsi || 'نامشخص'}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* History */}
          {history.length > 0 && (
            <section className="mt-6 rounded-2xl border border-[#F2F2F2] bg-white p-5 sm:p-6">
              <h2 className="text-[17px]">تاریخچه قیمت</h2>
              <ol className="mt-3 divide-y divide-[#F4F4F4]">
                {history.map((entry, index) => (
                  <li key={index} className="flex flex-wrap items-center justify-between gap-2 py-3">
                    <span className="flex min-w-0 items-center gap-2">
                      {entry.isActive && (
                        <span className="flex-none rounded-md bg-primary/10 px-1.5 py-0.5 text-[10.5px] text-primary">فعال</span>
                      )}
                      <span className="text-[12px] text-[#8A8A8A]">{entry.updatedAtShamsi || '—'}</span>
                    </span>

                    <span className="flex items-center gap-2">
                      <span className="text-[14px] font-bold text-secondary">{formatPrice(entry.price)}</span>
                      <span className="text-[10.5px] text-[#8B8B8B]">تومان</span>
                      {entry.direction === 'increase' && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#16A34A]/12 text-[#0F9D58]" title="افزایش">
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                            <path d="M6 2.2L10.2 9H1.8z" />
                          </svg>
                        </span>
                      )}
                      {entry.direction === 'decrease' && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EF4444]/12 text-[#E02424]" title="کاهش">
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                            <path d="M6 9.8L1.8 3h8.4z" />
                          </svg>
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <div className="mt-8 text-center">
            <Link
              href="/car-prices"
              className="inline-flex h-11 items-center rounded-xl bg-primary px-6 text-[13.5px] font-bold text-white transition hover:opacity-90"
            >
              مشاهده قیمت خودروهای دیگر
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default CarPriceDetailPage;
