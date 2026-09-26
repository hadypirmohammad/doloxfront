import StateCitySelect from '@/components/global/StateCitySelect';
import { getcities } from '@/utils/Request';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const Location = ({ step, setStep, setCity }) => {
  const [selectedCity, setSelectedCity] = useState('');
  const [error, setError] = useState('');
  const [cities, setCities] = useState([]);

  const handleNextStep = () => {
    if (selectedCity) {
      setCity(selectedCity);
      setStep(8);
      setError('');
    } else {
      setError('لطفا استان و شهر را انتخاب کنید');
    }
  };

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const result = await getcities();
        setCities(result || []);
      } catch (err) {
        setCities([]);
      }
    };

    fetchCities();
  }, []);

  if (step !== 7) return null;

  return (
    <div dir="rtl" className="px-4 pt-5 sm:px-5">
      <div className="mx-auto max-w-xl rounded-[22px] border border-[#EEF1F6] bg-white p-4 shadow-[0_2px_10px_rgba(20,36,63,.04)] sm:p-5">
        <div className="flex flex-row-reverse items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleNextStep}
            className="flex flex-row-reverse items-center gap-2 rounded-2xl border-[1.5px] border-primary px-5 py-2.5 text-sm font-bold text-primary"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            ادامه
          </button>
          <div className="flex items-center gap-2">
            <span className="h-5 w-[3px] rounded-[3px] bg-primary" />
            <h2 className="m-0 text-[17px] font-bold text-secondary">مکان آگهی</h2>
          </div>
        </div>

        <p className="m-0 pt-3.5 text-[13.5px] text-[#8B94A5]">
          لطفا استان و شهر خود را برای ثبت آگهی انتخاب کنید.
        </p>

        <div className="mt-5 [&_*]:!font-['vazir']">
          <StateCitySelect cities={cities} value={selectedCity} onChange={setSelectedCity} />
          {error && <div className="pt-1.5 text-sm text-red-500">{error}</div>}
        </div>

        <div className="mt-5 flex flex-row-reverse items-center gap-3.5 rounded-[18px] bg-[#FFF3EA] p-4">
          <Image
            src="/media/images/default-ad.webp"
            alt="موقعیت آگهی"
            width={96}
            height={80}
            className="h-20 w-24 flex-none rounded-2xl object-cover"
          />
          <div className="flex-1">
            <p className="m-0 text-[15.5px] font-bold text-secondary">انتخاب درست موقعیت</p>
            <p className="m-0 pt-2 text-[12.5px] leading-[1.9] text-[#8B94A5]">
              انتخاب صحیح موقعیت آگهی، باعث دیده شدن بیشتر و جذب خریدار سریع‌تر می‌شود.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleNextStep}
          className="mt-5 flex w-full flex-row-reverse items-center justify-center gap-2.5 rounded-2xl bg-gradient-orange py-4 text-base font-bold text-white"
        >
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          ادامه
        </button>

        <button
          type="button"
          onClick={() => setStep(step - 1)}
          className="mt-3 flex w-full items-center justify-center gap-2.5 rounded-2xl border border-[#E7EBF1] bg-white py-3.5 text-[14.5px] font-bold text-secondary"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          مرحله قبل
        </button>
      </div>
    </div>
  );
};

export default Location;
