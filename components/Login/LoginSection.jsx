import Link from 'next/link';
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { loginReq } from '@/utils/Request';
import { setCookie } from 'nookies';
import { useRouter } from 'next/router';
import AuthShell, {
    ArrowIcon,
    EyeToggle,
    LockFieldIcon,
    PhoneFieldIcon,
    authFieldInput,
    authFieldWrap,
    authSubmitButton,
} from './AuthShell';

const LoginSection = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            phonenumber: '',
            password: '',
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
        }),
        onSubmit: async (values) => {
            setLoading(true);
            setMessage("");
            try {
                const response = await loginReq(values.phonenumber, values.password);

                if (response.error) {
                    setMessage(response.message);
                } else if (response.token) {
                    setCookie(null, 'access', response.token, {
                        maxAge: 1024 * 60 * 60,
                        path: '/',
                        secure: true,
                    });

                    await router.push("/dashboard");
                }
            } catch (error) {
                setMessage(error.message);
            } finally {
                setLoading(false);
            }
        }
    });

    const fieldError = (name) =>
        formik.touched[name] && formik.errors[name] ? (
            <p className='m-0 pt-1.5 text-right text-[11.5px] text-red-500'>{formik.errors[name]}</p>
        ) : null;

    return (
        <AuthShell
            title='ورود به حساب کاربری'
            subtitle='شماره موبایل و رمز عبور خود را وارد کنید'
            footer={
                <p className='m-0 pt-4 text-center text-xs leading-[1.8] text-[#a3abb6]'>
                    ورود شما به معنای پذیرفتن <Link href='/rules' className='font-semibold text-primary'>قوانین دولوکس</Link> است.
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
                        disabled={loading}
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
                        disabled={loading}
                    />
                    <EyeToggle visible={showPassword} onToggle={() => setShowPassword((prev) => !prev)} />
                </label>
                {fieldError('password')}

                {message ? (
                    <p className='m-0 pt-2.5 text-right text-[12px] text-red-500'>{message}</p>
                ) : null}

                <div className='flex items-center justify-between pt-3'>
                    <Link href='/forgetpassword' className='text-[12px] font-medium text-primary'>
                        رمز عبور را فراموش کردید؟
                    </Link>
                    <Link href='/register' className='text-[12px] font-medium text-[#a3abb6] hover:text-primary'>
                        ثبت نام
                    </Link>
                </div>

                <button type='submit' disabled={loading} dir='ltr' className={authSubmitButton}>
                    {loading ? (
                        <span className='loading loading-spinner loading-sm' />
                    ) : (
                        <>
                            <span>ورود به حساب</span>
                            <ArrowIcon />
                        </>
                    )}
                </button>
            </form>
        </AuthShell>
    );
};

export default LoginSection;
