import DashboardAd from '@/components/Dashboard/DashboardAd';
import TelegramButton from '@/components/Dashboard/TelegramButton';
import DashboardPanel from '@/components/global/DashboardPanel';
import { getToken, withAuth } from '@/utils/Auth';
import { getMyads } from '@/utils/Request';
import Link from 'next/link';
import React from 'react';

export async function getServerSideProps(context) {
  const authResult = await withAuth(context);

  if (authResult.redirect) {
    return authResult;
  }
  const token = await getToken(context);
  const myads = await getMyads(token);
  return {
    props: {
      ads: myads || [],
      token: token || '',
    },
  };
}

const Dashboard = ({ user, ads, token }) => {
  return (
    <div className="flex h-fit w-full justify-start bg-[#FAFAFA] px-4 pb-10 pt-6 md:pt-8">
      <DashboardPanel user={user} />
      <div className="h-full w-full px-2 sm:px-4">
        <div className="flex h-fit w-full max-w-screen-lg flex-col rounded-3xl border border-[#F0F0F0] bg-white p-5 shadow-[0_8px_24px_rgba(36, 59, 83,0.04)] sm:p-8">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h1 className="text-xl text-secondary">آگهی های من</h1>
            <div className="flex items-center gap-2">
              <TelegramButton token={token} />
              <Link
                className="hidden h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm text-white sm:inline-flex"
                href="/createad"
              >
                + ثبت آگهی
              </Link>
            </div>
          </div>
          {ads?.map((ad, index) => (
            <DashboardAd key={index} ad={ad} />
          ))}

          {(!ads || ads.length === 0) && (
            <div className="flex h-72 flex-col items-center justify-center text-center">
              <h3 className="text-lg font-bold text-secondary">هنوز هیچ آگهی ندارید</h3>
              <p className="mt-2 text-sm text-[#8A8A8A]">همین حالا ثبت آگهی کنید</p>
              <Link
                className="mt-4 flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm text-white"
                href="/createad"
              >
                ثبت رایگان آگهی
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
