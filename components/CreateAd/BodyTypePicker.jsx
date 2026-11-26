import { vehicleTypeSet } from '@/utils/services/vehicleTypes';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const CATEGORIES = {
  5: { title: 'نوع خودرو', name: 'سواری', icon: '/media/images/features/type-car.webp' },
  6: { title: 'نوع موتور', name: 'موتورسیکلت', icon: '/media/images/features/type-motorcycle.webp' },
  7: { title: 'نوع خودرو', name: 'سنگین', icon: '/media/images/features/type-heavy.webp' },
};

const BodyTypePicker = ({ headBrandId = 5, value, onChange, error }) => {
  const [open, setOpen] = useState(false);
  const box = useRef(null);
  const types = vehicleTypeSet(headBrandId).items;
  const category = CATEGORIES[headBrandId] || CATEGORIES[5];
  const labelOf = (name) => (headBrandId === 5 && name === 'سدان' ? `${name} (${category.name})` : name);

  useEffect(() => {
    if (!open) return undefined;
    const onOutside = (event) => {
      if (box.current && !box.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [open]);

  return (
    <div ref={box} className="pb-2">
      <div
        onClick={() => setOpen((state) => !state)}
        className="flex cursor-pointer flex-row-reverse items-center gap-3 rounded-[14px] bg-[linear-gradient(270deg,#FFF6F1,#FCFDFE_70%)] px-3.5 py-3"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#8E9AAC"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`flex-none transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
        <span className="min-w-0 flex-1">
          <span className="block text-[14.5px] font-bold text-secondary">{category.title}</span>
          <span className={`block pt-1 text-[13.5px] ${value ? 'font-semibold text-[#42536B]' : 'text-[#A3ADBC]'}`}>
            {value ? labelOf(value) : 'انتخاب کنید'}
          </span>
        </span>
        <span className="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-[12px] bg-[#FFEDE3]">
          <Image src={category.icon} alt="" width={128} height={128} className="h-[28px] w-[28px] object-contain" />
        </span>
      </div>

      {open && (
        <div className="mt-1.5 max-h-64 overflow-y-auto rounded-[14px] border border-[#EEF1F6] bg-white p-1.5 shadow-[0_8px_20px_rgba(20,36,63,.08)]">
          {types.map((type) => (
            <div
              key={type.label}
              onClick={() => {
                onChange(type.label);
                setOpen(false);
              }}
              className={`cursor-pointer rounded-[10px] px-3.5 py-2.5 text-[14px] ${
                value === type.label ? 'bg-[#FFF3EA] font-bold text-primary' : 'text-[#42536B] hover:bg-[#F7F9FC]'
              }`}
            >
              {labelOf(type.label)}
            </div>
          ))}
        </div>
      )}

      {error && <div className="pt-1.5 text-sm text-red-500">{error}</div>}
    </div>
  );
};

export default BodyTypePicker;
