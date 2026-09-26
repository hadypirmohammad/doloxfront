import DashboardAuto from '@/components/Dashboard/DashboardAuto';
import DashboardPanel from '@/components/global/DashboardPanel';
import { getToken, withAuth } from '@/utils/Auth';
import { getAutogalleries } from '@/utils/Request';
import Link from 'next/link';
import React from 'react';

export async function getServerSideProps(context) {
  const authResult = await withAuth(context);

  if (authResult.redirect) {
    return authResult;
  }
  const token = await getToken(context);
  const myGalleryies = await getAutogalleries(token).catch(() => []);
  return {
    props: {
      myGalleryies: myGalleryies || [],
    },
  };
}

const auto = ({ user, myGalleryies }) => {
  return (
    <div className="flex h-fit w-full justify-start bg-[#FAFAFA] px-4 pb-10 pt-6 md:pt-8">
      <DashboardPanel user={user} />
      <div className="h-full w-full px-2 sm:px-4">
        <div className="flex h-fit w-full max-w-screen-lg flex-col rounded-3xl border border-[#F0F0F0] bg-white p-5 shadow-[0_8px_24px_rgba(36, 59, 83,0.04)] sm:p-8">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h1 className="text-xl text-secondary">اتوگالری من</h1>
            <Link
              className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm text-white"
              href="/createautogallery"
            >
              + ثبت اتوگالری
            </Link>
          </div>
          {myGalleryies?.map((autoItem, index) => (
            <DashboardAuto key={index} auto={autoItem} />
          ))}
          {myGalleryies.length <= 0 && (
            <div className="mx-auto flex h-[50vh] flex-col items-center justify-center text-center">
              <p className="dolox-wordmark text-[36px] leading-none" dir="ltr">
                <span className="text-secondary">DOLO</span>
                <span className="text-primary">X</span>
              </p>
              <h1 className="mt-4 text-xl text-secondary">همین حالا اولین اتوگالریتو ثبت کن</h1>
              <Link
                className="mt-4 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm text-white"
                href="/createautogallery"
              >
                ثبت رایگان اتوگالری
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default auto;
