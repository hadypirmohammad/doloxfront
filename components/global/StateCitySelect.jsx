import { findProvinceIdForCity, getProvinces } from '@/utils/cities';
import { useEffect, useMemo, useState } from 'react';

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

  const handleProvinceChange = (event) => {
    const next = event.target.value;
    setProvinceId(next);
    setCityId('');
    onChange?.(returnObject ? null : '');
  };

  const handleCityChange = (event) => {
    const next = event.target.value;
    setCityId(next);
    emitCity(next);
  };

  return (
    <div className={`flex w-full flex-col gap-3 ${className}`} dir="rtl">
      <label className="form-control w-full">
        <div className={labelClassName}>
          <span className={labelTextClassName}>{stateLabel}</span>
        </div>
        <select
          className={selectClassName}
          value={provinceId}
          onChange={handleProvinceChange}
          disabled={disabled}
        >
          <option value="">انتخاب استان</option>
          {provinces.map((province) => (
            <option key={province.CityId} value={province.CityId}>
              {province.CityName}
            </option>
          ))}
        </select>
      </label>

      <label className="form-control w-full">
        <div className={labelClassName}>
          <span className={labelTextClassName}>{cityLabel}</span>
        </div>
        <select
          className={selectClassName}
          value={cityId}
          onChange={handleCityChange}
          disabled={disabled || !provinceId}
        >
          <option value="">انتخاب شهر</option>
          {childCities.map((city) => (
            <option key={city.CityId} value={city.CityId}>
              {city.CityName}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default StateCitySelect;
