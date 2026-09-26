import React, { useEffect, useState } from 'react'
import * as Yup from 'yup';
import { useFormik } from 'formik';

// Yup schema for price validation
const validationSchema = Yup.object().shape({
    name: Yup.string().required("نام الزامی است"),
    description: Yup.string().required("توضیحات الزامی است"),
});
 

const GalleryInformation = ({ step, setStep , setDescription , setName }) => {
   
    const formik = useFormik({
        initialValues: {
            name: "",
            description: ""
        },
        validationSchema,
        onSubmit: (values) => {
            setDescription(values.description)
            setName(values.name)
            setStep(1); // Proceed to next step
        }
    });

 
    if (step !== 0) return null;
    return (
        <div>
            <div className='px-2 md:px-0 [&_*]:!font-["vazir"]'>
                <div dir='rtl' className='py-2 md:max-w-lg mx-auto px-4'>
                    <div dir='ltr' className='justify-between w-full flex items-center '>
                        <button
                            type='submit'
                            className='btn btn-sm bg-primary text-white border-none'
                            onClick={formik.handleSubmit} // Use Formik submit handler
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 16" fill="none">
                                <path
                                    d="M9.242 15.9735C8.84789 15.9746 8.45747 15.8975 8.09339 15.7466C7.7293 15.5957 7.39878 15.374 7.121 15.0945L0 7.97345L7.121 0.852453C8.254 -0.281547 10.23 -0.281547 11.363 0.852453C11.929 1.41645 12.242 2.16945 12.242 2.97145C12.242 3.71745 11.972 4.42245 11.478 4.97345H16.314C17.968 4.97345 19.314 6.31945 19.314 7.97345C19.314 9.62745 17.968 10.9735 16.314 10.9735H11.478C11.971 11.5225 12.242 12.2255 12.242 12.9715C12.2436 13.3661 12.1667 13.7571 12.0158 14.1217C11.8649 14.4864 11.643 14.8173 11.363 15.0955C11.085 15.3746 10.7544 15.5959 10.3903 15.7466C10.0263 15.8973 9.636 15.9744 9.242 15.9735ZM2.828 7.97345L8.535 13.6805C8.72537 13.8625 8.97861 13.9641 9.242 13.9641C9.50539 13.9641 9.75863 13.8625 9.949 13.6805C10.138 13.4915 10.242 13.2395 10.242 12.9725C10.242 12.7055 10.138 12.4555 9.951 12.2675L6.656 8.97345H16.314C16.5715 8.96193 16.8146 8.85155 16.9927 8.66527C17.1709 8.47899 17.2703 8.23119 17.2703 7.97345C17.2703 7.71572 17.1709 7.46791 16.9927 7.28163C16.8146 7.09536 16.5715 6.98497 16.314 6.97345H6.656L9.949 3.68045C10.0422 3.58795 10.1162 3.47793 10.1668 3.35671C10.2173 3.2355 10.2434 3.10549 10.2434 2.97416C10.2435 2.84283 10.2177 2.71279 10.1673 2.5915C10.1169 2.47022 10.0431 2.36009 9.95 2.26745C9.75971 2.08499 9.50633 1.98304 9.2427 1.98285C8.97907 1.98267 8.72554 2.08426 8.535 2.26645L2.828 7.97345Z"
                                    fill="white"
                                />
                            </svg>
                            <span className='font-[vazir]'>ادامه</span>
                        </button>

                        <button
                            className='btn-sm text-primary bg-transparent shadow-none border-none'
                            onClick={() => setStep(step - 1)}
                        >
                            <span className='font-[vazir] font-bold'>قبلی</span>
                        </button>
                    </div>


                    {/* Price input field */}
                   
                        <div className="form-control w-full mt-4">
                            <label className="form-control w-full relative">
                                <div className="label">
                                    <span className="label-text">نام اتوگالری</span>
                                </div>
                                <input
                                    id="name"
                                    dir="rtl"
                                    type="text"
                                    placeholder="گالری محمد"
                                    className="input focus:outline-primary border-none w-full bg-base-200 font-['vazir']"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.name && formik.errors.name ? (
                                    <div className="text-red-500 text-sm">{formik.errors.price}</div>
                                ) : null}
                            </label>
                        </div>

                    <div className="form-control w-full mt-4">
                        <label className="form-control w-full relative">
                            <div className="label">
                                <span className="label-text">درباره اتوگالری</span>
                            </div>
                            <textarea
                                id="description"
                                dir="rtl"
                                type="text"
                                placeholder="درباره اتوگالری"
                                className=" h-36 p-2  input  focus:outline-primary border-none w-full bg-base-200 font-['vazir']"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.description && formik.errors.description ? (
                                <div className="text-red-500 text-sm">{formik.errors.description}</div>
                            ) : null}
                        </label>
                    </div>
                    

                  
                </div>
            </div>
        </div>
    )
}

export default GalleryInformation;
