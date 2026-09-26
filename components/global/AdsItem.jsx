import { formatPrice } from '@/utils/Cal';
import { BackendURL } from '@/utils/URL';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const DEFAULT_AD_IMAGE = '/media/images/default-ad.webp';

const resolveImageSrc = (coverImage) => {
  if (!coverImage) return DEFAULT_AD_IMAGE;
  if (coverImage.startsWith('http') || coverImage.startsWith('/media')) return coverImage;
  return `${BackendURL.slice(0, -1)}${coverImage}`;
};

const AdsItem = ({ ad }) => {
  const [imageSrc, setImageSrc] = useState(() => resolveImageSrc(ad?.CoverImage));

  useEffect(() => {
    setImageSrc(resolveImageSrc(ad?.CoverImage));
  }, [ad?.CoverImage]);

  if (ad === undefined) return <div className="h-72" />;

  function findGearType(adFeatures) {
    const gearFeature = adFeatures?.find(
      (item) => item.Feature?.ParentFeature?.FeatureName === 'نوع دنده '
    );
    return gearFeature ? gearFeature.Feature.FeatureName : null;
  }

  const href = `/ad/${ad.EnTitle || ad.En_Title || ''}`;
  const planId = Number(ad.PlanId) || 1;
  const isAllCities = planId === 2 || planId === 4;
  const isFeatured = planId === 3 || planId === 4;
  const brandName = ad.BrandName || ad.Brand?.ParentBrand?.Name || ad.Brand?.Name;
  const cityName = ad.CityName || ad.City?.CityName;

  const cardShadow = isFeatured
    ? 'shadow-[0_8px_32px_rgba(255,94,0,0.45)] hover:shadow-[0_12px_40px_rgba(255,94,0,0.55)]'
    : 'shadow-[0_6px_20px_rgba(36, 59, 83,0.06)] hover:shadow-[0_10px_28px_rgba(36, 59, 83,0.1)]';

  return (
    <Link
      href={href}
      className={`block overflow-hidden rounded-2xl border border-[#F2F2F2] bg-white transition hover:-translate-y-0.5 ${cardShadow}`}
    >
      <div className="relative h-[150px] w-full bg-[#F7F7F7] sm:h-[160px]">
        <Image
          src={imageSrc}
          alt={ad.Title || 'آگهی'}
          fill
          className="object-cover"
          sizes="(max-width:768px) 100vw, 280px"
          onError={() => {
            if (imageSrc !== DEFAULT_AD_IMAGE) {
              setImageSrc(DEFAULT_AD_IMAGE);
            }
          }}
        />

        {cityName && !isAllCities && (
          <span className="absolute right-3 top-3 rounded-lg bg-secondary px-2.5 py-1 text-[11px] text-white">
            {cityName}
          </span>
        )}

        {isAllCities && (
          <span
            className="absolute right-3 top-3 flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1 text-[11px] text-white"
            title="این آگهی در سراسر کشور دیده می‌شود"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.5 2L16.5 5V12H18.5C18.6326 12 18.7598 12.0527 18.8536 12.1464C18.9473 12.2402 19 12.3674 19 12.5V21H19.5C19.6326 21 19.7598 21.0527 19.8536 21.1464C19.9473 21.2402 20 21.3674 20 21.5C20 21.6326 19.9473 21.7598 19.8536 21.8536C19.7598 21.9473 19.6326 22 19.5 22H4.5C4.36739 22 4.24021 21.9473 4.14645 21.8536C4.05268 21.7598 4 21.6326 4 21.5C4 21.3674 4.05268 21.2402 4.14645 21.1464C4.24021 21.0527 4.36739 21 4.5 21H5V10.5C5 10.3674 5.05268 10.2402 5.14645 10.1464C5.24021 10.0527 5.36739 10 5.5 10H6.5V6.5H7.5V10H8.5V2ZM9.5 3.443L15.5 5.693V12H14C13.8674 12 13.7402 12.0527 13.6464 12.1464C13.5527 12.2402 13.5 12.3674 13.5 12.5V21H9.5V3.443ZM6 11V21H8.5V11H6ZM18 21H17V20H15.5V21H14.5V13H18V21Z"
                fill="white"
              />
            </svg>
            تمام شهرها
          </span>
        )}

        {brandName && (
          <span className="absolute bottom-3 right-3 rounded-full bg-white px-3 py-1.5 text-[11px] text-secondary shadow-sm">
            {brandName}
          </span>
        )}
      </div>

      <div className="p-3.5 text-right sm:p-4">
        <h3 className="line-clamp-1 text-[14px] font-bold text-secondary sm:text-[15px]">
          {ad.Title}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[#7A7A7A]">
          {ad.Worked != null && <span>{formatPrice(ad.Worked)} کیلومتر</span>}
          {ad.Year != null && <span>سال {ad.Year}</span>}
          {findGearType(ad.AdFeatures) && <span>{findGearType(ad.AdFeatures)}</span>}
        </div>

        <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#F3F3F3] pt-3">
          <div className="flex flex-wrap gap-1">
            {ad.isGest && (
              <span className="rounded-md bg-secondary/10 px-2 py-0.5 text-[11px] text-secondary">اقساطی</span>
            )}
            {ad.isRent && (
              <span className="rounded-md bg-secondary/10 px-2 py-0.5 text-[11px] text-secondary">اجاره</span>
            )}
          </div>
          <p className="text-[13px] font-bold text-primary sm:text-[14px]">
            {ad.IsAgreement ? (
              'توافقی'
            ) : (
              <>
                {formatPrice(ad.Price)} <span className="text-[11px] font-normal text-[#8B8B8B]">تومان</span>
              </>
            )}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default AdsItem;
