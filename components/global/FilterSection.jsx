import { useState } from 'react';

const FilterSection = ({ title, hint, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="rounded-2xl border border-[#EEF0F4] bg-white">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-right"
      >
        <span className="font-soft text-[14px] text-secondary">{title}</span>
        <span className="flex min-w-0 items-center gap-2">
          {hint && <span className="truncate text-[12px] text-[#C2410C]">{hint}</span>}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8B94A5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`flex-none transition-transform ${open ? 'rotate-180' : ''}`}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </button>
      {open && <div className="border-t border-[#F1F2F4] px-4 pb-4 pt-3">{children}</div>}
    </section>
  );
};

export default FilterSection;
