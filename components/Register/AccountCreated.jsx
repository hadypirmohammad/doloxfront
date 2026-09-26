import Link from 'next/link'
import React from 'react'
import AuthShell, { ArrowIcon, authSubmitButton } from '@/components/Login/AuthShell';

const AccountCreated = () => {
  return (
    <AuthShell
      title='حساب کاربری شما ساخته شد'
      subtitle='همین حالا وارد حساب خود شوید'
      footer={
        <p className='m-0 pt-4 text-center text-xs leading-[1.8] text-[#a3abb6]'>
          خوش آمدید! از این پس می‌توانید آگهی ثبت کنید و در مزایده‌ها شرکت کنید.
        </p>
      }
    >
      <div className='flex flex-col items-center pt-8'>
        <span className='flex h-[74px] w-[74px] items-center justify-center rounded-full bg-[#e8f7ee]'>
          <svg width='34' height='34' viewBox='0 0 24 24' fill='none' stroke='#1e8e4e' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
            <path d='M5 12.5l5 5 9-11' />
          </svg>
        </span>
      </div>

      <Link href='/login' dir='ltr' className={authSubmitButton}>
        <span>صفحه ورود</span>
        <ArrowIcon />
      </Link>
    </AuthShell>
  )
}

export default AccountCreated
