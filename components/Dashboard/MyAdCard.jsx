import { adTitleWithoutYear, convertToShamsiAndGregorian, formatPrice, toPersianDigits } from '@/utils/Cal';
import { defaultAdImage, resolveAdImage } from '@/utils/adImage';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { AD_EDIT_WINDOW_DAYS, adEditDaysLeft } from '@/utils/services/adRules';
import BrandLogo from '@/components/global/BrandLogo';
import { adCategoryOf, brandLogoOf, brandNamesOf } from '@/utils/services/brands';
import { useModelBrand } from '@/utils/services/modelBrands';

const STATUS_STYLE = {
  active: 'bg-[#22A45D] text-white',
  review: 'bg-[#7A8699] text-white',
  expired: 'bg-[#E14B4B] text-white',
};

const STATUS_LABEL = {
  active: 'فعال',
  review: 'در حال بررسی',
  expired: 'منقضی شده',
};

const shamsi = (value) => {
  const { shamsi: date } = convertToShamsiAndGregorian(value);
  if (!date?.year) return '';
  return toPersianDigits(`${date.year}/${String(date.month).padStart(2, '0')}/${String(date.day).padStart(2, '0')}`);
};

const outlineButton =
  'flex h-[38px] items-center justify-center gap-1 whitespace-nowrap rounded-[10px] border border-[#F5B48A] bg-white px-2 text-[12px] font-semibold text-[#C2410C] transition-colors hover:bg-[#FFF6F0] sm:gap-1.5 sm:px-3.5 sm:text-[13px]';

const MyAdCard = ({ ad, status, onDelete, deleting, brandIndex = {} }) => {
  const typedAd = { HeadCategoryId: adCategoryOf(ad, brandIndex), ...ad };
  const fallback = defaultAdImage(typedAd);
  const [image, setImage] = useState(resolveAdImage(ad?.CoverImage, typedAd));

  const year = ad?.Year?.Year ?? ad?.Year;
  const title = adTitleWithoutYear(ad?.Title, year) || 'بدون عنوان';
  const { brand, model } = brandNamesOf(ad, brandIndex);
  const city = ad?.City?.CityName || ad?.CityName || '';
  const price = ad?.Price;
  const isAgreement = ad?.IsAgreement;
  const created = shamsi(ad?.PublishDate);
  const expires = shamsi(ad?.ExpiryDate);
  const adId = ad?.AdId;
  const enTitle = ad?.En_Title;
  const knownLogo = brandLogoOf(ad, brandIndex);
  const modelBrand = useModelBrand(ad?.BrandId, !knownLogo);
  const brandLogo = knownLogo || modelBrand?.image || '';

  const editDaysLeft = adEditDaysLeft(ad);
  const editable = editDaysLeft > 0;
  const expired = status === 'expired';

  return (
    <article className="flex flex-col gap-2.5 rounded-2xl border border-[#E6E8EC] bg-white p-3 sm:flex-row sm:flex-wrap sm:gap-[18px] sm:p-3.5">
      <div className="flex min-w-0 gap-3 sm:contents">
        <div className="relative h-[92px] w-[112px] flex-none overflow-hidden rounded-[10px] bg-[#EEF1F5] sm:h-[148px] sm:w-[220px] sm:rounded-xl">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width:640px) 112px, 220px"
            onError={() => setImage(fallback)}
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:flex-[1_1_420px] sm:gap-3">
        <div className="flex items-start gap-2.5">
          <BrandLogo
            src={brandLogo}
            name={brand || title}
            size={44}
            imageClassName="h-7 w-7"
            className="hidden border border-[#E6E8EC] bg-white sm:flex"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="truncate text-[11px] text-[#5B6575] sm:text-[12px]">
              {[brand, model, year != null ? toPersianDigits(year) : '', city].filter(Boolean).join(' · ')}
            </span>
            <span className="truncate text-[15px] font-bold text-[#1E2A3A] sm:text-[17px]">{title}</span>
          </div>
          <span
            className={`flex-none rounded-full px-2.5 py-1 text-[11px] font-bold sm:px-3 sm:text-[12px] ${STATUS_STYLE[status]}`}
          >
            {STATUS_LABEL[status]}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[12px] text-[#5B6575]">قیمت:</span>
            <span className="text-[18px] font-extrabold text-[#C2410C] sm:text-[19px]">
              {isAgreement ? 'توافقی' : toPersianDigits(formatPrice(price))}
            </span>
            {!isAgreement && <span className="text-[11px] text-[#5B6575] sm:text-[12px]">تومان</span>}
          </div>

          <div className="flex flex-1 flex-wrap gap-2.5 text-[11px] text-[#5B6575] sm:justify-end sm:gap-4 sm:text-[12px]">
            {created && (
              <span>
                تاریخ ثبت: <b className="font-semibold text-[#1E2A3A]">{created}</b>
              </span>
            )}
            {expires && (
              <span>
                انقضا: <b className="font-semibold text-[#1E2A3A]">{expires}</b>
              </span>
            )}
          </div>
        </div>

        </div>
      </div>

      <div className="flex w-full items-center gap-1.5 sm:order-last sm:mt-auto sm:flex-wrap sm:gap-2">
          {expired ? (
            <Link
              href={`/managead/${adId}`}
              className="order-3 flex h-[38px] flex-[1.3] items-center justify-center gap-1 whitespace-nowrap rounded-[10px] bg-gradient-orange px-2.5 text-[12px] font-bold text-white sm:order-1 sm:flex-none sm:gap-1.5 sm:px-4 sm:text-[13px]"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="flex-none">
                <path d="M4 12a8 8 0 0 1 14-5.3L20 9M20 4v5h-5M20 12a8 8 0 0 1-14 5.3L4 15M4 20v-5h5" />
              </svg>
              تمدید آگهی
            </Link>
          ) : (
            <Link
              href={`/managead/${adId}`}
              title="صدرنشین، سفارشی، سراسری و …"
              className="order-3 flex h-[38px] flex-[1.3] items-center justify-center gap-1 whitespace-nowrap rounded-[10px] bg-gradient-orange px-2.5 text-[12px] font-bold text-white sm:order-1 sm:flex-none sm:gap-1.5 sm:px-4 sm:text-[13px]"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="flex-none">
                <path d="M12 19V5M6 11l6-6 6 6" />
              </svg>
              ارتقای آگهی
            </Link>
          )}

          {editable ? (
            <Link href={`/managead/edit/${adId}`} className={`${outlineButton} order-2 flex-1 sm:order-2`}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" className="flex-none">
                <path d="M4 20h4L19 9l-4-4L4 16z" />
              </svg>
              ویرایش
            </Link>
          ) : (
            <button
              type="button"
              onClick={() =>
                toast(`مهلت ویرایش این آگهی تمام شده است (${toPersianDigits(AD_EDIT_WINDOW_DAYS)} روز پس از ثبت)`)
              }
              className="order-2 flex h-[38px] flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-[10px] border border-[#E6E8EC] bg-[#F6F7F9] px-2 text-[12px] font-semibold text-[#9AA3B0] sm:order-2 sm:gap-1.5 sm:px-3.5 sm:text-[13px]"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
                <rect x="4.5" y="10.5" width="15" height="9.5" rx="2" />
                <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
              </svg>
              ویرایش
            </button>
          )}

          {status === 'review' ? (
            <button
              type="button"
              onClick={() => toast('این آگهی پس از تأیید کارشناسان قابل مشاهده است')}
              className="order-1 flex h-[38px] flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-[10px] border border-[#E6E8EC] bg-[#F6F7F9] px-2 text-[12px] font-semibold text-[#9AA3B0] sm:order-3 sm:gap-1.5 sm:px-3.5 sm:text-[13px]"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="flex-none">
                <path d="M2 12s3.6-7 10-7c1.6 0 3 .3 4.3.8M22 12s-3.6 7-10 7c-1.6 0-3-.3-4.3-.8M4 4l16 16" />
              </svg>
              مشاهده
            </button>
          ) : (
            <Link href={`/ad/${enTitle || adId}`} className={`${outlineButton} order-1 flex-1 sm:order-3`}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="flex-none">
                <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              مشاهده
            </Link>
          )}

          <button
            type="button"
            onClick={() => onDelete?.(ad)}
            disabled={deleting}
            className={`${outlineButton} order-4 flex-1 disabled:opacity-60 sm:order-4`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="flex-none">
              <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
            </svg>
            حذف
          </button>

          <span className="hidden flex-1 sm:order-5 sm:block" />

          <span className="hidden items-center gap-1 text-[12px] text-[#5B6575] sm:order-6 sm:flex">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            {editable
              ? `امکان ویرایش تا ${toPersianDigits(editDaysLeft)} روز دیگر`
              : `مهلت ویرایش (${toPersianDigits(AD_EDIT_WINDOW_DAYS)} روز) تمام شده است`}
          </span>
      </div>
    </article>
  );
};

export default MyAdCard;
