import { formatPrice } from '@/utils/Cal';
import { getCarPrices } from '@/utils/Request';
import { resolveBackendMediaUrl } from '@/utils/media';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

function mapListItem(item) {
  const direction = item?.priceChange?.direction || item?.priceChange?.changeDirection || 'none';
  const changePct =
    item?.priceChange?.percent ??
    item?.priceChange?.changePercent ??
    item?.priceChange?.value ??
    null;
  const image = resolveBackendMediaUrl(item.carImage);

  return {
    brandId: item.brandId,
    name: [item.parentBrand, item.carName].filter(Boolean).join(' — ') || item.carName,
    price: item.currentPriceToman ?? item.price ?? item.latestPrice ?? null,
    change: typeof changePct === 'number' ? changePct : null,
    direction,
    activePricesCount: item.activePricesCount ?? 0,
    updatedAt: item.currentPriceUpdatedAt || null,
    image,
    rawCarImage: item.carImage || null,
  };
}

export async function getServerSideProps(context) {
  const page = Number(context.query.page) || 1;
  const search = context.query.search || '';

  try {
    const data = await getCarPrices({ page, pageSize: 20, search });
    return {
      props: {
        items: data?.items || [],
        pagination: data?.pagination || null,
        search,
        page,
      },
    };
  } catch {
    return { props: { items: [], pagination: null, search, page } };
  }
}

const CarPricesPage = ({ items, pagination, search, page }) => {
  const router = useRouter();
  const [query, setQuery] = useState(search || '');
  const mapped = (items || []).map(mapListItem);

  useEffect(() => {
    const rows = (items || []).map(mapListItem);
    console.log(
      'car-prices final image paths:',
      rows.map((item) => ({
        brandId: item.brandId,
        rawCarImage: item.rawCarImage,
        finalPath: item.image,
      }))
    );
  }, [items]);

  const submitSearch = (event) => {
    event.preventDefault();
    router.push({
      pathname: '/car-prices',
      query: {
        ...(query ? { search: query } : {}),
        page: 1,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-3 py-8 text-secondary sm:px-4" dir="rtl">
      <div className="mx-auto max-w-screen-xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl">قیمت روز خودروها</h1>
            <p className="mt-1 font-['vazir'] text-sm text-[#8A8A8A]">جستجو و مشاهده قیمت مدل‌ها</p>
          </div>
          <form onSubmit={submitSearch} className="flex w-full gap-2 sm:max-w-md">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input flex-1 border-none bg-white font-['vazir'] shadow-sm focus:outline-primary"
              placeholder="جستجوی خودرو..."
            />
            <button type="submit" className="rounded-xl bg-primary px-4 text-white">
              جستجو
            </button>
          </form>
        </div>

        <div className="space-y-3">
          {mapped.length === 0 ? (
            <p className="rounded-2xl bg-white p-6 font-['vazir'] text-sm text-[#8A8A8A]">موردی یافت نشد</p>
          ) : (
            mapped.map((item) => (
              <Link
                key={item.brandId}
                href={`/car-prices/${item.brandId}`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-[#F0F0F0] bg-white px-4 py-3 shadow-sm transition hover:border-primary/30"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[#F0F0F0] bg-[#FAFAFA]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-1.5"
                      sizes="48px"
                    />
                  </div>
                  <div className="min-w-0 text-right">
                    <p className="truncate font-bold">{item.name}</p>
                    <p className="mt-1 font-['vazir'] text-xs text-[#8A8A8A]">
                      {item.price != null
                        ? `${formatPrice(item.price)} تومان`
                        : item.activePricesCount > 0
                          ? 'مشاهده جزئیات قیمت'
                          : 'قیمت ثبت نشده'}
                    </p>
                  </div>
                </div>
                <span
                  className={`shrink-0 text-sm ${
                    item.direction === 'up'
                      ? 'text-success'
                      : item.direction === 'down'
                        ? 'text-error'
                        : 'text-[#8A8A8A]'
                  }`}
                >
                  {item.direction === 'up'
                    ? '▲'
                    : item.direction === 'down'
                      ? '▼'
                      : item.direction === 'new'
                        ? 'جدید'
                        : '—'}
                </span>
              </Link>
            ))
          )}
        </div>

        {pagination?.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              disabled={!pagination.hasPrevious}
              className="rounded-xl border border-[#E8E8E8] bg-white px-4 py-2 text-sm disabled:opacity-40"
              onClick={() =>
                router.push({
                  pathname: '/car-prices',
                  query: { ...(search ? { search } : {}), page: page - 1 },
                })
              }
            >
              قبلی
            </button>
            <span className="font-['vazir'] text-sm">
              صفحه {page} از {pagination.totalPages}
            </span>
            <button
              type="button"
              disabled={!pagination.hasNext}
              className="rounded-xl border border-[#E8E8E8] bg-white px-4 py-2 text-sm disabled:opacity-40"
              onClick={() =>
                router.push({
                  pathname: '/car-prices',
                  query: { ...(search ? { search } : {}), page: page + 1 },
                })
              }
            >
              بعدی
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarPricesPage;
