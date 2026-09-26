'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import NewsCard from './NewsCard';

const NewsSection = ({ blogs = [] }) => {
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
    <section className="bg-[#FAFAFA] px-3 py-8 sm:px-4 sm:py-12">
      <div className="mx-auto max-w-screen-xl">
        <div className="mb-4 flex items-center justify-between sm:mb-6">
          <h2 className="text-lg text-secondary sm:text-2xl">آخرین اخبار</h2>
          <Link
            href="https://blog.dolox.ir"
            target="_blank"
            rel="noopener noreferrer"
            className="font-['vazir'] text-sm text-primary"
          >
            مشاهده همه
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
