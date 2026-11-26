import { adTitleWithoutYear, formatPrice, toPersianDigits } from '@/utils/Cal';
import { defaultAdImage, resolveAdImage } from '@/utils/adImage';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const GalleryAdThumb = ({ ad }) => {
  const fallback = defaultAdImage(ad);
  const [image, setImage] = useState(resolveAdImage(ad?.CoverImage, ad));

  const year = ad?.Year?.Year ?? ad?.Year;
  const title = adTitleWithoutYear(ad?.Title, year) || 'بدون عنوان';
  const adId = ad?.AdId;
  const enTitle = ad?.En_Title;
  const price = ad?.Price;
  const isAgreement = ad?.IsAgreement || !Number(price);

  return (
    <article className="flex flex-col gap-2.5 rounded-xl border border-[#E6E8EC] bg-white p-2">
      <div className="relative aspect-[4/3.4] w-full overflow-hidden rounded-lg bg-[#E9EDF3]">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width:640px) 45vw, 200px"
          className="object-cover"
          onError={() => setImage(fallback)}
        />
      </div>

      <div className="flex min-w-0 flex-col gap-0.5 px-1">
        <span dir="ltr" className="font-soft truncate text-left text-[12.5px] text-[#1E2A3A]">{title}</span>
        {year != null && <span dir="ltr" className="text-left text-[11.5px] text-[#5B6575]">{toPersianDigits(year)}</span>}
        <span className="font-soft text-[11.5px] leading-[1.7] text-[#C2410C]">
          {isAgreement ? 'توافقی' : `${toPersianDigits(formatPrice(price))} تومان`}
        </span>
      </div>

      <Link
        href={`/ad/${enTitle || adId}`}
        className="flex min-h-10 items-center justify-center gap-1.5 rounded-lg border-[1.5px] border-primary font-soft text-[13px] text-primary transition-colors hover:bg-primary hover:text-white"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-none">
          <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        مشاهده
      </Link>
    </article>
  );
};

export default GalleryAdThumb;
