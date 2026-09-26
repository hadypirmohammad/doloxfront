import Image from 'next/image';
import Link from 'next/link';

const AdBanner = () => {
  return (
    <section className="bg-white px-3 py-6 sm:px-4 sm:py-8">
      <div className="mx-auto max-w-screen-xl">
        <div className="flex flex-col items-center gap-5 overflow-hidden rounded-2xl bg-secondary px-5 py-6 text-white sm:flex-row sm:justify-between sm:gap-8 sm:rounded-3xl sm:px-8 sm:py-7 lg:px-10">
          <div className="relative h-28 w-28 shrink-0 sm:h-36 sm:w-36 lg:h-40 lg:w-40">
            <Image
              src="/media/images/khalaficamera.png"
              alt="استعلام خلافی"
              fill
              className="object-contain"
              sizes="160px"
            />
          </div>

          <div className="flex-1 text-center sm:text-right">
            <h2 className="text-lg sm:text-2xl lg:text-[28px]">استعلام خلافی خودرو</h2>
            <p className="mt-2 font-['vazir'] text-sm text-white/80 sm:text-base">
              خلافی خودرو خود را استعلام کنید
            </p>
          </div>

          <Link
            href="/khalafi"
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-primary px-6 text-sm text-white transition hover:opacity-90 sm:h-12 sm:px-8 sm:text-base"
          >
            استعلام خلافی
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AdBanner;
