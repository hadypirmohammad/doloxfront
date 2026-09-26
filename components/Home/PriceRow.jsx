import { formatPrice } from '@/utils/Cal';
import Image from 'next/image';
import Link from 'next/link';

const PriceRow = ({ item }) => {
  const direction = item.direction || (item.change > 0 ? 'up' : item.change < 0 ? 'down' : 'none');
  const isUp = direction === 'up';
  const isDown = direction === 'down';
  const changeValue = typeof item.change === 'number' ? item.change : null;
  const changeText =
    changeValue != null && Math.abs(changeValue) >= 0.01
      ? `${isUp ? '+' : ''}${changeValue.toFixed(2)}%`
      : direction === 'up'
        ? 'صعودی'
        : direction === 'down'
          ? 'نزولی'
          : direction === 'new'
            ? 'جدید'
            : 'بدون تغییر';

  const toneClass = isUp ? 'text-success' : isDown ? 'text-error' : 'text-[#8A8A8A]';

  const content = (
    <>
      <div className="hidden items-center gap-4 rounded-xl border border-[#F2F2F2] bg-white px-4 py-3 shadow-[0_4px_14px_rgba(36, 59, 83,0.04)] sm:flex">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[#F0F0F0] bg-base-300">
          <Image
            src={item.icon || '/media/images/samplebrand.png'}
            alt={item.name}
            fill
            className="object-contain p-1.5"
            sizes="48px"
          />
        </div>
        <p className="min-w-0 flex-1 truncate font-['vazir'] text-[14px] font-bold text-secondary">
          {item.name}
        </p>
        <p className="shrink-0 font-['vazir'] text-[14px] text-secondary">
          {item.price != null ? (
            <>
              {formatPrice(item.price)} <span className="text-[11px] text-[#8B8B8B]">تومان</span>
            </>
          ) : (
            <span className="text-[12px] text-[#8B8B8B]">قیمت ثبت نشده</span>
          )}
        </p>
        <div className={`flex shrink-0 items-center gap-1 font-['vazir'] text-[13px] ${toneClass}`}>
          {(isUp || isDown) && (
            <svg
              className={isUp ? '' : 'rotate-180'}
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 15 15"
              fill="none"
            >
              <path d="M7.5 3L15 11H0L7.5 3Z" fill="currentColor" />
            </svg>
          )}
          <span>{changeText}</span>
        </div>
      </div>

      <div className="rounded-2xl border border-[#F2F2F2] bg-white p-4 shadow-[0_6px_18px_rgba(36, 59, 83,0.05)] sm:hidden">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[#F0F0F0] bg-base-300">
            <Image
              src={item.icon || '/media/images/samplebrand.png'}
              alt={item.name}
              fill
              className="object-contain p-1.5"
              sizes="48px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-['vazir'] text-[14px] font-bold text-secondary">{item.name}</p>
            <p className="mt-1 font-['vazir'] text-[13px] text-secondary">
              {item.price != null ? (
                <>
                  {formatPrice(item.price)} <span className="text-[11px] text-[#8B8B8B]">تومان</span>
                </>
              ) : (
                <span className="text-[12px] text-[#8B8B8B]">قیمت ثبت نشده</span>
              )}
            </p>
          </div>
          <div className={`flex items-center gap-1 font-['vazir'] text-[13px] ${toneClass}`}>
            {(isUp || isDown) && (
              <svg
                className={isUp ? '' : 'rotate-180'}
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 15 15"
                fill="none"
              >
                <path d="M7.5 3L15 11H0L7.5 3Z" fill="currentColor" />
              </svg>
            )}
            <span>{changeText}</span>
          </div>
        </div>
      </div>
    </>
  );

  if (item.brandId) {
    return (
      <Link href={`/car-prices/${item.brandId}`} className="block">
        {content}
      </Link>
    );
  }

  return content;
};

export default PriceRow;
