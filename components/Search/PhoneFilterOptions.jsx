import React, { useState } from "react";
import { useRouter } from "next/router";
import DoubleSlider from "../global/DoubleSlider";
import FilterSection from "../global/FilterSection";
import MultiCitySelect from "../global/MultiCitySelect";
import { HOME_CATEGORIES } from '@/components/Home/CategoryNav';

const FilterIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
        <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
        <circle cx="16" cy="7" r="2" />
        <circle cx="10" cy="17" r="2" />
    </svg>
);

const PhoneFilterOptions = ({
    cities,
    brands,
    city,
    setCity,
    brand,
    setBrand,
    year,
    setYear,
    worked,
    setWorked,
    price,
    setPrice,
    setFilter,
    filtersActive,
    headBrandId = 5,
    onCategoryChange,
    onResetFilters,
    resetKey = 0,
}) => {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const cityCount = Array.isArray(city) ? city.length : 0;
    const brandName = brand?.BrandId > 0 ? brand.Name : '';

    const handleApplyFilter = () => {
        setFilter(true);
        setOpen(false);
    };

    const handleClearFilter = () => {
        onResetFilters?.();
        setFilter(false);
        setOpen(false);
        router.push('/ads');
    };

    return (
        <div className="lg:hidden">
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className={`font-soft flex h-[42px] items-center gap-2 rounded-full border px-4 text-[14px] transition-colors ${
                        filtersActive ? 'border-primary bg-[#FFF6F0] text-[#C2410C]' : 'border-[#E6E8EC] bg-white text-secondary'
                    }`}
                >
                    <FilterIcon />
                    فیلتر
                    {filtersActive && <span className="h-2 w-2 rounded-full bg-primary" />}
                </button>
                {filtersActive && (
                    <button
                        type="button"
                        onClick={handleClearFilter}
                        className="font-soft flex h-[42px] items-center gap-1.5 rounded-full border border-[#E6E8EC] bg-white px-3.5 text-[13px] text-[#5B6575]"
                    >
                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                            <path d="M2 2l10 10M12 2 2 12" />
                        </svg>
                        حذف فیلترها
                    </button>
                )}
            </div>

            {open && <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setOpen(false)} />}

            <div
                className={`fixed inset-x-0 bottom-0 z-50 flex h-[85dvh] flex-col rounded-t-[22px] bg-[#F6F7F9] transition-transform duration-300 ${
                    open ? 'translate-y-0' : 'pointer-events-none translate-y-full'
                }`}
                aria-hidden={!open}
            >
                <div className="flex-none rounded-t-[22px] bg-white px-4 pb-3 pt-3">
                    <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-[#DDE1E7]" />
                    <div className="flex items-center justify-between">
                        <h2 className="font-soft m-0 text-[17px] text-secondary">فیلترها</h2>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            aria-label="بستن"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F1F3F7] text-secondary"
                        >
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M4 4l8 8M12 4l-8 8" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="flex-1 space-y-2.5 overflow-y-auto overscroll-contain p-3 font-[vazir]">
                    <section className="rounded-2xl border border-[#EEF0F4] bg-white p-4">
                        <p className="font-soft m-0 mb-3 text-[14px] text-secondary">دسته‌بندی</p>
                        <div className="grid grid-cols-3 gap-2">
                            {HOME_CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => onCategoryChange?.(cat.id)}
                                    className={`h-10 rounded-xl border text-[13px] transition-colors ${
                                        headBrandId === cat.id
                                            ? 'border-primary bg-[#FFF6F0] text-[#C2410C]'
                                            : 'border-[#E6E8EC] bg-white text-secondary'
                                    }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-2xl border border-[#EEF0F4] bg-white p-4">
                        <p className="font-soft m-0 mb-3 text-[14px] text-secondary">استان و شهر</p>
                        <MultiCitySelect key={resetKey} cities={cities} value={city} onChange={setCity} />
                        {cityCount > 1 && (
                            <p className="m-0 mt-2 text-[11.5px] text-[#8B94A5]">آگهی‌های {cityCount} شهر انتخاب‌شده نمایش داده می‌شود</p>
                        )}
                    </section>

                    <FilterSection title="برند" hint={brandName}>
                        <select
                            className="h-11 w-full rounded-xl border border-[#E6E8EC] bg-white px-3 text-[14px] text-secondary outline-none focus:border-primary"
                            value={brand?.BrandId > 0 ? brand.BrandId : ""}
                            onChange={(e) => {
                                const selected = brands.find((b) => b.BrandId === parseInt(e.target.value));
                                setBrand(selected || { BrandId: -1, Name: 'انتخاب کنید', ParentId: -1 });
                            }}
                        >
                            <option value="">همه برندها</option>
                            {brands?.map((b) => (
                                <option key={b.BrandId} value={b.BrandId}>{b.Name}</option>
                            ))}
                        </select>
                    </FilterSection>

                    <FilterSection title="سال تولید">
                        <div className="flex items-center gap-2.5 text-[13px] text-[#5B6575]">
                            <span>از</span>
                            <input
                                className="h-11 w-full rounded-xl border border-[#E6E8EC] bg-white text-center text-secondary outline-none focus:border-primary"
                                type="number"
                                inputMode="numeric"
                                placeholder=""
                                onChange={(e) => setYear({ ...year, min: parseInt(e.target.value) || 0 })}
                            />
                            <span>تا</span>
                            <input
                                className="h-11 w-full rounded-xl border border-[#E6E8EC] bg-white text-center text-secondary outline-none focus:border-primary"
                                type="number"
                                inputMode="numeric"
                                placeholder=""
                                onChange={(e) => setYear({ ...year, max: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </FilterSection>

                    <FilterSection title="کارکرد">
                        <div className="pb-1 pt-1">
                            <DoubleSlider
                                min="0"
                                max="1000000"
                                step={5000}
                                currentMin={worked.min}
                                currentMax={worked.max}
                                onChange={({ min, max }) => setWorked({ min, max })}
                            />
                        </div>
                    </FilterSection>

                    <FilterSection title="قیمت">
                        <div className="pb-1 pt-1">
                            <DoubleSlider
                                min="0"
                                max="100000000000"
                                step={100000000}
                                currentMin={price.min}
                                currentMax={price.max}
                                onChange={({ min, max }) => setPrice({ min, max })}
                            />
                        </div>
                    </FilterSection>
                </div>

                <div className="flex flex-none gap-2.5 border-t border-[#EEF0F4] bg-white p-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
                    <button
                        type="button"
                        onClick={handleApplyFilter}
                        className="font-soft h-12 flex-1 rounded-xl bg-gradient-orange text-[15px] text-white"
                    >
                        نمایش نتایج
                    </button>
                    {filtersActive && (
                        <button
                            type="button"
                            onClick={handleClearFilter}
                            className="font-soft h-12 rounded-xl border border-[#E6E8EC] bg-white px-5 text-[14px] text-secondary"
                        >
                            حذف فیلترها
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PhoneFilterOptions;
