// DailyPrice.jsx
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { formatPrice } from '@/utils/Cal';

const DailyPrice = ({ speed = 50 }) => {
  const ref = useRef(null);
  const [Swiper, setSwiper] = useState(null);
  const [SwiperSlide, setSwiperSlide] = useState(null);
  const [modules, setModules] = useState([]);

  useEffect(() => {
    import('swiper/react').then(({ Swiper: S, SwiperSlide: SS }) => {
      setSwiper(() => S);
      setSwiperSlide(() => SS);
    });

    import('swiper/modules').then((mod) => {
      setModules([
        mod.Navigation,
        mod.Autoplay
      ]);
    });

    import('swiper/css');
    import('swiper/css/navigation');
    import('swiper/css/pagination');
    import('swiper/css/autoplay');
  }, []);

  const logos = [
    { src: '/logo1.png', alt: 'برند 1', price: "6000000", change: "up" },
    { src: '/logo2.png', alt: 'برند 2', price: "6000000", change: "down" },
    { src: '/logo3.png', alt: 'برند 3', price: "6000000", change: "up" },
    { src: '/logo4.png', alt: 'برند 4', price: "6000000", change: "down" },
    { src: '/logo5.png', alt: 'برند 5', price: "6000000", change: "up" }
  ];

  useEffect(() => {
    const marquee = ref.current;
    if (!marquee) return;

    const handleMouseEnter = () => marquee.style.animationPlayState = 'paused';
    const handleMouseLeave = () => marquee.style.animationPlayState = 'running';

    marquee.addEventListener('mouseenter', handleMouseEnter);
    marquee.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      marquee.removeEventListener('mouseenter', handleMouseEnter);
      marquee.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        .dailyPriceSwiper .swiper-button-next,
        .dailyPriceSwiper .swiper-button-prev {
          color: #FF6B00 !important;
          background: rgba(255, 255, 255, 0.2);
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
        
        .dailyPriceSwiper .swiper-button-next:after,
        .dailyPriceSwiper .swiper-button-prev:after {
          font-size: 18px;
        }

        .dailyPriceSwiper .swiper-slide {
          width: 303px !important;
        }
      `}</style>

      <section className='mx-auto  px-2  bg-white'>
        <div className='mx-auto max-w-screen-xl text-white rounded-xl'>
          <div className="overflow-hidden w-full bg-white py-8">
            <h2 className='md:text-3xl text-2xl w-full text-right text-black px-4'>
              قیمت روز خودرو ها
            </h2>

            {Swiper && SwiperSlide && modules.length ? (
              <div className='mt-4 px-4'>
                <Swiper
                  modules={modules}
                  spaceBetween={16}
                  slidesPerView={'auto'}
                  autoplay={{
                    delay: 0,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                  }}
                  speed={3000}
                  navigation={true}
                  loop={true}
                  className="dailyPriceSwiper"
                >
                  {[...logos, ...logos, ...logos].map((logo, index) => (
                    <SwiperSlide key={`logo-${index}`}>
                      <div className="w-full h-[149px] bg-[#1E1E1E] text-white rounded-[20px] p-4 shadow-xl/30 shadow-xl hover:bg-primary hover:shadow-lg hover:shadow-primary transition-all">
                        <Image
                          src="/media/images/samplebrand.png"
                          alt={logo.alt}
                          width={64}
                          height={64}
                          className="h-[64px] w-[64px] bg-white rounded-full p-2 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0"
                        />
                        <p className="pt-2">هوندا HRV</p>
                        <div className="flex justify-between items-center">
                          <div className="flex justify-end gap-1 items-center">
                            <span>19.61 %</span>
                            <svg
                              className={logo.change === "up" ? "" : "rotate-180"}
                              xmlns="http://www.w3.org/2000/svg"
                              width="15" height="15"
                              viewBox="0 0 15 15"
                              fill="none"
                            >
                              <path d="M7.5 3L15 11H0L7.5 3Z" fill={logo.change === "up" ? "#00FFA6" : "#FF2600"} />
                            </svg>
                          </div>
                          <div>تومان {formatPrice(logo.price)}</div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            ) : (
              <div className="overflow-hidden">
                <ul
                  ref={ref}
                  className="flex animate-marquee gap-4 pt-4 px-4 -tranlate-x-100"
                  style={{
                    '--speed': `${speed}s`
                  }}
                >
                  {Array.from({ length: 5 }, () => [...logos]).flat().map((logo, index) => (
                    <li
                      key={`logo-${index}`}
                      className="flex-shrink-0 w-[303px] h-[149px] bg-[#1E1E1E] text-white rounded-[20px] p-4 shadow-xl/30 shadow-xl hover:bg-primary hover:shadow-lg hover:shadow-primary"
                    >
                      <Image
                        src="/media/images/samplebrand.png"
                        alt={logo.alt}
                        width={64}
                        height={64}
                        className="h-[64px] w-[64px] bg-white rounded-full p-2 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0"
                      />
                      <p className="pt-2">هوندا HRV</p>
                      <div className="flex justify-between items-center">
                        <div className="flex justify-end gap-1 items-center">
                          <span>19.61 %</span>
                          <svg
                            className={logo.change === "up" ? "" : "rotate-180"}
                            xmlns="http://www.w3.org/2000/svg"
                            width="15" height="15"
                            viewBox="0 0 15 15"
                            fill="none"
                          >
                            <path d="M7.5 3L15 11H0L7.5 3Z" fill={logo.change === "up" ? "#00FFA6" : "#FF2600"} />
                          </svg>
                        </div>
                        <div>تومان {formatPrice(logo.price)}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default DailyPrice;
