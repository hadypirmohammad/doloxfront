import { PREVIEW_WITHOUT_LOGIN, getToken, withAuth } from '@/utils/Auth';
import { mockProfile } from '@/utils/services/preview.mock';

import { getProfile, getUser, linkTelegramAccount, updateUserProfile, getCities} from '@/utils/Request';
import { hasActiveSubscription, pickField } from '@/utils/Cal';
import { useFormik } from 'formik';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup';
import jwt from 'jsonwebtoken';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { Router, useRouter } from 'next/router';
import { BackendURL } from '@/utils/URL';
import { toPersianDigits } from '@/utils/Cal';
import { destroyCookie } from 'nookies';


export async function getServerSideProps(context) {
  // Use the withAuth function to check authentication
  const authResult = await withAuth(context);
  // If the user is not authenticated, they will be redirected
  if (authResult.redirect) {
    return authResult;
  }
  const token = await getToken(context);
  const decoded = jwt.decode(token); // Decode the JWT
  // const userId = await decoded.user_id; // Get user ID from token
  const profileData = await getUser(token).catch(() => null);
  const cities = await getCities(token).catch(() => []);
  // Otherwise, return the props needed for the page
  return {
    props: {
      cities: cities  || [],
      profileData: profileData || (PREVIEW_WITHOUT_LOGIN ? mockProfile : {}), // If null, pass an empty object
      token : token || null
    }, // or other props you want to pass
  };
}

const DEFAULT_AVATAR = '/media/images/defaultimg.png';

const resolveAvatarSrc = (avatar) => {
  if (!avatar) return '';
  if (avatar.startsWith('http') || avatar.startsWith('/media')) return avatar;
  return `${BackendURL.slice(0, -1)}${avatar.startsWith('/') ? avatar : `/${avatar}`}`;
};

const PersonIcon = ({ size = 19 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#FF5E00" className="flex-none">
    <circle cx="12" cy="7.6" r="3.9" />
    <path d="M4.6 20.5c.7-3.9 3.7-6.1 7.4-6.1s6.7 2.2 7.4 6.1z" />
  </svg>
);

const ACCOUNT_ROWS = [
  {
    label: 'گالری من',
    href: '/dashboard/gallery',
    icon: (
      <>
        <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
        <circle cx="8.5" cy="9.5" r="1.5" />
        <polyline points="4,17 9,12 13,15 17,11 20,14" />
      </>
    ),
  },
  {
    label: 'چت ها',
    href: '/dashboard/chat',
    icon: <path d="M20 12.5c0 3.9-3.6 7-8 7-1 0-2-.15-2.9-.45L4.5 20.5l1.1-3.3A6.6 6.6 0 0 1 4 12.5c0-3.9 3.6-7 8-7s8 3.1 8 7Z" />,
  },
  {
    label: 'کیف پول',
    href: '/wallet',
    icon: (
      <>
        <rect x="3" y="6.5" width="18" height="12" rx="2.5" />
        <path d="M3 10.5h18" />
        <path d="M16.5 14.5h.01" />
      </>
    ),
  },
  {
    label: 'اشتراک مزایده ها',
    href: '/auctions',
    icon: (
      <>
        <path d="M4 18.5h16" />
        <path d="M5 15.5 7 7l4 3 2-5 2 5 4-3 2 8.5z" />
      </>
    ),
  },
  {
    label: 'اعلان‌ها',
    href: null,
    icon: (
      <>
        <path d="M12 3.5a5.6 5.6 0 0 1 5.6 5.6c0 4 1.4 5.6 1.4 5.6H5s1.4-1.6 1.4-5.6A5.6 5.6 0 0 1 12 3.5z" />
        <path d="M10 17.8a2.1 2.1 0 0 0 4 0" />
      </>
    ),
  },
  {
    label: 'آگهی های من',
    href: '/dashboard',
    icon: (
      <>
        <path d="M4 9.5h3l8-4v13l-8-4H4z" />
        <path d="M18 9.5a3 3 0 0 1 0 5" />
        <path d="M7 14.5v4" />
      </>
    ),
  },
  {
    label: 'علاقمندی ها',
    href: '/favorites',
    icon: <path d="M12 20s-7.4-4.3-7.4-9.2A4.1 4.1 0 0 1 12 8.3a4.1 4.1 0 0 1 7.4 2.5C19.4 15.7 12 20 12 20z" />,
  },
  {
    label: 'خبرنامه',
    href: 'https://blog.dolox.ir',
    external: true,
    icon: (
      <>
        <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
        <polyline points="3.8,7 12,13 20.2,7" />
      </>
    ),
  },
  {
    label: 'درباره دولوکس',
    href: '/about',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5.5M12 7.8h.01" />
      </>
    ),
  },
  {
    label: 'قوانین ومقررات',
    href: '/rules',
    icon: (
      <>
        <rect x="5" y="3.5" width="14" height="17" rx="2.5" />
        <path d="M8.5 8.5h7M8.5 12h7M8.5 15.5h4" />
      </>
    ),
  },
  {
    label: 'پشتیبانی',
    href: 'https://wa.me/989139777207',
    external: true,
    icon: (
      <>
        <path d="M5 13v-1a7 7 0 0 1 14 0v1" />
        <rect x="3" y="13" width="4" height="5.5" rx="1.8" />
        <rect x="17" y="13" width="4" height="5.5" rx="1.8" />
        <path d="M19 18.5v.5a2.5 2.5 0 0 1-2.5 2.5H14" />
      </>
    ),
  },
];

const iconFieldWrap =
  'flex flex-row-reverse items-center gap-3 rounded-xl border border-[#eceef1] bg-[#f6f7f9] px-4 transition-colors focus-within:border-primary focus-within:bg-white';
const iconFieldInput =
  "min-w-0 flex-1 border-0 bg-transparent py-3.5 text-right text-[15.5px] font-medium text-[#222831] outline-none font-['vazir']";
const labelClass = 'text-[12.5px] text-[#9aa2ab]';
const errorClass = 'pt-1 text-sm text-red-500';
const rowClass =
  'flex flex-row-reverse items-center gap-3 rounded-[14px] border border-[#eceef1] bg-white px-4 py-3.5 transition-colors';

const RowIcon = ({ children }) => (
  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-[10px] border border-[#f6ddcd] bg-[#fff8f3]">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF5E00" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  </span>
);

const Profile = ({ cities, profileData, token, user }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [linkingTelegram, setLinkingTelegram] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const avatarSrc = avatarPreview || resolveAvatarSrc(pickField(profileData, ['UserAvatar', 'Avatar']));
  const phoneNumber =
    pickField(profileData, ['PhoneNumber', 'Phone', 'Mobile']) ||
    pickField(user, ['PhoneNumber', 'Phone', 'Mobile']) ||
    '';

  const handleLogout = async () => {
    destroyCookie(null, 'access');
    destroyCookie(null, 'refresh');
    await fetch('/api/logout', { method: 'POST' });
    await router.push('/');
    router.reload();
  };

  const formik = useFormik({
    initialValues: {
      firstName: pickField(profileData, ['Name', 'FirstName']) || '',
      lastName: pickField(profileData, ['LastName', 'Family', 'FamilyName']) || '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('نام الزامی است'),
      lastName: Yup.string().required('نام خانوادگی الزامی است'),
    }),
    onSubmit: async(values) => {
      setLoading(true);

      const result = await updateUserProfile(
        token,
        pickField(profileData, ['Email']) || '',
        avatarFile,
        pickField(profileData, ['CityId']) || '',
        values.firstName,
        values.lastName,
        pickField(profileData, ['GenderId']) || '',
      )

      if (result.status == 200) {
        toast.success("اطلاعات به رورسانی شد");
        router.reload();
      } else {
        toast.error("مشکلی در ارتباط با سرور وجود دارد");
      }
      setLoading(false)

    },
  });

  const hasChanges =
    JSON.stringify(formik.values) !== JSON.stringify(formik.initialValues) || Boolean(avatarFile);

  const pickAvatar = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('فقط فایل تصویری مجاز است');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      toast.error('حجم تصویر باید کمتر از ۳ مگابایت باشد');
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const telegramConnected = Boolean(pickField(profileData, ['TelegramId']));
  const telegramAllowed = hasActiveSubscription(profileData);

  const openTelegram = async () => {
    if (linkingTelegram) return;

    setLinkingTelegram(true);
    const link = await linkTelegramAccount(token);
    setLinkingTelegram(false);

    if (!link) {
      toast.error('دریافت لینک ربات تلگرام ناموفق بود، دوباره تلاش کنید');
      return;
    }

    window.location.href = link;
  };

  return (
    <div dir="rtl" className='flex w-full justify-center gap-4 bg-[#eff2f7] px-4 pb-10 pt-6 md:pt-8'>
      <div className='h-full w-full min-w-0 max-w-screen-lg'>
        <div className='flex h-fit w-full flex-col gap-5 rounded-[22px] bg-white p-5 shadow-[0_10px_30px_rgba(17,28,46,0.05)] sm:p-7'>
          <div className='flex flex-row-reverse items-center gap-4'>
            <label className='group relative flex h-[104px] w-[104px] flex-none cursor-pointer items-end justify-center overflow-hidden rounded-full bg-[#fdf0e6]'>
              <input type='file' accept='image/*' onChange={pickAvatar} className='hidden' />
              {avatarSrc ? (
                <Image src={avatarSrc} width={200} height={200} alt='profile' className='h-full w-full object-cover' unoptimized={Boolean(avatarPreview)} />
              ) : (
                <svg width="72%" height="78%" viewBox="0 0 24 22" fill="#FF5E00">
                  <circle cx="12" cy="6.4" r="5.4" />
                  <path d="M1.6 22c.9-5.4 5.2-8.4 10.4-8.4S21.5 16.6 22.4 22z" />
                </svg>
              )}
              <span className='absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-black/55 py-1.5 text-[11px] font-bold text-white'>
                <svg width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                  <path d='M4 19h16M12 15V4M7.5 8.5 12 4l4.5 4.5' />
                </svg>
                تغییر
              </span>
            </label>
            <div className='flex min-w-0 flex-1 flex-col items-start gap-1.5'>
              <h1 className='m-0 text-[22px] font-bold text-[#111c2e]'>مشخصات کاربری</h1>
              <p className='m-0 text-[13px] text-[#9aa2ab]'>مدیریت اطلاعات حساب کاربری</p>
            </div>
          </div>

          <form onSubmit={formik.handleSubmit} className='flex flex-col gap-4'>
            <label className='flex flex-col gap-2'>
              <span className={labelClass}>نام</span>
              <span className={iconFieldWrap}>
                <PersonIcon />
                <input
                  id="firstName"
                  type="text"
                  placeholder="نام"
                  className={iconFieldInput}
                  {...formik.getFieldProps('firstName')}
                  disabled={loading}
                />
              </span>
              {formik.touched.firstName && formik.errors.firstName ? (
                <span className={errorClass}>{formik.errors.firstName}</span>
              ) : null}
            </label>

            <label className='flex flex-col gap-2'>
              <span className={labelClass}>نام خانوادگی</span>
              <span className={iconFieldWrap}>
                <PersonIcon />
                <input
                  id="lastName"
                  type="text"
                  placeholder="نام خانوادگی"
                  className={iconFieldInput}
                  {...formik.getFieldProps('lastName')}
                  disabled={loading}
                />
              </span>
              {formik.touched.lastName && formik.errors.lastName ? (
                <span className={errorClass}>{formik.errors.lastName}</span>
              ) : null}
            </label>

            {hasChanges ? (
              <div className='flex flex-row-reverse items-center gap-3'>
                <button
                  type="submit"
                  disabled={loading}
                  className='rounded-xl bg-primary px-6 py-3 text-[14.5px] font-bold text-white transition-colors hover:bg-[#d7541a] disabled:opacity-60'
                >
                  {loading ? <span className='loading loading-spinner loading-sm' /> : 'ذخیره تغییرات'}
                </button>
                <button
                  type="button"
                  onClick={() => formik.resetForm()}
                  disabled={loading}
                  className='rounded-xl border border-[#ececf0] bg-white px-5 py-3 text-[14.5px] text-[#2b3138] transition-colors hover:border-primary disabled:opacity-60'
                >
                  انصراف
                </button>
              </div>
            ) : null}
          </form>

          <div className='h-px bg-[#eef0f2]' />

          <div className='flex flex-row-reverse items-center gap-3.5'>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#FF5E00" strokeWidth="1.7" className='flex-none'>
              <circle cx="9.5" cy="8" r="3.5" />
              <path d="M2.8 20c.7-3.4 3.4-5.3 6.7-5.3 1 0 2 .2 2.8.5" />
              <circle cx="17.5" cy="17" r="3" />
              <path d="M17.5 12.8v1M17.5 21.2v1M21.7 17h-1M14.3 17h-1" />
            </svg>
            <div className='flex min-w-0 flex-1 flex-col items-start gap-1.5'>
              <h2 className='m-0 text-[16.5px] font-bold text-[#111c2e]'>اطلاعات حساب</h2>
              <p className='m-0 text-[12.5px] text-[#9aa2ab]'>اطلاعات هویتی شما برای ارتباط و امنیت حساب</p>
            </div>
          </div>

          <div className={`${rowClass} bg-[#f3f6fa]`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2fa855" strokeWidth="1.7" className='flex-none'>
              <path d="M12 2.8 20 5.6v6c0 4.4-3.2 7.8-8 9.6-4.8-1.8-8-5.2-8-9.6v-6z" />
              <path d="M8.4 12.2l2.6 2.5 4.6-5" />
            </svg>
            <div className='flex min-w-0 flex-1 flex-col items-start gap-1'>
              <span className='text-[15px] font-bold text-[#111c2e]'>وضعیت حساب</span>
              {phoneNumber ? (
                <span className='text-[12.5px] leading-[1.9] text-[#2fa855]'>
                  ورود شما با شماره <span dir='ltr' className='font-bold'>{toPersianDigits(phoneNumber)}</span> تأیید شد
                </span>
              ) : (
                <span className='text-[12.5px] text-[#2fa855]'>حساب شما فعال و تأیید شده است</span>
              )}
            </div>
          </div>

          <nav className='flex flex-col gap-2.5'>
            {ACCOUNT_ROWS.map((row) =>
              row.href ? (
                <Link
                  key={row.label}
                  href={row.href}
                  className={`${rowClass} hover:border-primary hover:bg-[#fffaf7]`}
                  {...(row.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <RowIcon>{row.icon}</RowIcon>
                  <span className='min-w-0 flex-1 text-[15px] font-medium text-[#111c2e]'>{row.label}</span>
                  <span className='flex-none text-xl leading-none text-[#9aa2ab]'>‹</span>
                </Link>
              ) : (
                <div key={row.label} className={rowClass}>
                  <RowIcon>{row.icon}</RowIcon>
                  <span className='min-w-0 flex-1 text-[15px] font-medium text-[#111c2e]'>{row.label}</span>
                  <span className='flex-none text-xl leading-none text-[#c9cfd7]'>‹</span>
                </div>
              )
            )}

            {telegramAllowed ? (
              <button
                type='button'
                onClick={openTelegram}
                disabled={linkingTelegram}
                className={`${rowClass} hover:border-primary hover:bg-[#fffaf7] disabled:opacity-60`}
              >
                <RowIcon>
                  <path d='M21.5 4.5 2.8 11.3c-.9.3-.9 1.6 0 1.9l4.7 1.5 1.8 5.1c.3.8 1.3 1 1.9.4l2.5-2.4 4.6 3.4c.7.5 1.7.1 1.9-.7l3-14.3c.2-.9-.7-1.6-1.7-1.2z' />
                  <path d='m7.5 14.7 9.8-7.4-7.9 8.4' />
                </RowIcon>
                <span className='min-w-0 flex-1 text-right text-[15px] font-medium text-[#111c2e]'>
                  {telegramConnected ? 'ربات تلگرام (متصل)' : 'اتصال به ربات تلگرام'}
                </span>
                <span className='flex-none text-xl leading-none text-[#9aa2ab]'>
                  {linkingTelegram ? <span className='loading loading-spinner loading-xs' /> : '‹'}
                </span>
              </button>
            ) : (
              <Link href='/auctions/subscription' className={`${rowClass} hover:border-primary hover:bg-[#fffaf7]`}>
                <RowIcon>
                  <path d='M21.5 4.5 2.8 11.3c-.9.3-.9 1.6 0 1.9l4.7 1.5 1.8 5.1c.3.8 1.3 1 1.9.4l2.5-2.4 4.6 3.4c.7.5 1.7.1 1.9-.7l3-14.3c.2-.9-.7-1.6-1.7-1.2z' />
                  <path d='m7.5 14.7 9.8-7.4-7.9 8.4' />
                </RowIcon>
                <span className='min-w-0 flex-1 text-right'>
                  <span className='block text-[15px] font-medium text-[#111c2e]'>ربات تلگرام</span>
                  <span className='block pt-0.5 text-[12px] text-[#9aa2ab]'>ویژه دارندگان اشتراک مزایده</span>
                </span>
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='#9aa2ab' strokeWidth='1.9' strokeLinecap='round' strokeLinejoin='round' className='flex-none'>
                  <rect x='4.5' y='10.5' width='15' height='10' rx='2.5' />
                  <path d='M8 10.5V7.5a4 4 0 0 1 8 0v3' />
                </svg>
              </Link>
            )}

            <button
              type='button'
              onClick={handleLogout}
              className={`${rowClass} text-right hover:border-[#e0472f] hover:bg-[#fdf1ef]`}
            >
              <span className='flex h-9 w-9 flex-none items-center justify-center rounded-[10px] border border-[#f7d8d2] bg-[#fdf3f1]'>
                <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='#e0472f' strokeWidth='1.7' strokeLinecap='round' strokeLinejoin='round'>
                  <path d='M14 5.5H7.5A2.5 2.5 0 0 0 5 8v8a2.5 2.5 0 0 0 2.5 2.5H14' />
                  <path d='M17.5 12H10M14.5 9l3 3-3 3' />
                </svg>
              </span>
              <span className='min-w-0 flex-1 text-[15px] font-medium text-[#e0472f]'>خروج</span>
              <span className='flex-none text-xl leading-none text-[#e5a79c]'>‹</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Profile
