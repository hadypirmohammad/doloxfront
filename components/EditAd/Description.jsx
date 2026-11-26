import React, { useMemo } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import EditStep from './EditStep';

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

            setStep(3);
        },
    });

    if (step !== 2) return null;

    return (
        <EditStep
            title='توضیحات و کارکرد'
            hint='در توضیحات به نکات چشم‌گیر خودرو اشاره کنید.'
            onPrev={() => setStep(step - 1)}
            onNext={formik.handleSubmit}
        >
            {/* Description */}
            <textarea
                className='h-36 w-full resize-none rounded-[14px] border border-[#E7EBF1] bg-[#FAFBFC] p-3.5 text-[14px] leading-[1.9] text-secondary outline-none focus:border-primary'
                placeholder='توضیحات'
                {...formik.getFieldProps('description')}
            />
            {formik.touched.description && formik.errors.description && (
                <div className='pt-1.5 text-sm text-red-500'>{formik.errors.description}</div>
            )}

            {/* Status */}
            <div className='mt-4 grid grid-cols-2 gap-2'>
                {['صفر', 'کارکرده'].map((item) => (
                    <button
                        key={item}
                        type='button'
                        onClick={() => formik.setFieldValue('status', item)}
                        className={`h-11 rounded-[12px] border text-[14px] font-bold transition-colors ${
                            formik.values.status === item
                                ? 'border-primary bg-[#FFF3EA] text-primary'
                                : 'border-[#E7EBF1] bg-white text-[#42536B]'
                        }`}
                    >
                        {item}
                    </button>
                ))}
            </div>

            {/* Kilometer Field */}
            {formik.values.status === 'کارکرده' && (
                <label className='mt-4 block'>
                    <span className='block pb-1.5 text-[13.5px] font-bold text-secondary'>کارکرد</span>
                    <span className='flex h-12 items-center gap-2 rounded-[14px] border border-[#E7EBF1] bg-[#FAFBFC] px-3.5 focus-within:border-primary'>
                        <input
                            dir='ltr'
                            type='number'
                            placeholder='200000'
                            className='h-full w-full bg-transparent text-[14px] text-secondary outline-none'
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
                        <span className='flex-none text-[12.5px] text-[#8B94A5]'>کیلومتر</span>
                    </span>
                    {formik.touched.kilometer && formik.errors.kilometer && (
                        <span className='block pt-1.5 text-sm text-red-500'>{formik.errors.kilometer}</span>
                    )}
                </label>
            )}
        </EditStep>
    );
};

export default Description;
