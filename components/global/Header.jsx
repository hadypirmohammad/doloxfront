import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/router';

const navLinks = [
  { href: '/ads', label: 'خرید خودرو' },
  { href: '/auctions', label: 'مزایده' },
  { href: '/khalafi', label: 'خلافی' },
  { href: '/autogallery', label: 'گالری ها' },
  { href: 'https://blog.dolox.ir', label: 'اخبار', external: true },
  { href: '/about', label: 'درباره ما' },
];

const mobileNavLinks = [
  { href: '/ads', label: 'خرید خودرو' },
  { href: '/auctions', label: 'مزایده ها' },
  { href: '/autogallery', label: 'گالری ها' },
  { href: '/khalafi', label: 'خلافی خودرو' },
];

const Header = ({ user }) => {
  const [drawer, setDrawer] = useState(false);
  const router = useRouter();

  const toggleDrawer = () => setDrawer((prev) => !prev);
  const closeDrawer = () => setDrawer(false);

  const isActive = (path) => {
    if (path.startsWith('/#')) return false;
    return router.pathname === path ? 'text-primary' : 'text-secondary';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#EFEFEF] bg-white">
      <div className="mx-auto flex h-[72px] max-w-screen-xl items-center justify-between gap-3 px-4 lg:h-[84px]">
        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={toggleDrawer}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E8E8E8] lg:hidden"
          aria-label="منو"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 16 16" fill="none">
            <path d="M2.5 4H13.5M2.5 8H13.5M2.5 12H13.5" stroke="#243b53" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center" onClick={closeDrawer}>
          <Image
            src="/media/images/dolox-logo.png"
            width={200}
            height={56}
            alt="Dolox"
            className="h-6 w-auto object-contain sm:h-7 lg:h-8"
            quality={90}
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden flex-1 items-center justify-center lg:flex">
          <ul className="flex items-center gap-5 xl:gap-7">
            {navLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`text-[14px] transition-colors hover:text-primary ${isActive(item.href)}`}
                  {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/createautogallery"
            className="hidden h-10 items-center justify-center rounded-xl border border-[#E0E0E0] bg-secondary px-3 text-[13px] text-white transition hover:opacity-90 lg:inline-flex lg:h-11 lg:px-4 lg:text-[14px]"
          >
            + ثبت گالری
          </Link>
          <Link
            href="/createad"
            className="hidden h-10 items-center justify-center rounded-xl bg-primary px-3 text-[13px] text-white transition hover:opacity-90 sm:inline-flex lg:h-11 lg:px-4 lg:text-[14px]"
          >
            + ثبت آگهی خودرو
          </Link>

          {!user ? (
            <Link
              href="/login"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-[#E0E0E0] bg-secondary px-3 text-[12px] text-white transition hover:opacity-90 sm:h-10 sm:px-4 sm:text-[13px] lg:h-11 lg:text-[14px]"
            >
              ورود / ثبت نام
            </Link>
          ) : (
            <Link
              href="/dashboard/profile"
              dir="ltr"
              aria-label="مشخصات کاربری"
              className="flex h-10 w-10 items-center justify-center gap-2 rounded-xl border border-[#E0E0E0] transition-colors hover:border-primary sm:w-auto sm:px-3 lg:h-11"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 12 12" fill="none">
                <path d="M5.66667 0C6.41811 0 7.13878 0.298511 7.67014 0.829864C8.20149 1.36122 8.5 2.08189 8.5 2.83333C8.5 3.58478 8.20149 4.30545 7.67014 4.8368C7.13878 5.36816 6.41811 5.66667 5.66667 5.66667C4.91522 5.66667 4.19455 5.36816 3.6632 4.8368C3.13184 4.30545 2.83333 3.58478 2.83333 2.83333C2.83333 2.08189 3.13184 1.36122 3.6632 0.829864C4.19455 0.298511 4.91522 0 5.66667 0ZM5.66667 7.08333C8.7975 7.08333 11.3333 8.35125 11.3333 9.91667V11.3333H0V9.91667C0 8.35125 2.53583 7.08333 5.66667 7.08333Z" fill="#243b53" />
              </svg>
              <span className="hidden max-w-[120px] truncate text-[13px] text-secondary sm:inline">
                {user?.PhoneNumber || user?.username || 'حساب کاربری'}
              </span>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile drawer — keep off-canvas when closed so it cannot widen the page */}
      <div
        className={`fixed inset-y-0 right-0 z-50 flex h-screen max-h-[100dvh] w-[280px] max-w-[85vw] flex-col overflow-y-auto overscroll-contain bg-white p-5 pb-[calc(20px+env(safe-area-inset-bottom))] shadow-xl transition-transform duration-300 ease-in-out lg:hidden ${
          drawer ? 'translate-x-0' : 'pointer-events-none translate-x-full'
        }`}
        aria-hidden={!drawer}
      >
        <div className="mb-6 flex items-center justify-between">
          <Image src="/media/images/dolox-logo.png" width={180} height={50} alt="Dolox" quality={90} className="h-7 w-auto object-contain" />
          <button type="button" onClick={closeDrawer} className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E8E8E8]" aria-label="بستن">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4L12 12M12 4L4 12" stroke="#243b53" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <ul className="flex shrink-0 flex-col gap-1">
          {mobileNavLinks.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={closeDrawer}
                className={`block rounded-xl px-3 py-3 text-[15px] transition hover:bg-base-300 ${isActive(item.href)}`}
                {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex shrink-0 flex-col gap-2 pt-6">
          <Link href="/createautogallery" onClick={closeDrawer} className="flex h-11 items-center justify-center rounded-xl bg-secondary text-[14px] text-white">
            + ثبت گالری
          </Link>
          <Link href="/createad" onClick={closeDrawer} className="flex h-11 items-center justify-center rounded-xl bg-primary text-[14px] text-white">
            + ثبت آگهی خودرو
          </Link>
          {!user && (
            <Link href="/login" onClick={closeDrawer} className="flex h-11 items-center justify-center rounded-xl border border-[#E0E0E0] text-[14px] text-secondary">
              ورود / ثبت نام
            </Link>
          )}
        </div>
      </div>

      {drawer && <div onClick={closeDrawer} className="fixed inset-0 z-40 bg-black/40 lg:hidden" />}
    </header>
  );
};

export default Header;
