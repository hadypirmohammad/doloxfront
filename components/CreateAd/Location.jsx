import StateCitySelect from '@/components/global/StateCitySelect';
import { getcities } from '@/utils/Request';
import React, { useEffect, useState } from 'react';

const Location = ({ step, setStep, setCity }) => {
  const [selectedCity, setSelectedCity] = useState('');
  const [error, setError] = useState('');
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(true);

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
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, []);

  if (step !== 7) return null;

  return (
    <div dir="rtl" className="px-4 pt-5 sm:px-5">
      <div className="mx-auto max-w-xl rounded-[22px] border border-[#EEF1F6] bg-white p-4 shadow-[0_2px_10px_rgba(20,36,63,.04)] sm:p-5">
        <div className="flex items-center gap-2">
          <span className="h-5 w-[3px] rounded-[3px] bg-primary" />
          <h2 className="m-0 text-[17px] font-bold text-secondary">مکان آگهی</h2>
        </div>

        <p className="m-0 pt-3.5 text-[13.5px] text-[#8B94A5]">
          لطفا استان و شهر خود را برای ثبت آگهی انتخاب کنید.
        </p>

        <div className="mt-5 [&_*]:!font-['vazir']">
          <StateCitySelect cities={cities} value={selectedCity} onChange={setSelectedCity} disabled={loadingCities} />
          {loadingCities && (
            <div className="flex items-center gap-2 pt-2.5 text-[12.5px] text-[#8B94A5]">
              <span className="loading loading-spinner loading-xs text-primary" />
              در حال دریافت لیست شهرها...
            </div>
          )}
          {!loadingCities && cities.length === 0 && (
            <div className="pt-2.5 text-[12.5px] text-red-500">دریافت لیست شهرها ناموفق بود، لطفا صفحه را دوباره باز کنید.</div>
          )}
          {error && <div className="pt-1.5 text-sm text-red-500">{error}</div>}
        </div>

        <div className="mt-5 flex flex-row-reverse items-center gap-3.5 rounded-[18px] bg-[#FFF3EA] p-4">
          <svg width="74" height="74" viewBox="0 0 64 64" fill="none" className="h-[74px] w-[74px] flex-none">
            <path
              d="M32 5c-10.5 0-19 8.3-19 18.6 0 12.6 15.7 28.4 18.2 30.8a1.2 1.2 0 0 0 1.6 0C35.3 52 51 36.2 51 23.6 51 13.3 42.5 5 32 5z"
              fill="#FF5E00"
            />
            <path
              d="M32 5c-2 0-4 .3-5.8.9 7.6 2.4 13.1 9.3 13.1 17.7 0 11.2-12.4 24.9-17 30 .3.3.6.6.9.8a1.2 1.2 0 0 0 1.6 0C35.3 52 51 36.2 51 23.6 51 13.3 42.5 5 32 5z"
              fill="#CC4B00"
            />
            <circle cx="32" cy="23.5" r="12.5" fill="#F7F7F7" />
            <circle cx="32" cy="23.5" r="10" fill="#FFFFFF" />
            <path
              d="M24 25.6c0-.7.3-1.3.9-1.7l1.5-1.1 1.4-2.6c.4-.7 1.1-1.1 1.9-1.1h4.6c.8 0 1.5.4 1.9 1.1l1.4 2.6 1.5 1.1c.6.4.9 1 .9 1.7v2.2c0 .5-.4.9-.9.9h-1.3a.9.9 0 0 1-.9-.9v-.6h-9v.6c0 .5-.4.9-.9.9h-1.2a.9.9 0 0 1-.9-.9v-2.2z"
              fill="#FF5E00"
            />
            <path d="M27.4 24.4h9.2l-1.3-2.4h-6.6l-1.3 2.4z" fill="#FFFFFF" />
            <ellipse cx="32" cy="57" rx="14" ry="3.4" fill="#FF5E00" opacity=".25" />
          </svg>
          <div className="flex-1">
            <p className="m-0 text-[15.5px] font-bold text-secondary">انتخاب درست موقعیت</p>
            <p className="m-0 pt-2 text-[12.5px] leading-[1.9] text-[#8B94A5]">
              انتخاب صحیح موقعیت آگهی، باعث دیده شدن بیشتر و جذب خریدار سریع‌تر می‌شود.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-4 flex max-w-xl gap-3">
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          className="flex flex-1 items-center justify-center gap-2.5 rounded-2xl border border-[#E7EBF1] bg-white py-3.5 text-[14.5px] font-bold text-secondary"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          مرحله قبل
        </button>
        <button
          type="button"
          onClick={handleNextStep}
          className="flex flex-1 flex-row-reverse items-center justify-center gap-2.5 rounded-2xl bg-gradient-orange py-3.5 text-[14.5px] font-bold text-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          مرحله بعد
        </button>
      </div>
    </div>
  );
};

export default Location;
