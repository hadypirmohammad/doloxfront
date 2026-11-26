import AuctionStack from '@/components/HomeV2/AuctionStack';
import SectionShell from '@/components/HomeV2/SectionShell';
import { toPersianDigits } from '@/utils/Cal';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const PERKS = [
  'به‌روزرسانی روزانه آگهی‌های مزایده',
  'پوشش مزایده‌های سراسر کشور',
  'تنوع مزایده‌های خودرو، ملک و ...',
];

const Check = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mt-0.5 flex-none">
    <path d="m5 12.5 4.5 4.5L19 7" stroke="#22A45D" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ROTATE_MS = 1300;

const AuctionsV2 = ({ auctions = [], hasSubscription = false }) => {
  const [active, setActive] = useState(0);
  const [animated, setAnimated] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    if (auctions.length < 2) return undefined;
    setAnimated(true);
    return undefined;
  }, [auctions.length]);

  useEffect(() => {
    if (!animated || paused) return undefined;
    const timer = setInterval(() => {
      setActive((value) => (value + 1) % auctions.length);
    }, ROTATE_MS);
    return () => clearInterval(timer);
  }, [animated, paused, auctions.length]);

  const step = toPersianDigits(active + 1);

  const panel = (
    <SectionShell title="مزایده‌ها" href="/auctions">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10">
        <div className="flex flex-col gap-4 lg:w-[46%]">
          <span className="font-soft flex w-fit items-center gap-2 rounded-full border border-[#22A45D]/25 bg-[#22A45D]/10 px-3.5 py-1.5 text-[11.5px] text-[#1C8B4E]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22A45D]" />
            فرصت‌ها را از دست ندهید
          </span>

          <h2 className="font-soft m-0 text-[20px] leading-[1.6] text-secondary sm:text-[26px]">
            فرصت‌های مزایده را از دست ندهید!
          </h2>

          <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
            {PERKS.map((perk) => (
              <li key={perk} className="flex items-start gap-2.5 text-[13px] text-[#5B6575] sm:text-[14.5px]">
                <Check />
                {perk}
              </li>
            ))}
          </ul>

          <Link
            href="/auctions"
            className="font-soft mt-1 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-orange text-[15px] text-white transition-opacity hover:opacity-90 sm:w-fit sm:px-9"
          >
            مشاهده مزایده‌ها
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 6l-6 6 6 6" />
            </svg>
          </Link>
        </div>

        {auctions.length > 0 && (
        <div
          className="flex flex-1 flex-col gap-3"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AuctionStack
            auctions={auctions}
            active={active}
            animated={animated}
            hasSubscription={hasSubscription}
          />

          {animated && (
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11.5px] text-[#8B94A5]">
                {step} از {toPersianDigits(auctions.length)}
              </span>
              <span className="h-1 flex-1 overflow-hidden rounded-full bg-[#E3E7ED]">
                <span
                  className="block h-full rounded-full bg-gradient-orange transition-[width] duration-200"
                  style={{ width: `${((active + 1) / auctions.length) * 100}%` }}
                />
              </span>
            </div>
          )}
        </div>
        )}
      </div>
    </SectionShell>
  );

  return panel;
};

export default AuctionsV2;
