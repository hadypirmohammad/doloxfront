import { calculateDaysLeft, convertToShamsiAndGregorian, pickField, toPersianDigits } from '@/utils/Cal';
import Link from 'next/link';

const shamsi = (value) => {
  const { shamsi: date } = convertToShamsiAndGregorian(value);
  if (!date?.year) return '';
  return toPersianDigits(`${date.year}/${String(date.month).padStart(2, '0')}/${String(date.day).padStart(2, '0')}`);
};

const UsageCard = ({ title, icon, remaining, total }) => {
  const left = Math.max(Number(remaining) || 0, 0);
  const all = Math.max(Number(total) || 0, left);
  const used = all - left;
  const percent = all > 0 ? Math.round((used / all) * 100) : 0;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#E6E8EC] bg-white p-3.5 sm:gap-3.5 sm:p-[18px]">
      <div className="flex items-center gap-2.5">
        <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-[#E6E8EC] sm:h-[42px] sm:w-[42px]">
          {icon}
        </span>
        <strong className="font-soft text-[13px] text-[#1E2A3A] sm:text-[14.5px]">{title}</strong>
      </div>

      <span className="text-[12px] text-[#5B6575] sm:text-[13px]">مصرف‌شده / کل</span>

      <div className="h-2.5 overflow-hidden rounded-full bg-[#E9EDF3]">
        <div className="h-full rounded-full bg-gradient-orange transition-all" style={{ width: `${percent}%` }} />
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="flex items-baseline gap-1.5">
          <span className="font-soft text-[18px] text-[#1E2A3A] sm:text-[22px]">{toPersianDigits(used)}</span>
          <span className="font-soft text-[18px] text-[#5B6575] sm:text-[22px]">/ {toPersianDigits(all)}</span>
        </span>
        <span className="text-[12px] text-[#5B6575] sm:text-[13px]">{toPersianDigits(left)} عدد باقیمانده</span>
      </div>
    </div>
  );
};

const GallerySubscription = ({ gallery, quota, plan, basePlan }) => {
  const free = Boolean(quota?.IsInFreePeriod);
  const endDate = free ? quota?.FreePeriodEndDate : quota?.SubscriptionEndDate;
  const daysLeft = endDate ? calculateDaysLeft(endDate) : null;
  const expiry = shamsi(endDate);

  const expiredNow = daysLeft !== null && daysLeft <= 0;
  const planName = free
    ? 'اشتراک رایگان اولیه'
    : plan?.Name || (quota?.NeedsSubscription ? 'بدون اشتراک فعال' : 'اشتراک فعال');
  const duration = plan?.DurationDays ? `${toPersianDigits(plan.DurationDays)} روزه` : '';
  const actionLabel = free
    ? 'مشاهده اشتراک‌ها'
    : quota?.NeedsSubscription || expiredNow
      ? 'خرید اشتراک'
      : 'تمدید اشتراک';

  const limits = plan || (free ? basePlan : null);
  const totalNormal = pickField(quota, ['TotalNormal', 'NormalAdsCount', 'NormalTotal']) ?? limits?.NormalAdsCount ?? 0;
  const totalLadder = pickField(quota, ['TotalLadder', 'LadderAdsCount', 'LadderTotal']) ?? limits?.LadderAdsCount ?? 0;

  return (
    <section className="flex flex-col gap-3.5 rounded-2xl border border-[#E6E8EC] bg-white p-3.5 sm:gap-4 sm:p-[18px]">
      <h2 className="font-soft m-0 text-[16px] text-[#1E2A3A] sm:text-[19px]">وضعیت اشتراک و مصرف</h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[repeat(auto-fit,minmax(210px,1fr))] sm:gap-3.5">
        <div className="flex flex-col gap-3 rounded-2xl border border-[#FFE0C8] bg-[#FFF4EC] p-3.5 sm:p-[18px]">
          <div className="flex items-center gap-2.5">
            <svg width="28" height="28" viewBox="0 0 24 24" className="flex-none">
              <path
                d="M3 8l4.5 3.5L12 5l4.5 6.5L21 8l-2 10H5z"
                fill="#F7A21B"
                stroke="#D9850A"
                strokeWidth="1"
                strokeLinejoin="round"
              />
            </svg>
            <strong className="font-soft text-[15.5px] text-[#C2410C] sm:text-[17px]">اشتراک گالری</strong>
          </div>

          <span className="font-soft text-[15px] text-[#5B6575] sm:text-[17px]">{planName}</span>

          <div className="flex flex-col gap-2 text-[12px] text-[#5B6575] sm:text-[13px]">
            {duration && (
              <span className="flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E2A3A" strokeWidth="1.8" strokeLinecap="round" className="flex-none">
                  <circle cx="12" cy="12" r="8.5" />
                  <path d="M12 7.5V12l3 2" />
                </svg>
                <span>مدت اشتراک: {duration}</span>
              </span>
            )}
            {expiry && (
              <span className="flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E2A3A" strokeWidth="1.8" strokeLinecap="round" className="flex-none">
                  <rect x="3.5" y="5" width="17" height="15" rx="2" />
                  <path d="M8 3v4M16 3v4M3.5 10h17M8 14h3" />
                </svg>
                <span>تاریخ انقضا: {expiry}</span>
              </span>
            )}
            {daysLeft !== null && (
              <span className={`flex items-center gap-2 ${daysLeft > 0 ? '' : 'text-[#E14B4B]'}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="flex-none">
                  <circle cx="12" cy="12" r="8.5" />
                  <path d="M12 8v5M12 16h.01" />
                </svg>
                <span>
                  {daysLeft > 0 ? `${toPersianDigits(daysLeft)} روز باقی‌مانده` : 'اشتراک منقضی شده است'}
                </span>
              </span>
            )}
          </div>

          <Link
            href={`/manageauto/${gallery?.GalleryId}`}
            className="mt-auto flex min-h-[46px] items-center justify-center rounded-[10px] bg-gradient-orange font-soft text-[14px] text-white sm:min-h-[48px] sm:text-[16px]"
          >
            {actionLabel}
          </Link>
        </div>

        <UsageCard
          title="میزان مصرف صدرنشین‌ها"
          remaining={quota?.RemainingLadder ?? 0}
          total={totalLadder}
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path d="M6 2.5h8l4.5 4.5v14.5H6z" fill="#1E2A3A" />
              <path d="M14 2.5V7h4.5" fill="#5B6575" />
              <path d="M9 12h6M9 15.5h6M9 19h4" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          }
        />

        <UsageCard
          title="میزان مصرف آگهی‌ها"
          remaining={quota?.RemainingNormal ?? 0}
          total={totalNormal}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path
                d="M5 11l1.8-5A2 2 0 0 1 8.7 4.6h6.6a2 2 0 0 1 1.9 1.4L19 11v7.5a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-1V17h-7v1.5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z"
                fill="#1E2A3A"
              />
              <path d="M7.2 10.5l1.2-3.6h7.2l1.2 3.6z" fill="#FFFFFF" />
              <circle cx="8" cy="13.6" r="1.3" fill="#FFFFFF" />
              <circle cx="16" cy="13.6" r="1.3" fill="#FFFFFF" />
            </svg>
          }
        />
      </div>

      {quota?.NeedsSubscription && (
        <p className="m-0 rounded-xl bg-[#FFF1E8] px-3.5 py-3 text-center text-[12px] text-[#C2410C] sm:text-[13px]">
          {quota?.Reason || 'برای ثبت آگهی در این گالری نیاز به خرید اشتراک دارید'}
        </p>
      )}
    </section>
  );
};

export default GallerySubscription;
