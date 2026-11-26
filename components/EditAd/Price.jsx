import React, { useEffect, useState, useMemo } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import EditStep from './EditStep';

// Validation
const validationSchema = Yup.object().shape({
    price: Yup.number()
        .nullable()
        .test(
            'is-positive',
            'قیمت باید بیشتر از ۰ باشد',
            value => value === null || value === '' || value > 0
        )
});

const Price = ({
    step,
    setStep,
    setPrice,
    setInstallments,
    setRentorsale,
    Price: initialPrice = null,
    Installments = false,
    RentorSale = false
}) => {

    // ✅ Detect initial category
    const initialCategory = useMemo(() => {
        if (initialPrice === null) return "توافقی";
        if (Installments) return "اقساط";
        return "نقدی";
    }, [initialPrice, Installments]);

    const [category, setCategory] = useState(initialCategory);
    const [isRent, setIsRent] = useState(RentorSale);

    // ✅ Sync when props change (edit mode)
    useEffect(() => {
        if (initialPrice === null) setCategory("توافقی");
        else if (Installments) setCategory("اقساط");
        else setCategory("نقدی");

        setIsRent(RentorSale);
    }, [initialPrice, Installments, RentorSale]);

    const formik = useFormik({
        initialValues: {
            price: initialPrice ?? ""
        },
        enableReinitialize: true,
        validationSchema,

        onSubmit: (values) => {

            if (category === "توافقی") {
                setPrice(null);
            } else {
                setPrice(values.price ? Number(values.price) : null);
            }

            setInstallments(category === "اقساط");
            setRentorsale(isRent);

            setStep(4);
        }
    });

    if (step !== 3) return null;

    return (
        <EditStep
            title='قیمت'
            hint='نوع قیمت و مبلغ را مشخص کنید.'
            onPrev={() => setStep(step - 1)}
            onNext={formik.handleSubmit}
        >
            {/* Category Selector */}
            <div className='grid grid-cols-3 gap-2'>
                {["نقدی", "اقساط", "توافقی"].map((item) => (
                    <button
                        key={item}
                        type='button'
                        onClick={() => {
                            setCategory(item);
                            if (item === "توافقی") {
                                formik.setFieldValue('price', '');
                            }
                        }}
                        className={`h-11 rounded-[12px] border text-[14px] font-bold transition-colors ${
                            category === item
                                ? 'border-primary bg-[#FFF3EA] text-primary'
                                : 'border-[#E7EBF1] bg-white text-[#42536B]'
                        }`}
                    >
                        {item}
                    </button>
                ))}
            </div>

            {/* Price Input */}
            {category !== "توافقی" && (
                <label className='mt-4 block'>
                    <span className='block pb-1.5 text-[13.5px] font-bold text-secondary'>قیمت</span>
                    <span className='flex h-12 items-center gap-2 rounded-[14px] border border-[#E7EBF1] bg-[#FAFBFC] px-3.5 focus-within:border-primary'>
                        <input
                            dir='ltr'
                            type='number'
                            placeholder='200000'
                            className='h-full w-full bg-transparent text-[14px] text-secondary outline-none'
                            {...formik.getFieldProps('price')}
                        />
                        <span className='flex-none text-[12.5px] text-[#8B94A5]'>تومان</span>
                    </span>
                    {formik.touched.price && formik.errors.price && (
                        <span className='block pt-1.5 text-sm text-red-500'>{formik.errors.price}</span>
                    )}
                </label>
            )}

            {/* Rent Checkbox */}
            <label className='mt-4 flex cursor-pointer items-center gap-2.5 rounded-[14px] bg-[#FAFBFC] px-3.5 py-3'>
                <input
                    type='checkbox'
                    checked={isRent}
                    onChange={() => setIsRent(!isRent)}
                    className='checkbox checkbox-sm border-orange-400 [--chkbg:theme(colors.primary)] [--chkfg:white]'
                />
                <span className='text-[14px] text-secondary'>خودرو را اجاره هم می‌دهم</span>
            </label>
        </EditStep>
    );
};

export default Price;
