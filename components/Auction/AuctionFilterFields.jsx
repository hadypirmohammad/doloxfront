import DoubleSlider from '../global/DoubleSlider';
import FilterSection from '../global/FilterSection';
import MultiCitySelect from '../global/MultiCitySelect';

const AuctionFilterFields = ({
  cities,
  categories,
  query,
  setQuery,
  city,
  setCity,
  category,
  setCategory,
  setPriceRange,
  activeAuctions,
  setActiveAuctions,
}) => {
  const categoryName = categories.find((item) => String(item.AuctionCategoryId) === String(category))?.CategoryName || '';

  return (
    <div className="space-y-2.5 font-[vazir]">
      <label className="flex h-[48px] items-center gap-2 rounded-2xl border border-[#EEF0F4] bg-white px-3.5">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B94A5" strokeWidth="2" strokeLinecap="round" className="flex-none">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="جستجو در عنوان مزایده…"
          className="h-full w-full bg-transparent text-[14px] text-secondary outline-none placeholder:text-[#A7AEBA]"
        />
      </label>

      <section className="rounded-2xl border border-[#EEF0F4] bg-white p-4">
        <p className="font-soft m-0 mb-3 text-[14px] text-secondary">استان و شهر</p>
        <MultiCitySelect cities={cities} value={city} onChange={setCity} />
      </section>

      <FilterSection title="دسته‌بندی" hint={categoryName}>
        <div className="flex flex-wrap gap-2">
          {[{ AuctionCategoryId: '', CategoryName: 'همه' }, ...categories].map((item) => {
            const active = String(category) === String(item.AuctionCategoryId);
            return (
              <button
                key={item.AuctionCategoryId || 'all'}
                type="button"
                onClick={() => setCategory(item.AuctionCategoryId)}
                className={`h-9 rounded-full border px-3.5 text-[13px] transition-colors ${
                  active ? 'border-primary bg-[#FFF6F0] text-[#C2410C]' : 'border-[#E6E8EC] bg-white text-secondary'
                }`}
              >
                {item.CategoryName}
              </button>
            );
          })}
        </div>
      </FilterSection>

      <FilterSection title="قیمت پایه">
        <div className="pb-1 pt-1">
          <DoubleSlider max={100000} min={10} onChange={setPriceRange} />
        </div>
      </FilterSection>

      <button
        type="button"
        onClick={() => setActiveAuctions(!activeAuctions)}
        className="flex w-full items-center justify-between rounded-2xl border border-[#EEF0F4] bg-white px-4 py-3.5 text-right"
      >
        <span className="font-soft text-[14px] text-secondary">فقط مزایده‌های جاری</span>
        <span className={`relative h-6 w-11 flex-none rounded-full transition-colors ${activeAuctions ? 'bg-primary' : 'bg-[#D6DAE2]'}`}>
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${activeAuctions ? 'right-0.5' : 'right-[22px]'}`} />
        </span>
      </button>
    </div>
  );
};

export default AuctionFilterFields;
