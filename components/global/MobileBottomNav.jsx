import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';

const items = [
  {
    href: '/createad',
    label: 'ثبت آگهی',
    icon: (
      <>
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <path d="M12 8.5v7M8.5 12h7" />
      </>
    ),
  },
  {
    href: '/dashboard/chat',
    label: 'چت ها',
    icon: (
      <>
        <path d="M4 18.5V7a3.5 3.5 0 0 1 3.5-3.5h9A3.5 3.5 0 0 1 20 7v6a3.5 3.5 0 0 1-3.5 3.5H8.6L4 20z" />
        <path d="M8.5 10h.01M12 10h.01M15.5 10h.01" />
      </>
    ),
  },
  {
    href: '/',
    label: 'خانه',
    icon: (
      <>
        <path d="M3.5 10.2 12 3.5l8.5 6.7V19a1.5 1.5 0 0 1-1.5 1.5h-4.2V15a1.3 1.3 0 0 0-1.3-1.3h-3a1.3 1.3 0 0 0-1.3 1.3v5.5H5A1.5 1.5 0 0 1 3.5 19z" />
      </>
    ),
  },
  {
    href: '/autogallery',
    label: 'گالری ها',
    icon: (
      <>
        <path d="M4 10.5V20h16v-9.5" />
        <path d="M3 10.5 5.2 5h13.6L21 10.5a2.6 2.6 0 0 1-4.5 1.8 2.6 2.6 0 0 1-4.5 0 2.6 2.6 0 0 1-4.5 0A2.6 2.6 0 0 1 3 10.5Z" />
        <path d="M9.5 20v-4.5h5V20" />
      </>
    ),
  },
  {
    href: '/auctions',
    label: 'مزایده ها',
    icon: (
      <>
        <path d="M8 4.5h8l1.5 3.5h-11z" />
        <rect x="4" y="8" width="16" height="12.5" rx="2.5" />
        <path d="M9 13.5l2 2 4-4" />
      </>
    ),
  },
];

const isActive = (pathname, href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

const MobileBottomNav = () => {
  const router = useRouter();
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const idle = useRef(null);

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY.current) >= 8) {
        setHidden(y > 80);
        lastY.current = y;
      }
      clearTimeout(idle.current);
      idle.current = setTimeout(() => setHidden(false), 250);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(idle.current);
    };
  }, []);

  useEffect(() => {
    setHidden(false);
  }, [router.asPath]);

  return (
    <>
      <div className="h-[calc(92px+env(safe-area-inset-bottom))] lg:hidden" />
      <nav
        dir="rtl"
        aria-label="منوی پایین"
        className={`fixed inset-x-0 bottom-0 z-30 px-4 pb-[calc(14px+env(safe-area-inset-bottom))] transition-transform duration-300 lg:hidden ${
          hidden ? 'translate-y-[calc(100%+12px)]' : 'translate-y-0'
        }`}
      >
        <ul className="mx-auto flex h-[66px] max-w-[420px] items-center justify-between rounded-full bg-[#1E2A3A]/95 px-2.5 shadow-[0_14px_36px_rgba(16,24,35,.35)] backdrop-blur-md">
          {items.map((item) => {
            const active = isActive(router.pathname, item.href);
            return (
              <li key={item.href} className="flex flex-1 justify-center">
                <Link
                  href={item.href}
                  aria-label={item.label}
                  aria-current={active ? 'page' : undefined}
                  className={`flex h-[50px] w-[50px] items-center justify-center rounded-full transition-all ${
                    active
                      ? 'bg-gradient-orange text-white shadow-[0_6px_18px_rgba(255,94,0,.45)]'
                      : 'text-[#AAB4C3] hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="23"
                    height="23"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={active ? 2 : 1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {item.icon}
                  </svg>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

export default MobileBottomNav;
