import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { destroyCookie } from 'nookies';
import React from 'react';
import { BackendURL } from '@/utils/URL';
import { PREVIEW_WITHOUT_LOGIN } from '@/utils/Auth';
import { mockProfile } from '@/utils/services/preview.mock';

const DEFAULT_AVATAR = '/media/images/defaultimg.png';

const resolveAvatarSrc = (avatar) => {
    if (!avatar) return DEFAULT_AVATAR;
    if (avatar.startsWith('http') || avatar.startsWith('/media')) return avatar;
    return `${BackendURL.slice(0, -1)}${avatar.startsWith('/') ? avatar : `/${avatar}`}`;
};

const links = [
    {
        href: '/dashboard/profile',
        label: 'مشخصات کاربری',
        icon: (
            <>
                <circle cx="12" cy="8" r="3.6" />
                <path d="M4.8 20c.8-3.6 3.7-5.6 7.2-5.6s6.4 2 7.2 5.6" />
            </>
        ),
    },
    {
        href: '/dashboard',
        label: 'آگهی های من',
        icon: (
            <>
                <rect x="3.5" y="4.5" width="17" height="15" rx="3" />
                <path d="M3.5 9.5h17" />
            </>
        ),
    },
    {
        href: '/dashboard/gallery',
        label: 'گالری من',
        icon: (
            <>
                <path d="M4 15.5h16v3H4z" />
                <path d="M6 15.5l1.6-5.2h8.8L18 15.5" />
            </>
        ),
    },
    {
        href: '/dashboard/chat',
        label: 'چت ها',
        icon: <path d="M20 12.5c0 3.9-3.6 7-8 7-1 0-2-.15-2.9-.45L4.5 20.5l1.1-3.3A6.6 6.6 0 0 1 4 12.5c0-3.9 3.6-7 8-7s8 3.1 8 7Z" />,
    },
];

const DashboardPanel = ({ user }) => {
    const router = useRouter();
    const panelUser = user || (PREVIEW_WITHOUT_LOGIN ? mockProfile : null);

    const handleLogout = async () => {
        destroyCookie(null, 'access');
        destroyCookie(null, 'refresh');
        await fetch('/api/logout', { method: 'POST' });
        await router.push('/');
        router.reload();
    };

    return (
        <aside className="hidden w-3/12 min-w-[240px] max-w-[280px] flex-col gap-[22px] self-start rounded-[20px] border border-[#ececf0] bg-white p-5 py-6 md:flex">
            <div className="flex flex-col items-center gap-3">
                <Image
                    className="h-[92px] w-[92px] rounded-full object-cover object-center"
                    src={resolveAvatarSrc(panelUser?.UserAvatar)}
                    width={150}
                    height={150}
                    alt="profile pic"
                />
                <span dir="ltr" className="text-[15px] font-bold text-[#222831]">
                    {panelUser?.PhoneNumber || ''}
                </span>
            </div>

            <div className="h-px bg-[#f1f2f4]" />

            <span className="text-base font-bold text-[#222831]">خوش آمدید 👋</span>

            <nav className="flex flex-col gap-1">
                {links.map((item) => {
                    const active = router.pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-[11px] rounded-xl px-3 py-[11px] text-[14.5px] transition-colors ${
                                active ? 'bg-[#fff6f1] font-medium text-primary' : 'text-[#2b3138] hover:bg-[#f6f7f9]'
                            }`}
                        >
                            <svg
                                width="17"
                                height="17"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke={active ? '#FF5E00' : '#6f7782'}
                                strokeWidth="1.8"
                                className="flex-none"
                            >
                                {item.icon}
                            </svg>
                            {item.label}
                        </Link>
                    );
                })}

                <div className="my-2 h-px bg-[#f1f2f4]" />

                <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-[11px] rounded-xl px-3 py-[11px] text-right text-[14.5px] text-[#e0472f] transition-colors hover:bg-[#fdf1ef]"
                >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#e0472f" strokeWidth="1.8" className="flex-none">
                        <path d="M14 5.5H7.5A2.5 2.5 0 0 0 5 8v8a2.5 2.5 0 0 0 2.5 2.5H14" />
                        <path d="M17.5 12H10M14.5 9l3 3-3 3" />
                    </svg>
                    خروج
                </button>
            </nav>
        </aside>
    );
};

export default DashboardPanel;
