import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

const items = [
  {
    href: '/createad',
    label: 'ثبت آگهی',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v8M8 12h8" />
      </>
    ),
  },
  {
    href: '/dashboard/chat',
    label: 'چت ها',
    icon: (
      <>
        <path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.1A8 8 0 1 1 20 12z" />
        <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" />
      </>
    ),
  },
  {
    href: '/',
    label: 'خانه',
    icon: (
      <>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
      </>
    ),
  },
  {
    href: '/auctions',
    label: 'مزایده ها',
    icon: (
      <>
        <rect x="9.5" y="6" width="10" height="5" rx="1.2" transform="rotate(45 14.5 8.5)" />
        <path d="M12.7 10.3 4 19" />
        <path d="M13 21h8" />
      </>
    ),
  },
];

const isActive = (pathname, href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

const MobileBottomNav = () => {
  const router = useRouter();

  return (
    <>
      <div className="h-[calc(64px+env(safe-area-inset-bottom))] lg:hidden" />
      <nav
        dir="rtl"
        aria-label="منوی پایین"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-[#EFEFEF] bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-6px_18px_rgba(36,59,83,0.06)] lg:hidden"
      >
        <ul className="mx-auto grid h-16 max-w-screen-sm grid-cols-4">
          {items.map((item) => {
            const active = isActive(router.pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`flex h-full flex-col items-center justify-center gap-1 transition-colors ${
                    active ? 'text-primary' : 'text-[#8A8F98] hover:text-secondary'
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={active ? 2.2 : 1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {item.icon}
                  </svg>
                  <span className={`text-[11px] leading-none ${active ? 'font-bold' : ''}`}>{item.label}</span>
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
