import { calculateDaysLeft, formatPrice } from '@/utils/Cal'
import { isFavorite, toggleFavorite } from '@/utils/favorites'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const AuctionItem = ({ auction }) => {
    const daysLeft = calculateDaysLeft(auction?.AuctionDate);
    const cityName = auction?.City?.CityName || '';
    const auctionId = auction?.AuctionId;
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        setLiked(auction?.IsFavorite ?? isFavorite('auction', auctionId));
    }, [auction?.IsFavorite, auctionId]);

    const handleFavorite = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        setLiked(await toggleFavorite('auction', auctionId, liked, auction));
    };

  return (
      <Link
        href={`/auctions/${auction.AuctionId}`}
        className="my-2 flex w-full items-center gap-3 rounded-2xl border border-secondary/40 bg-white px-3.5 py-3 shadow-[0_8px_24px_rgba(36,59,83,0.06)] transition duration-300 hover:-translate-y-0.5 hover:border-secondary hover:shadow-[0_14px_36px_rgba(255,94,0,0.18)] sm:px-4"
      >
          <button
              type="button"
              aria-label={liked ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
              aria-pressed={liked}
              onClick={handleFavorite}
              className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-[#E6E8EC] bg-white transition-colors hover:border-primary"
          >
              <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill={liked ? '#FF5E00' : 'none'}
                  stroke={liked ? '#FF5E00' : '#9AA3B0'}
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
              >
                  <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
              </svg>
          </button>

          <div className='flex min-w-0 flex-1 flex-col gap-1'>
              <h2 className='m-0 truncate text-[14.5px] font-bold text-secondary sm:text-[15.5px]'>{auction.Title}</h2>
              {cityName && (
                  <div className='flex items-center gap-1 text-[12px] text-[#8B94A5]'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 20" fill="none" className='flex-none'>
                          <path d="M13.6562 3.19773C10.5322 0.237476 5.46716 0.237476 2.34316 3.19773C1.60145 3.89578 1.01207 4.72961 0.60968 5.65023C0.207288 6.57084 0 7.55966 0 8.55855C0 9.55744 0.207288 10.5463 0.60968 11.4669C1.01207 12.3875 1.60145 13.2213 2.34316 13.9194L7.99917 19.2802L13.6562 13.9194C14.3979 13.2213 14.9873 12.3875 15.3897 11.4669C15.792 10.5463 15.9993 9.55744 15.9993 8.55855C15.9993 7.55966 15.792 6.57084 15.3897 5.65023C14.9873 4.72961 14.3979 3.89578 13.6562 3.19773ZM7.99917 11.0921C7.33117 11.0921 6.70417 10.8416 6.23117 10.3869C5.76292 9.93488 5.49994 9.32237 5.49994 8.68378C5.49994 8.04519 5.76292 7.43268 6.23117 6.98065C6.70317 6.52596 7.33117 6.2755 7.99917 6.2755C8.66716 6.2755 9.29516 6.52596 9.76716 6.98065C10.2354 7.43268 10.4984 8.04519 10.4984 8.68378C10.4984 9.32237 10.2354 9.93488 9.76716 10.3869C9.29516 10.8416 8.66716 11.0921 7.99917 11.0921Z" fill="#A3ADBC" />
                      </svg>
                      <span className='truncate'>{cityName}</span>
                  </div>
              )}
          </div>

          {daysLeft > 0 && (
              <span className='flex-none rounded-lg bg-[#FFF3EA] px-2.5 py-1 text-[11.5px] font-bold text-primary'>
                  {daysLeft} روز مانده
              </span>
          )}

          <p className='m-0 flex-none whitespace-nowrap text-[14px] font-bold text-secondary sm:text-[15px]'>
              {formatPrice(auction.Price)} <span className='text-[11.5px] font-normal text-[#8B94A5]'>ت</span>
          </p>
      </Link>
  )
}

export default AuctionItem
