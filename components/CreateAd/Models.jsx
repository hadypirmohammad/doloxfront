import { getModelsByBrand } from '@/utils/Request';
import { resolveBackendMediaUrl } from '@/utils/media';
import { normalizeSearchTerm } from '@/utils/Cal';
import Image from 'next/image';
import React, { useEffect, useMemo, useState } from 'react'

const BRAND_IMAGE_FALLBACK = '/media/images/samplebrand.png';

const Models = ({ brand, setStep, step, setModel }) => {

    const [modelData, setModelData] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [brandImage, setBrandImage] = useState(BRAND_IMAGE_FALLBACK);

    useEffect(() => {
        const fetchModels = async () => {
            if (!brand?.BrandId) return;
            try {
                const fetchedModel = await getModelsByBrand(brand);
                setModelData(Array.isArray(fetchedModel) ? fetchedModel : []);
            } catch (error) {
                setModelData([]);
            }
        };

        fetchModels();
    }, [brand]);

    useEffect(() => {
        setBrandImage(resolveBackendMediaUrl(brand?.Image, BRAND_IMAGE_FALLBACK));
    }, [brand]);

    const visibleModels = useMemo(() => {
        const term = normalizeSearchTerm(searchInput);
        if (!term) return modelData;
        return modelData.filter((model) => normalizeSearchTerm(model?.Name).includes(term));
    }, [modelData, searchInput]);

    if (step !== 1) return (<></>)

    return (
        <div dir='rtl' className='px-4 pt-5 sm:px-5'>
            <div className='mx-auto flex max-w-xl items-center justify-between gap-3 rounded-[18px] border border-[#EEF1F6] bg-white p-3.5 shadow-[0_2px_10px_rgba(20,36,63,.04)]'>
                <div className='flex min-w-0 flex-1 items-center gap-3'>
                    <span className='flex h-[46px] w-[46px] flex-none items-center justify-center rounded-xl border border-[#E7EBF1] bg-white'>
                        <Image
                            className='h-8 w-10 object-contain'
                            src={brandImage}
                            alt=''
                            width={40}
                            height={32}
                            onError={() => setBrandImage(BRAND_IMAGE_FALLBACK)}
                        />
                    </span>
                    <div className='min-w-0'>
                        <p className='m-0 text-[11.5px] text-[#A3ADBC]'>برند انتخاب شده</p>
                        <p className='m-0 truncate pt-1 text-base font-bold text-secondary'>{brand?.Name}</p>
                    </div>
                </div>
                <button
                    type='button'
                    onClick={() => setStep(0)}
                    className='flex flex-none items-center gap-2 rounded-[13px] border border-[#E7EBF1] px-3.5 py-2.5 text-[13px] font-semibold text-[#42536B]'
                >
                    تغییر برند
                    <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                        <path d='M15 18l-6-6 6-6' />
                    </svg>
                </button>
            </div>

            <div className='mx-auto mt-3.5 max-w-xl rounded-[20px] border border-[#EEF1F6] bg-white p-4 shadow-[0_2px_10px_rgba(20,36,63,.04)] sm:p-5'>
                <div className='flex items-center gap-2'>
                    <span className='h-[18px] w-[3px] rounded-[3px] bg-primary' />
                    <h2 className='m-0 text-[15.5px] font-bold text-secondary'>مدل خودرو را انتخاب کنید</h2>
                </div>

                <label className='mt-3.5 flex items-center gap-3 rounded-2xl border border-[#EAEEF4] bg-white px-4 py-3 focus-within:border-primary'>
                    <svg width='19' height='19' viewBox='0 0 24 24' fill='none' stroke='#14243F' strokeWidth='1.8' strokeLinecap='round' className='flex-none'>
                        <circle cx='11' cy='11' r='7' />
                        <path d='M20 20l-3.6-3.6' />
                    </svg>
                    <input
                        type='text'
                        className="min-w-0 flex-1 border-0 bg-transparent text-right text-sm text-secondary outline-none font-['vazir'] placeholder:text-[#A3ADBC]"
                        placeholder='جستجو در مدل‌ها...'
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                </label>

                {visibleModels.length === 0 ? (
                    <p className="py-10 text-center font-['vazir'] text-sm text-[#8A8A8A]">مدلی یافت نشد</p>
                ) : (
                    <div className='mt-2.5 flex flex-col gap-1.5'>
                        {visibleModels.map((model, index) => (
                            <div
                                key={model.ModelId || index}
                                className='flex cursor-pointer flex-row-reverse items-center justify-between rounded-[13px] border border-[#EEF1F6] bg-white px-3.5 py-3.5 transition-colors hover:border-primary'
                                onClick={() => {
                                    setModel(model)
                                    setStep(2)
                                }}
                            >
                                <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='#8E9AAC' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='flex-none'>
                                    <path d='M15 18l-6-6 6-6' />
                                </svg>
                                <span className='text-sm font-semibold text-secondary'>{model.Name}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Models
