'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import AuctionCard from './AuctionCard';

const AuctionSection = ({ auctions = [] }) => {
  const [Swiper, setSwiper] = useState(null);
  const [SwiperSlide, setSwiperSlide] = useState(null);
  const [modules, setModules] = useState([]);

  useEffect(() => {
    import('swiper/react').then(({ Swiper: S, SwiperSlide: SS }) => {
      setSwiper(() => S);
      setSwiperSlide(() => SS);
    });
    import('swiper/modules').then((mod) => {
      setModules([mod.FreeMode]);
    });
    import('swiper/css');
    import('swiper/css/free-mode');
  }, []);

  if (!auctions?.length) return null;

  return (
    <section className="bg-[#FAFAFA] px-3 py-8 sm:px-4 sm:py-10">
      <div className="mx-auto max-w-screen-xl">
        <div className="mb-4 flex items-center justify-between sm:mb-6">
          <h2 className="text-lg text-secondary sm:text-2xl">آگهی مزایده</h2>
          <Link href="/auctions" className="font-['vazir'] text-sm text-primary">
            مشاهده همه
          </Link>
        </div>

        {Swiper && SwiperSlide && modules.length ? (
          <div className="-mx-1 overflow-x-clip px-1 py-2">
            <Swiper
              modules={modules}
              freeMode
              spaceBetween={14}
              slidesPerView="auto"
              className="!overflow-visible"
            >
              {auctions.map((auction, index) => (
                <SwiperSlide key={auction.id || index} className="!w-auto">
                  <AuctionCard auction={auction} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <div className="flex gap-3.5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {auctions.map((auction, index) => (
              <AuctionCard key={auction.id || index} auction={auction} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AuctionSection;
