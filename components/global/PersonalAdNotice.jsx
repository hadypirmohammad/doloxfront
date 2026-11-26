import Link from 'next/link';
import { useEffect } from 'react';

const PersonalAdNotice = ({ open, galleries = [], onClose }) => {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const list = Array.isArray(galleries) ? galleries : [];
  const multi = list.length > 1;
  const first = list[0] || null;

  return (
    <div
      dir="rtl"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(30,42,58,0.55)] p-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="personal-ad-title"
        className="flex w-full max-w-[460px] flex-col items-center gap-3.5 rounded-[18px] bg-white px-5 pb-5 pt-6 text-center shadow-[0_20px_50px_rgba(30,42,58,0.25)] sm:px-[26px] sm:pb-6 sm:pt-7"
      >
        <span className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-[#FFF1E8] sm:h-16 sm:w-16">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF5E00" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5.5M12 7.8h.01" strokeWidth="2.6" />
          </svg>
        </span>

        <h2 id="personal-ad-title" className="m-0 text-[16.5px] font-extrabold text-[#1E2A3A] sm:text-[19px]">
          شما در حال ثبت آگهی شخصی هستید
        </h2>

        <p className="m-0 text-[13px] leading-[2] text-[#5B6575] sm:text-[14px]">
          اگر می‌خواهید آگهی با نام گالری شما منتشر شود و از اشتراک گالری استفاده کنید،{' '}
          {multi ? 'گالری مورد نظر را انتخاب کنید' : 'گزینه «ثبت با نام گالری» را بزنید'}.
        </p>

        <p className="m-0 text-[12.5px] leading-[2] text-[#5B6575] sm:text-[13.5px]">
          اگر می‌خواهید آگهی به‌صورت شخصی ثبت شود، همین‌جا ادامه دهید؛ از سهمیه گالری کم نمی‌شود و نام
          گالری روی آگهی نمی‌آید.
        </p>

        <div className="mt-1.5 flex w-full flex-col gap-2">
          {multi ? (
            list.map((gallery) => (
              <Link
                key={gallery.GalleryId}
                href={`/createad?gl=${gallery.GalleryId}`}
                className="flex min-h-[48px] w-full items-center justify-between gap-2 rounded-xl border border-[#F5B48A] bg-[#FFF6F0] px-4 text-[14px] font-bold text-[#C2410C] transition-colors hover:bg-[#FFEDE1]"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
                    <path d="M4 10.5V20h16v-9.5" />
                    <path d="M3 10.5 5.2 5h13.6L21 10.5a2.6 2.6 0 0 1-4.5 1.8 2.6 2.6 0 0 1-4.5 0 2.6 2.6 0 0 1-4.5 0A2.6 2.6 0 0 1 3 10.5Z" />
                  </svg>
                  <span className="truncate">{gallery.Name || 'گالری بدون نام'}</span>
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
                  <path d="M14 6l-6 6 6 6" />
                </svg>
              </Link>
            ))
          ) : (
            <Link
              href={first ? `/createad?gl=${first.GalleryId}` : '/dashboard/gallery'}
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-orange text-[15px] font-bold text-white sm:min-h-[50px] sm:text-[16px]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
                <path d="M4 10.5V20h16v-9.5" />
                <path d="M3 10.5 5.2 5h13.6L21 10.5a2.6 2.6 0 0 1-4.5 1.8 2.6 2.6 0 0 1-4.5 0 2.6 2.6 0 0 1-4.5 0A2.6 2.6 0 0 1 3 10.5Z" />
              </svg>
              ثبت با نام گالری
            </Link>
          )}

          <button
            type="button"
            onClick={onClose}
            className="min-h-[46px] w-full rounded-xl border border-[#E6E8EC] bg-white text-[14.5px] font-bold text-[#1E2A3A] transition-colors hover:bg-[#F6F7F9] sm:min-h-[48px]"
          >
            ادامه به‌صورت شخصی
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalAdNotice;
