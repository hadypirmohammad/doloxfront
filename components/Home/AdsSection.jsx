'use client';

import AdsItem from '@/components/global/AdsItem';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const AdsSection = ({ ads = [] }) => {
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

  if (!ads?.length) return null;

  const items = ads.slice(0, 8);

  return (
    <section className="bg-[#FAFAFA] px-3 py-8 sm:px-4 sm:py-10">
      <div className="mx-auto max-w-screen-xl">
        <div className="mb-4 flex items-center justify-between sm:mb-6">
          <h2 className="text-lg text-secondary sm:text-2xl">آخرین آگهی ها</h2>
          <Link href="/ads" className="text-sm text-primary">
            مشاهده همه
          </Link>
        </div>

        {Swiper && SwiperSlide && modules.length ? (
          <div className="-mx-1 overflow-x-clip px-1 py-3">
            <Swiper
              modules={modules}
              freeMode
              spaceBetween={16}
              slidesPerView="auto"
              className="!overflow-visible"
            >
              {items.map((ad, index) => (
                <SwiperSlide
                  key={ad.AdId || ad.EnTitle || index}
                  className="!h-auto !w-[260px] sm:!w-[280px]"
                >
                  <AdsItem ad={ad} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <div className="-mx-1 flex gap-4 overflow-x-auto px-1 py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {items.map((ad, index) => (
              <div key={ad.AdId || ad.EnTitle || index} className="w-[260px] shrink-0 sm:w-[280px]">
                <AdsItem ad={ad} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AdsSection;
