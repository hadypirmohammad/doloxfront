import { useFormik } from 'formik';
import * as Yup from 'yup';

import Link from 'next/link';
import React, { useState } from 'react';
import { createUserReq } from '@/utils/Request';
import AuthShell, {
    ArrowIcon,
    EyeToggle,
    LockFieldIcon,
    PhoneFieldIcon,
    authFieldInput,
    authFieldWrap,
    authSubmitButton,
} from '@/components/Login/AuthShell';

const RegisterSection = ({ setstep, setphonenumber }) => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            phonenumber: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            phonenumber: Yup.string()
                .matches(/^09\d{9}$/, 'شماره تلفن نامعتبر است')
                .required('شماره تلفن لازم است'),
            password: Yup.string()
                .min(8, 'رمز عبور باید حداقل ۸ حرف باشد')
                .matches(/[a-zA-Z]/, 'رمز عبور باید شامل حداقل یک حرف باشد')
                .matches(/\d/, 'رمز عبور باید شامل حداقل یک عدد باشد')
                .matches(/[A-Z]/, 'رمز عبور باید شامل حداقل یک حرف بزرگ باشد')
                .required('رمز عبور لازم است'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'رمزهای عبور مطابقت ندارند')
                .required('تکرار رمز عبور لازم است'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const response = await createUserReq(values.phonenumber, values.password, values.confirmPassword);
                if (response.ok) {
                    setphonenumber(values.phonenumber)
                    setstep(1)
                }
                if (response.message) {
                    setErrorMessage(response.message);
                }
            } catch (error) {
                setErrorMessage('خطایی رخ داد. دوباره تلاش کنید.', error);
            } finally {
                setSubmitting(false);
            }
        },
    });

    const fieldError = (name) =>
        formik.touched[name] && formik.errors[name] ? (
            <p className='m-0 pt-1.5 text-right text-[11.5px] text-red-500'>{formik.errors[name]}</p>
        ) : null;

    return (
        <AuthShell
            title='ساخت حساب کاربری'
            subtitle='شماره موبایل و رمز عبور خود را وارد کنید'
            footer={
                <p className='m-0 pt-4 text-center text-xs leading-[1.8] text-[#a3abb6]'>
                    ثبت نام شما به معنای پذیرفتن <Link href='/rules' className='font-semibold text-primary'>قوانین دولوکس</Link> است.
                </p>
            }
        >
            <form onSubmit={formik.handleSubmit} className='pt-5'>
                <label dir='ltr' className={authFieldWrap}>
                    <PhoneFieldIcon />
                    <input
                        dir='ltr'
                        type='tel'
                        inputMode='numeric'
                        id='phonenumber'
                        placeholder='09121234567'
                        className={authFieldInput}
                        {...formik.getFieldProps('phonenumber')}
                        disabled={formik.isSubmitting}
                    />
                    {formik.values.phonenumber ? (
                        <button
                            type='button'
                            aria-label='پاک کردن'
                            onClick={() => formik.setFieldValue('phonenumber', '')}
                            className='flex-none'
                        >
                            <svg width='12' height='12' viewBox='0 0 14 14' fill='none' stroke='#b9c0c9' strokeWidth='1.4' strokeLinecap='round'>
                                <line x1='1.5' y1='1.5' x2='12.5' y2='12.5' />
                                <line x1='12.5' y1='1.5' x2='1.5' y2='12.5' />
                            </svg>
                        </button>
                    ) : null}
                </label>
                {fieldError('phonenumber')}

                <label dir='ltr' className={`${authFieldWrap} mt-3.5`}>
                    <LockFieldIcon />
                    <input
                        dir='ltr'
                        type={showPassword ? 'text' : 'password'}
                        id='password'
                        placeholder='••••••••'
                        className={authFieldInput}
                        {...formik.getFieldProps('password')}
                        disabled={formik.isSubmitting}
                    />
                    <EyeToggle visible={showPassword} onToggle={() => setShowPassword((prev) => !prev)} />
                </label>
                {fieldError('password')}

                <label dir='ltr' className={`${authFieldWrap} mt-3.5`}>
                    <LockFieldIcon />
                    <input
                        dir='ltr'
                        type={showConfirmPassword ? 'text' : 'password'}
                        id='confirmPassword'
                        placeholder='تکرار رمز عبور'
                        className={authFieldInput}
                        {...formik.getFieldProps('confirmPassword')}
                        disabled={formik.isSubmitting}
                    />
                    <EyeToggle visible={showConfirmPassword} onToggle={() => setShowConfirmPassword((prev) => !prev)} />
                </label>
                {fieldError('confirmPassword')}

                {errorMessage ? (
                    <p className='m-0 pt-2.5 text-right text-[12px] text-red-500'>{errorMessage}</p>
                ) : null}

                <div className='flex items-center justify-between pt-3'>
                    <span className='text-[12px] text-[#a3abb6]'>حساب کاربری دارید؟</span>
                    <Link href='/login' className='text-[12px] font-medium text-primary'>
                        ورود
                    </Link>
                </div>

                <button type='submit' disabled={formik.isSubmitting} dir='ltr' className={authSubmitButton}>
                    {formik.isSubmitting ? (
                        <span className='loading loading-spinner loading-sm' />
                    ) : (
                        <>
                            <span>دریافت کد تایید</span>
                            <ArrowIcon />
                        </>
                    )}
                </button>
            </form>
        </AuthShell>
    );
};

export default RegisterSection;
