'use client';

import AdsItem from '@/components/global/AdsItem';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const AdsSection = ({ ads = [], surface = 'bg-[#FAFAFA]', bare = false, brandIndex = {} }) => {
  const [Swiper, setSwiper] = useState(null);
  const [SwiperSlide, setSwiperSlide] = useState(null);
  const [modules, setModules] = useState([]);
  const swiperRef = useRef(null);

  useEffect(() => {
    import('swiper/react').then(({ Swiper: S, SwiperSlide: SS }) => {
      setSwiper(() => S);
      setSwiperSlide(() => SS);
    });
    import('swiper/modules').then((mod) => {
      setModules([mod.FreeMode, mod.Autoplay]);
    });
    import('swiper/css');
    import('swiper/css/free-mode');
  }, []);

  if (!ads?.length) return null;

  const items = ads.slice(0, 8);

  return (
    <section className={`${surface} ${bare ? '' : 'px-3 py-8 sm:px-4 sm:py-10'}`}>
      <div className={bare ? "" : "mx-auto max-w-screen-xl"}>
        <div className={`mb-4 items-center justify-between sm:mb-6 ${bare ? "hidden" : "flex"}`}>
          <h2 className="text-lg text-secondary sm:text-2xl">آخرین آگهی ها</h2>
          <Link href="/ads" className="font-soft flex h-9 flex-none items-center gap-1 rounded-full border border-primary/35 bg-[#FFF6F0] px-3.5 text-[12.5px] text-[#C2410C] transition-colors hover:bg-primary hover:text-white sm:text-[13.5px]">
            مشاهده همه
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
              <path d="M14 6l-6 6 6 6" />
            </svg>
          </Link>
        </div>

        {Swiper && SwiperSlide && modules.length ? (
          <div className="relative py-3">
            <button
              type="button"
              aria-label="بعدی"
              onClick={() => swiperRef.current?.slideNext()}
              className="absolute -left-9 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#E6E8EC] bg-white text-secondary shadow-[0_6px_20px_rgba(30,42,58,.14)] transition-colors hover:bg-primary hover:text-white sm:flex lg:-left-12"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 6l-6 6 6 6" />
              </svg>
            </button>

            <button
              type="button"
              aria-label="قبلی"
              onClick={() => swiperRef.current?.slidePrev()}
              className="absolute -right-9 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#E6E8EC] bg-white text-secondary shadow-[0_6px_20px_rgba(30,42,58,.14)] transition-colors hover:bg-primary hover:text-white sm:flex lg:-right-12"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 6l6 6-6 6" />
              </svg>
            </button>

            <div className="-mx-1 overflow-x-clip px-1">
            <Swiper
              modules={modules}
              freeMode
              loop
              autoplay={{ delay: 2000, disableOnInteraction: false, pauseOnMouseEnter: true }}
              spaceBetween={16}
              slidesPerView="auto"
              onSwiper={(instance) => {
                swiperRef.current = instance;
              }}
              className="!overflow-visible"
            >
              {items.map((ad, index) => (
                <SwiperSlide
                  key={ad.AdId || ad.EnTitle || index}
                  className="!h-auto !w-[260px] sm:!w-[280px]"
                >
                  <AdsItem ad={ad} brandIndex={brandIndex} />
                </SwiperSlide>
              ))}
            </Swiper>
            </div>
          </div>
        ) : (
          <div className="-mx-1 flex gap-4 overflow-x-auto px-1 py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {items.map((ad, index) => (
              <div key={ad.AdId || ad.EnTitle || index} className="w-[260px] shrink-0 sm:w-[280px]">
                <AdsItem ad={ad} brandIndex={brandIndex} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AdsSection;
