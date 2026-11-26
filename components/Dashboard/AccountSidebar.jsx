import { PREVIEW_WITHOUT_LOGIN } from '@/utils/Auth';
import { convertToShamsiAndGregorian, pickField, toPersianDigits } from '@/utils/Cal';
import { BackendURL } from '@/utils/URL';
import { mockProfile } from '@/utils/services/preview.mock';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { destroyCookie } from 'nookies';
import React from 'react';

const DEFAULT_AVATAR = '/media/images/defaultimg.png';

const resolveAvatarSrc = (avatar) => {
  if (!avatar) return DEFAULT_AVATAR;
  if (avatar.startsWith('http') || avatar.startsWith('/media')) return avatar;
  return `${BackendURL.slice(0, -1)}${avatar.startsWith('/') ? avatar : `/${avatar}`}`;
};

const accountLinks = [
  {
    href: '/dashboard/profile',
    label: 'پروفایل',
    icon: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
  },
  {
    href: '/dashboard',
    label: 'آگهی‌های من',
    icon: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </>
    ),
  },
  {
    href: '/dashboard/gallery',
    label: 'گالری من',
    icon: (
      <>
        <path d="M4 10.5V20h16v-9.5" />
        <path d="M3 10.5 5.2 5h13.6L21 10.5a2.6 2.6 0 0 1-4.5 1.8 2.6 2.6 0 0 1-4.5 0 2.6 2.6 0 0 1-4.5 0A2.6 2.6 0 0 1 3 10.5Z" />
        <path d="M9.5 20v-5h5v5" />
      </>
    ),
  },
  {
    href: '/dashboard/chat',
    label: 'پیام‌ها',
    icon: <path d="M4 5h16v11H9l-5 4z" />,
  },
  {
    href: '/wallet',
    label: 'کیف پول',
    icon: (
      <>
        <rect x="3" y="6" width="18" height="14" rx="2" />
        <path d="M16 13h2M3 10h18M6 6V4h10v2" />
      </>
    ),
  },
  {
    href: '/auctions/subscription',
    label: 'دسترسی به مزایده‌ها',
    icon: <path d="M14 4l6 6M11 7l6 6M12.5 5.5l-6 6M4 20l7-7" />,
  },
  {
    href: '/favorites',
    label: 'علاقه‌مندی‌ها',
    icon: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />,
  },
];

const infoLinks = [
  {
    href: 'https://blog.dolox.ir',
    label: 'اخبار و مقالات',
    external: true,
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </>
    ),
  },
  {
    href: '/about',
    label: 'درباره دولوکس',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5M12 8h.01" />
      </>
    ),
  },
  {
    href: '/rules',
    label: 'قوانین و مقررات',
    icon: (
      <>
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M9 8h6M9 12h6M9 16h4" />
      </>
    ),
  },
  {
    href: 'https://wa.me/989139777207',
    label: 'پشتیبانی',
    external: true,
    icon: (
      <>
        <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
        <rect x="3" y="14" width="4" height="6" rx="1.5" />
        <rect x="17" y="14" width="4" height="6" rx="1.5" />
      </>
    ),
  },
];

const shamsiDate = (value) => {
  const { shamsi } = convertToShamsiAndGregorian(value);
  if (!shamsi?.year) return '';
  return toPersianDigits(`${shamsi.year}/${String(shamsi.month).padStart(2, '0')}/${String(shamsi.day).padStart(2, '0')}`);
};

const AccountSidebar = ({ user, unread = 0 }) => {
  const router = useRouter();
  const panelUser = user || (PREVIEW_WITHOUT_LOGIN ? mockProfile : null);

  const firstName = pickField(panelUser, ['Name', 'FirstName']) || '';
  const lastName = pickField(panelUser, ['LastName', 'Family', 'FamilyName']) || '';
  const fullName = `${firstName} ${lastName}`.trim();
  const phone = pickField(panelUser, ['PhoneNumber', 'Phone', 'Mobile']) || '';
  const joined = shamsiDate(pickField(panelUser, ['RegisterDate', 'CreateDate']));

  const handleLogout = async () => {
    destroyCookie(null, 'access');
    destroyCookie(null, 'refresh');
    await fetch('/api/logout', { method: 'POST' });
    await router.push('/');
    router.reload();
  };

  const renderLink = (item) => {
    const active =
      router.pathname === item.href ||
      (item.href !== '/dashboard' && router.pathname.startsWith(`${item.href}/`));
    const content = (
      <>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="flex-none"
        >
          {item.icon}
        </svg>
        <span className="min-w-0 flex-1 truncate text-right">{item.label}</span>
        {item.href === '/dashboard/chat' && unread > 0 && (
          <span className="flex h-[22px] min-w-[22px] flex-none items-center justify-center rounded-full bg-primary px-1.5 text-[12px] text-white">
            {toPersianDigits(unread)}
          </span>
        )}
      </>
    );

    const className = `flex items-center gap-2.5 rounded-[10px] px-3 py-3 text-[14px] transition-colors ${
      active
        ? 'border-r-[3px] border-primary bg-[#FFF1E8] font-bold text-[#C2410C]'
        : 'text-[#1E2A3A] hover:bg-[#F6F7F9]'
    }`;

    if (item.external) {
      return (
        <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
          {content}
        </a>
      );
    }

    return (
      <Link key={item.href} href={item.href} className={className}>
        {content}
      </Link>
    );
  };

  return (
    <aside className="hidden w-full max-w-[300px] flex-[1_1_260px] flex-col gap-4 self-start lg:flex">
      <div className="flex flex-col gap-1 rounded-2xl border border-[#E6E8EC] bg-white px-4 pb-3 pt-6">
        <div className="flex flex-col items-center gap-1.5 border-b border-[#EEF0F3] pb-4">
          <Image
            className="h-16 w-16 rounded-full object-cover object-center"
            src={resolveAvatarSrc(pickField(panelUser, ['UserAvatar', 'Avatar']))}
            width={160}
            height={160}
            alt="profile"
          />
          {fullName && <span className="text-[16px] font-bold text-[#1E2A3A]">{fullName}</span>}
          {phone && (
            <span dir="ltr" className="text-[13px] text-[#1E2A3A]">
              {toPersianDigits(phone)}
            </span>
          )}
          {joined && (
            <span className="text-[12px] text-[#5B6575]">عضویت از {joined}</span>
          )}
        </div>

        <nav className="flex flex-col pt-2">
          {accountLinks.map(renderLink)}

          <div className="my-2 h-px bg-[#EEF0F3]" />

          {infoLinks.map(renderLink)}

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2.5 rounded-[10px] px-3 py-3 text-right text-[14px] text-[#E0472F] transition-colors hover:bg-[#FDF1EF]"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="flex-none"
            >
              <path d="M15 17l5-5-5-5M20 12H9M12 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6" />
            </svg>
            <span className="min-w-0 flex-1 truncate text-right">خروج</span>
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default AccountSidebar;
