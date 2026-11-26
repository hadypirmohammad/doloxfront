import BrandLogo from '@/components/global/BrandLogo';
import { useAutoScroll } from '@/hooks/useAutoScroll';
import { toPersianDigits } from '@/utils/Cal';
import { CAR_PRICE_GROUPS, GROUP_LOGO_BRAND, filterByGroup } from '@/utils/services/carPriceGroups';

const GROUP_ICONS = {
  all: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="2" />
      <rect x="13" y="4" width="7" height="7" rx="2" />
      <rect x="4" y="13" width="7" height="7" rx="2" />
      <rect x="13" y="13" width="7" height="7" rx="2" />
    </>
  ),
  domestic: (
    <>
      <path d="M5 21V10l7-6 7 6v11" />
      <path d="M9 21v-6h6v6" />
    </>
  ),
  foreign: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.4 2.5 3.6 5.3 3.6 8.5s-1.2 6-3.6 8.5c-2.4-2.5-3.6-5.3-3.6-8.5s1.2-6 3.6-8.5z" />
    </>
  ),
  chinese: (
    <>
      <path d="M12 3.5l2.4 5 5.4.6-4 3.7 1.1 5.3L12 15.4l-4.9 2.7 1.1-5.3-4-3.7 5.4-.6z" />
    </>
  ),
};

const median = (list) => {
  const values = list
    .map((item) => item.change)
    .filter((value) => typeof value === 'number' && Number.isFinite(value))
    .sort((a, b) => a - b);
  if (!values.length) return null;
  const middle = Math.floor(values.length / 2);
  return values.length % 2 ? values[middle] : (values[middle - 1] + values[middle]) / 2;
};

const Change = ({ value }) => {
  if (value == null || Math.abs(value) < 0.005) {
    return <span className="text-[13px] text-[#A7AEBA]">۰٪</span>;
  }
  const up = value > 0;
  return (
    <span className={`flex items-center gap-0.5 text-[13px] ${up ? 'text-[#1E9E5A]' : 'text-[#E03A3A]'}`} dir="ltr">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={up ? '' : 'rotate-180'}>
        <path d="M12 19V5M6 11l6-6 6 6" />
      </svg>
      {up ? '+' : '−'}
      {toPersianDigits(Math.abs(value).toFixed(2))}٪
    </span>
  );
};

const CarPriceGroupTiles = ({ items = [], logos = {}, active, onSelect }) => {
  const rowRef = useAutoScroll();
  return (
  <div ref={rowRef} className="-mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-px-1 px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:grid sm:snap-none sm:grid-cols-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-9 [&::-webkit-scrollbar]:hidden">
    {CAR_PRICE_GROUPS.map((group) => {
      const selected = active === group.key;
      const logoBrand = GROUP_LOGO_BRAND[group.key];
      const logo = logoBrand ? logos[logoBrand] || items.find((item) => item.brand === logoBrand)?.image || '' : '';
      const groupItems = filterByGroup(items, group.key);
      return (
        <button
          key={group.key}
          type="button"
          onClick={() => onSelect(group.key)}
          aria-pressed={selected}
          className={`flex w-[calc((100%-16px)/2.6)] flex-none snap-start flex-col items-center gap-1.5 rounded-2xl border px-2 py-3 transition-colors sm:w-auto ${
            selected ? 'border-primary bg-[#FFF6F0]' : 'border-[#EEF0F4] bg-white hover:border-primary/40'
          }`}
        >
          {logoBrand ? (
            <BrandLogo src={logo} name={group.label} size={34} imageClassName="h-6 w-6" className="bg-white" />
          ) : (
            <span className={`flex h-[34px] w-[34px] items-center justify-center rounded-full ${selected ? 'bg-primary text-white' : 'bg-[#F1F3F7] text-secondary'}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {GROUP_ICONS[group.key]}
              </svg>
            </span>
          )}
          <span className={`font-soft text-center text-[13.5px] leading-[1.5] ${selected ? 'text-[#C2410C]' : 'text-secondary'}`}>
            {group.label}
          </span>
          <Change value={median(groupItems)} />
        </button>
      );
    })}
  </div>
  );
};

export default CarPriceGroupTiles;
