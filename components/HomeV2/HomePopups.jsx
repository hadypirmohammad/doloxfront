import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'dolox_home_popups_closed';
const ROTATE_MS = 4000;
const PHONE = '09901140313';

const Check = () => (
  <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#E8F7EE]">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1E9E5A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  </span>
);

const Actions = ({ children, onClose }) => (
  <div className="mt-auto flex gap-2 px-5 pb-2 pt-4">
    {children}
    <button
      type="button"
      onClick={onClose}
      className="font-soft h-[46px] rounded-2xl border border-[#E6E8EC] bg-white px-5 text-[14px] text-[#5B6575] transition-colors hover:bg-[#F6F7F9]"
    >
      بستن
    </button>
  </div>
);

const AuctionSlide = ({ onClose }) => (
  <div className="flex h-full flex-col">
    <div className="relative mx-4 mt-4 aspect-[1200/990] overflow-hidden rounded-[22px] bg-[linear-gradient(160deg,#E7F4F8_0%,#F4F8FB_55%,#FFF3EA_100%)]">
      <Image src="/media/images/popup-auction.webp" alt="بیش از ۴۰۰ آگهی مزایده در روز" fill sizes="370px" className="object-contain p-2" />
    </div>

    <div className="px-5 pt-4 text-center">
      <h3 className="m-0 text-[18px] leading-[1.6] text-secondary">دولوکس؛ مرجع مزایده‌های کشور</h3>
      <p className="m-0 pt-1 text-[12.5px] leading-[1.9] text-[#6B7585]">
        انتشار روزانه آگهی‌های مزایده دولتی و خصوصی کل کشور
      </p>
    </div>

    <ul className="mx-4 mb-0 mt-4 flex list-none flex-col gap-3 rounded-2xl bg-[#F6F8FA] p-4 text-[13.5px] text-secondary">
      <li className="flex items-center gap-2"><Check />انتشار روزانه مزایده‌های جدید</li>
      <li className="flex items-center gap-2"><Check />جستجوی آسان بر اساس شهر و دسته‌بندی</li>
      <li className="flex items-center gap-2"><Check />دسترسی به فرصت‌های متنوع مزایده در سراسر کشور</li>
    </ul>

    <Actions onClose={onClose}>
      <Link
        href="/auctions"
        onClick={onClose}
        className="font-soft flex h-[46px] flex-1 items-center justify-center rounded-2xl bg-gradient-orange text-[14.5px] text-white shadow-[0_8px_20px_rgba(255,94,0,.25)]"
      >
        مشاهده مزایده‌ها
      </Link>
    </Actions>
  </div>
);

const PaintSlide = ({ onClose }) => (
  <div className="flex h-full flex-col">
    <div className="relative mx-auto mt-4 h-[104px] w-[300px] max-w-[calc(100%-96px)]">
      <Image src="/media/images/autoplus-logo.webp" alt="اتوپلاس، احیای رنگ و نقاشی خودرو" fill sizes="300px" className="object-contain" />
    </div>

    <div className="flex items-start justify-between gap-3 px-5 pt-3">
      <div className="flex min-w-0 flex-col">
        <h3 className="m-0 text-[18px] leading-[1.6] text-secondary">درخشش اتفاقی نیست...</h3>
        <p className="m-0 text-[12.5px] leading-[1.9] text-[#6B7585]">تخصص، دقت و کیفیت در رنگ و نقاشی خودرو</p>
      </div>
      <span className="mt-1 flex flex-none items-center gap-1 rounded-full bg-[#FFF1E8] px-2.5 py-1 text-[11.5px] text-[#C2410C]">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
          <circle cx="12" cy="9.5" r="2.5" />
        </svg>
        اصفهان
      </span>
    </div>

    <ul className="m-0 flex list-none flex-col gap-2 px-5 pt-3 text-[13px] text-secondary">
      <li className="flex items-center gap-2"><Check />رنگ و نقاشی خودرو</li>
      <li className="flex items-center gap-2"><Check />احیای رنگ و بدنه</li>
      <li className="flex items-center gap-2"><Check />واکس، پولیش و براق‌سازی</li>
    </ul>

    <div className="mx-4 mt-4 overflow-hidden rounded-[20px] bg-[#F1F3F6]">
      <div className="relative aspect-[4/3] w-full">
        <Image src="/media/images/popup-paint.webp" alt="اتاق رنگ اتوپلاس" fill sizes="400px" className="object-contain" />
      </div>
    </div>

    <Actions onClose={onClose}>
      <a
        href={`tel:${PHONE}`}
        className="font-soft flex h-[46px] flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-orange text-[14.5px] text-white shadow-[0_8px_20px_rgba(255,94,0,.25)]"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round">
          <path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z" />
        </svg>
        تماس
      </a>
    </Actions>
  </div>
);

const SLIDES = [AuctionSlide, PaintSlide];

const HomePopups = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const touchX = useRef(null);

  useEffect(() => {
    let closed = false;
    try {
      closed = window.sessionStorage.getItem(STORAGE_KEY) === '1';
    } catch (error) {
      closed = false;
    }
    if (!closed) setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open || held) return undefined;
    const timer = setTimeout(() => setActive((value) => (value + 1) % SLIDES.length), ROTATE_MS);
    return () => clearTimeout(timer);
  }, [open, active, held]);

  const step = (direction) => setActive((value) => (value + direction + SLIDES.length) % SLIDES.length);

  function close() {
    setOpen(false);
    try {
      window.sessionStorage.setItem(STORAGE_KEY, '1');
    } catch (error) {
      setOpen(false);
    }
  }

  if (!open) return null;

  return (
    <div
      dir="rtl"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(30,42,58,0.35)] p-4 backdrop-blur-[3px]"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="اطلاعیه"
        onTouchStart={(event) => {
          touchX.current = event.touches[0]?.clientX ?? null;
          setHeld(true);
        }}
        onTouchCancel={() => setHeld(false)}
        onMouseDown={() => setHeld(true)}
        onMouseUp={() => setHeld(false)}
        onMouseLeave={() => setHeld(false)}
        onTouchEnd={(event) => {
          setHeld(false);
          if (touchX.current == null) return;
          const delta = (event.changedTouches[0]?.clientX ?? touchX.current) - touchX.current;
          touchX.current = null;
          if (Math.abs(delta) > 40) step(delta > 0 ? 1 : -1);
        }}
        className="relative max-h-[92vh] w-full max-w-[400px] overflow-y-auto overscroll-contain rounded-[28px] bg-white shadow-[0_30px_70px_rgba(30,42,58,.28)] [scrollbar-width:none]"
      >
        <button
          type="button"
          aria-label="بستن"
          onClick={close}
          className="absolute left-6 top-6 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white text-secondary shadow-[0_4px_14px_rgba(30,42,58,.16)] transition-colors hover:bg-[#F6F7F9]"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>

        <div className="grid">
          {SLIDES.map((Slide, index) => (
            <div
              key={index}
              aria-hidden={index !== active}
              className={`col-start-1 row-start-1 transition-opacity duration-300 ${index === active ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
            >
              <Slide onClose={close} />
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-2 pb-4 pt-2">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`اسلاید ${index + 1}`}
              onClick={() => setActive(index)}
              className={`h-2 rounded-full transition-all ${index === active ? 'w-6 bg-primary' : 'w-2 bg-[#D6DAE2]'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePopups;
