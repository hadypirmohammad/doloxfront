import SubscriptionCards from '@/components/Auction/SubscriptionCards';
import { getToken, withAuth } from '@/utils/Auth';
import { getUser } from '@/utils/Request';
import { hasActiveSubscription, subscriptionEndDate } from '@/utils/Cal';
import Link from 'next/link';
import React from 'react'

export async function getServerSideProps(context) {
  const authResult = await withAuth(context);

  if (authResult.redirect) {
    return authResult;
  }

  const token = await getToken(context);
  const userdata = await getUser(token).catch(() => null);

  return {
    props: {
      token: token || "",
      lockedTitle: context.query.title || "",
      alreadyActive: hasActiveSubscription(userdata),
      expiresAt: subscriptionEndDate(userdata) || "",
    },
  };
}

const AuctionSubscription = ({ token, lockedTitle, alreadyActive, expiresAt }) => {
  return (
    <div className='flex flex-col items-center gap-3 bg-[#FAFAFA] px-3 pt-6 pb-10 md:pt-8'>
      {alreadyActive && (
        <div dir='rtl' className="flex w-full max-w-5xl flex-wrap items-center gap-2.5 rounded-2xl border border-[#BFE8CF] bg-[#F3FBF5] px-4 py-3.5 text-right font-['vazir']">
          <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='#1E9E5A' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='flex-none'>
            <circle cx='12' cy='12' r='9' />
            <path d='M8 12.5l2.5 2.5L16 9.5' />
          </svg>
          <p className='m-0 flex-1 text-[13.5px] leading-[2] text-[#1E9E5A]'>
            اشتراک شما فعال است{expiresAt ? ` تا ${expiresAt}` : ''}. اگر هنوز به مزایده‌ها دسترسی ندارید با پشتیبانی تماس بگیرید.
          </p>
          <Link href='/auctions' className='rounded-xl bg-[#1E9E5A] px-4 py-2 text-[13px] font-bold text-white'>
            رفتن به مزایده‌ها
          </Link>
        </div>
      )}

      {lockedTitle && !alreadyActive && (
        <div dir='rtl' className="flex w-full max-w-5xl items-center gap-2.5 rounded-2xl border border-[#FFD9C2] bg-[#FFF6F1] px-4 py-3.5 text-right font-['vazir']">
          <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='#FF5E00' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' className='flex-none'>
            <rect x='4.5' y='10.5' width='15' height='10' rx='2.5' />
            <path d='M8 10.5V7.5a4 4 0 0 1 8 0v3' />
          </svg>
          <p className='m-0 text-[13.5px] leading-[2] text-secondary'>
            برای دیدن جزئیات مزایده‌ی «{lockedTitle}» باید اشتراک فعال داشته باشید.
          </p>
        </div>
      )}
      <SubscriptionCards token={token} />
    </div>
  )
}

export default AuctionSubscription
