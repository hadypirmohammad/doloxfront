import { pickField } from '@/utils/Cal';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const DISMISS_KEY = 'dolox_profile_prompt_shown';

const keyFor = (user) => {
  const id = pickField(user, ['UserId', 'Id', 'PhoneNumber', 'Phone', 'Mobile']);
  return id ? `${DISMISS_KEY}_${id}` : DISMISS_KEY;
};

const CompleteProfileModal = ({ user }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (router.pathname === '/dashboard/profile') return;

    const firstName = pickField(user, ['Name', 'FirstName']);
    const lastName = pickField(user, ['LastName', 'Family', 'FamilyName']);

    if (firstName && lastName) return;

    try {
      if (localStorage.getItem(keyFor(user))) return;
      localStorage.setItem(keyFor(user), '1');
    } catch (error) {
      return;
    }

    setOpen(true);
  }, [user, router.pathname]);

  const close = () => setOpen(false);

  if (!open) return null;

  return (
    <div dir='rtl' className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 px-4 [&_*]:!font-['vazir']">
      <div className='w-full max-w-sm rounded-[22px] bg-white p-6 text-center shadow-[0_18px_50px_rgba(17,28,46,0.25)]'>
        <span className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF1E7]'>
          <svg width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='#FF5E00' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round'>
            <circle cx='12' cy='8' r='3.6' />
            <path d='M5 20c.7-3.6 3.5-5.6 7-5.6s6.3 2 7 5.6' />
          </svg>
        </span>

        <h2 className='m-0 pt-4 text-[17px] font-bold text-secondary'>اطلاعات کاربری خود را تکمیل کنید</h2>
        <p className='m-0 pt-3 text-[13px] leading-[2] text-[#8B94A5]'>
          نام و نام خانوادگی شما ثبت نشده است. با تکمیل آن، خریداران راحت‌تر به شما اعتماد می‌کنند.
        </p>

        <div className='flex gap-2.5 pt-6'>
          <button
            type='button'
            onClick={close}
            className='flex-1 rounded-2xl border border-[#E7EBF1] bg-white py-3 text-[14px] font-bold text-secondary'
          >
            بعدا
          </button>
          <Link
            href='/dashboard/profile'
            onClick={close}
            className='flex-1 rounded-2xl bg-gradient-orange py-3 text-[14px] font-bold text-white'
          >
            تکمیل اطلاعات
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfileModal;
