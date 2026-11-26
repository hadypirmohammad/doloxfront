import { galleryBadge } from '@/utils/services/autoGalleries';
import { isFavorite, toggleFavorite } from '@/utils/favorites';
import { resolveBackendMediaUrl } from '@/utils/media';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const COVER_FALLBACK = '/media/images/defaultimg.png';

const addressLine = (gallery) => {
    const parts = [gallery?.ProvinceName, gallery?.CityName].filter(Boolean);
    if (parts.length) return parts.join(' ، ');
    return String(gallery?.Adress || '').split('،').slice(0, 2).join(' ، ').trim();
};

const AutoItem = ({ auto }) => {
    const [cover, setCover] = useState(() => resolveBackendMediaUrl(auto?.Cover, COVER_FALLBACK));
    const [logo, setLogo] = useState(() => resolveBackendMediaUrl(auto?.Profile, ''));
    const [liked, setLiked] = useState(false);
    const badge = galleryBadge(auto);
    const address = addressLine(auto);
    const phone = auto?.Phone || auto?.Mobile || '';

    useEffect(() => {
        setLiked(auto?.IsFavorite ?? isFavorite('gallery', auto?.GalleryId));
    }, [auto]);

    return (
        <div dir='rtl' className='overflow-hidden rounded-[18px] border border-[#EEF1F6] bg-white shadow-[0_8px_24px_rgba(36,59,83,0.05)] transition-shadow hover:shadow-[0_14px_34px_rgba(36,59,83,0.1)]'>
            <div className='relative h-[190px] w-full bg-[#F1F3F7] sm:h-[215px]'>
                <Image
                    src={cover}
                    alt={auto?.Name || 'گالری'}
                    fill
                    sizes='(max-width: 768px) 100vw, 50vw'
                    className='object-cover'
                    onError={() => setCover(COVER_FALLBACK)}
                />

                {badge && (
                    <span className='absolute right-3 top-3 flex items-center gap-1.5 rounded-lg bg-gradient-orange px-2.5 py-1 text-[11.5px] font-bold text-white shadow-sm'>
                        <svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                            <path d='M12 2.8 20 5.6v6c0 4.4-3.2 7.8-8 9.6-4.8-1.8-8-5.2-8-9.6v-6z' />
                            <path d='m8.6 12.2 2.4 2.3 4.4-4.8' />
                        </svg>
                        {badge}
                    </span>
                )}

                <button
                    type='button'
                    aria-label={liked ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
                    aria-pressed={liked}
                    onClick={async () => setLiked(await toggleFavorite('gallery', auto?.GalleryId, liked, auto))}
                    className='absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/45 text-white transition-colors hover:bg-black/60'
                >
                    <svg
                        width='17'
                        height='17'
                        viewBox='0 0 24 24'
                        fill={liked ? '#FF5E00' : 'none'}
                        stroke={liked ? '#FF5E00' : 'currentColor'}
                        strokeWidth='1.9'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    >
                        <path d='M12 20s-7.4-4.3-7.4-9.2A4.1 4.1 0 0 1 12 8.3a4.1 4.1 0 0 1 7.4 2.5C19.4 15.7 12 20 12 20z' />
                    </svg>
                </button>
            </div>

            <div className='flex items-start gap-3 p-4'>
                <span className='flex h-[52px] w-[52px] flex-none items-center justify-center overflow-hidden rounded-full border-[3px] border-white bg-secondary text-[17px] font-bold text-white shadow-[0_2px_10px_rgba(20,36,63,.12)]'>
                    {logo ? (
                        <Image
                            src={logo}
                            alt=''
                            width={52}
                            height={52}
                            className='h-full w-full object-cover'
                            onError={() => setLogo('')}
                        />
                    ) : (
                        String(auto?.Name || 'گ').trim().charAt(0)
                    )}
                </span>

                <div className='min-w-0 flex-1'>
                    <h2 className='m-0 truncate text-[15.5px] font-bold text-secondary'>{auto?.Name || 'گالری'}</h2>

                    {auto?.ManagerName && (
                        <p className='m-0 truncate pt-1 text-[12.5px] text-[#8B94A5]'>مدیر: {auto.ManagerName}</p>
                    )}

                    <div className='flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 text-[12px] text-[#8B94A5]'>
                        {address && (
                            <span className='flex items-center gap-1'>
                                <svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='#A3ADBC' strokeWidth='1.9' className='flex-none'>
                                    <path d='M12 21.5s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z' />
                                    <circle cx='12' cy='10.2' r='2.6' />
                                </svg>
                                <span className='truncate'>{address}</span>
                            </span>
                        )}

                        {phone && (
                            <a href={`tel:${phone}`} dir='ltr' className='flex items-center gap-1 hover:text-primary'>
                                <svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='#A3ADBC' strokeWidth='1.9' className='flex-none'>
                                    <path d='M5 4.5h3.5l1.7 4-2 1.5a11 11 0 0 0 5.8 5.8l1.5-2 4 1.7V19a1.5 1.5 0 0 1-1.6 1.5A15.5 15.5 0 0 1 3.5 6.1 1.5 1.5 0 0 1 5 4.5z' />
                                </svg>
                                {phone}
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <div className='px-4 pb-4'>
                <Link
                    href={`/autogallery/${auto?.GalleryId}`}
                    className='flex w-full flex-row-reverse items-center justify-center gap-2 rounded-xl border border-[#FFD9BF] bg-[#FFF6F1] py-2.5 text-[13.5px] font-bold text-primary transition-colors hover:border-primary'
                >
                    <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                        <path d='M19 12H5M12 19l-7-7 7-7' />
                    </svg>
                    مشاهده گالری
                </Link>
            </div>
        </div>
    )
}

export default AutoItem
