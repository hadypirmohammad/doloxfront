import { calculateDaysLeft, formatPrice } from '@/utils/Cal';
import Link from 'next/link';

const AuctionCard = ({ auction }) => {
  const daysLeft = calculateDaysLeft(
    auction?.end_date || auction?.AuctionDate || auction?.EndDate
  );
  const href = auction?.id || auction?.AuctionId
    ? `/auctions/${auction.id || auction.AuctionId}`
    : '/auctions';
  const title = auction?.title || auction?.Title || 'مزایده';
  const city = auction?.city || auction?.City?.CityName || '';
  const price = formatPrice(auction?.base_price || auction?.Price || auction?.BasePrice);
  const isActive = daysLeft > 0;

  return (
    <Link
      href={href}
      className="group relative block w-[250px] shrink-0 overflow-hidden rounded-2xl border border-secondary/40 bg-white shadow-[0_8px_24px_rgba(36,59,83,0.06)] transition duration-300 hover:-translate-y-1 hover:border-secondary hover:shadow-[0_14px_36px_rgba(255,94,0,0.18)] sm:w-[270px]"
    >
      {/* orange top bar */}
      <span className="absolute inset-x-0 top-0 h-1 bg-primary" />
      {/* soft orange wash */}
      <span className="pointer-events-none absolute -left-10 top-0 h-28 w-28 rounded-full bg-primary/10 blur-2xl transition group-hover:bg-primary/20" />

      <div className="relative z-[1] p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <span className="rounded-md bg-primary px-2.5 py-1 text-[11px] text-white">
            مزایده
          </span>
          <span
            className={`rounded-md px-2.5 py-1 text-[11px] ${
              isActive ? 'bg-primary/10 text-primary' : 'bg-[#F3F3F3] text-[#8A8A8A]'
            }`}
          >
            {isActive ? 'فعال' : 'پایان یافته'}
          </span>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M14 4L20 10M12.5 5.5L4 14V18H8L16.5 9.5M9 18H20"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="min-w-0 flex-1 text-right">
            <h3 className="line-clamp-2 text-[15px] font-bold leading-6 text-secondary sm:text-[16px]">
              {title}
            </h3>
            {city ? <p className="mt-1 text-[12px] text-[#8A8A8A]">{city}</p> : null}
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-[#F0F0F0] bg-[#FAFAFA] px-3 py-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-[#8A8A8A]">زمان باقی‌مانده</span>
            <span className={`text-[13px] font-bold ${isActive ? 'text-primary' : 'text-[#8A8A8A]'}`}>
              {isActive ? `${daysLeft} روز` : 'به پایان رسیده'}
            </span>
          </div>
          <div className="my-2.5 h-px w-full bg-gradient-to-l from-primary/70 via-[#EDEDED] to-transparent" />
          <div className="flex items-end justify-between gap-2">
            <span className="text-[11px] text-[#8A8A8A]">قیمت پایه</span>
            <p className="text-[15px] font-bold text-secondary sm:text-[16px]">
              {price}
              <span className="mr-1 text-[11px] font-normal text-primary">تومان</span>
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-[12px] text-[#8A8A8A] transition group-hover:text-primary">
          <span>مشاهده مزایده</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </Link>
  );
};

export default AuctionCard;
