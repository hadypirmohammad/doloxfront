import { useEffect, useRef, useState } from 'react';

const FilterSelect = ({
  label,
  value,
  options = [],
  placeholder = 'همه',
  disabled = false,
  onChange,
  variant = 'bar',
}) => {
  const box = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) return undefined;
    const onOutside = (event) => {
      if (!box.current?.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const selected = options.find((option) => String(option.value) === String(value));
  const searchable = options.length > 8;
  const visible = query
    ? options.filter((option) => option.label.includes(query.trim()))
    : options;

  const bar = variant === 'bar';

  return (
    <div ref={box} className={`relative ${bar ? 'min-w-0 flex-1' : ''}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((state) => !state)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={
          bar
            ? 'flex w-full flex-col items-start gap-0.5 px-5 text-right disabled:cursor-not-allowed'
            : 'flex h-[52px] w-full items-center justify-between gap-2 rounded-xl border border-[#E6E8EC] bg-white px-4 text-right transition-colors focus:border-primary disabled:cursor-not-allowed disabled:bg-[#F2F3F5]'
        }
      >
        {bar && <span className="text-[11.5px] text-[#8B94A5]">{label}</span>}
        <span className="flex w-full items-center justify-between gap-2">
          <span
            className={`truncate text-[14.5px] ${
              disabled ? 'text-[#B8BEC9]' : selected ? 'text-secondary' : 'text-[#6D7686]'
            }`}
          >
            {selected?.label || placeholder}
          </span>
          <svg
            width="17"
            height="17"
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

      {open && !disabled && (
        <div className="absolute inset-x-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-[#E6E8EC] bg-white shadow-[0_18px_44px_rgba(30,42,58,.18)]">
          {searchable && (
            <div className="border-b border-[#F1F2F4] p-2">
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="جستجو…"
                className="h-9 w-full rounded-lg bg-[#F6F7F9] px-3 text-[13px] text-secondary outline-none placeholder:text-[#A7AEBA]"
              />
            </div>
          )}

          <div className="max-h-[232px] overflow-y-auto overscroll-contain py-1">
            {visible.length === 0 && (
              <p className="m-0 px-3 py-6 text-center text-[12.5px] text-[#8B94A5]">موردی پیدا نشد</p>
            )}

            {visible.map((option) => {
              const active = String(option.value) === String(value);
              return (
                <button
                  key={option.value || 'all'}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange?.(option.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-right text-[13.5px] transition-colors ${
                    active ? 'bg-[#FFF6F0] text-[#C2410C]' : 'text-secondary hover:bg-[#F6F7F9]'
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {active && (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
                      <path d="m5 12.5 4.5 4.5L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSelect;
