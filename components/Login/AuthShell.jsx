import Link from 'next/link';
import React from 'react';

const AuthShell = ({ title, subtitle, children, footer }) => {
    return (
        <section dir='rtl' className='flex min-h-[80vh] justify-center bg-[#e9ecf1] px-0 py-0 sm:px-4 sm:py-10'>
            <div className='relative w-full max-w-[520px] overflow-hidden bg-[#fafafb] px-7 pb-10 pt-14 sm:rounded-[28px] sm:px-10 sm:shadow-[0_18px_50px_rgba(20,35,60,0.10)]'>
                <span className='pointer-events-none absolute -right-40 -top-40 h-80 w-80 rounded-full bg-[#fdf1e8]' />
                <span className='pointer-events-none absolute -right-32 -top-32 h-60 w-60 rounded-full bg-[#fbe4d0]' />
                <span className='pointer-events-none absolute -right-24 -top-24 h-40 w-40 rounded-full bg-[#f9d8bd]' />
                <span className='pointer-events-none absolute -bottom-44 -left-44 h-80 w-80 rounded-full bg-[#fdf1e8]' />
                <span className='pointer-events-none absolute -bottom-36 -left-36 h-64 w-64 rounded-full bg-[#fbe4d0]' />
                <span className='pointer-events-none absolute -bottom-28 -left-28 h-48 w-48 rounded-full bg-gradient-to-br from-[#ffb05e] to-[#f7740a]' />

                <div className='relative z-10 flex flex-col'>
                    <Link href='/' dir='ltr' className='dolox-wordmark text-center text-[27px] leading-none tracking-[1px] text-[#1c2b42]'>
                        DOLO<span className='text-primary'>X</span>
                    </Link>
                    <span className='pt-2.5 text-center text-[12.5px] font-medium text-[#a3abb6]'>آسون بخر ، راحت بفروش</span>

                    <h1 className='m-0 pt-10 text-[21px] font-bold leading-[1.15] text-[#1c2b42]'>{title}</h1>
                    <p className='m-0 pt-2 text-[12.5px] text-[#a3abb6]'>{subtitle}</p>

                    {children}

                    <div className='flex items-center gap-2.5 pt-10'>
                        <span className='h-px flex-1 bg-[#e7e9ee]' />
                        <svg width='14' height='16' viewBox='0 0 18 20' fill='none' stroke='#c6ccd4' strokeWidth='1.3'>
                            <path d='M9 1 16.5 5.3v9.4L9 19 1.5 14.7V5.3z' />
                        </svg>
                        <span className='h-px flex-1 bg-[#e7e9ee]' />
                    </div>
                    {footer}
                </div>
            </div>
        </section>
    );
};

export const authFieldWrap =
    'flex items-center gap-3 rounded-xl border border-[#edeef2] bg-[#fdfdfe] px-3.5 transition-colors focus-within:border-primary';
export const authFieldInput =
    "min-w-0 flex-1 border-0 bg-transparent py-3 text-left text-[13px] font-medium tracking-[0.6px] text-[#1c2b42] outline-none font-['vazir']";
export const authSubmitButton =
    'mt-5 flex h-[46px] w-full items-center justify-center gap-4 rounded-xl bg-gradient-to-b from-[#fd8a1f] to-[#f7740a] text-sm font-bold text-white shadow-[0_6px_16px_rgba(249,116,10,0.24)] transition hover:brightness-105 disabled:opacity-60';

export const ArrowIcon = () => (
    <svg width='20' height='11' viewBox='0 0 22 12' fill='none' stroke='#fff' strokeWidth='1.5' strokeLinecap='round'>
        <line x1='1' y1='6' x2='20' y2='6' />
        <polyline points='15.5,1.5 20.5,6 15.5,10.5' />
    </svg>
);

export const PhoneFieldIcon = () => (
    <svg width='12' height='15' viewBox='0 0 14 18' fill='none' stroke='#a3abb6' strokeWidth='1.4' className='flex-none'>
        <rect x='1' y='1' width='12' height='16' rx='3' />
        <line x1='5.5' y1='14.3' x2='8.5' y2='14.3' />
    </svg>
);

export const LockFieldIcon = () => (
    <svg width='13' height='15' viewBox='0 0 16 18' fill='none' stroke='#a3abb6' strokeWidth='1.4' className='flex-none'>
        <rect x='2' y='7.5' width='12' height='9.5' rx='2.5' />
        <path d='M4.8 7.5V5.2a3.2 3.2 0 0 1 6.4 0v2.3' />
    </svg>
);

export const EyeToggle = ({ visible, onToggle }) => (
    <button type='button' aria-label='نمایش رمز عبور' onClick={onToggle} className='flex-none'>
        <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='#b9c0c9' strokeWidth='1.6'>
            <path d='M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12z' />
            <circle cx='12' cy='12' r='3' />
            {!visible ? <line x1='4' y1='20' x2='20' y2='4' /> : null}
        </svg>
    </button>
);

export default AuthShell;
