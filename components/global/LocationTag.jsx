import { useEffect, useRef, useState } from 'react';

const LocationTag = ({ label }) => {
  const [open, setOpen] = useState(false);
  const box = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onOutside = (event) => {
      if (!box.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onOutside);
    return () => document.removeEventListener('pointerdown', onOutside);
  }, [open]);

  if (!label) return null;

  return (
    <span ref={box} className="relative flex min-w-0 items-center">
      <button
        type="button"
        title={label}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen((value) => !value);
        }}
        onTouchEnd={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen((value) => !value);
        }}
        className="swiper-no-swiping flex min-w-0 items-center gap-1 text-[12px] text-[#7A7A7A]"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#A3ADBC" strokeWidth="1.9" className="flex-none">
          <path d="M12 21.5s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z" />
          <circle cx="12" cy="10.2" r="2.6" />
        </svg>
        <span className="truncate">{label}</span>
      </button>

      {open && (
        <span
          role="tooltip"
          className="absolute bottom-[calc(100%+8px)] left-0 z-20 w-max max-w-[220px] rounded-lg bg-secondary px-2.5 py-1.5 text-[12px] leading-[1.7] text-white shadow-[0_8px_20px_rgba(30,42,58,.25)]"
        >
          {label}
          <span className="absolute -bottom-1 left-3 h-2 w-2 rotate-45 bg-secondary" />
        </span>
      )}
    </span>
  );
};

export default LocationTag;
