import React, { useMemo } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Description = ({
    step,
    setStep,
    setKilometer,
    setDescription,
    setWheelnumber,
    setWeight,
    setMaxweight,
    kilometer = null,
    description = null,
    wheelnumber = null,
    weight = null,
    maxweight = null
}) => {

    // ✅ Build initial values safely
    const initialValues = useMemo(() => {
        const isZero = kilometer === 0;

        return {
            description: description || '',
            status: isZero ? 'صفر' : 'کارکرده',
            kilometer: isZero ? '' : (kilometer || ''),
            wheelnumber: wheelnumber || '',
            weight: weight || '',
            maxweight: maxweight || ''
        };
    }, [description, kilometer, wheelnumber, weight, maxweight]);

    const formik = useFormik({
        initialValues,
        enableReinitialize: true,

        validationSchema: Yup.object({
            description: Yup.string().required('توضیحات الزامی است'),
            status: Yup.string().required('لطفا یک گزینه را انتخاب کنید'),
            kilometer: Yup.number()
                .min(0, 'کیلومتر نمی‌تواند منفی باشد')
                .nullable()
        }),

        onSubmit: (values) => {
            setDescription(values.description);

            const finalKilometer =
                values.status === 'صفر'
                    ? 0
                    : values.kilometer || 0;

            setKilometer(finalKilometer);
            console.log(values.description, finalKilometer);

            setStep(3);
        },
    });

    if (step !== 2) return null;

    return (
        <div>
            <div className='px-2 md:px-0 [&_*]:!font-["vazir"]'>
                <div dir='rtl' className='py-2 md:w-96 mx-auto px-4'>

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

                    {/* Description */}
                    <label className="form-control">
                        <div className="label">
                            <span className="label-text">
                                در توضیحات به نکات چشم گیر اشاره کنید
                            </span>
                        </div>

                        <textarea
                            className="textarea textarea-bordered h-36 bg-base-200 focus:outline-primary text-black w-full"
                            placeholder="توضیحات"
                            {...formik.getFieldProps('description')}
                        />

                        {formik.touched.description &&
                            formik.errors.description && (
                                <div className="text-red-500 text-sm">
                                    {formik.errors.description}
                                </div>
                            )}
                    </label>

                    {/* Status */}
                    <div className="form-control w-full mt-4">
                        <div className="flex">
                            <label className="flex items-center ml-4">
                                <input
                                    type="radio"
                                    name="status"
                                    value="صفر"
                                    className="radio"
                                    onChange={formik.handleChange}
                                    checked={formik.values.status === 'صفر'}
                                />
                                <span className="mr-2">صفر</span>
                            </label>

                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="status"
                                    value="کارکرده"
                                    className="radio"
                                    onChange={formik.handleChange}
                                    checked={formik.values.status === 'کارکرده'}
                                />
                                <span className="mr-2">کارکرده</span>
                            </label>
                        </div>

                        {/* Kilometer Field */}
                        {formik.values.status === 'کارکرده' && (
                            <label className="form-control w-full relative">
                                <div className="label">
                                    <span className="label-text">
                                        کارکرد
                                    </span>
                                </div>

                                <input
                                    dir="ltr"
                                    type="number"
                                    placeholder="200000"
                                    className="input focus:outline-primary border-none w-full bg-base-200"
                                    {...formik.getFieldProps('kilometer')}
                                    onBlur={(e) => {
                                        const value = e.target.value;
                                        formik.setFieldValue(
                                            'kilometer',
                                            value
                                                ? parseInt(value, 10)
                                                : ''
                                        );
                                    }}
                                />

                                {formik.touched.kilometer &&
                                    formik.errors.kilometer && (
                                        <div className="text-red-500 text-sm">
                                            {formik.errors.kilometer}
                                        </div>
                                    )}

                                <span className='absolute top-12 right-6'>
                                    کیلومتر
                                </span>
                            </label>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Description;