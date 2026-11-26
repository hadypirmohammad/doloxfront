import AdsItem from '@/components/global/AdsItem';
import AutoItem from '@/components/global/AutoItem';
import { favoriteToken, getFavoriteItems, getFavorites } from '@/utils/favorites';
import AuctionItem from '@/components/Auction/AuctionItem';
import { toPersianDigits } from '@/utils/Cal';
import { getAutogalleriesByid, getMyFavorites } from '@/utils/Request';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

const Favorites = () => {
  const [galleries, setGalleries] = useState([]);
  const [ads, setAds] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mergeById = (serverList, localList, key) => {
      const seen = new Set(serverList.map((item) => String(item?.[key])));
      return [...serverList, ...localList.filter((item) => !seen.has(String(item?.[key])))];
    };

    const load = async () => {
      const token = favoriteToken();
      let serverGalleries = [];
      let serverAds = [];
      let serverAuctions = [];

      if (token) {
        const data = await getMyFavorites(token);
        serverGalleries = data.Galleries || [];
        serverAds = data.Ads || [];
        serverAuctions = data.Auctions || [];
      }

      const localAds = getFavoriteItems('ad');
      let localGalleries = getFavoriteItems('gallery');

      const missing = getFavorites('gallery').filter(
        (id) => !localGalleries.some((item) => String(item?.GalleryId) === String(id))
      );

      if (missing.length) {
        const fetched = await Promise.all(missing.map((id) => getAutogalleriesByid(id).catch(() => null)));
        localGalleries = [...localGalleries, ...fetched.filter(Boolean)];
      }

      setGalleries(mergeById(serverGalleries, localGalleries, 'GalleryId'));
      setAds(mergeById(serverAds, localAds, 'AdId'));
      setAuctions(mergeById(serverAuctions, getFavoriteItems('auction'), 'AuctionId'));
      setLoading(false);
    };

    load();
  }, []);

  return (
    <div dir='rtl' className='min-h-screen bg-[#F5F6F8] px-4 pb-12 pt-6 text-secondary sm:px-6 md:pt-8'>
      <div className='mx-auto max-w-screen-xl'>
        <div className='flex items-center gap-2'>
          <span className='h-5 w-[3px] rounded-[3px] bg-primary' />
          <h1 className='m-0 text-[20px] font-bold sm:text-[24px]'>علاقه‌مندی ها</h1>
        </div>
        <p className='m-0 pt-3 text-[13px] leading-[2] text-[#8B94A5]'>
          هر چیزی که با زدن دکمه قلب ذخیره کرده‌اید — گالری، مزایده و آگهی — در بخش خودش اینجا نگه
          داشته می‌شود.
        </p>

        {loading && (
          <div className='flex justify-center py-20'>
            <span className='loading loading-spinner loading-md text-primary' />
          </div>
        )}

        {!loading && galleries.length > 0 && (
          <>
            <div className='flex items-center gap-2 pt-8'>
              <span className='h-5 w-[3px] rounded-[3px] bg-primary' />
              <h2 className='m-0 text-[17px] font-bold'>گالری های ذخیره شده</h2>
              <span className='rounded-full bg-[#FFF1E8] px-2.5 py-0.5 text-[12px] text-[#C2410C]'>
                {toPersianDigits(galleries.length)}
              </span>
            </div>
          <div className='grid grid-cols-1 gap-4 pt-4 lg:grid-cols-2'>
            {galleries.map((gallery) => (
              <AutoItem key={gallery.GalleryId} auto={gallery} />
            ))}
          </div>
          </>
        )}

        {!loading && auctions.length > 0 && (
          <>
            <div className='flex items-center gap-2 pt-8'>
              <span className='h-5 w-[3px] rounded-[3px] bg-primary' />
              <h2 className='m-0 text-[17px] font-bold'>مزایده های ذخیره شده</h2>
              <span className='rounded-full bg-[#FFF1E8] px-2.5 py-0.5 text-[12px] text-[#C2410C]'>
                {toPersianDigits(auctions.length)}
              </span>
            </div>
            <div className='flex flex-col pt-2'>
              {auctions.map((item, index) => (
                <AuctionItem key={item.AuctionId || index} auction={item} />
              ))}
            </div>
          </>
        )}

        {!loading && ads.length > 0 && (
          <>
            <div className='flex items-center gap-2 pt-8'>
              <span className='h-5 w-[3px] rounded-[3px] bg-primary' />
              <h2 className='m-0 text-[17px] font-bold'>آگهی های ذخیره شده</h2>
              <span className='rounded-full bg-[#FFF1E8] px-2.5 py-0.5 text-[12px] text-[#C2410C]'>
                {toPersianDigits(ads.length)}
              </span>
            </div>
            <div className='grid grid-cols-1 gap-3 pt-4 sm:grid-cols-2 lg:grid-cols-4'>
              {ads.map((item, index) => (
                <AdsItem key={item.AdId || index} ad={item} />
              ))}
            </div>
          </>
        )}

        {!loading && galleries.length === 0 && ads.length === 0 && auctions.length === 0 && (
          <div className='flex flex-col items-center gap-3.5 py-24 text-center'>
            <span className='flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#FFEDE3] text-primary'>
              <svg width='28' height='28' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round'>
                <path d='M12 20s-7.4-4.3-7.4-9.2A4.1 4.1 0 0 1 12 8.3a4.1 4.1 0 0 1 7.4 2.5C19.4 15.7 12 20 12 20z' />
              </svg>
            </span>
            <p className='m-0 text-sm text-[#8B94A5]'>هنوز چیزی به علاقه‌مندی‌ها اضافه نکرده‌اید</p>
            <Link href='/autogallery' className='rounded-xl bg-gradient-orange px-6 py-2.5 text-[13.5px] font-bold text-white'>
              مشاهده گالری ها
            </Link>
          </div>
        )}

        <p className='m-0 pt-8 text-center text-[11.5px] leading-[2] text-[#A3ADBC]'>
          برای اینکه علاقه‌مندی‌هایتان روی همه دستگاه‌ها باشد، وارد حساب کاربری شوید.
        </p>
      </div>
    </div>
  )
}

export default Favorites
