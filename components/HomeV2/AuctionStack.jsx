import { calculateDaysLeft, formatPrice, toPersianDigits } from '@/utils/Cal';
import Link from 'next/link';

const VISIBLE = 3;

const AuctionStack = ({ auctions = [], active = 0, animated = true, hasSubscription = false }) => {
  const total = auctions.length;

  const cards = auctions.map((auction, index) => {
    const id = auction?.id ?? auction?.AuctionId;
    const title = auction?.title || auction?.Title || 'مزایده';
    const city = auction?.city || auction?.City?.CityName || '';
    const price = auction?.base_price ?? auction?.BasePrice ?? auction?.Price;
    const daysLeft = calculateDaysLeft(auction?.end_date || auction?.AuctionDate || auction?.EndDate);
    const href = hasSubscription && id ? `/auctions/${id}` : '/auctions/subscription';
    return { key: id ?? index, index, title, city, price, daysLeft, href };
  });

  return (
    <div className={animated ? 'relative h-[124px] sm:h-[118px]' : 'flex flex-col gap-3'}>
      {cards.map((card) => {
        const rel = animated ? (card.index - active + total) % total : 0;
        const hidden = animated && rel >= VISIBLE;

        const style = animated
          ? {
              transform: `translate3d(0, ${-rel * 13}px, 0) scale(${1 - rel * 0.05})`,
              opacity: hidden ? 0 : 1 - rel * 0.3,
              zIndex: total - rel,
              pointerEvents: rel === 0 ? 'auto' : 'none',
            }
          : undefined;

        return (
          <Link
            key={card.key}
            href={card.href}
            aria-hidden={hidden || undefined}
            tabIndex={animated && rel !== 0 ? -1 : undefined}
            style={style}
            className={`${
              animated
                ? 'absolute inset-x-0 bottom-0 transition-[transform,opacity] duration-500 ease-out'
                : ''
            } flex items-center gap-3.5 rounded-[18px] border border-white/80 bg-white/85 p-3.5 shadow-[0_10px_30px_rgba(30,42,58,.10)] backdrop-blur-xl sm:gap-4 sm:p-4`}
          >
            <span className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-gradient-orange sm:h-[52px] sm:w-[52px]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 4l6 6M11 7l6 6M12.5 5.5l-6 6M4 20l7-7" />
              </svg>
            </span>

            <span className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="font-soft truncate text-[13.5px] text-secondary sm:text-[15.5px]">
                {card.title}
              </span>
              <span className="flex items-center gap-2 text-[11.5px] text-[#8B94A5] sm:text-[13px]">
                {card.city}
                {card.price ? (
                  <>
                    <span className="text-[#D6DAE2]">·</span>
                    <span className="text-[#C2410C]">
                      {toPersianDigits(formatPrice(card.price))} تومان
                    </span>
                  </>
                ) : null}
              </span>
            </span>

            {card.daysLeft > 0 && (
              <span className="flex-none whitespace-nowrap text-[11px] text-[#8B94A5] sm:text-[12.5px]">
                {toPersianDigits(card.daysLeft)} روز مانده
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default AuctionStack;
