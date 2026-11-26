import Image from 'next/image';
import Link from 'next/link';

const PaintBannerV2 = ({ image = '', href = '#' }) => (
  <section dir="rtl" className="px-3 py-6 sm:px-4 sm:py-7">
    <Link
      href={href}
      className="relative mx-auto flex h-[150px] max-w-screen-xl items-center overflow-hidden rounded-[22px] bg-[#1E2A3A] sm:h-[190px]"
    >
      {image ? (
        <Image src={image} alt="نقاشی خودرو" fill sizes="100vw" className="object-cover" />
      ) : null}
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-l from-[#101823]/95 via-[#101823]/70 to-transparent" />

      <div className="relative flex flex-col gap-2 px-5 sm:gap-3 sm:px-9">
        <span className="font-soft w-fit rounded-full bg-primary px-3 py-1 text-[11.5px] text-white">
          تبلیغات
        </span>
        <span className="font-soft text-[18px] text-white sm:text-[24px]">
          نقاشی و صافکاری خودرو
        </span>
        <span className="max-w-[320px] text-[12.5px] leading-[1.9] text-[#D7DEEC] sm:text-[14px]">
          رنگ‌آمیزی تخصصی با ضمانت، تحویل سریع و قیمت منصفانه.
        </span>
      </div>
    </Link>
  </section>
);

export default PaintBannerV2;
