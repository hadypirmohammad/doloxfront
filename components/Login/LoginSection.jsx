import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { sendLoginOtp, verifyLoginOtp } from '@/utils/Request';
import { setCookie } from 'nookies';
import { useRouter } from 'next/router';
import { toPersianDigits } from '@/utils/Cal';
import AuthShell, {
    ArrowIcon,
    LockFieldIcon,
    PhoneFieldIcon,
    authFieldInput,
    authFieldWrap,
    authSubmitButton,
} from './AuthShell';

const RESEND_SECONDS = 120;

const LoginSection = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [phone, setPhone] = useState("");
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        if (!countdown) return undefined;
        const timer = setInterval(() => setCountdown((value) => (value > 0 ? value - 1 : 0)), 1000);
        return () => clearInterval(timer);
    }, [countdown]);

    const phoneForm = useFormik({
        initialValues: {
            phonenumber: '',
        },
        validationSchema: Yup.object({
            phonenumber: Yup.string()
                .matches(/^09\d{9}$/, 'شماره تلفن نامعتبر است')
                .required('شماره تلفن لازم است'),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            setMessage("");
            const result = await sendLoginOtp(values.phonenumber);
            setLoading(false);

            if (result.error) {
                setMessage(result.message);
                return;
            }

            setPhone(values.phonenumber);
            setCountdown(RESEND_SECONDS);
        }
    });

    const codeForm = useFormik({
        initialValues: {
            code: '',
        },
        validationSchema: Yup.object({
            code: Yup.string()
                .matches(/^\d{4,6}$/, 'کد تایید نامعتبر است')
                .required('کد تایید لازم است'),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            setMessage("");
            const result = await verifyLoginOtp(phone, values.code);

            if (result.error) {
                setLoading(false);
                setMessage(result.message);
                return;
            }

            setCookie(null, 'access', result.token, {
                maxAge: 1024 * 60 * 60,
                path: '/',
                secure: true,
            });

            const next = typeof router.query.next === 'string' ? router.query.next : '';
            await router.push(next.startsWith('/') ? next : "/");
        }
    });

    const resend = async () => {
        if (countdown || loading) return;
        setLoading(true);
        setMessage("");
        const result = await sendLoginOtp(phone);
        setLoading(false);

        if (result.error) {
            setMessage(result.message);
            return;
        }

        setCountdown(RESEND_SECONDS);
    };

    const editPhone = () => {
        setPhone("");
        setMessage("");
        setCountdown(0);
        codeForm.resetForm();
    };

    const fieldError = (form, name) =>
        form.touched[name] && form.errors[name] ? (
            <p className='m-0 pt-1.5 text-right text-[11.5px] text-red-500'>{form.errors[name]}</p>
        ) : null;

    const timerLabel = `${toPersianDigits(String(Math.floor(countdown / 60)).padStart(2, '0'))}:${toPersianDigits(String(countdown % 60).padStart(2, '0'))}`;

    return (
        <AuthShell
            title='ورود به حساب کاربری'
            subtitle={phone ? 'کد تایید پیامک شده را وارد کنید' : 'شماره موبایل خود را وارد کنید'}
            footer={
                <p className='m-0 pt-4 text-center text-xs leading-[1.8] text-[#a3abb6]'>
                    ورود شما به معنای پذیرفتن <Link href='/rules' className='font-semibold text-primary'>قوانین دولوکس</Link> است.
                </p>
            }
        >
            {!phone ? (
                <form onSubmit={phoneForm.handleSubmit} className='pt-5'>
                    <label dir='ltr' className={authFieldWrap}>
                        <PhoneFieldIcon />
                        <input
                            dir='ltr'
                            type='tel'
                            inputMode='numeric'
                            id='phonenumber'
                            placeholder='09121234567'
                            className={authFieldInput}
                            {...phoneForm.getFieldProps('phonenumber')}
                            disabled={loading}
                        />
                        {phoneForm.values.phonenumber ? (
                            <button
                                type='button'
                                aria-label='پاک کردن'
                                onClick={() => phoneForm.setFieldValue('phonenumber', '')}
                                className='flex-none'
                            >
                                <svg width='12' height='12' viewBox='0 0 14 14' fill='none' stroke='#b9c0c9' strokeWidth='1.4' strokeLinecap='round'>
                                    <line x1='1.5' y1='1.5' x2='12.5' y2='12.5' />
                                    <line x1='12.5' y1='1.5' x2='1.5' y2='12.5' />
                                </svg>
                            </button>
                        ) : null}
                    </label>
                    {fieldError(phoneForm, 'phonenumber')}

                    <p className='m-0 pt-2.5 text-right text-[11.5px] leading-[1.9] text-[#a3abb6]'>
                        کد تایید به همین شماره پیامک می‌شود.
                    </p>

                    {message ? (
                        <p className='m-0 pt-2.5 text-right text-[12px] text-red-500'>{message}</p>
                    ) : null}

                    <button type='submit' disabled={loading} dir='ltr' className={authSubmitButton}>
                        {loading ? (
                            <span className='loading loading-spinner loading-sm' />
                        ) : (
                            <>
                                <span>دریافت کد تایید</span>
                                <ArrowIcon />
                            </>
                        )}
                    </button>
                </form>
            ) : (
                <form onSubmit={codeForm.handleSubmit} className='pt-5'>
                    <div className='flex items-center justify-between gap-2 rounded-[14px] bg-[#f7f8fa] px-3.5 py-2.5'>
                        <span dir='ltr' className='text-[13px] font-semibold text-[#14233c]'>{phone}</span>
                        <button type='button' onClick={editPhone} className='text-[12px] font-semibold text-primary'>
                            ویرایش شماره
                        </button>
                    </div>

                    <label dir='ltr' className={`${authFieldWrap} mt-3.5`}>
                        <LockFieldIcon />
                        <input
                            dir='ltr'
                            type='tel'
                            inputMode='numeric'
                            id='code'
                            autoComplete='one-time-code'
                            maxLength={6}
                            placeholder='------'
                            className={`${authFieldInput} tracking-[0.5em]`}
                            value={codeForm.values.code}
                            onBlur={codeForm.handleBlur}
                            onChange={(event) => codeForm.setFieldValue('code', event.target.value.replace(/\D/g, '').slice(0, 6))}
                            disabled={loading}
                        />
                    </label>
                    {fieldError(codeForm, 'code')}

                    {message ? (
                        <p className='m-0 pt-2.5 text-right text-[12px] text-red-500'>{message}</p>
                    ) : null}

                    <div className='flex items-center justify-between pt-3'>
                        {countdown ? (
                            <span dir='ltr' className='text-[12px] font-medium text-[#a3abb6]'>{timerLabel}</span>
                        ) : (
                            <button type='button' onClick={resend} className='text-[12px] font-semibold text-primary'>
                                ارسال دوباره کد
                            </button>
                        )}
                        <span className='text-[12px] text-[#a3abb6]'>
                            {countdown ? 'تا ارسال دوباره کد' : 'کد را دریافت نکردید؟'}
                        </span>
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
            )}
        </AuthShell>
    );
};

export default LoginSection;
