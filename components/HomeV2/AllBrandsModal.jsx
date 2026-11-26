import { resolveBackendMediaUrl } from '@/utils/media';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const normalize = (value) =>
  String(value || '')
    .replace(/[‌\s]+/g, ' ')
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .trim();

const AllBrandsModal = ({ brands = [], onClose }) => {
  const [query, setQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const term = normalize(query);
  const list = term ? brands.filter((brand) => normalize(brand.Name).includes(term)) : brands;

  if (!mounted) return null;

  return createPortal(
    <div
      dir="rtl"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-[rgba(30,42,58,0.35)] p-4 backdrop-blur-[3px]"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="همه برندها"
        className="flex max-h-[78vh] w-full max-w-[720px] flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_30px_70px_rgba(30,42,58,.28)] sm:max-h-[86vh]"
      >
        <div className="flex flex-none items-center justify-between gap-3 border-b border-[#F1F2F4] px-4 pb-3 pt-4 sm:px-5">
          <h2 className="font-soft m-0 text-[17px] text-secondary">همه برندها</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F1F3F7] text-secondary transition-colors hover:bg-[#E6E9EF]"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>

        <div className="flex-none px-4 pt-3 sm:px-5">
          <label className="flex h-[44px] items-center gap-2 rounded-xl border border-[#E6E8EC] bg-white px-3.5">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#8B94A5" strokeWidth="2" strokeLinecap="round" className="flex-none">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="جستجوی برند…"
              className="h-full w-full bg-transparent text-[14px] text-secondary outline-none placeholder:text-[#A7AEBA]"
            />
          </label>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4 pt-3 sm:px-5 sm:pb-5">
          {list.length === 0 ? (
            <p className="m-0 py-10 text-center text-[13px] text-[#8B94A5]">برندی با این نام پیدا نشد</p>
          ) : (
            <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-6 sm:gap-2">
              {list.map((brand) => (
                <Link
                  key={brand.BrandId}
                  href={{ pathname: '/ads', query: { headBrandId: 5, brandId: brand.BrandId } }}
                  onClick={onClose}
                  className="flex flex-col items-center gap-1 rounded-xl border border-[#EEF0F4] bg-white px-1 py-2.5 transition-colors hover:border-primary/50 hover:bg-[#FFFBF8] sm:gap-1.5 sm:py-3"
                >
                  <span className="relative h-6 w-full sm:h-7">
                    <Image src={resolveBackendMediaUrl(brand.Image, '')} alt={brand.Name || ''} fill sizes="80px" className="object-contain" />
                  </span>
                  <span className="w-full truncate text-center text-[11px] text-secondary sm:text-[12px]">{brand.Name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AllBrandsModal;
