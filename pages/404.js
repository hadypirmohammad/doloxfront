import Image from 'next/image';
import Link from 'next/link';

const primaryButton =
  'inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm text-white shadow-[0_10px_26px_rgba(0,0,0,0.25)] transition hover:opacity-90';
const ghostButton =
  'inline-flex h-11 items-center justify-center rounded-xl border border-white/70 bg-white/95 px-6 text-sm text-[#14233c] shadow-[0_10px_26px_rgba(0,0,0,0.18)] transition hover:border-primary hover:text-primary';

const Actions = ({ className }) => (
  <div className={className}>
    <Link href="/" className={primaryButton}>
      بازگشت به صفحه اصلی
    </Link>
    <Link href="/ads" className={ghostButton}>
      مشاهده آگهی‌ها
    </Link>
  </div>
);

export default function Custom404() {
  return (
    <div dir="rtl" className="w-full bg-white">
      <div className="relative hidden h-[calc(100vh-90px)] min-h-[480px] w-full items-end justify-center overflow-hidden bg-[#dbe4ee] sm:flex">
        <Image
          src="/media/images/404-crash.png"
          alt="۴۰۴ - متاسفانه به مشکل فنی برخوردیم"
          fill
          sizes="100vw"
          priority
          className="object-cover object-[50%_35%]"
        />
        <Actions className="relative z-10 flex flex-wrap items-center justify-center gap-3 pb-10" />
      </div>

      <div className="flex min-h-[calc(100vh-120px)] w-full flex-col sm:hidden">
        <div className="relative h-[42vh] min-h-[240px] w-full overflow-hidden bg-[#dbe4ee]">
          <div className="absolute inset-y-0 left-0 w-[210%]">
            <Image
              src="/media/images/404-crash.png"
              alt="۴۰۴ - متاسفانه به مشکل فنی برخوردیم"
              fill
              sizes="100vw"
              priority
              className="object-cover object-[0%_55%]"
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-5 py-8 text-center">
          <p className="m-0 text-[64px] font-bold leading-none text-[#14233c]">404</p>
          <h1 className="m-0 pt-4 text-[19px] font-bold leading-[1.7] text-[#14233c]">
            متاسفانه به مشکل فنی برخوردیم
          </h1>
          <p className="m-0 pt-2 text-[14px] font-semibold text-primary">
            — منتظرمون باشید ، به زودی برمیگردیم —
          </p>
          <Actions className="flex w-full flex-col items-stretch gap-3 pt-7" />
        </div>
      </div>
    </div>
  );
}
