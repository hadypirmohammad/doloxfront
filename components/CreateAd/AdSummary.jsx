import { resolveBackendMediaUrl } from '@/utils/media';
import { toPersianDigits } from '@/utils/Cal';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const BRAND_IMAGE_FALLBACK = '/media/images/samplebrand.png';

const AdSummary = ({ step, brand, model, year, bodyLabels = [], price, priceType }) => {
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
    { label: 'نوع قیمت', value: priceType },
    { label: 'قیمت', value: price ? `${toPersianDigits(Number(price).toLocaleString('en-US'))} تومان` : '' },
  ].filter((item) => item.value);

  return (
    <div dir='rtl' className='px-4 pt-4 sm:px-5'>
      <div className='mx-auto flex max-w-xl items-center gap-4 rounded-[18px] border border-[#EEF1F6] bg-white px-5 py-3.5 shadow-[0_2px_10px_rgba(20,36,63,.04)] sm:px-6'>
        <span className='flex h-[42px] w-[42px] flex-none items-center justify-center rounded-xl border border-[#E7EBF1] bg-white'>
          <Image
            className='h-8 w-9 object-contain'
            src={brandImage}
            alt=''
            width={36}
            height={32}
            onError={() => setBrandImage(BRAND_IMAGE_FALLBACK)}
          />
        </span>

        <div className='flex min-w-0 flex-1 flex-wrap items-center gap-x-7 gap-y-3 px-1 sm:gap-x-10'>
          {items.map((item) => (
            <div key={item.label} className='min-w-0 text-center'>
              <p className='m-0 text-[11px] text-[#A3ADBC]'>{item.label}</p>
              <p className='m-0 whitespace-nowrap pt-1.5 text-[13.5px] font-bold text-secondary'>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdSummary;
