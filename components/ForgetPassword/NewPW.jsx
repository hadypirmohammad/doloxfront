import { useFormik } from 'formik';
import { newpw } from '@/utils/Request';
import { ImageURL } from '@/utils/URL';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';

const NewPW = ({ OTP }) => {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

    const formik = useFormik({
        initialValues: {
            new_password: '',
        },
        validationSchema: Yup.object({
            new_password: Yup.string()
                .min(8, 'رمز عبور باید حداقل ۸ حرف باشد')
                .matches(/[a-zA-Z]/, 'رمز عبور باید شامل حداقل یک حرف باشد')
                .matches(/\d/, 'رمز عبور باید شامل حداقل یک عدد باشد')
                .matches(/[!@#$%^&*(),.?":{}|<>]/, 'رمز عبور باید شامل حداقل یک کاراکتر خاص باشد')
                .required('رمز عبور لازم است'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const response = await newpw(OTP, values.new_password);

                if (response.status === 200) {
                    setSuccessMessage('رمز عبور با موفقیت تغییر یافت');
                    setErrorMessage('');
                    toast.success('رمز عبور با موفقیت تغییر یافت');
                    setTimeout(() => {
                        router.push('/');
                    }, 1200);
                } else {
                    // برای خطاهای 400, 404, 422, 500 و ...

                    setErrorMessage('مشکلی پیش آمد، لطفا بعدا دوباره تلاش کنید.');
                    setErrorMessage(`خطا:
مشکلی پیش آمد، لطفا بعدا دوباره تلاش کنید.
                        ${response.status}
                        `);
                    setSuccessMessage('');
                }
            } catch (error) {
                setErrorMessage('مشکلی پیش آمد، لطفا بعدا دوباره تلاش کنید.');
                setSuccessMessage('');
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <section className='mx-auto bg-[#FAFAFA] px-2 py-8 md:py-12'>
            <div className='mx-auto max-w-screen-xl text-black'>
                <div className='flex bg-white md:max-w-2xl max-w-sm mx-auto rounded-[34px] flex-col md:flex-row'>
                    <div className='md:w-1/2 p-8 text-xl'>
                        <h1>رمز جدید را وارد کنید</h1>
                        <form onSubmit={formik.handleSubmit} className='[&_ *]:!font-["vazir"]'>
                            <label className="form-control w-full max-w-xs relative">
                                <div className="label">
                                    <span className="label-text">رمز جدید</span>
                                </div>
                                <input
                                    dir='ltr'
                                    type={showPassword ? 'text' : 'password'}
                                    id='new_password'
                                    placeholder="********"
                                    className="input focus:outline-primary border-none w-full max-w-xs bg-base-200 font-['vazir'] pr-10"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.new_password}
                                />
                                {/* Eye Icon for toggling password visibility */}
                                <span
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-12 cursor-pointer text-gray-500"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 3C5.5 3 1.5 6 1.5 10s4 7 8.5 7 8.5-3 8.5-7-4-7-8.5-7zm0 2c3 0 5.5 2.5 5.5 5.5S13 16 10 16 4.5 13.5 4.5 10 7 5 10 5zm0 1.5c-2.25 0-4 1.75-4 4 0 2.25 1.75 4 4 4 2.25 0 4-1.75 4-4s-1.75-4-4-4zm0 1.5c1.375 0 2.5 1.125 2.5 2.5S11.375 13 10 13s-2.5-1.125-2.5-2.5S8.625 8 10 8z" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path
                                                fillRule="evenodd"
                                                d="M10 3C5.5 3 1.5 6 1.5 10s4 7 8.5 7 8.5-3 8.5-7-4-7-8.5-7zm0 2a5.507 5.507 0 015.5 5.5 5.507 5.507 0 01-5.5 5.5A5.507 5.507 0 014.5 10 5.507 5.507 0 0110 5zm0 1.5c-2.25 0-4 1.75-4 4 0 2.25 1.75 4 4 4s4-1.75 4-4-1.75-4-4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    )}
                                </span>

                                {formik.touched.new_password && formik.errors.new_password ? (
                                    <div className="text-red-500 text-xs">{formik.errors.new_password}</div>
                                ) : null}
                            </label>

                            {errorMessage && (
                                <div className="text-red-500 text-xs mt-2">{errorMessage}</div>
                            )}
                            {successMessage && (
                                <div className="text-green-500 text-xs mt-2">{successMessage}</div>
                            )}

                            <div className='flex justify-between items-center'>
                                <button
                                    type='submit'
                                    className='btn bg-primary border-none text-white h-10 mt-2'
                                    disabled={formik.isSubmitting}
                                >
                                    {formik.isSubmitting ? 'در حال ارسال...' : 'تغییر رمز'}
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className='md:w-1/2 bg-gradient-red flex items-center flex-col justify-center p-4 md:rounded-l-[34px] rounded-b-[34px] md:rounded-br-[0px]'>
                        <Image className='px-4' src={ImageURL + 'logincar.png'} width={252.29} height={91} alt="hero image" />
                        <h2 className='w-full text-center pt-2 text-sm text-white'>
                            دولوکس، جایی برای فروش رایگان خودروهای شما!
                        </h2>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewPW;
