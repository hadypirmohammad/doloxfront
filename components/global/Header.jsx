import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { destroyCookie } from 'nookies';

const navLinks = [
  { href: '/ads', label: 'خرید خودرو' },
  { href: '/auctions', label: 'مزایده' },
  { href: '/khalafi', label: 'خلافی' },
  { href: '/autogallery', label: 'اتوگالری ها' },
  { href: 'https://blog.dolox.ir', label: 'اخبار', external: true },
  { href: '/about', label: 'درباره ما' },
];

const mobileNavLinks = [
  { href: '/ads', label: 'خرید خودرو' },
  { href: '/auctions', label: 'مزایده ها' },
  { href: '/autogallery', label: 'اتوگالری ها' },
  { href: '/khalafi', label: 'خلافی خودرو' },
];

const Header = ({ user }) => {
  const [drawer, setDrawer] = useState(false);
  const router = useRouter();

  const toggleDrawer = () => setDrawer((prev) => !prev);
  const closeDrawer = () => setDrawer(false);

  const handleLogout = async () => {
    destroyCookie(null, 'access');
    destroyCookie(null, 'refresh');
    await fetch('/api/logout', { method: 'POST' });
    await router.push('/login');
    router.reload();
  };

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
            + ثبت اتوگالری
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
            <div dir="ltr" className="dropdown dropdown-bottom dropdown-end">
              <div
                tabIndex={0}
                role="button"
                aria-label="حساب کاربری"
                className="flex h-10 w-10 items-center justify-center gap-2 rounded-xl border border-[#E0E0E0] sm:w-auto sm:px-3 lg:h-11"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 12 12" fill="none">
                  <path d="M5.66667 0C6.41811 0 7.13878 0.298511 7.67014 0.829864C8.20149 1.36122 8.5 2.08189 8.5 2.83333C8.5 3.58478 8.20149 4.30545 7.67014 4.8368C7.13878 5.36816 6.41811 5.66667 5.66667 5.66667C4.91522 5.66667 4.19455 5.36816 3.6632 4.8368C3.13184 4.30545 2.83333 3.58478 2.83333 2.83333C2.83333 2.08189 3.13184 1.36122 3.6632 0.829864C4.19455 0.298511 4.91522 0 5.66667 0ZM5.66667 7.08333C8.7975 7.08333 11.3333 8.35125 11.3333 9.91667V11.3333H0V9.91667C0 8.35125 2.53583 7.08333 5.66667 7.08333Z" fill="#243b53" />
                </svg>
                <span className="hidden max-w-[120px] truncate text-[13px] text-secondary sm:inline">
                  {user?.PhoneNumber || user?.username || 'حساب کاربری'}
                </span>
              </div>
              <ul dir="rtl" tabIndex={0} className="dropdown-content z-[1] mt-2 w-52 rounded-2xl bg-white p-2 shadow-lg">
                <li>
                  <Link className="flex h-10 items-center gap-2 rounded-xl pr-2 text-sm text-[#8B7676] hover:bg-base-300" href="/dashboard/profile">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path fillRule="evenodd" clipRule="evenodd" d="M3.33333 2.66667C3.33333 1.95942 3.61428 1.28115 4.11438 0.781048C4.61448 0.280951 5.29276 0 6 0C6.70724 0 7.38552 0.280951 7.88562 0.781048C8.38572 1.28115 8.66667 1.95942 8.66667 2.66667C8.66667 3.37391 8.38572 4.05219 7.88562 4.55229C7.38552 5.05238 6.70724 5.33333 6 5.33333C5.29276 5.33333 4.61448 5.05238 4.11438 4.55229C3.61428 4.05219 3.33333 3.37391 3.33333 2.66667ZM3.33333 6.66667C2.44928 6.66667 1.60143 7.01786 0.976311 7.64298C0.351189 8.2681 0 9.11594 0 10C0 10.5304 0.210714 11.0391 0.585787 11.4142C0.960859 11.7893 1.46957 12 2 12H10C10.5304 12 11.0391 11.7893 11.4142 11.4142C11.7893 11.0391 12 10.5304 12 10C12 9.11594 11.6488 8.2681 11.0237 7.64298C10.3986 7.01786 9.55072 6.66667 8.66667 6.66667H3.33333Z" fill="#8B7676" />
                    </svg>
                    مشخصات کاربری
                  </Link>
                </li>
                <li>
                  <Link className="flex h-10 items-center gap-2 rounded-xl pr-2 text-sm text-[#8B7676] hover:bg-base-300" href="/dashboard">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2.16667 0C1.59203 0 1.04093 0.228273 0.634602 0.634602C0.228273 1.04093 0 1.59203 0 2.16667V9.83333C0 10.408 0.228273 10.9591 0.634602 11.3654C1.04093 11.7717 1.59203 12 2.16667 12H9.83333C10.408 12 10.9591 11.7717 11.3654 11.3654C11.7717 10.9591 12 10.408 12 9.83333V2.16667C12 1.59203 11.7717 1.04093 11.3654 0.634602C10.9591 0.228273 10.408 0 9.83333 0H2.16667ZM2.16667 11C1.85725 11 1.5605 10.8771 1.34171 10.6583C1.12292 10.4395 1 10.1428 1 9.83333V3.66667H11V9.83333C11 10.1428 10.8771 10.4395 10.6583 10.6583C10.4395 10.8771 10.1428 11 9.83333 11H2.16667ZM2.5 4.66667C2.36739 4.66667 2.24021 4.71935 2.14645 4.81311C2.05268 4.90688 2 5.03406 2 5.16667V8.5C2 8.776 2.224 9 2.5 9H5.83333C5.96594 9 6.09312 8.94732 6.18689 8.85355C6.28065 8.75979 6.33333 8.63261 6.33333 8.5V5.16667C6.33333 5.03406 6.28065 4.90688 6.18689 4.81311C6.09312 4.71935 5.96594 4.66667 5.83333 4.66667H2.5ZM3 8V5.66667H5.33333V8H3Z" fill="#8B7676" />
                    </svg>
                    آگهی های من
                  </Link>
                </li>
                <li>
                  <Link className="flex h-10 items-center gap-2 rounded-xl pr-2 text-sm text-[#8B7676] hover:bg-base-300" href="/dashboard/auto">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="9" viewBox="0 0 12 9" fill="none">
                      <path d="M11.8523 3.55571L10.7077 2.49232L9.69231 0.461552C9.60512 0.319758 9.48288 0.202808 9.33737 0.121971C9.19187 0.0411328 9.02799 -0.000868404 8.86154 1.36102e-05H3.13846C2.97201 -0.000868404 2.80813 0.0411328 2.66263 0.121971C2.51712 0.202808 2.39488 0.319758 2.30769 0.461552L1.29231 2.49232L0.147692 3.55571C0.101063 3.59895 0.0638743 3.65137 0.0384589 3.70966C0.0130435 3.76796 -4.9945e-05 3.83088 1.43165e-07 3.89448V7.84617C1.43165e-07 7.96858 0.0486264 8.08597 0.135182 8.17253C0.221737 8.25908 0.339131 8.30771 0.461539 8.30771H2.30769C2.49231 8.30771 2.76923 8.12309 2.76923 7.93848V7.38463H9.23077V7.84617C9.23077 8.03078 9.41538 8.30771 9.6 8.30771H11.5385C11.6609 8.30771 11.7783 8.25908 11.8648 8.17253C11.9514 8.08597 12 7.96858 12 7.84617V3.89448C12.0001 3.83088 11.987 3.76796 11.9615 3.70966C11.9361 3.65137 11.8989 3.59895 11.8523 3.55571ZM3.23077 0.923091H8.76923L9.69231 2.76924H2.30769L3.23077 0.923091ZM3.69231 5.16925C3.69231 5.35386 3.41538 5.53848 3.23077 5.53848H1.29231C1.10769 5.53848 0.923077 5.26155 0.923077 5.07694V4.06155C1.01538 3.78463 1.2 3.60001 1.47692 3.69232L3.32308 4.06155C3.50769 4.06155 3.69231 4.33848 3.69231 4.52309V5.16925ZM11.0769 5.07694C11.0769 5.26155 10.8923 5.53848 10.7077 5.53848H8.76923C8.58462 5.53848 8.30769 5.35386 8.30769 5.16925V4.52309C8.30769 4.33848 8.49231 4.06155 8.67692 4.06155L10.5231 3.69232C10.8 3.60001 10.9846 3.78463 11.0769 4.06155V5.07694Z" fill="#8B7676" />
                    </svg>
                    اتو گالری های من
                  </Link>
                </li>
                <li>
                  <Link className="flex h-10 items-center gap-2 rounded-xl pr-2 text-sm text-[#8B7676] hover:bg-base-300" href="/dashboard/chat">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="9" viewBox="0 0 10 9" fill="none">
                      <path d="M5 0C7.75 0 10 1.79 10 4C10 6.21 7.75 8 5 8C4.38 8 3.785 7.91 3.235 7.75C1.775 9 0 9 0 9C1.165 7.835 1.35 7.05 1.375 6.75C0.525 6.035 0 5.065 0 4C0 1.79 2.25 0 5 0Z" fill="#8B7676" />
                    </svg>
                    چت ها
                  </Link>
                </li>
                <li>
                  <button type="button" className="flex h-10 w-full items-center gap-2 rounded-xl pr-2 text-sm text-primary hover:bg-base-300" onClick={handleLogout}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="9" viewBox="0 0 10 9" fill="none">
                      <path d="M8 5.5H6.5V6.5H8V5.5ZM9.5 9H0V4L4 0H9C9.13261 0 9.25979 0.0526784 9.35355 0.146447C9.44732 0.240215 9.5 0.367392 9.5 0.5V9ZM4.415 1L1.415 4H8.5V1H4.415Z" fill="#FF5E00" />
                    </svg>
                    خروج
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Mobile drawer — keep off-canvas when closed so it cannot widen the page */}
      <div
        className={`fixed inset-y-0 right-0 z-50 flex h-screen w-[280px] max-w-[85vw] flex-col bg-white p-5 shadow-xl transition-transform duration-300 ease-in-out lg:hidden ${
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

        <ul className="flex flex-col gap-1">
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

        <div className="mt-auto flex flex-col gap-2 pt-6">
          <Link href="/createautogallery" onClick={closeDrawer} className="flex h-11 items-center justify-center rounded-xl bg-secondary text-[14px] text-white">
            + ثبت اتوگالری
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
