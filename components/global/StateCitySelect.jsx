import { findProvinceIdForCity, getProvinces } from '@/utils/cities';
import { useEffect, useMemo, useRef, useState } from 'react';

const Dropdown = ({ options, value, placeholder, onSelect, disabled, className }) => {
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    const handleOutside = (event) => {
      if (boxRef.current && !boxRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  const selected = options.find((item) => String(item.CityId) === String(value));

  return (
    <div ref={boxRef} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={`${className} flex cursor-pointer items-center justify-between gap-2 text-right disabled:cursor-not-allowed disabled:opacity-60`}
      >
        <span className={selected ? 'truncate text-secondary' : 'truncate text-[#A3ADBC]'}>
          {selected?.CityName || placeholder}
        </span>
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
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full z-40 mt-1.5 max-h-60 overflow-y-auto rounded-2xl border border-[#EEF1F6] bg-white p-1.5 shadow-[0_8px_20px_rgba(20,36,63,.12)]">
          {options.length === 0 ? (
            <p className="m-0 py-4 text-center text-[13px] text-[#A3ADBC]">موردی یافت نشد</p>
          ) : (
            options.map((item) => (
              <div
                key={item.CityId}
                onClick={() => {
                  onSelect(String(item.CityId));
                  setOpen(false);
                }}
                className={`cursor-pointer rounded-[10px] px-3.5 py-2.5 text-[14px] ${
                  String(item.CityId) === String(value)
                    ? 'bg-[#FFF3EA] font-bold text-primary'
                    : 'text-[#42536B] hover:bg-[#F7F9FC]'
                }`}
              >
                {item.CityName}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Two-field location picker: استان then شهر.
 * Only child cities are selectable / emitted via onChange.
 */
const StateCitySelect = ({
  cities = [],
  value,
  onChange,
  disabled = false,
  /** When true, onChange receives the city object; otherwise CityId */
  returnObject = false,
  stateLabel = 'استان',
  cityLabel = 'شهر',
  className = '',
  labelClassName = 'label py-1',
  labelTextClassName = 'label-text',
  selectClassName = "input focus:outline-primary border-none w-full bg-base-200 font-['vazir']",
}) => {
  const provinces = useMemo(() => getProvinces(cities), [cities]);

  const selectedCityId =
    value && typeof value === 'object' ? value.CityId : value;

  const [provinceId, setProvinceId] = useState(() =>
    String(findProvinceIdForCity(cities, selectedCityId) || '')
  );
  const [cityId, setCityId] = useState(() =>
    selectedCityId != null && selectedCityId !== '' ? String(selectedCityId) : ''
  );

  useEffect(() => {
    const nextCity =
      selectedCityId != null && selectedCityId !== '' ? String(selectedCityId) : '';
    const nextProvince = String(findProvinceIdForCity(cities, selectedCityId) || '');
    setCityId(nextCity);
    if (nextProvince) setProvinceId(nextProvince);
  }, [selectedCityId, cities]);

  const childCities = useMemo(() => {
    const province = provinces.find((p) => String(p.CityId) === String(provinceId));
    return province?.ChildrenCities || [];
  }, [provinces, provinceId]);

  const emitCity = (nextCityId) => {
    if (!nextCityId) {
      onChange?.(returnObject ? null : '');
      return;
    }
    const city = childCities.find((c) => String(c.CityId) === String(nextCityId));
    if (!city) {
      onChange?.(returnObject ? null : '');
      return;
    }
    if (returnObject) {
      const province = provinces.find((p) => String(p.CityId) === String(provinceId));
      onChange?.({ ...city, ProvinceName: province?.CityName, ProvinceId: province?.CityId });
    } else {
      onChange?.(String(city.CityId));
    }
  };

  const handleProvinceChange = (next) => {
    setProvinceId(next);
    setCityId('');
    onChange?.(returnObject ? null : '');
  };

  const handleCityChange = (next) => {
    setCityId(next);
    emitCity(next);
  };

  return (
    <div className={`flex w-full flex-col gap-3 ${className}`} dir="rtl">
      <div className="form-control w-full">
        <div className={labelClassName}>
          <span className={labelTextClassName}>{stateLabel}</span>
        </div>
        <Dropdown
          options={provinces}
          value={provinceId}
          placeholder="انتخاب استان"
          onSelect={handleProvinceChange}
          disabled={disabled}
          className={selectClassName}
        />
      </div>

      <div className="form-control w-full">
        <div className={labelClassName}>
          <span className={labelTextClassName}>{cityLabel}</span>
        </div>
        <Dropdown
          options={childCities}
          value={cityId}
          placeholder="انتخاب شهر"
          onSelect={handleCityChange}
          disabled={disabled || !provinceId}
          className={selectClassName}
        />
      </div>
    </div>
  );
};

export default StateCitySelect;
