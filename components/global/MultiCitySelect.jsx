import { getProvinces } from '@/utils/cities';
import { useEffect, useMemo, useRef, useState } from 'react';

const toKey = (value) => String(value);

const normalize = (value) =>
  String(value || '')
    .replace(/[‌\s]+/g, ' ')
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .trim();

const CheckBox = ({ checked }) => (
  <span
    className={`flex h-[18px] w-[18px] flex-none items-center justify-center rounded border ${
      checked ? 'border-primary bg-primary' : 'border-[#CBD2DC] bg-white'
    }`}
  >
    {checked && (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="m5 12.5 4.5 4.5L19 7" />
      </svg>
    )}
  </span>
);

const Chevron = ({ open }) => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#8B94A5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`flex-none transition-transform ${open ? 'rotate-180' : ''}`}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const summarize = (names, empty, unit) => {
  if (!names.length) return empty;
  if (names.length === 1) return names[0];
  return `${names[0]} و ${names.length - 1} ${unit} دیگر`;
};

const Trigger = ({ bar, label, text, active, count, open, disabled, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-haspopup="listbox"
    aria-expanded={open}
    className={
      bar
        ? 'flex w-full flex-col items-start gap-0.5 px-5 text-right disabled:cursor-not-allowed'
        : `flex h-[52px] w-full items-center justify-between gap-2 rounded-xl border bg-white px-4 text-right transition-colors disabled:cursor-not-allowed disabled:bg-[#F6F7F9] ${
            open ? 'border-primary' : 'border-[#E6E8EC]'
          }`
    }
  >
    {bar && <span className="text-[11.5px] text-[#8B94A5]">{label}</span>}
    <span className="flex w-full items-center justify-between gap-2">
      <span className={`truncate text-[14.5px] ${active ? 'text-secondary' : 'text-[#6D7686]'} ${disabled ? 'opacity-60' : ''}`}>{text}</span>
      <span className="flex flex-none items-center gap-1.5">
        {count > 0 && <span className="rounded-full bg-[#FFF1E8] px-2 py-0.5 text-[11px] text-[#C2410C]">{count}</span>}
        <Chevron open={open} />
      </span>
    </span>
  </button>
);

const Panel = ({ children, query, setQuery, placeholder, onClear, onClose }) => (
  <div className="absolute inset-x-0 top-[calc(100%+8px)] z-50 w-full min-w-[280px] overflow-hidden rounded-2xl border border-[#E6E8EC] bg-white shadow-[0_18px_44px_rgba(30,42,58,.18)]">
    <div className="border-b border-[#F1F2F4] p-2">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        className="h-9 w-full rounded-lg bg-[#F6F7F9] px-3 text-[13px] text-secondary outline-none placeholder:text-[#A7AEBA]"
      />
    </div>
    <div className="max-h-[260px] overflow-y-auto overscroll-contain py-1">{children}</div>
    <div className="flex items-center justify-between border-t border-[#F1F2F4] px-3 py-2">
      <button type="button" onClick={onClear} className="text-[12.5px] text-[#8B94A5] hover:text-[#E03A3A]">
        پاک کردن
      </button>
      <button type="button" onClick={onClose} className="rounded-lg bg-gradient-orange px-4 py-1.5 text-[12.5px] text-white">
        تأیید
      </button>
    </div>
  </div>
);

const Row = ({ checked, onClick, children, strong = false }) => (
  <button
    type="button"
    role="option"
    aria-selected={checked}
    onClick={onClick}
    className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-right text-[13.5px] transition-colors ${
      checked ? 'bg-[#FFF6F0] text-[#C2410C]' : 'text-secondary hover:bg-[#F6F7F9]'
    } ${strong ? 'font-bold' : ''}`}
  >
    <CheckBox checked={checked} />
    <span className="min-w-0 flex-1 truncate">{children}</span>
  </button>
);

const MultiCitySelect = ({ cities = [], value = [], onChange, variant = 'stack' }) => {
  const box = useRef(null);
  const [open, setOpen] = useState(null);
  const [query, setQuery] = useState('');
  const [provinceIds, setProvinceIds] = useState([]);
  const [picked, setPicked] = useState([]);
  const seeded = useRef(false);

  const provinces = useMemo(() => getProvinces(cities), [cities]);
  const citiesOf = (province) => (province?.ChildrenCities || []).map((city) => toKey(city.CityId));
  const provinceById = (id) => provinces.find((province) => toKey(province.CityId) === toKey(id));

  useEffect(() => {
    if (seeded.current || !provinces.length) return;
    seeded.current = true;
    const chosen = new Set((value || []).map(toKey));
    if (!chosen.size) return;
    const nextProvinces = provinces.filter((province) => citiesOf(province).some((id) => chosen.has(id))).map((province) => toKey(province.CityId));
    setProvinceIds(nextProvinces);
    setPicked([...chosen]);
  }, [provinces]);

  useEffect(() => {
    if (!open) return undefined;
    const onOutside = (event) => {
      if (!box.current?.contains(event.target)) setOpen(null);
    };
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(null);
    };
    document.addEventListener('mousedown', onOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const emit = (nextProvinces, nextPicked) => {
    setProvinceIds(nextProvinces);
    setPicked(nextPicked);
    const pickedSet = new Set(nextPicked);
    const ids = nextProvinces.flatMap((id) => {
      const all = citiesOf(provinceById(id));
      const explicit = all.filter((cityId) => pickedSet.has(cityId));
      return explicit.length ? explicit : all;
    });
    onChange?.(ids);
  };

  const toggleProvince = (id) => {
    const key = toKey(id);
    if (provinceIds.includes(key)) {
      const removed = new Set(citiesOf(provinceById(key)));
      emit(provinceIds.filter((item) => item !== key), picked.filter((cityId) => !removed.has(cityId)));
    } else {
      emit([...provinceIds, key], picked);
    }
  };

  const toggleCity = (id) => {
    const key = toKey(id);
    emit(provinceIds, picked.includes(key) ? picked.filter((item) => item !== key) : [...picked, key]);
  };

  const toggleAllCities = (province) => {
    const all = citiesOf(province);
    const full = all.every((id) => picked.includes(id));
    const rest = picked.filter((id) => !all.includes(id));
    emit(provinceIds, full ? rest : [...rest, ...all]);
  };

  const openPanel = (name) => {
    setQuery('');
    setOpen((current) => (current === name ? null : name));
  };

  const term = normalize(query);
  const matches = (name) => !term || normalize(name).includes(term);
  const selectedProvinces = provinceIds.map(provinceById).filter(Boolean);

  const provinceNames = selectedProvinces.map((province) => province.CityName);
  const cityNames = selectedProvinces.flatMap((province) => {
    const all = citiesOf(province);
    const explicit = (province.ChildrenCities || []).filter((city) => picked.includes(toKey(city.CityId)));
    if (!explicit.length) return [];
    if (explicit.length === all.length) return [`همه شهرهای ${province.CityName}`];
    return explicit.map((city) => city.CityName);
  });

  const bar = variant === 'bar';

  return (
    <div ref={box} className={bar ? 'flex min-w-0 flex-1' : 'grid grid-cols-1 gap-2'}>
      <div className={`relative ${bar ? 'min-w-0 flex-1' : ''}`}>
        <Trigger
          bar={bar}
          label="استان"
          text={summarize(provinceNames, 'همه استان‌ها', 'استان')}
          active={provinceNames.length > 0}
          count={provinceNames.length > 1 ? provinceNames.length : 0}
          open={open === 'province'}
          onClick={() => openPanel('province')}
        />
        {open === 'province' && (
          <Panel
            query={query}
            setQuery={setQuery}
            placeholder="جستجوی استان…"
            onClear={() => emit([], [])}
            onClose={() => setOpen(null)}
          >
            {provinces.filter((province) => matches(province.CityName)).map((province) => (
              <Row key={province.CityId} checked={provinceIds.includes(toKey(province.CityId))} onClick={() => toggleProvince(province.CityId)}>
                {province.CityName}
              </Row>
            ))}
          </Panel>
        )}
      </div>

      <div className={`relative ${bar ? 'min-w-0 flex-1 border-r border-[#E6E8EC]' : ''}`}>
        <Trigger
          bar={bar}
          label="شهر"
          text={summarize(cityNames, 'همه شهرها', 'مورد')}
          active={cityNames.length > 0}
          count={cityNames.length > 1 ? cityNames.length : 0}
          open={open === 'city'}
          disabled={!selectedProvinces.length}
          onClick={() => openPanel('city')}
        />
        {open === 'city' && (
          <Panel
            query={query}
            setQuery={setQuery}
            placeholder="جستجوی شهر…"
            onClear={() => emit(provinceIds, [])}
            onClose={() => setOpen(null)}
          >
            {selectedProvinces.map((province) => {
              const all = citiesOf(province);
              const list = (province.ChildrenCities || []).filter((city) => matches(city.CityName));
              return (
                <div key={province.CityId} className="border-b border-[#F4F5F7] last:border-b-0">
                  {!term && (
                    <Row strong checked={all.length > 0 && all.every((id) => picked.includes(id))} onClick={() => toggleAllCities(province)}>
                      همه شهرهای {province.CityName}
                    </Row>
                  )}
                  {list.map((city) => (
                    <Row key={city.CityId} checked={picked.includes(toKey(city.CityId))} onClick={() => toggleCity(city.CityId)}>
                      {city.CityName}
                    </Row>
                  ))}
                </div>
              );
            })}
          </Panel>
        )}
      </div>
    </div>
  );
};

export default MultiCitySelect;
