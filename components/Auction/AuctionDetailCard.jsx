import React from 'react'
import { convertToShamsiAndGregorian } from '@/utils/Cal'

const AuctionDetailCard = ({ auction }) => {
  const auctiondata =auction.Auction
  // console.log(auctiondata)

  const formatShamsiDate = (dateString) => {
    const { shamsi } = convertToShamsiAndGregorian(dateString);
    if (!shamsi?.year) return '—';
    return `${shamsi.year}/${String(shamsi.month).padStart(2, '0')}/${String(shamsi.day).padStart(2, '0')}`;
  };
  return (
    <div className='h-full rounded-[15px] bg-white p-6'>
      <h1  className="text-center text-xl">{auctiondata.Title}</h1>
      <div className='flex justify-between py-2'>
        <span className='font-[vazir]'>کداگهی:</span>
        <span className='font-[vazir]'>{auctiondata?.AuctionId}</span>
      </div>
      <hr></hr>
      <div className='flex justify-between py-2'>
        <span className='font-[vazir]'>قیمت پایه :</span>
        <span className='font-[vazir]'>{auctiondata?.Price}</span>
      </div>
      <hr></hr>
      <div className='flex justify-between py-2'>
        <span className='font-[vazir]'>استان :</span>
        <span className='font-[vazir]'>{auctiondata?.City.CityName}</span>
      </div>
      <hr></hr>
      <div className='flex justify-between py-2'>
        <span className='font-[vazir]'>برگزار کننده:</span>
        <span className='font-[vazir]'>{auctiondata?.Orgnizer}</span>
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