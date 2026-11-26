import { resolveBackendMediaUrl } from '@/utils/media';
import { toPersianDigits } from '@/utils/Cal';
import { galleryTypeLabel } from '@/utils/services/galleryPanel';
import Image from 'next/image';
import { useState } from 'react';

const COVER_FALLBACK = '/media/images/samplebrand.png';

const GalleryBanner = ({ gallery, tone, onEdit }) => {
  const [cover, setCover] = useState(resolveBackendMediaUrl(gallery?.Cover, COVER_FALLBACK));
  const [logo, setLogo] = useState(resolveBackendMediaUrl(gallery?.Profile, ''));

  const name = gallery?.Name || 'گالری من';
  const type = galleryTypeLabel(gallery?.GalleryType);
  const phone = gallery?.Phone || gallery?.Mobile || '';
  const city = gallery?.CityName || '';
  const address = gallery?.Adress || '';
  const place = city || address;

  const ribbon =
    tone === 'gold'
      ? 'bg-[#F7B52C] text-[#1E2A3A]'
      : 'bg-primary text-white';

  return (
    <section
      aria-label="بنر گالری"
      className="relative isolate overflow-hidden rounded-2xl bg-[#1E2A3A] min-h-[240px] sm:min-h-[260px]"
    >
      <Image
        src={cover}
        alt={name}
        fill
        priority
        sizes="(max-width:768px) 100vw, 980px"
        className="-z-10 object-cover object-center"
        onError={() => setCover(COVER_FALLBACK)}
      />
      <span className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-[#101823]/95 via-[#101823]/60 to-[#101823]/25 md:bg-gradient-to-l md:from-[#101823]/95 md:via-[#101823]/70 md:to-transparent" />

      <button
        type="button"
        onClick={onEdit}
        className="absolute left-3 top-3 z-10 flex h-9 items-center gap-1.5 rounded-[10px] border border-white/30 bg-black/25 px-2.5 font-soft text-[11.5px] text-white backdrop-blur-sm transition-colors hover:bg-black/45 sm:left-5 sm:top-5 sm:h-10 sm:px-3.5 sm:text-[13px]"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" className="flex-none">
          <path d="M4 20h4L19 9l-4-4L4 16z" />
        </svg>
        ویرایش مشخصات
      </button>

      <div className="relative flex min-h-[240px] flex-col justify-between gap-5 p-4 text-white sm:min-h-[260px] sm:p-6 md:p-7">
        <div className="flex flex-col items-start gap-3.5 pt-11 sm:gap-4 sm:pt-12 md:pt-0">
          <h1 className="m-0 max-w-[560px] font-soft text-[21px] leading-[1.45] drop-shadow-[0_2px_12px_rgba(0,0,0,.45)] sm:text-[28px] md:text-[32px]">
            {name}
          </h1>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {type && (
              <span className={`rounded-[10px] px-3.5 py-2 font-soft text-[12.5px] shadow-[0_6px_18px_rgba(0,0,0,.25)] sm:px-5 sm:py-2.5 sm:text-[15px] ${ribbon}`}>
                {type}
              </span>
            )}
            {logo && (
              <span className="flex h-[42px] w-[52px] flex-none items-center justify-center overflow-hidden rounded-[10px] border border-white/20 bg-[#1E2A3A]/80 backdrop-blur-sm sm:h-[50px] sm:w-[64px]">
                <Image
                  src={logo}
                  alt={name}
                  width={64}
                  height={50}
                  className="h-full w-full object-contain p-1.5"
                  onError={() => setLogo('')}
                />
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 text-[12px] text-[#E4E9F2] drop-shadow-[0_1px_8px_rgba(0,0,0,.5)] sm:gap-x-7 sm:text-[13.5px]">
          {place && (
            <span className="flex min-w-0 items-center gap-1.5">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="flex-none">
                <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
                <circle cx="12" cy="9.5" r="2.5" />
              </svg>
              <span className="truncate">{place}</span>
            </span>
          )}
          {phone && (
            <a href={`tel:${phone}`} className="flex items-center gap-1.5 transition-colors hover:text-white">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" className="flex-none">
                <path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z" />
              </svg>
              <span dir="ltr">{toPersianDigits(phone)}</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default GalleryBanner;
