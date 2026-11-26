import { formatPrice } from '@/utils/Cal';
import { resolveAdImage } from '@/utils/adImage';
import Image from 'next/image';
import Link from 'next/link';

const DashboardAd = ({ ad }) => {
  const isPending = !ad?.IsActive;
  const imageSrc = resolveAdImage(ad?.CoverImage, ad);

  return (
    <div className="my-3 overflow-hidden rounded-2xl border border-[#F0F0F0] bg-white shadow-[0_6px_20px_rgba(36, 59, 83,0.05)] transition hover:border-primary/25 hover:shadow-[0_10px_28px_rgba(255,94,0,0.12)]">
      <div className="flex flex-col md:flex-row md:items-stretch">
        <div className="flex min-w-0 flex-1 items-center gap-3 p-3 sm:gap-4 sm:p-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#F5F5F5] sm:h-24 sm:w-24">
            <Image src={imageSrc} alt={ad?.Title || 'آگهی'} fill className="object-cover" sizes="96px" />
          </div>

          <div className="min-w-0 flex-1 text-right">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-md px-2 py-0.5 text-[11px] ${
                  isPending ? 'bg-warning/20 text-[#9A7B00]' : 'bg-primary/10 text-primary'
                }`}
              >
                {isPending ? 'در حال بررسی' : 'فعال'}
              </span>
            </div>
            <h2 className="line-clamp-2 text-[14px] font-bold text-secondary sm:text-[15px]">
              {ad?.Title || 'بدون عنوان'}
            </h2>
            <p className="mt-2 text-[14px] font-bold text-primary">
              {ad?.IsAgreement ? (
                'توافقی'
              ) : (
                <>
                  {formatPrice(ad?.Price)}
                  <span className="mr-1 text-[11px] font-normal text-[#8A8A8A]">تومان</span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center border-t border-[#F0F0F0] px-4 py-3 md:w-48 md:border-r md:border-t-0">
          <Link
            href={`/managead/${ad.AdId}`}
            className="flex h-10 w-full items-center justify-center rounded-xl bg-primary text-sm text-white transition hover:opacity-90 md:w-auto md:px-5"
          >
            مدیریت آگهی
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardAd;
