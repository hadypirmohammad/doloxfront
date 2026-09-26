import React, { useEffect, useState, useMemo } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';

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
        <div>
            <div className='px-2 md:px-0 [&_*]:!font-["vazir"]'>
                <div dir='rtl' className='py-2 md:max-w-lg mx-auto px-4'>

                    {/* Buttons */}
                    <div dir='ltr' className='justify-between w-full flex items-center'>
                        <button
                            type='button'
                            className='btn btn-sm bg-primary text-white border-none'
                            onClick={formik.handleSubmit}
                        >
                            ادامه
                        </button>

                        <button
                            type='button'
                            className='btn-sm text-primary bg-transparent shadow-none border-none'
                            onClick={() => setStep(step - 1)}
                        >
                            قبلی
                        </button>
                    </div>

                    {/* Category Selector */}
                    <div className='flex bg-gradient-red mx-auto justify-between max-w-md w-full text-white rounded-[50px] px-7 py-1 mt-8'>
                        {["نقدی", "اقساط", "توافقی"].map((item) => (
                            <div
                                key={item}
                                className={`font-["vazir-bold"] w-full text-center py-2 rounded-full cursor-pointer ${category === item ? "text-black bg-white" : ""
                                    }`}
                                onClick={() => {
                                    setCategory(item);
                                    if (item === "توافقی") {
                                        formik.setFieldValue('price', '');
                                    }
                                }}
                            >
                                {item}
                            </div>
                        ))}
                    </div>

                    {/* Price Input */}
                    {category !== "توافقی" && (
                        <div className="form-control w-full mt-4">
                            <label className="form-control w-full relative">
                                <div className="label">
                                    <span className="label-text">قیمت</span>
                                </div>

                                <input
                                    dir="ltr"
                                    type="number"
                                    placeholder="200000"
                                    className="input focus:outline-primary border-none w-full bg-base-200"
                                    {...formik.getFieldProps('price')}
                                />

                                <span className='absolute top-12 right-6'>
                                    تومان
                                </span>

                                {formik.touched.price && formik.errors.price && (
                                    <div className="text-red-500 text-sm">
                                        {formik.errors.price}
                                    </div>
                                )}
                            </label>
                        </div>
                    )}

                    {/* Rent Checkbox */}
                    <div className='flex gap-2 mt-4'>
                        <input
                            type="checkbox"
                            checked={isRent}
                            onChange={() => setIsRent(!isRent)}
                            className="checkbox border-orange-400 [--chkbg:theme(colors.primary)] [--chkfg:white]"
                        />
                        <p>خودرو را اجاره هم می دهم</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Price;