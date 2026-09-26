import React, { useState } from "react";
import DoubleSlider from "../global/DoubleSlider";
import StateCitySelect from "../global/StateCitySelect";
import { HOME_CATEGORIES } from '@/components/Home/CategoryNav';

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
}) => {
    const [open, setOpen] = useState(false);

    // تابعی برای بستن دراور و اعمال فیلتر نهایی
    const handleApplyFilter = () => {
        setFilter(prev => !prev); // تحریک useEffect در کامپوننت والد
        setOpen(false); // بستن دراور
    };

    return (
        <div className="md:hidden">

            {/* button */}
            <div className="flex">

            <button
                onClick={() => setOpen(true)}
                className="flex px-3 py-2 shadow bg-white rounded-full mr-1 text-[#8B7676] items-center gap-2 ml-2"
                >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 16 15" fill="none">
                    <path d="M14.75 7.24963H5.40027M2.10005 7.24963H0.75M2.10005 7.24963C2.10005 6.82196 2.27386 6.41181 2.58325 6.10941C2.89263 5.807 3.31225 5.63711 3.74978 5.63711C4.18732 5.63711 4.60693 5.807 4.91632 6.10941C5.2257 6.41181 5.39951 6.82196 5.39951 7.24963C5.39951 7.6773 5.2257 8.08745 4.91632 8.38985C4.60693 8.69226 4.18732 8.86215 3.74978 8.86215C3.31225 8.86215 2.89263 8.69226 2.58325 8.38985C2.27386 8.08745 2.10005 7.6773 2.10005 7.24963ZM14.75 12.1367H10.4002M10.4002 12.1367C10.4002 12.5645 10.2259 12.9751 9.91648 13.2776C9.60702 13.5801 9.18731 13.75 8.74968 13.75C8.31214 13.75 7.89253 13.5794 7.58314 13.277C7.27376 12.9746 7.09995 12.5644 7.09995 12.1367M10.4002 12.1367C10.4002 11.709 10.2259 11.2991 9.91648 10.9966C9.60702 10.6942 9.18731 10.5242 8.74968 10.5242C8.31214 10.5242 7.89253 10.6941 7.58314 10.9965C7.27376 11.2989 7.09995 11.7091 7.09995 12.1367M7.09995 12.1367H0.75M14.75 2.36252H12.4003M9.10005 2.36252H0.75M9.10005 2.36252C9.10005 1.93485 9.27386 1.5247 9.58325 1.2223C9.89263 0.91989 10.3122 0.75 10.7498 0.75C10.9664 0.75 11.181 0.791709 11.3811 0.872746C11.5813 0.953782 11.7631 1.07256 11.9163 1.2223C12.0695 1.37203 12.191 1.54979 12.2739 1.74543C12.3568 1.94107 12.3995 2.15076 12.3995 2.36252C12.3995 2.57428 12.3568 2.78396 12.2739 2.9796C12.191 3.17524 12.0695 3.353 11.9163 3.50274C11.7631 3.65248 11.5813 3.77125 11.3811 3.85229C11.181 3.93333 10.9664 3.97504 10.7498 3.97504C10.3122 3.97504 9.89263 3.80515 9.58325 3.50274C9.27386 3.20033 9.10005 2.79018 9.10005 2.36252Z" stroke="#8B7676" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" />
                </svg>
                <span className="font-[vazir] font-bold">فیلتر</span>
            </button>
            { filtersActive &&
                    <button className="flex px-3 py-2 shadow bg-white rounded-full mr-1 text-[#8B7676] items-center gap-2 ml-2" onClick={handleApplyFilter}>  {filtersActive && "حذف فیلتر ها"}  </button>
            }
            </div>

            {/* overlay */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/40 z-40"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* drawer */}
            <div
                className={`fixed bottom-0 left-0 w-full h-[80vh] bg-white rounded-t-[20px] z-50 transition-transform duration-300 overflow-y-auto
                ${open ? "translate-y-0" : "translate-y-full"}`}
            >
                <div className="pt-6">

                    {/* handle */}
                    <div className="w-20 h-2 bg-gray-300 rounded-full mx-auto mb-4 "></div>

                    <div className='flex items-center gap-2 px-4'>
                        <div className='h-[1px] w-full bg-black opacity-40' />
                        <h2 className='text-xl font-[vazir]'>فیلتر</h2>
                        <div className='h-[1px] w-full bg-black opacity-40' />
                    </div>

                    <div className='px-4 font-[vazir] pb-10'>

                        {/* category */}
                        <div className="py-3">
                            <p className="mb-2 text-md font-medium">دسته‌بندی</p>
                            <div className="grid grid-cols-4 gap-2">
                                {HOME_CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => onCategoryChange?.(cat.id)}
                                        className={`rounded-xl border px-2 py-2 text-[12px] transition ${
                                            headBrandId === cat.id
                                                ? 'border-primary bg-primary/10 font-bold text-primary'
                                                : 'border-black/20 bg-white text-black'
                                        }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className='h-[1px] w-full bg-black opacity-40' />

                        {/* city */}
                        <div className="collapse collapse-arrow">
                            <input type="checkbox" />
                            <div className="collapse-title text-md font-medium">شهر</div>
                            <div className="collapse-content">
                                <StateCitySelect
                                    cities={cities}
                                    value={city}
                                    returnObject
                                    onChange={(selected) => setCity(selected)}
                                />
                            </div>
                        </div>

                        <div className='h-[1px] w-full bg-black opacity-40' />

                        {/* brand */}
                        <div className="collapse collapse-arrow">
                            <input type="checkbox" />
                            <div className="collapse-title text-md font-medium">برند</div>
                            <div className="collapse-content">
                                <select
                                    className="select w-full text-black bg-white border-black border-2 font-[vazir]"
                                    value={brand?.BrandId > 0 ? brand.BrandId : ""}
                                    onChange={(e) => {
                                        const selected = brands.find(b => b.BrandId === parseInt(e.target.value));
                                        setBrand(selected);
                                    }}
                                >
                                    <option value="" disabled>انتخاب برند</option>
                                    {brands?.map((b, index) => (
                                        <option className='font-[vazir]' key={index} value={b.BrandId}>{b.Name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className='h-[1px] w-full bg-black opacity-40' />

                        {/* year */}
                        <div className="collapse collapse-arrow">
                            <input type="checkbox" />
                            <div className="collapse-title text-md font-medium">سال تولید</div>
                            <div className="collapse-content">
                                <div className='h-20 flex gap-3 items-center'>
                                    <span>از</span>
                                    <input
                                        className='w-full text-center border-2 border-black h-10 rounded'
                                        type="number"
                                        placeholder="1400"
                                        value={year.min}
                                        onChange={(e) => setYear({ ...year, min: parseInt(e.target.value) || 0 })}
                                    />
                                    <span>تا</span>
                                    <input
                                        className='w-full text-center border-2 border-black h-10 rounded'
                                        type="number"
                                        placeholder="1404"
                                        value={year.max}
                                        onChange={(e) => setYear({ ...year, max: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='h-[1px] w-full bg-black opacity-40' />

                        {/* mileage */}
                        <div className="collapse collapse-arrow">
                            <input type="checkbox" />
                            <div className="collapse-title text-md font-medium">کارکرد</div>
                            <div className="collapse-content">
                                <div className='h-20 flex justify-center'>
                                    <DoubleSlider
                                        min="0" 
                                        max="1000000" 
                                        currentMin={worked.min}
                                        currentMax={worked.max}
                                        onChange={({ min, max }) => setWorked({ min, max })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='h-[1px] w-full bg-black opacity-40' />

                        {/* price */}
                        <div className="collapse collapse-arrow">
                            <input type="checkbox" />
                            <div className="collapse-title text-md font-medium">قیمت</div>
                            <div className="collapse-content">
                                <div className='h-20 flex justify-center mx-auto'>
                                    <DoubleSlider
                                        min="0" 
                                        max="1000000" 
                                        currentMin={price.min}
                                        currentMax={price.max}
                                        onChange={({ min, max }) => setPrice({ min, max })}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleApplyFilter}
                            className='btn mx-auto bg-secondary text-white border-none w-full my-6'
                        >
  {!filtersActive && "اعمال فیلتر"}
                {filtersActive && "حذف فیلتر ها"}
                                        </button>
                        <div className='mx-auto mt-auto h-4 w-24 rounded-t-3xl bg-[#FAFAFA]' />

                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhoneFilterOptions;
