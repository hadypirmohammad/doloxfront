import { BackendURL } from '@/utils/URL';
import Image from 'next/image';
import Link from 'next/link';

const DashboardAuto = ({ auto }) => {
  const isPending = !auto?.IsActive;
  const imageSrc = auto?.Profile
    ? auto.Profile.startsWith('http') || auto.Profile.startsWith('/media')
      ? auto.Profile
      : `${BackendURL.slice(0, -1)}${auto.Profile}`
    : '/media/images/sampleautogallery.png';

  return (
    <div className="my-3 overflow-hidden rounded-2xl border border-[#F0F0F0] bg-white shadow-[0_6px_20px_rgba(36, 59, 83,0.05)] transition hover:border-primary/25 hover:shadow-[0_10px_28px_rgba(255,94,0,0.12)]">
      <div className="flex flex-col md:flex-row md:items-stretch">
        <div className="flex min-w-0 flex-1 items-center gap-3 p-3 sm:gap-4 sm:p-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#F5F5F5] sm:h-24 sm:w-24">
            <Image src={imageSrc} alt={auto?.Name || 'اتوگالری'} fill className="object-cover" sizes="96px" />
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
              {auto?.Name || 'بدون نام'}
            </h2>
            {auto?.CityName || auto?.City?.CityName ? (
              <p className="mt-1 text-[12px] text-[#8A8A8A]">{auto?.CityName || auto?.City?.CityName}</p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col items-stretch justify-center gap-2 border-t border-[#F0F0F0] px-4 py-3 sm:flex-row sm:items-center md:w-auto md:border-r md:border-t-0 md:px-5">
          {isPending ? (
            <p className="py-2 text-center text-sm text-[#8A8A8A]">در حال بررسی توسط ادمین</p>
          ) : (
            <>
              <Link
                href={`/createad?gl=${auto.GalleryId}`}
                className="flex h-10 items-center justify-center rounded-xl border border-primary bg-white px-4 text-sm text-primary transition hover:bg-primary hover:text-white"
              >
                ثبت آگهی
              </Link>
              <Link
                href={`/manageauto/${auto.GalleryId}`}
                className="flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm text-white transition hover:opacity-90"
              >
                مدیریت اتوگالری
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardAuto;
