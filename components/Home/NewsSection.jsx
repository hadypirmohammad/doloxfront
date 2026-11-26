'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import NewsCard from './NewsCard';

const NewsSection = ({ blogs = [], surface = 'bg-[#FAFAFA]', bare = false }) => {
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

  if (!blogs?.length) return null;

  const items = blogs.slice(0, 4);

  return (
    <section className={`${surface} ${bare ? '' : 'px-3 py-8 sm:px-4 sm:py-12'}`}>
      <div className={bare ? "" : "mx-auto max-w-screen-xl"}>
        <div className={`mb-4 items-center justify-between sm:mb-6 ${bare ? "hidden" : "flex"}`}>
          <h2 className="text-lg text-secondary sm:text-2xl">آخرین اخبار</h2>
          <Link
            href="https://blog.dolox.ir"
            target="_blank"
            rel="noopener noreferrer"
            className="font-soft flex h-9 flex-none items-center gap-1 rounded-full border border-primary/35 bg-[#FFF6F0] px-3.5 text-[12.5px] text-[#C2410C] transition-colors hover:bg-primary hover:text-white sm:text-[13.5px]"
          >
            مشاهده همه
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
              <path d="M14 6l-6 6 6 6" />
            </svg>
          </Link>
        </div>

        <div className="hidden gap-4 lg:grid lg:grid-cols-4">
          {items.map((blog, index) => (
            <NewsCard key={blog.id || index} blog={blog} />
          ))}
        </div>

        <div className="lg:hidden">
          {Swiper && SwiperSlide && modules.length ? (
            <Swiper modules={modules} freeMode spaceBetween={14} slidesPerView="auto">
              {items.map((blog, index) => (
                <SwiperSlide key={blog.id || index} className="!w-[260px] sm:!w-[280px]">
                  <NewsCard blog={blog} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="flex flex-col gap-3.5">
              {items.map((blog, index) => (
                <NewsCard key={blog.id || index} blog={blog} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
