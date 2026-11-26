import React from 'react';

const pick = (ad, keys) => {
  for (const key of keys) {
    const value = ad?.[key];
    if (value !== undefined && value !== null && String(value).trim() !== '') return value;
  }
  return null;
};

const getCoords = (ad) => {
  const lat = Number(pick(ad, ['Lat', 'lat', 'Latitude', 'latitude']));
  const lng = Number(pick(ad, ['Lon', 'lon', 'Lng', 'lng', 'Longitude', 'longitude']));
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || (lat === 0 && lng === 0)) return null;
  return { lat, lng };
};

const LocationDetail = ({ ad }) => {
  const coords = getCoords(ad);
  const address = pick(ad, ['LocationAddress', 'Address', 'address', 'FullAddress', 'AdAddress']);
  const city = pick(ad, ['CityName', 'cityName']) || ad?.City?.CityName;

  if (!coords && !address && !city) return null;

  const mapUrl = coords
    ? `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([city, address].filter(Boolean).join(' '))}`;
  const staticMap = coords
    ? `https://static-maps.yandex.ru/1.x/?ll=${coords.lng},${coords.lat}&z=15&size=240,160&l=map&pt=${coords.lng},${coords.lat},pm2rdm`
    : null;

  return (
    <div dir="rtl" className="mt-2 h-fit w-full max-w-screen-sm rounded-[15px] bg-white p-6">
      <h2 className="m-0 pb-4 text-center text-lg font-bold">لوکیشن</h2>

      <div className="flex items-center gap-3.5">
        <span className="flex h-[76px] w-[104px] flex-none items-center justify-center overflow-hidden rounded-[14px] border border-[#EEF1F6] bg-[#F7F9FC]">
          {staticMap ? (
            <img src={staticMap} alt="" className="h-full w-full object-cover" />
          ) : (
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#FF5E00" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 21.5s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z" />
              <circle cx="12" cy="10.2" r="2.6" />
            </svg>
          )}
        </span>

        <div className="min-w-0 flex-1">
          <p className="m-0 text-[13px] leading-[2] text-[#42536B] font-[vazir]">
            {[city, address].filter(Boolean).join('، ')}
          </p>

          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2.5 inline-flex items-center gap-2 rounded-xl border border-[#FFD4B8] bg-[#FFF3EA] px-3.5 py-2 text-[12.5px] font-bold text-primary transition-colors hover:border-primary"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 3.5-5.5 2.5v14L9 17.5l6 3 5.5-2.5v-14L15 6.5z" />
              <path d="M9 3.5v14M15 6.5v14" />
            </svg>
            مشاهده روی نقشه
          </a>
        </div>
      </div>
    </div>
  );
};

export default LocationDetail;
