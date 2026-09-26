import { resolveBackendMediaUrl } from '@/utils/media';
import { toPersianDigits } from '@/utils/Cal';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const BRAND_IMAGE_FALLBACK = '/media/images/samplebrand.png';

const AdSummary = ({ step, setStep, brand, model, year, bodyLabels = [], price }) => {
  const [brandImage, setBrandImage] = useState(BRAND_IMAGE_FALLBACK);

  useEffect(() => {
    setBrandImage(resolveBackendMediaUrl(brand?.Image, BRAND_IMAGE_FALLBACK));
  }, [brand]);

  if (step < 2 || step > 8 || !brand) return null;

  const bodyLabel = bodyLabels.find((item) => item.name?.includes('بدنه')) || bodyLabels.find((item) => item.value);

  const items = [
    { label: 'برند', value: brand?.Name },
    { label: 'مدل', value: model?.Name },
    { label: 'سال', value: year?.Year ? toPersianDigits(year.Year) : '' },
    { label: bodyLabel?.name || 'بدنه', value: bodyLabel?.value },
    { label: 'قیمت', value: price ? `${toPersianDigits(Number(price).toLocaleString('en-US'))} تومان` : '' },
  ].filter((item) => item.value);

  return (
    <div dir='rtl' className='px-4 pt-4 sm:px-5'>
      <div className='mx-auto flex max-w-xl items-center gap-3 rounded-[18px] border border-[#EEF1F6] bg-white p-3.5 shadow-[0_2px_10px_rgba(20,36,63,.04)]'>
        <span className='flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[11px] border border-[#E7EBF1] bg-white'>
          <Image
            className='h-7 w-8 object-contain'
            src={brandImage}
            alt=''
            width={32}
            height={28}
            onError={() => setBrandImage(BRAND_IMAGE_FALLBACK)}
          />
        </span>

        <div className='flex min-w-0 flex-1 flex-wrap items-center gap-x-5 gap-y-2'>
          {items.map((item) => (
            <div key={item.label} className='min-w-0 text-center'>
              <p className='m-0 text-[10.5px] text-[#A3ADBC]'>{item.label}</p>
              <p className='m-0 truncate pt-1 text-[12.5px] font-bold text-secondary'>{item.value}</p>
            </div>
          ))}
        </div>

        <button
          type='button'
          onClick={() => setStep(step - 1)}
          className='flex flex-none items-center gap-2 rounded-[13px] border border-[#E7EBF1] bg-white px-3.5 py-2.5 text-[13px] font-semibold text-[#42536B]'
        >
          <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
            <path d='M19 12H5M12 19l-7-7 7-7' />
          </svg>
          بازگشت
        </button>
      </div>
    </div>
  );
};

export default AdSummary;
