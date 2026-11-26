import { GALLERY_STATUSES, GALLERY_TYPES } from '@/utils/services/autoGalleries';
import { getProvinces } from '@/utils/cities';
import React, { useEffect, useMemo, useRef, useState } from 'react';

const SelectBox = ({ icon, label, value, placeholder, options, onSelect }) => {
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    const handleOutside = (event) => {
      if (boxRef.current && !boxRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const selected = options.find((item) => String(item.id) === String(value));

  return (
    <div ref={boxRef} className='relative'>
      <button
        type='button'
        onClick={() => setOpen((prev) => !prev)}
        className='flex w-full items-center gap-2.5 rounded-[14px] border border-[#EAEEF4] bg-white px-3.5 py-2.5 text-right transition-colors hover:border-primary'
      >
        <span className='flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-[#FFF3EA] text-primary'>
          <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round'>
            {icon}
          </svg>
        </span>
        <span className='min-w-0 flex-1'>
          <span className='block text-[12.5px] font-bold text-secondary'>{label}</span>
          <span className='block truncate pt-0.5 text-[11.5px] text-[#8B94A5]'>{selected?.label || placeholder}</span>
        </span>
        <svg
          width='16'
          height='16'
          viewBox='0 0 24 24'
          fill='none'
          stroke='#8E9AAC'
          strokeWidth='1.8'
          strokeLinecap='round'
          className={`flex-none transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path d='M6 9l6 6 6-6' />
        </svg>
      </button>

      {open && (
        <div className='absolute inset-x-0 top-full z-40 mt-1.5 max-h-60 overflow-y-auto rounded-2xl border border-[#EEF1F6] bg-white p-1.5 shadow-[0_8px_20px_rgba(20,36,63,.12)]'>
          {options.map((item) => (
            <div
              key={String(item.id)}
              onClick={() => {
                onSelect(item);
                setOpen(false);
              }}
              className={`cursor-pointer rounded-[10px] px-3.5 py-2.5 text-[13.5px] ${
                String(item.id) === String(value)
                  ? 'bg-[#FFF3EA] font-bold text-primary'
                  : 'text-[#42536B] hover:bg-[#F7F9FC]'
              }`}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const icons = {
  type: (
    <>
      <path d='M4 17h16' />
      <path d='M5.5 17v-3.5l1.7-4A2 2 0 0 1 9.04 8h5.92a2 2 0 0 1 1.84 1.5l1.7 4V17' />
    </>
  ),
  province: (
    <>
      <path d='M12 21.5s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z' />
      <circle cx='12' cy='10.2' r='2.6' />
    </>
  ),
  city: (
    <>
      <rect x='4' y='8' width='7' height='12' rx='1' />
      <rect x='13' y='4' width='7' height='16' rx='1' />
      <path d='M7 12h.01M7 16h.01M16.5 8h.01M16.5 12h.01M16.5 16h.01' />
    </>
  ),
  status: (
    <>
      <path d='M12 2.8 20 5.6v6c0 4.4-3.2 7.8-8 9.6-4.8-1.8-8-5.2-8-9.6v-6z' />
      <path d='m8.6 12.2 2.4 2.3 4.4-4.8' />
    </>
  ),
};

const GalleryFilterBar = ({ cities = [], searchInput, setSearchInput, filters, onApply }) => {
  const [province, setProvince] = useState(null);
  const provinces = useMemo(() => getProvinces(cities), [cities]);

  const provinceOptions = useMemo(
    () => [{ id: '', label: 'همه استان‌ها' }, ...provinces.map((p) => ({ id: p.CityId, label: p.CityName, raw: p }))],
    [provinces]
  );

  const cityOptions = useMemo(() => {
    const children = province?.ChildrenCities || [];
    return [{ id: '', label: 'همه شهرها' }, ...children.map((c) => ({ id: c.CityId, label: c.CityName, raw: c }))];
  }, [province]);

  return (
    <div className='rounded-[20px] border border-[#EEF1F6] bg-white p-4 shadow-[0_10px_34px_rgba(29,53,87,.07)] sm:p-5'>
      <label className='flex items-center gap-3 rounded-[14px] border border-[#EAEEF4] bg-[#F8FAFC] px-4 py-3 focus-within:border-primary'>
        <svg width='19' height='19' viewBox='0 0 24 24' fill='none' stroke='#8E9AAC' strokeWidth='1.8' strokeLinecap='round' className='flex-none'>
          <circle cx='11' cy='11' r='7' />
          <path d='m21 21-4.3-4.3' />
        </svg>
        <input
          type='text'
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') onApply();
          }}
          placeholder='نام گالری، شهر یا استان را جستجو کنید...'
          className="min-w-0 flex-1 border-0 bg-transparent text-right text-[13.5px] text-secondary outline-none font-['vazir'] placeholder:text-[#A3ADBC]"
        />
      </label>

      <div className='grid gap-2.5 pt-3 sm:grid-cols-2 lg:grid-cols-4'>
        <SelectBox
          icon={icons.type}
          label='نوع گالری'
          placeholder='همه گالری ها'
          value={filters.type}
          options={GALLERY_TYPES}
          onSelect={(item) => onApply({ type: item.id })}
        />

        <SelectBox
          icon={icons.province}
          label='استان'
          placeholder='همه استان‌ها'
          value={province?.CityId || ''}
          options={provinceOptions}
          onSelect={(item) => {
            setProvince(item.raw || null);
            onApply({ city: item.raw || null });
          }}
        />

        <SelectBox
          icon={icons.city}
          label='شهر'
          placeholder='همه شهرها'
          value={filters.city?.CityId || ''}
          options={cityOptions}
          onSelect={(item) => onApply({ city: item.raw || province || null })}
        />

        <SelectBox
          icon={icons.status}
          label='وضعیت گالری'
          placeholder='همه گالری‌ها'
          value={filters.status}
          options={GALLERY_STATUSES}
          onSelect={(item) => onApply({ status: item.id })}
        />
      </div>

      <button
        type='button'
        onClick={() => onApply()}
        className='mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-orange py-3 text-[14.5px] font-bold text-white'
      >
        <svg width='17' height='17' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round'>
          <circle cx='11' cy='11' r='7' />
          <path d='m21 21-4.3-4.3' />
        </svg>
        جستجو
      </button>
    </div>
  );
};

export default GalleryFilterBar;
