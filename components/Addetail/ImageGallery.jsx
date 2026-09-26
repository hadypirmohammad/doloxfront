import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { BackendURL } from '@/utils/URL';

const DEFAULT_AD_IMAGE = '/media/images/default-ad.webp';

const resolveSrc = (path) => {
  if (!path) return DEFAULT_AD_IMAGE;
  if (path.startsWith('http') || path.startsWith('/media')) return path;
  return `${BackendURL.slice(0, -1)}${path}`;
};

const GalleryImage = ({ src, alt, priority = false }) => {
  const [imageSrc, setImageSrc] = useState(src || DEFAULT_AD_IMAGE);

  useEffect(() => {
    setImageSrc(src || DEFAULT_AD_IMAGE);
  }, [src]);

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      priority={priority}
      className="object-contain object-center"
      sizes="(max-width: 768px) 280px, 340px"
      onError={() => {
        if (imageSrc !== DEFAULT_AD_IMAGE) {
          setImageSrc(DEFAULT_AD_IMAGE);
        }
      }}
    />
  );
};

const ImageGallery = ({ ad }) => {
  const [Swiper, setSwiper] = useState(null);
  const [SwiperSlide, setSwiperSlide] = useState(null);

  const data = ad;

  const logos = useMemo(() => {
    const images =
      data?.Images?.map((image) => ({
        src: resolveSrc(image),
        alt: data?.Title || 'تصویر آگهی',
      })) || [];

    const cover = data?.CoverImage
      ? [{ src: resolveSrc(data.CoverImage), alt: data?.Title || 'تصویر آگهی' }]
      : [];

    const list = [...cover, ...images];
    return list.length ? list : [{ src: DEFAULT_AD_IMAGE, alt: data?.Title || 'تصویر آگهی' }];
  }, [data?.CoverImage, data?.Images, data?.Title]);

  useEffect(() => {
    import('swiper/react').then(({ Swiper: S, SwiperSlide: SS }) => {
      setSwiper(() => S);
      setSwiperSlide(() => SS);
    });
    import('swiper/css');
  }, []);

  const frameClass =
    'relative mx-auto aspect-[3/4] w-full max-w-[280px] overflow-hidden rounded-xl bg-white sm:max-w-[320px] md:max-w-[340px]';

  return (
    <section className="mx-auto mb-4 overflow-hidden rounded-2xl bg-white p-3 pb-5 sm:mb-0 sm:p-4 md:mb-0">
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
                <GalleryImage src={logo.src} alt={logo.alt} priority={index === 0} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className={frameClass}>
          <GalleryImage src={logos[0].src} alt={logos[0].alt} priority />
        </div>
      )}
    </section>
  );
};

export default ImageGallery;
