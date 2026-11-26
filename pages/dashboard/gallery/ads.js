import AccountSidebar from '@/components/Dashboard/AccountSidebar';
import MyAdCard from '@/components/Dashboard/MyAdCard';
import { getToken, withAuth } from '@/utils/Auth';
import { calculateDaysLeft, normalizeSearchTerm, pickField, toPersianDigits } from '@/utils/Cal';
import { deleteAd, getAutogalleries, getMyads, getUser } from '@/utils/Request';
import { isGalleryAd } from '@/utils/services/galleryPanel';
import { getBrandIndex } from '@/utils/services/brands';
import Link from 'next/link';
import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';

const PAGE_SIZE = 8;

export async function getServerSideProps(context) {
  const authResult = await withAuth(context);

  if (authResult.redirect) {
    return authResult;
  }
  const token = await getToken(context);

  const [userdata, galleries, myads, brandIndex] = await Promise.all([
    getUser(token).catch(() => null),
    getAutogalleries(token).catch(() => []),
    getMyads(token).catch(() => []),
    getBrandIndex().catch(() => ({})),
  ]);

  const list = Array.isArray(galleries) ? galleries : [];
  const requested = context.query?.g;
  const gallery =
    list.find((item) => String(item?.GalleryId) === String(requested)) || list[0] || null;

  if (!gallery) {
    return { redirect: { destination: '/dashboard/gallery', permanent: false } };
  }

  return {
    props: {
      user: userdata ?? null,
      gallery,
      ads: (Array.isArray(myads) ? myads : []).filter((ad) => isGalleryAd(ad, gallery)),
      brandIndex,
      token: token || '',
    },
  };
}

const adStatus = (ad) => {
  if (ad?.IsExpired) return 'expired';
  if (ad?.ExpiryDate && calculateDaysLeft(ad.ExpiryDate) <= 0) return 'expired';
  return ad?.IsActive ? 'active' : 'review';
};

const TABS = [
  { key: 'all', label: 'همه آگهی‌ها', short: 'همه' },
  { key: 'active', label: 'فعال', short: 'فعال' },
  { key: 'review', label: 'در حال بررسی', short: 'بررسی' },
  { key: 'expired', label: 'منقضی شده', short: 'منقضی' },
];

const SORTS = [
  { key: 'newest', label: 'جدیدترین' },
  { key: 'oldest', label: 'قدیمی‌ترین' },
  { key: 'expensive', label: 'گران‌ترین' },
  { key: 'cheapest', label: 'ارزان‌ترین' },
];

const fieldClass =
  'flex h-11 items-center gap-2 rounded-xl border border-[#E6E8EC] bg-white px-3 text-[13px] text-[#1E2A3A] sm:h-12 sm:gap-2.5 sm:px-3.5 sm:text-[14px]';

const GalleryAds = ({ user, gallery, ads, brandIndex = {}, token }) => {
  const [list, setList] = useState(ads);
  const [tab, setTab] = useState('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [removing, setRemoving] = useState(null);

  const withStatus = useMemo(() => list.map((ad) => ({ ad, status: adStatus(ad) })), [list]);

  const counts = useMemo(
    () => ({
      all: withStatus.length,
      active: withStatus.filter((item) => item.status === 'active').length,
      review: withStatus.filter((item) => item.status === 'review').length,
      expired: withStatus.filter((item) => item.status === 'expired').length,
    }),
    [withStatus]
  );

  const visible = useMemo(() => {
    const term = normalizeSearchTerm(query);
    const filtered = withStatus
      .filter((item) => (tab === 'all' ? true : item.status === tab))
      .filter((item) => !term || normalizeSearchTerm(item.ad?.Title).includes(term));

    const value = (ad) => Number(ad?.Price) || 0;
    const time = (ad) => new Date(ad?.PublishDate || 0).getTime();

    const sorted = [...filtered];
    if (sort === 'newest') sorted.sort((a, b) => time(b.ad) - time(a.ad));
    if (sort === 'oldest') sorted.sort((a, b) => time(a.ad) - time(b.ad));
    if (sort === 'expensive') sorted.sort((a, b) => value(b.ad) - value(a.ad));
    if (sort === 'cheapest') sorted.sort((a, b) => value(a.ad) - value(b.ad));

    return sorted;
  }, [withStatus, tab, query, sort]);

  const pages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const slice = visible.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const switchTab = (key) => {
    setTab(key);
    setPage(1);
  };

  const removeAd = async (ad) => {
    const adId = pickField(ad, ['AdId']);
    if (!adId || removing) return;
    if (!window.confirm('این آگهی حذف شود؟')) return;

    setRemoving(adId);

    try {
      await deleteAd(token, adId);
      setList((previous) => previous.filter((item) => pickField(item, ['AdId']) !== adId));
      toast.success('آگهی حذف شد');
    } catch (error) {
      console.error('deleteAd failed:', error);
      toast.error('حذف آگهی انجام نشد، دوباره تلاش کنید');
    }

    setRemoving(null);
  };

  return (
    <div dir="rtl" className="w-full bg-[#F6F7F9] px-3 pb-12 pt-4 sm:px-4 md:pt-7">
      <div className="mx-auto flex w-full max-w-screen-xl flex-wrap items-start gap-4 sm:gap-6">
        <AccountSidebar user={user} />

        <section className="flex min-w-0 flex-[999_1_560px] flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 sm:py-1">
            <Link
              href={`/dashboard/gallery?g=${gallery.GalleryId}`}
              aria-label="بازگشت به پنل گالری"
              className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-[#FFF1E8] sm:h-11 sm:w-11"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8590C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </Link>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <h1 className="m-0 text-[17px] font-extrabold text-[#1E2A3A] sm:text-[22px]">آگهی‌های گالری</h1>
              <p className="m-0 line-clamp-1 text-[11.5px] text-[#5B6575] sm:text-[13px]">
                {gallery.Name} — مدیریت آگهی‌های منتشرشده با نام گالری و ارتقای آن‌ها
              </p>
            </div>
            <Link
              href={`/createad?gl=${gallery.GalleryId}`}
              className="hidden h-11 items-center justify-center rounded-xl bg-gradient-orange px-4 text-[13.5px] font-bold text-white sm:inline-flex"
            >
              + ثبت آگهی
            </Link>
          </div>

          <div className="flex gap-1.5 sm:grid sm:grid-cols-4 sm:gap-0 sm:overflow-hidden sm:rounded-[14px] sm:border sm:border-[#E6E8EC] sm:bg-white">
            {TABS.map((item) => {
              const active = tab === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => switchTab(item.key)}
                  className={`flex h-9 flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-full px-2 text-[12.5px] sm:h-14 sm:gap-2 sm:rounded-none sm:border-0 sm:border-b-[3px] sm:bg-white sm:px-0 sm:text-[14px] ${
                    active
                      ? 'bg-gradient-orange font-bold text-white sm:bg-none sm:bg-white sm:border-primary sm:text-[#C2410C]'
                      : 'border border-[#E6E8EC] bg-white text-[#1E2A3A] sm:border-transparent'
                  }`}
                >
                  <span className="sm:hidden">{item.short}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                  <span
                    className={`flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10.5px] sm:h-6 sm:min-w-[24px] sm:px-1.5 sm:text-[12px] ${
                      active
                        ? 'bg-white/25 text-white sm:bg-primary sm:text-white'
                        : 'bg-[#EEF0F3] text-[#3D4757]'
                    }`}
                  >
                    {toPersianDigits(counts[item.key])}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex gap-2 sm:gap-3">
            <label className={`${fieldClass} min-w-0 flex-1`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5B6575" strokeWidth="2" strokeLinecap="round" className="flex-none">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                placeholder="جستجوی آگهی…"
                className="min-w-0 flex-1 border-0 bg-transparent text-[14px] outline-none"
              />
            </label>

            <label className={`${fieldClass} flex-none sm:flex-[0_1_220px]`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5B6575" strokeWidth="1.8" strokeLinecap="round" className="flex-none">
                <path d="M7 4v16M3 16l4 4 4-4M17 20V4M13 8l4-4 4 4" />
              </svg>
              <span className="hidden flex-none text-[#5B6575] sm:inline">مرتب‌سازی:</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="min-w-0 flex-1 border-0 bg-transparent text-[13px] outline-none sm:text-[14px]"
              >
                {SORTS.map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex flex-col gap-3.5">
            {slice.map((item) => (
              <MyAdCard
                key={pickField(item.ad, ['AdId'])}
                ad={item.ad}
                status={item.status}
                onDelete={removeAd}
                deleting={removing === pickField(item.ad, ['AdId'])}
                brandIndex={brandIndex}
              />
            ))}
          </div>

          {slice.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-[#E6E8EC] bg-white px-6 py-16 text-center">
              <h3 className="text-[16px] font-bold text-[#1E2A3A]">
                {list.length === 0 ? 'این گالری هنوز آگهی ندارد' : 'آگهی‌ای با این فیلتر پیدا نشد'}
              </h3>
              <p className="pt-2 text-[13px] text-[#5B6575]">
                {list.length === 0 ? 'آگهی را از همین‌جا ثبت کنید تا با نام گالری منتشر شود' : 'فیلتر یا جستجو را تغییر دهید'}
              </p>
              {list.length === 0 && (
                <Link
                  href={`/createad?gl=${gallery.GalleryId}`}
                  className="mt-5 flex h-11 items-center justify-center rounded-xl bg-gradient-orange px-6 text-[14px] font-bold text-white"
                >
                  ثبت آگهی گالری
                </Link>
              )}
            </div>
          )}

          {pages > 1 && (
            <nav className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPage(Math.max(1, current - 1))}
                disabled={current === 1}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E6E8EC] bg-white disabled:opacity-40"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E2A3A" strokeWidth="2" strokeLinecap="round">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>

              {Array.from({ length: pages }, (unused, index) => index + 1).map((number) => (
                <button
                  key={number}
                  type="button"
                  onClick={() => setPage(number)}
                  className={`h-10 w-10 rounded-full text-[14px] ${
                    number === current
                      ? 'bg-gradient-orange font-bold text-white'
                      : 'border border-[#E6E8EC] bg-white text-[#1E2A3A]'
                  }`}
                >
                  {toPersianDigits(number)}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setPage(Math.min(pages, current + 1))}
                disabled={current === pages}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E6E8EC] bg-white disabled:opacity-40"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E2A3A" strokeWidth="2" strokeLinecap="round">
                  <path d="M15 6l-6 6 6 6" />
                </svg>
              </button>
            </nav>
          )}
        </section>
      </div>
    </div>
  );
};

export default GalleryAds;
