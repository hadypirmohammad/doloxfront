import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { defaultAdImage, resolveAdImage } from '@/utils/adImage';

const GalleryImage = ({ src, alt, fallback, priority = false }) => {
  const [imageSrc, setImageSrc] = useState(src || fallback);

  useEffect(() => {
    setImageSrc(src || fallback);
  }, [src, fallback]);

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      priority={priority}
      className="object-cover object-center"
      sizes="(max-width: 768px) 100vw, 640px"
      onError={() => {
        if (imageSrc !== fallback) {
          setImageSrc(fallback);
        }
      }}
    />
  );
};

const ImageGallery = ({ ad }) => {
  const [Swiper, setSwiper] = useState(null);
  const [SwiperSlide, setSwiperSlide] = useState(null);

  const data = ad;
  const brandName = data?.Brand || data?.MainBrand || '';
  const fallback = defaultAdImage(data);

  const logos = useMemo(() => {
    const images =
      data?.Images?.map((image) => ({
        src: resolveAdImage(image, data),
        alt: data?.Title || 'تصویر آگهی',
      })) || [];

    const cover = data?.CoverImage
      ? [{ src: resolveAdImage(data.CoverImage, data), alt: data?.Title || 'تصویر آگهی' }]
      : [];

    const list = [...cover, ...images];
    return list.length ? list : [{ src: fallback, alt: data?.Title || 'تصویر آگهی' }];
  }, [data, fallback]);

  useEffect(() => {
    import('swiper/react').then(({ Swiper: S, SwiperSlide: SS }) => {
      setSwiper(() => S);
      setSwiperSlide(() => SS);
    });
    import('swiper/css');
  }, []);

  const frameClass = 'relative aspect-[4/3] w-full overflow-hidden bg-[#F1F3F7] sm:aspect-[16/10]';

  const brandBadge = brandName ? (
    <span className="absolute bottom-3 right-3 z-10 rounded-full bg-white px-3.5 py-1.5 text-[12.5px] font-bold text-secondary shadow-[0_4px_14px_rgba(20,36,63,.18)]">
      {brandName}
    </span>
  ) : null;

  return (
    <section className="mx-auto mb-4 overflow-hidden rounded-2xl bg-white sm:mb-0">
      <div className="relative">
        {Swiper && SwiperSlide ? (
          <Swiper
            spaceBetween={0}
            slidesPerView={1}
            loop={logos.length > 1}
            className="ad-detail-gallery w-full"
          >
            {logos.map((logo, index) => (
              <SwiperSlide key={`ad-image-${index}-${logo.src}`}>
                <div className={frameClass}>
                  <GalleryImage src={logo.src} alt={logo.alt} fallback={fallback} priority={index === 0} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className={frameClass}>
            <GalleryImage src={logos[0].src} alt={logos[0].alt} fallback={fallback} priority />
          </div>
        )}

        {brandBadge}
      </div>
    </section>
  );
};

export default ImageGallery;
