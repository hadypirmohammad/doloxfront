import { adTitleWithoutYear, formatPrice } from '@/utils/Cal';
import { defaultAdImage, resolveAdImage } from '@/utils/adImage';
import { isFavorite, toggleFavorite } from '@/utils/favorites';
import { adGalleryBadge } from '@/utils/services/autoGalleries';
import BrandLogo from '@/components/global/BrandLogo';
import LocationTag from '@/components/global/LocationTag';
import { brandLogoOf } from '@/utils/services/brands';
import { useModelBrand } from '@/utils/services/modelBrands';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';

const GEARBOX_FEATURE_ID = 161;

const isFreeZoneAd = (ad) =>
  Boolean(ad?.IsFreeZone ?? ad?.isFreeZone ?? ad?.FreeZone ?? ad?.freeZone ?? ad?.IsFreeZonePlate);

const AdsItem = ({ ad, brandIndex = {} }) => {
  const [imageSrc, setImageSrc] = useState(() => resolveAdImage(ad?.CoverImage, ad));
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setImageSrc(resolveAdImage(ad?.CoverImage, ad));
  }, [ad]);

  useEffect(() => {
    setLiked(ad?.IsFavorite ?? isFavorite('ad', ad?.AdId));
  }, [ad]);

  const knownLogo = ad ? brandLogoOf(ad, brandIndex) : '';
  const modelBrand = useModelBrand(ad?.BrandId, Boolean(ad) && !knownLogo);

  if (ad === undefined) return <div className="h-72" />;

  function findGearType(source) {
    const direct = source?.GearType || source?.Gearbox || source?.GearBox || source?.GearTypeName;
    if (direct) return direct;

    const isGearbox = (parentId, parentName) =>
      Number(parentId) === GEARBOX_FEATURE_ID || /گیربکس|دنده/.test(String(parentName || ''));

    const nested = source?.AdFeatures?.find((item) =>
      isGearbox(item?.Feature?.ParentFeature?.FeatureId, item?.Feature?.ParentFeature?.FeatureName)
    );
    if (nested) return nested.Feature?.FeatureName || null;

    const flat = source?.Features?.find((item) =>
      isGearbox(item?.ParentFeatureId ?? item?.ParentFeature?.FeatureId, item?.ParentFeatureName ?? item?.ParentFeature?.FeatureName)
    );

    return flat?.FeatureName || null;
  }

  const href = `/ad/${ad.EnTitle || ad.En_Title || ''}`;
  const planId = Number(ad.PlanId) || 1;
  const isAllCities = planId === 2 || planId === 4;
  const isFeatured = planId === 3 || planId === 4;
  console.log("HeadAd: ",ad.HeadBrandName);
  console.log("brandNameAd: ",ad.BrandName);
  const parentName = ad.HeadBrandName;
  const brandName = ad.BrandName || ad.Brand?.ParentBrand?.Name || ad.Brand?.Name;
  const cityName = ad.CityName || ad.City?.CityName;
  const provinceName = ad.ProvinceName || ad.City?.ProvinceName;
  const locationLabel = [provinceName, cityName].filter(Boolean).join(' - ');
  const freeZone = isFreeZoneAd(ad);
  const gallery = adGalleryBadge(ad);
  const gearType = findGearType(ad);
  const brandLogo = knownLogo || modelBrand?.image || '';

  const specs = [
    ad.Year != null && {
      key: 'year',
      value: ad.Year,
      icon: (
        <>
          <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
          <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" />
        </>
      ),
    },
    ad.Worked != null && {
      key: 'worked',
      value: `${formatPrice(ad.Worked)} km`,
      icon: (
        <>
          <path d="M4.5 18a8 8 0 1 1 15 0" />
          <path d="M12 18l4-5" />
          <circle cx="12" cy="18" r="1" />
        </>
      ),
    },
    gearType && {
      key: 'gear',
      value: gearType,
      icon: (
        <>
          <circle cx="12" cy="4.6" r="2.1" />
          <path d="M12 6.7v10.8" />
          <path d="M6.5 17.5h11" />
          <path d="M6.5 17.5v2.4M12 17.5v2.4M17.5 17.5v2.4" />
        </>
      ),
    },
  ].filter(Boolean);

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
            const fallback = defaultAdImage(ad);
            if (imageSrc !== fallback) {
              setImageSrc(fallback);
            }
          }}
        />

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

        {isFeatured && !isAllCities && (
          <span
            className="absolute right-3 top-3 flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1 text-[11px] font-bold text-white"
            title="آگهی سفارشی"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.5l2.6 5.9 6.4.6-4.8 4.3 1.4 6.2-5.6-3.3-5.6 3.3 1.4-6.2L3 9l6.4-.6z" />
            </svg>
            سفارشی
          </span>
        )}

        {(freeZone || gallery) && (
          <div className="absolute left-3 top-3 flex max-w-[75%] flex-col items-start gap-1.5">
            {freeZone && (
              <span className="flex items-center gap-1 rounded-lg bg-gradient-orange px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2.5" y="7" width="19" height="10" rx="2" />
                  <path d="M7 7v10M2.5 12h4" />
                </svg>
                منطقه آزاد
              </span>
            )}

            {gallery && (
              <span
                className={`flex max-w-full items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold shadow-sm backdrop-blur-sm ${
                  gallery.tone === 'gold' ? 'bg-[#1E2A3A]/85 text-[#F7D679]' : 'bg-[#1E2A3A]/85 text-[#FFB68A]'
                }`}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
                  <path d="M3 9l2-5h14l2 5M3 9v11h18V9M3 9h18M9 20v-6h6v6" />
                </svg>
                <span className="truncate">{gallery.name}</span>
                {gallery.tone === 'gold' && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
                    <path d="m5 12.5 4.5 4.5L19 7" />
                  </svg>
                )}
              </span>
            )}
          </div>
        )}

        

        <button
          type="button"
          aria-label={liked ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
          aria-pressed={liked}
          onClick={async (event) => {
            event.preventDefault();
            event.stopPropagation();
            setLiked(await toggleFavorite('ad', ad?.AdId, liked, ad));
          }}
          className="absolute bottom-3 left-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-white transition-colors hover:bg-black/60"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={liked ? '#FF5E00' : 'none'}
            stroke={liked ? '#FF5E00' : 'currentColor'}
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20s-7.4-4.3-7.4-9.2A4.1 4.1 0 0 1 12 8.3a4.1 4.1 0 0 1 7.4 2.5C19.4 15.7 12 20 12 20z" />
          </svg>
        </button>
      </div>

      <div className="p-3.5 text-right sm:p-4">
        <h3 className="line-clamp-1 text-[14px] font-bold text-secondary sm:text-[15px]">
          {adTitleWithoutYear(parentName+" "+brandName , ad.Year)}
        </h3>

        <div className="mt-2 flex items-center gap-1.5 text-[11.5px] text-[#6B7280]">
          {specs.map((spec, index) => (
            <Fragment key={spec.key}>
              {index > 0 && <span className="h-3.5 w-px flex-none bg-[#E3E7ED]" />}
              <span className="flex min-w-0 items-center gap-1">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9AA3AE"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-none"
                >
                  {spec.icon}
                </svg>
                <span className="truncate">{spec.value}</span>
              </span>
            </Fragment>
          ))}
        </div>

        {(ad.isGest || ad.isRent) && (
          <div className="mt-2 flex flex-wrap gap-1">
            {ad.isGest && (
              <span className="rounded-md bg-secondary/10 px-2 py-0.5 text-[11px] text-secondary">اقساطی</span>
            )}
            {ad.isRent && (
              <span className="rounded-md bg-secondary/10 px-2 py-0.5 text-[11px] text-secondary">اجاره</span>
            )}
          </div>
        )}

        <div className="mt-2.5 flex items-center justify-between gap-2">
          <p className="m-0 flex-none whitespace-nowrap text-[14px] font-bold text-secondary sm:text-[15px]">
            {ad.IsAgreement ? (
              'توافقی'
            ) : (
              <>
                {formatPrice(ad.Price)} <span className="text-[11px] font-normal text-[#8B8B8B]">تومان</span>
              </>
            )}
          </p>

          <LocationTag label={locationLabel} />
        </div>

      </div>
    </Link>
  );
};

export default AdsItem;
