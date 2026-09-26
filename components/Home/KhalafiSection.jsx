import Image from 'next/image';
import Link from 'next/link';

const features = [
  {
    title: 'به روز',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <polyline points="12,7 12,12 16,14" />
      </>
    ),
  },
  {
    title: 'امن',
    icon: <path d="M12 2.5 20 5.5v6c0 5-3.4 8.5-8 10.5-4.6-2-8-5.5-8-10.5v-6z" />,
  },
  {
    title: 'سریع',
    icon: <path d="M13 2 4 13h6l-1 9 9-11h-6z" fill="currentColor" stroke="none" />,
  },
];

const Dots = ({ className }) => (
  <svg width="64" height="48" viewBox="0 0 64 48" fill="#DFE3EA" className={className}>
    {[0, 16, 32, 48].map((y) => (
      <g key={y}>
        <circle cx="2" cy={y + 2} r="3" />
        <circle cx="18" cy={y + 2} r="3" />
        <circle cx="34" cy={y + 2} r="3" />
        <circle cx="50" cy={y + 2} r="3" />
      </g>
    ))}
  </svg>
);

const KhalafiSection = () => {
  return (
    <section className="bg-[#FAFAFA] px-3 py-4 sm:px-4 sm:py-6">
      <div className="mx-auto max-w-screen-xl">
        <div
          dir="rtl"
          className="relative overflow-hidden rounded-2xl border border-[#E6EAF0] bg-white px-4 pb-4 pt-2 shadow-[0_14px_34px_rgba(20,36,63,0.13)] sm:px-7 sm:py-4"
        >
          <svg
            width="165"
            height="115"
            viewBox="0 0 165 115"
            fill="none"
            stroke="#F7942F"
            strokeWidth="4.5"
            className="pointer-events-none absolute left-0 top-0 h-[55px] w-[78px] sm:h-[52px] sm:w-[74px]"
          >
            <path d="M152 -39 A 178 178 0 0 1 -7 107" />
            <path d="M159 -39 A 185 185 0 0 1 -7 114" stroke="#F9BD85" strokeWidth="3.5" />
          </svg>

          <svg
            width="161"
            height="151"
            viewBox="613 370 161 151"
            fill="none"
            stroke="#F7942F"
            strokeWidth="4.5"
            className="pointer-events-none absolute bottom-0 right-0 h-[52px] w-[56px] sm:hidden"
          >
            <path d="M620 576 A 233 233 0 0 1 772 377" />
            <path d="M613 575 A 240 240 0 0 1 770 370" stroke="#F9BD85" strokeWidth="3.5" />
          </svg>

          <Dots className="pointer-events-none absolute right-4 top-16 sm:hidden" />
          <Dots className="pointer-events-none absolute left-4 top-16 sm:hidden" />

          <div className="relative flex flex-col items-center gap-1 sm:flex-row sm:justify-between sm:gap-6">
            <Image
              src="/media/images/khalafi-banner-car.webp"
              alt="استعلام خلافی خودرو"
              width={900}
              height={472}
              className="h-auto w-[155px] max-w-full flex-none sm:w-[180px] lg:w-[215px]"
            />

            <div className="text-center sm:flex-1 sm:text-right">
              <h2 className="m-0 text-xl font-bold text-secondary sm:text-[22px] lg:text-[26px]">
                استعلام <span className="text-[#F7502A]">خلافی</span> خودرو
              </h2>
              <p className="m-0 pt-1.5 font-['vazir'] text-xs font-semibold text-[#6F7B8C] sm:pt-1.5 sm:text-[13px] lg:text-sm">
                وضعیت خلافی و اطلاعات خودرو را سریع و آنلاین بررسی کنید
              </p>
            </div>

            <Link
              href="/khalafi"
              className="order-3 mt-3.5 flex h-11 w-full max-w-[300px] flex-none items-center justify-center gap-3 rounded-full bg-[linear-gradient(180deg,#FFA03E,#F7740A)] text-base text-white shadow-[0_12px_26px_rgba(249,116,10,.3)] transition hover:brightness-105 sm:order-4 sm:mt-0 sm:h-[52px] sm:w-auto sm:px-9 sm:text-lg"
            >
              شروع استعلام
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </Link>

            <div className="order-4 flex items-center gap-6 pt-4 sm:order-3 sm:flex-none sm:gap-5 sm:pt-0">
              {features.map((feature, index) => (
                <div key={feature.title} className="flex items-center gap-6 sm:gap-5">
                  {index > 0 && <span className="h-[34px] w-px bg-[#DFE3EA]" />}
                  <div className="w-[66px] text-center sm:w-auto">
                    <span className="mx-auto flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#FDEAD9]">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#F7740A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {feature.icon}
                      </svg>
                    </span>
                    <span className="block whitespace-nowrap pt-2 font-['vazir'] text-[13px] font-semibold text-[#5D6A7C] sm:pt-1.5 sm:text-xs">
                      {feature.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KhalafiSection;
