import React, { useEffect, useMemo, useState } from 'react'
import { getSalsByModel } from '@/utils/Request'
import { normalizeSearchTerm, toPersianDigits } from '@/utils/Cal'

const Year = ({ step, setStep, setYear, model }) => {

    const [yeardata, setyeardata] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        const fetchModels = async () => {

            try {
                const fetchedModel = await getSalsByModel(model);
                setyeardata(Array.isArray(fetchedModel) ? fetchedModel : []);
            } catch (error) {
                setyeardata([]);
            }
        };

        fetchModels();
    }, [model]);

    const uniqueYears = useMemo(() => {
        const seen = new Set();
        return yeardata.filter((item) => {
            const key = item?.YearId ?? item?.Year;
            if (key === undefined || key === null || seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }, [yeardata]);

    const visibleYears = useMemo(() => {
        const term = normalizeSearchTerm(searchInput);
        if (!term) return uniqueYears;
        return uniqueYears.filter((item) => normalizeSearchTerm(item?.Year).includes(term));
    }, [uniqueYears, searchInput]);

    const goNext = () => {
        if (!selected) return;
        setYear(selected);
        setStep(3);
    };

    if (step !== 2) return (<></>)

    return (
        <div dir='rtl' className='px-4 pt-5 sm:px-5'>
            <div className='mx-auto max-w-xl rounded-[22px] border border-[#EEF1F6] bg-white p-4 shadow-[0_2px_10px_rgba(20,36,63,.04)] sm:p-5'>
                <div className='flex items-center gap-2'>
                    <span className='h-5 w-[3px] rounded-[3px] bg-primary' />
                    <h2 className='m-0 text-[17px] font-bold text-secondary'>سال خودرو</h2>
                </div>
                <p className='m-0 pt-2.5 text-[13px] text-[#98A2B3]'>سال دقیق تولید خودرو را انتخاب کنید.</p>

                <label className='mt-4 flex items-center gap-3 rounded-2xl border border-[#EAEEF4] bg-white px-4 py-3 focus-within:border-primary'>
                    <svg width='19' height='19' viewBox='0 0 24 24' fill='none' stroke='#14243F' strokeWidth='1.8' strokeLinecap='round' className='flex-none'>
                        <circle cx='11' cy='11' r='7' />
                        <path d='M20 20l-3.6-3.6' />
                    </svg>
                    <input
                        type='text'
                        className="min-w-0 flex-1 border-0 bg-transparent text-right text-sm text-secondary outline-none font-['vazir'] placeholder:text-[#A3ADBC]"
                        placeholder='جست و جو سال'
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                </label>

                {visibleYears.length === 0 ? (
                    <p className="py-10 text-center font-['vazir'] text-sm text-[#8A8A8A]">سالی یافت نشد</p>
                ) : (
                    <div className='mt-4 grid grid-cols-4 gap-2 rounded-2xl border border-[#EEF1F6] p-3 sm:grid-cols-5'>
                        {visibleYears.map((item, index) => {
                            const active = (selected?.YearId ?? selected?.Year) === (item?.YearId ?? item?.Year);
                            return (
                                <button
                                    key={item.YearId ?? item.Year ?? index}
                                    type='button'
                                    onClick={() => setSelected(item)}
                                    className={`rounded-xl border py-3 text-center text-[12.5px] font-bold transition-colors ${
                                        active
                                            ? 'border-primary bg-primary text-white'
                                            : 'border-[#EDF0F5] bg-white text-secondary hover:border-primary'
                                    }`}
                                >
                                    {toPersianDigits(item.Year)}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className='mx-auto mt-4 flex max-w-xl gap-3'>
                <button
                    type='button'
                    onClick={() => setStep(1)}
                    className='flex flex-1 items-center justify-center gap-2.5 rounded-2xl border border-[#E7EBF1] bg-white py-3.5 text-[14.5px] font-bold text-secondary'
                >
                    <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                        <path d='M5 12h14M12 5l7 7-7 7' />
                    </svg>
                    مرحله قبل
                </button>
                <button
                    type='button'
                    onClick={goNext}
                    disabled={!selected}
                    className={`flex flex-1 flex-row-reverse items-center justify-center gap-2.5 rounded-2xl py-3.5 text-[14.5px] font-bold text-white transition-opacity ${
                        selected ? 'bg-gradient-orange' : 'cursor-not-allowed bg-[#F1B392]'
                    }`}
                >
                    <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                        <path d='M19 12H5M12 19l-7-7 7-7' />
                    </svg>
                    مرحله بعد
                </button>
            </div>
        </div>
    )
}
export default Year
