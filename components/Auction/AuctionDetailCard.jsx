import React, { useEffect, useState } from 'react'
import { convertToShamsiAndGregorian, formatPrice, toPersianDigits } from '@/utils/Cal'
import { isFavorite, toggleFavorite } from '@/utils/favorites'

const AuctionDetailCard = ({ auction, provinceName = '' }) => {
  const auctiondata = auction?.Auction
  const auctionId = auctiondata?.AuctionId
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    setLiked(auctiondata?.IsFavorite ?? isFavorite('auction', auctionId))
  }, [auctiondata?.IsFavorite, auctionId])

  const handleFavorite = async () => {
    setLiked(await toggleFavorite('auction', auctionId, liked, auctiondata))
  }
  // console.log(auctiondata)

  const formatShamsiDate = (dateString) => {
    const { shamsi } = convertToShamsiAndGregorian(dateString);
    if (!shamsi?.year) return '—';
    return `${shamsi.year}/${String(shamsi.month).padStart(2, '0')}/${String(shamsi.day).padStart(2, '0')}`;
  };
  return (
    <div className='relative h-full rounded-[15px] bg-white p-6'>
      <button
        type='button'
        onClick={handleFavorite}
        aria-label={liked ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
        aria-pressed={liked}
        className='absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#E6E8EC] bg-white transition-colors hover:border-primary/50'
      >
        <svg width='19' height='19' viewBox='0 0 24 24' fill={liked ? '#FF5E00' : 'none'} stroke={liked ? '#FF5E00' : '#5B6575'} strokeWidth='1.9' strokeLinecap='round' strokeLinejoin='round'>
          <path d='M12 20s-7.4-4.3-7.4-9.2A4.1 4.1 0 0 1 12 8.3a4.1 4.1 0 0 1 7.4 2.5C19.4 15.7 12 20 12 20z' />
        </svg>
      </button>
      <h1  className="px-10 text-center text-xl">{auctiondata?.Title || 'مزایده'}</h1>
      <div className='flex justify-between py-2'>
        <span className='font-[vazir]'>کداگهی:</span>
        <span className='font-[vazir]'>{auctiondata?.AuctionId != null ? toPersianDigits(auctiondata.AuctionId) : '—'}</span>
      </div>
      <hr></hr>
      <div className='flex justify-between py-2'>
        <span className='font-[vazir]'>قیمت پایه :</span>
        <span className='font-[vazir]'>{auctiondata?.Price != null ? `${toPersianDigits(formatPrice(auctiondata.Price))} تومان` : '—'}</span>
      </div>
      <hr></hr>
      <div className='flex justify-between py-2'>
        <span className='font-[vazir]'>استان :</span>
        <span className='font-[vazir]'>{provinceName || '—'}</span>
      </div>
      <hr></hr>
      <div className='flex justify-between py-2'>
        <span className='font-[vazir]'>شهر :</span>
        <span className='font-[vazir]'>{auctiondata?.City?.CityName || '—'}</span>
      </div>
      <hr></hr>
      <div className='flex justify-between py-2'>
        <span className='font-[vazir]'>تاریخ انتشار:</span>
        <span className='font-[vazir]'>{formatShamsiDate(auctiondata?.publishDate)}</span>
      </div>
      <hr></hr>
      <div className='flex justify-between py-2'>
        <span className='font-[vazir]'>تاریخ دریافت اسناد:</span>
        <span className='font-[vazir]'>{formatShamsiDate(auctiondata?.GetDocDate)}</span>
      </div>
      <hr></hr>
      <div className='flex justify-between py-2'>
        <span className='font-[vazir]'>تاریخ مزایده :</span>
        <span className='font-[vazir]'>{formatShamsiDate(auctiondata?.AuctionDate)}</span>
      </div>
    </div>
  )
}

export default AuctionDetailCard