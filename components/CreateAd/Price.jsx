import React, { useEffect, useState } from 'react'
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { formatNumber } from '@/utils/Cal';

// Yup schema for price validation
const validationSchema = Yup.object().shape({
    price: Yup.number()
        .nullable()
        .test('is-positive', 'قیمت باید بیشتر از ۰ باشد', value => value === null || value > 0)
});

const tabs = [
    {
        title: 'نقدی',
        icon: (
            <>
                <circle cx='9' cy='9' r='5.5' />
                <path d='M14.5 6.3A5.5 5.5 0 1 1 12 17' />
            </>
        ),
    },
    {
        title: 'اقساط',
        icon: (
            <>
                <path d='M19 5 5 19' />
                <circle cx='7.5' cy='7.5' r='2.5' />
                <circle cx='16.5' cy='16.5' r='2.5' />
            </>
        ),
    },
    {
        title: 'توافقی',
        icon: (
            <>
                <path d='M11 6.5 8.8 4.7a2 2 0 0 0-2.6.1L3 7.8l3.5 3.6' />
                <path d='M13 6.5h3.6l4.4 4.2-3 3.1-2.2-2' />
                <path d='m9 13 2.2 2.2M11.5 11l3 3M8 15.5l1.6 1.6' />
            </>
        ),
    },
];

const Price = ({ step, setStep, setPrice, setInstallments, setRentorsale }) => {


    const [category, setCategory] = useState("نقدی");
    const [isRent, setIsRent] = useState(false); // For rent or sale option

    const formik = useFormik({
        initialValues: {
            price: ""
        },
        validationSchema,
        onSubmit: (values) => {
            if (category === "توافقی") {
                setPrice(null); // Set price to null if "توافقی" is selected
            } else {
                setPrice(values.price); // Set the price if نقدی or اقساط is selected
            }
            setRentorsale(isRent); // Set if rent  true
            setStep(6); // Proceed to next step
        }
    });

    useEffect(() => {
        setInstallments(category === "اقساط")
    }, [category]);

    if (step !== 5) return null;
    return (
        <div dir='rtl' className='px-4 pt-5 sm:px-5 [&_*]:!font-["vazir"]'>
            <div className='mx-auto max-w-xl rounded-[20px] border border-[#EEF1F6] bg-white p-4 shadow-[0_2px_10px_rgba(20,36,63,.04)] sm:p-5'>
                <div className='flex flex-row-reverse items-center justify-between gap-3'>
                    <button
                        type='button'
                        onClick={formik.handleSubmit}
                        className='flex flex-row-reverse items-center gap-2 rounded-xl bg-gradient-orange px-4 py-2.5 text-[12.5px] font-bold text-white'
                    >
                        <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                            <path d='M19 12H5M12 19l-7-7 7-7' />
                        </svg>
                        ادامه
                    </button>
                    <div className='flex items-center gap-2'>
                        <span className='h-5 w-[3px] rounded-[3px] bg-primary' />
                        <h2 className='m-0 text-[17px] font-bold text-secondary'>قیمت خودرو</h2>
                    </div>
                </div>

                <div className='mt-4 flex overflow-hidden rounded-[14px] border border-[#EEF1F6]'>
                    {tabs.map((tab) => {
                        const active = category === tab.title;
                        return (
                            <div
                                key={tab.title}
                                onClick={() => {
                                    setCategory(tab.title);
                                    if (tab.title === 'توافقی') formik.setFieldValue('price', null);
                                }}
                                className={`flex flex-1 cursor-pointer items-center justify-center gap-2 py-3.5 text-sm transition-colors ${
                                    active
                                        ? 'rounded-xl bg-gradient-orange font-bold text-white'
                                        : 'font-semibold text-[#42536B]'
                                }`}
                            >
                                <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.7' strokeLinecap='round' strokeLinejoin='round'>
                                    {tab.icon}
                                </svg>
                                {tab.title}
                            </div>
                        );
                    })}
                </div>

                {category !== "توافقی" && (
                    <div className='mt-4'>
                        <p className='m-0 pb-2 text-[12.5px] text-[#A3ADBC]'>قیمت درخواستی (تومان)</p>
                        <label className='flex items-center justify-between gap-3 rounded-[14px] border border-[#EDF0F5] bg-[#F4F6F9] px-4 py-3.5 focus-within:border-primary'>
                            <input
                                id='price'
                                dir='ltr'
                                type='number'
                                placeholder='200000000'
                                className="min-w-0 flex-1 border-0 bg-transparent text-left text-sm text-secondary outline-none placeholder:text-[#A3ADBC]"
                                value={formik.values.price}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            <span className='flex-none text-[14.5px] font-bold text-secondary'>تومان</span>
                        </label>
                        {formik.values.price > 0 && (
                            <p className='m-0 pt-2 text-[12.5px] text-[#8B94A5]'>{formatNumber(formik.values.price)} تومان</p>
                        )}
                        {formik.touched.price && formik.errors.price ? (
                            <div className='pt-1.5 text-sm text-red-500'>{formik.errors.price}</div>
                        ) : null}
                    </div>
                )}

                <div className='mt-4 flex items-center gap-3 rounded-2xl bg-[#FFF3EA] p-3.5'>
                    <span className='flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#FFE3D0] text-primary'>
                        <svg width='19' height='19' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.9' strokeLinecap='round' strokeLinejoin='round'>
                            <path d='M3.5 16.5 9 11l3.5 3.5L20.5 6.5' />
                            <path d='M15.5 6.5h5v5' />
                        </svg>
                    </span>
                    <div className='flex-1'>
                        <p className='m-0 text-sm font-bold text-secondary'>قیمت مناسب، فروش سریع‌تر</p>
                        <p className='m-0 pt-1.5 text-[12.5px] text-[#8B94A5]'>قیمت را نزدیک به نرخ روز بازار ثبت کنید تا زودتر خریدار پیدا کنید.</p>
                    </div>
                </div>

                <label className='mt-4 flex cursor-pointer flex-row-reverse items-center justify-between gap-3'>
                    <span className='text-[15px] font-bold text-secondary'>خودرو را اجاره هم می دهم</span>
                    <input
                        type='checkbox'
                        checked={isRent}
                        onChange={() => setIsRent(!isRent)}
                        className='checkbox h-6 w-6 rounded-[7px] border-[1.5px] border-primary [--chkbg:theme(colors.primary)] [--chkfg:white]'
                    />
                </label>

                <div className='mt-4 flex items-center gap-2.5 rounded-[14px] bg-[#F4F6F9] p-3.5'>
                    <svg width='19' height='19' viewBox='0 0 24 24' fill='none' stroke='#A3ADBC' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' className='flex-none'>
                        <path d='M12 3 5 6v6c0 4 3 7.3 7 9 4-1.7 7-5 7-9V6z' />
                        <path d='m9 12 2 2 4-4' />
                    </svg>
                    <p className='m-0 text-[12.5px] text-[#98A2B3]'>قیمت وارد شده فقط برای نمایش به خریداران خواهد بود و قابل ویرایش است.</p>
                </div>
            </div>

            <div className='mx-auto mt-4 flex max-w-xl gap-3'>
                <button
                    type='button'
                    onClick={() => setStep(step - 1)}
                    className='flex flex-1 items-center justify-center gap-2.5 rounded-2xl border border-[#E7EBF1] bg-white py-3.5 text-[14.5px] font-bold text-secondary'
                >
                    <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                        <path d='M5 12h14M12 5l7 7-7 7' />
                    </svg>
                    مرحله قبل
                </button>
                <button
                    type='button'
                    onClick={formik.handleSubmit}
                    className='flex flex-1 flex-row-reverse items-center justify-center gap-2.5 rounded-2xl bg-gradient-orange py-3.5 text-[14.5px] font-bold text-white'
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

export default Price;
