import Image from 'next/image';
import Link from 'next/link';

const GalleriesBannerV2 = () => (
  <section dir="rtl" className="px-3 py-6 sm:px-4 sm:py-7">
    <div className="relative mx-auto flex min-h-[260px] max-w-screen-xl items-center overflow-hidden rounded-[26px] bg-[#EEF2F7] sm:min-h-[320px]">
      <Image
        src="/media/images/gallery-banner.webp"
        alt=""
        fill
        sizes="100vw"
        className="scale-105 object-cover object-[50%_72%] blur-[3px]"
      />
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-l from-[#101823]/70 via-[#101823]/35 to-[#101823]/10" />

      <div className="relative flex flex-col items-start gap-3 px-5 py-7 sm:gap-4 sm:px-10">
        <span className="font-soft w-fit rounded-full bg-white/20 px-3 py-1 text-[11.5px] text-white backdrop-blur-sm">
          گالری‌های دولوکس
        </span>

        <h2 className="font-soft m-0 max-w-[460px] text-[19px] leading-[1.6] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,.45)] sm:text-[26px]">
          گالری‌های معتبر خودرو و موتورسیکلت
        </h2>

        <p className="m-0 max-w-[460px] text-[12.5px] leading-[2] text-[#E4E9F2] drop-shadow-[0_1px_8px_rgba(0,0,0,.5)] sm:text-[14px]">
          مجموعه‌ای از گالری‌های خودرو و موتورسیکلت را مشاهده و با آن‌ها آشنا شوید.
        </p>

        <Link
          href="/autogallery"
          className="font-soft mt-1 flex h-[48px] items-center justify-center rounded-xl bg-gradient-orange px-7 text-[15px] text-white transition-opacity hover:opacity-90"
        >
          مشاهده گالری‌ها
        </Link>
      </div>
    </div>
  </section>
);

export default GalleriesBannerV2;
