import { formatPrice } from '@/utils/Cal';
import { getCarPriceDetail } from '@/utils/Request';
import { resolveBackendMediaUrl } from '@/utils/media';
import Image from 'next/image';
import Link from 'next/link';

export async function getServerSideProps(context) {
  const { brandId } = context.params;

  try {
    const detail = await getCarPriceDetail(brandId);
    return { props: { detail: detail || null, brandId } };
  } catch {
    return { props: { detail: null, brandId } };
  }
}

function pickPrice(entry) {
  if (entry == null) return null;
  if (typeof entry === 'number') return entry;
  return (
    entry.currentPriceToman ??
    entry.price ??
    entry.Price ??
    entry.amount ??
    entry.Amount ??
    null
  );
}

const CarPriceDetailPage = ({ detail, brandId }) => {
  const car = detail?.car || {};
  const history = detail?.priceHistory || [];
  const direction = detail?.priceChange?.direction || 'none';
  const currentPrice =
    detail?.currentPriceToman ??
    car.currentPriceToman ??
    pickPrice(detail?.activePrices?.[0]) ??
    null;
  const imageSrc = resolveBackendMediaUrl(car.carImage || detail?.carImage);
  console.log('car-prices detail image path:', {
    brandId,
    carImage: car.carImage || detail?.carImage,
    finalPath: imageSrc,
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-3 py-8 text-secondary sm:px-4" dir="rtl">
      <div className="mx-auto max-w-screen-md">
        <Link href="/car-prices" className="font-['vazir'] text-sm text-primary">
          ← بازگشت به لیست قیمت‌ها
        </Link>

        <div className="mt-4 rounded-3xl border border-[#F0F0F0] bg-white p-5 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-[#F0F0F0] bg-[#FAFAFA]">
              <Image src={imageSrc} alt={car.carName || 'brand'} fill className="object-contain p-2" sizes="64px" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-['vazir'] text-xs text-[#8A8A8A]">{car.rootBrand}</p>
              <h1 className="mt-1 text-2xl">
                {car.parentBrand ? `${car.parentBrand} — ` : ''}
                {car.carName || `خودرو ${brandId}`}
              </h1>
            </div>
          </div>
          <p className="mt-3 text-xl font-bold text-primary">
            {currentPrice != null ? `${formatPrice(currentPrice)} تومان` : 'قیمت ثبت نشده'}
          </p>
          <p
            className={`mt-2 text-sm ${
              direction === 'up' ? 'text-success' : direction === 'down' ? 'text-error' : 'text-[#8A8A8A]'
            }`}
          >
            روند قیمت:{' '}
            {direction === 'up'
              ? 'صعودی'
              : direction === 'down'
                ? 'نزولی'
                : direction === 'new'
                  ? 'جدید'
                  : 'بدون تغییر'}
          </p>
        </div>

        <div className="mt-4 rounded-3xl border border-[#F0F0F0] bg-white p-5 sm:p-8">
          <h2 className="mb-3 text-lg">تاریخچه قیمت</h2>
          {history.length === 0 ? (
            <p className="font-['vazir'] text-sm text-[#8A8A8A]">تاریخچه‌ای موجود نیست.</p>
          ) : (
            <div className="space-y-2">
              {history.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-xl border border-[#F2F2F2] px-3 py-2"
                >
                  <span className="font-['vazir'] text-xs text-[#8A8A8A]">
                    {entry.date || entry.Date || entry.createdAt || '—'}
                  </span>
                  <span className="text-sm font-bold">
                    {pickPrice(entry) != null ? `${formatPrice(pickPrice(entry))} تومان` : '—'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarPriceDetailPage;
