import AccountSidebar from '@/components/Dashboard/AccountSidebar';
import GalleryAdThumb from '@/components/Dashboard/GalleryAdThumb';
import GalleryBadgeNotice from '@/components/Dashboard/GalleryBadgeNotice';
import GalleryBanner from '@/components/Dashboard/GalleryBanner';
import GalleryEditNotice from '@/components/Dashboard/GalleryEditNotice';
import GallerySubscription from '@/components/Dashboard/GallerySubscription';
import { getToken, withAuth } from '@/utils/Auth';
import { pickField } from '@/utils/Cal';
import {
  getAutogalleries,
  getGalleryQuota,
  getGallerySubscriptionPlans,
  getMyads,
  getUser,
} from '@/utils/Request';
import { adKey, galleryTone, isGalleryAd } from '@/utils/services/galleryPanel';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

const PREVIEW_COUNT = 4;

export async function getServerSideProps(context) {
  const authResult = await withAuth(context);
  if (authResult.redirect) return authResult;

  const token = await getToken(context);

  const [userdata, galleries, plans, ads] = await Promise.all([
    getUser(token).catch(() => null),
    getAutogalleries(token).catch(() => []),
    getGallerySubscriptionPlans().catch(() => []),
    getMyads(token).catch(() => []),
  ]);

  const list = Array.isArray(galleries) ? galleries : [];
  const requested = context.query?.g;
  const gallery =
    list.find((item) => String(item?.GalleryId) === String(requested)) || list[0] || null;

  const quota = gallery ? await getGalleryQuota(token, gallery.GalleryId).catch(() => null) : null;

  return {
    props: {
      user: userdata ?? null,
      galleries: list,
      gallery,
      quota: quota ?? null,
      plans: Array.isArray(plans) ? plans : [],
      ads: Array.isArray(ads) ? ads : [],
      token: token || '',
    },
  };
}

const GalleryPanel = ({ user, galleries, gallery, quota, plans, ads, token }) => {
  const router = useRouter();
  const [editNotice, setEditNotice] = useState(false);

  const canRegister = quota ? quota.CanRegister !== false : true;
  const quotaReason =
    quota?.Reason ||
    'سهمیه آگهی گالری شما تمام شده یا اشتراکی فعال نیست. پس از خرید اشتراک، دکمه ثبت آگهی فعال می‌شود.';

  if (!gallery) {
    return (
      <div dir="rtl" className="w-full bg-[#F6F7F9] px-3 pb-12 pt-4 sm:px-4 md:pt-7">
        <div className="mx-auto flex w-full max-w-screen-xl flex-wrap items-start gap-4 sm:gap-6">
          <AccountSidebar user={user} />
          <section className="flex min-w-0 flex-[999_1_560px] flex-col items-center justify-center rounded-2xl border border-[#E6E8EC] bg-white px-6 py-16 text-center">
            <h1 className="font-soft text-[17px] text-[#1E2A3A]">هنوز گالری ثبت نکرده‌اید</h1>
            <p className="pt-2 text-[13px] text-[#5B6575]">
              با ثبت گالری، آگهی‌هایتان با نام گالری منتشر می‌شود و از اشتراک گالری استفاده می‌کنید
            </p>
            <Link
              href="/createautogallery"
              className="mt-5 flex h-11 items-center justify-center rounded-xl bg-gradient-orange px-6 font-soft text-[14px] text-white"
            >
              ثبت گالری
            </Link>
          </section>
        </div>
      </div>
    );
  }

  const tone = galleryTone(gallery);
  const planId = pickField(quota, ['GallerySubscriptionPlanId', 'PlanId', 'SubscriptionPlanId']);
  const plan = plans.find((item) => String(item?.GallerySubscriptionPlanId) === String(planId)) || null;
  const basePlan = [...plans].sort((a, b) => (Number(a?.NormalAdsCount) || 0) - (Number(b?.NormalAdsCount) || 0))[0] || null;

  const galleryAds = ads.filter((ad) => isGalleryAd(ad, gallery));
  const preview = galleryAds.slice(0, PREVIEW_COUNT);

  return (
    <div dir="rtl" className="w-full bg-[#F6F7F9] px-3 pb-12 pt-4 sm:px-4 md:pt-7">
      <div className="mx-auto flex w-full max-w-screen-xl flex-wrap items-start gap-4 sm:gap-6">
        <AccountSidebar user={user} />

        <section className="flex min-w-0 flex-[999_1_560px] flex-col gap-3.5 sm:gap-[18px]">
          {galleries.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {galleries.map((item) => {
                const active = String(item.GalleryId) === String(gallery.GalleryId);
                return (
                  <button
                    key={item.GalleryId}
                    type="button"
                    onClick={() => router.push(`/dashboard/gallery?g=${item.GalleryId}`)}
                    className={`h-9 flex-none whitespace-nowrap rounded-full px-3.5 text-[12.5px] ${
                      active
                        ? 'bg-gradient-orange font-soft text-white'
                        : 'border border-[#E6E8EC] bg-white text-[#1E2A3A]'
                    }`}
                  >
                    {item.Name}
                  </button>
                );
              })}
            </div>
          )}

          <GalleryEditNotice
            open={editNotice}
            gallery={gallery}
            token={token}
            onClose={() => setEditNotice(false)}
          />

          <GalleryBanner gallery={gallery} tone={tone} onEdit={() => setEditNotice(true)} />

          {canRegister ? (
            <Link
              href={`/createad?gl=${gallery.GalleryId}`}
              className="flex min-h-[52px] items-center justify-center gap-2.5 rounded-[14px] bg-gradient-orange font-soft text-[16px] text-white sm:min-h-[58px] sm:text-[19px]"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" className="flex-none">
                <path d="M12 5v14M5 12h14" />
              </svg>
              ثبت آگهی جدید
            </Link>
          ) : (
            <div className="flex flex-col gap-2.5 rounded-[14px] border border-[#F3D88E] bg-[#FFF9EA] p-3.5 sm:p-4">
              <div className="flex items-center gap-2">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#B4820C" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7.5v5.5M12 16.2v.2" />
                </svg>
                <span className="font-soft text-[13.5px] text-[#8A6410] sm:text-[15px]">
                  برای ثبت آگهی در گالری، اشتراک فعال لازم است
                </span>
              </div>

              <p className="m-0 text-[12.5px] leading-[2] text-[#8A6410]/80 sm:text-[13.5px]">
                {quotaReason}
              </p>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Link
                  href={`/manageauto/${gallery.GalleryId}`}
                  className="flex min-h-[46px] flex-1 items-center justify-center rounded-xl bg-gradient-orange font-soft text-[14.5px] text-white"
                >
                  خرید اشتراک
                </Link>

                <button
                  type="button"
                  disabled
                  className="flex min-h-[46px] flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-[#E6E8EC] bg-[#F6F7F9] font-soft text-[14.5px] text-[#9AA3B0]"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
                    <rect x="4.5" y="10.5" width="15" height="9.5" rx="2" />
                    <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
                  </svg>
                  ثبت آگهی جدید
                </button>
              </div>
            </div>
          )}

          <GalleryBadgeNotice tone={tone} />

          <GallerySubscription gallery={gallery} quota={quota} plan={plan} basePlan={basePlan} />

          <section className="flex flex-col gap-3.5 rounded-2xl border border-[#E6E8EC] bg-white p-3.5 sm:gap-4 sm:p-[18px]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-soft m-0 text-[16px] text-[#1E2A3A] sm:text-[19px]">آگهی‌های گالری من</h2>
              <Link
                href={`/dashboard/gallery/ads?g=${gallery.GalleryId}`}
                className="flex min-h-11 items-center gap-1.5 font-soft text-[13px] text-primary sm:text-[15px]"
              >
                مشاهده همه آگهی‌ها
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
                  <path d="M19 12H5M11 6l-6 6 6 6" />
                </svg>
              </Link>
            </div>

            {preview.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-3.5 lg:grid-cols-4">
                {preview.map((ad) => (
                  <GalleryAdThumb key={adKey(ad)} ad={ad} />
                ))}
              </div>
            ) : (
              <p className="m-0 py-8 text-center text-[13px] text-[#5B6575]">
                هنوز آگهی‌ای با نام این گالری ثبت نشده است
              </p>
            )}
          </section>
        </section>
      </div>
    </div>
  );
};

export default GalleryPanel;
