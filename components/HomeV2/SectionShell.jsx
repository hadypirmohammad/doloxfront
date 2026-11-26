import Link from 'next/link';

const ACTION_CLASS =
  'font-soft absolute -top-[46px] left-0 flex h-9 items-center gap-1.5 rounded-full border border-primary/35 bg-[#FFF6F0] px-3.5 text-[12.5px] text-[#C2410C] transition-colors hover:bg-primary hover:text-white sm:-top-[48px] sm:text-[13.5px]';

const ActionContent = ({ label }) => (
  <>
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
      <rect x="3.5" y="3.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="2" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="2" />
    </svg>
    {label}
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
      <path d="M14 6l-6 6 6 6" />
    </svg>
  </>
);

const SectionShell = ({ title, href, onAction, action = 'مشاهده همه', connect = true, plain = false, children }) => (
  <section dir="rtl" className="px-3 pb-8 pt-14 sm:px-4 sm:pb-10 sm:pt-20">
    <div className="relative mx-auto max-w-screen-xl">
      {connect && (
        <span className="pointer-events-none absolute -top-[30px] -right-[26px] h-[42px] w-[33px] -translate-y-full rounded-tr-[16px] border-r border-t border-[#D7DDE6] sm:h-[62px] sm:rounded-tr-[20px]" />
      )}

      <span className="pointer-events-none absolute -bottom-6 -left-2 right-[7px] -top-[30px] rounded-l-[34px] border-y border-l border-[#D7DDE6] sm:-bottom-7 sm:-left-4" />

      {title && (
        <h2 className="absolute -top-[44px] right-0 m-0 flex items-center gap-2.5 bg-[#EEF2F7] pl-2.5 text-lg text-secondary sm:-top-[46px] sm:text-2xl">
          <span className="h-3.5 w-3.5 flex-none rounded-full border-[3px] border-primary bg-white" />
          {title}
        </h2>
      )}

      {href && (
        <Link href={href} className={ACTION_CLASS}>
          <ActionContent label={action} />
        </Link>
      )}

      {!href && onAction && (
        <button type="button" onClick={onAction} className={ACTION_CLASS}>
          <ActionContent label={action} />
        </button>
      )}

      <div
        className={
          plain
            ? 'relative px-1 sm:px-2'
            : 'relative rounded-[22px] border border-white/70 bg-white/55 p-4 shadow-[0_12px_40px_rgba(30,42,58,.10)] backdrop-blur-2xl sm:p-6'
        }
      >
        {children}
      </div>
    </div>
  </section>
);

export default SectionShell;
