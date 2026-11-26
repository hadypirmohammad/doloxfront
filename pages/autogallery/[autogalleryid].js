import React, { useMemo, useState } from 'react'

import Image from 'next/image';
import Link from 'next/link';
import { getAutogalleriesByid } from '@/utils/Request';
import { resolveBackendMediaUrl } from '@/utils/media';
import { normalizeSearchTerm, toPersianDigits } from '@/utils/Cal';
import { galleryBadge } from '@/utils/services/autoGalleries';
import AdsItem from '@/components/global/AdsItem';

const COVER_FALLBACK = '/media/images/defaultimg.png';

export async function getServerSideProps(context) {


    const { autogalleryid } = context.params;
    const current = await getAutogalleriesByid( autogalleryid )


    // console.log("current", current)
    return {
        props: {
            autogallery: current || {},
        },
    };
}

const normalizePhone = (value) => {
    const digits = String(value ?? '').replace(/\D/g, '');
    if (!digits) return '';
    return digits.startsWith('0') ? digits : `0${digits}`;
};

const contactNumbers = (gallery) => {
    const raw = [
        gallery?.Mobile,
        gallery?.Phone,
        gallery?.Phone2,
        gallery?.SecondPhone,
        gallery?.User?.PhoneNumber,
        ...(Array.isArray(gallery?.Phones) ? gallery.Phones : []),
    ];

    return [...new Set(raw.map(normalizePhone).filter(Boolean))];
};

const AutoGalleryDetail = ({ autogallery }) => {
    const [cover, setCover] = useState(() => resolveBackendMediaUrl(autogallery?.Cover, COVER_FALLBACK));
    const [logo, setLogo] = useState(() => resolveBackendMediaUrl(autogallery?.Profile, ''));
    const [query, setQuery] = useState('');

    const badge = galleryBadge({
        IsVerified: Boolean(autogallery?.IsVerified),
        IsApproved: Boolean(
            autogallery?.AdminApprovedAt ?? autogallery?.IsApproved ?? autogallery?.IsConfirmed ?? autogallery?.ApprovedAt
        ),
    });
    const fullAddress = autogallery?.Adress || '';
    const numbers = contactNumbers(autogallery);

    const ads = useMemo(() => {
        const list = Array.isArray(autogallery?.Ads) ? autogallery.Ads : [];
        const term = normalizeSearchTerm(query);
        if (!term) return list;
        return list.filter((ad) => normalizeSearchTerm(ad?.Title).includes(term));
    }, [autogallery, query]);

    return (
        <div dir='rtl' className='min-h-screen bg-[#F5F6F8] text-secondary'>
            <section className='bg-white'>
                <div className='relative h-[220px] w-full sm:h-[340px] lg:h-[400px]'>
                    <Image
                        src={cover}
                        alt={autogallery?.Name || 'گالری'}
                        fill
                        sizes='100vw'
                        priority
                        className='object-cover'
                        onError={() => setCover(COVER_FALLBACK)}
                    />
                    <span className='pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(12,18,26,.85)_0%,rgba(12,18,26,.25)_45%,rgba(12,18,26,0)_75%)]' />

                    <div className='absolute inset-x-4 bottom-4 flex items-center gap-3 sm:inset-x-8 sm:bottom-6'>
                        <span className='flex h-[64px] w-[64px] flex-none items-center justify-center overflow-hidden rounded-[18px] border-[3px] border-white bg-secondary text-[22px] font-bold text-white shadow-[0_8px_20px_rgba(20,36,63,.18)] sm:h-[92px] sm:w-[92px] sm:rounded-[22px]'>
                            {logo ? (
                                <Image
                                    src={logo}
                                    alt=''
                                    width={92}
                                    height={92}
                                    className='h-full w-full object-cover'
                                    onError={() => setLogo('')}
                                />
                            ) : (
                                String(autogallery?.Name || 'گ').trim().charAt(0)
                            )}
                        </span>

                        <div className='min-w-0 rounded-[14px] bg-white/90 px-3.5 py-2.5 backdrop-blur-sm sm:px-5 sm:py-3'>
                            <div className='flex items-center gap-2'>
                                <h1 className='m-0 truncate text-[17px] font-bold sm:text-[22px]'>{autogallery?.Name || 'گالری'}</h1>
                                {badge && (
                                    <span className='flex items-center gap-1 rounded-lg bg-gradient-orange px-2 py-0.5 text-[10.5px] font-bold text-white'>
                                        {badge}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className='mx-auto flex max-w-screen-xl flex-col gap-3 px-4 py-4 sm:px-8'>
                    {fullAddress && (
                        <p className='m-0 flex items-start gap-2 text-[13px] leading-[2] text-[#42536B] sm:text-[14px]'>
                            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='#FF5E00' strokeWidth='1.9' className='mt-1 flex-none'>
                                <path d='M12 21.5s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z' />
                                <circle cx='12' cy='10.2' r='2.6' />
                            </svg>
                            {fullAddress}
                        </p>
                    )}

                    <div className='flex flex-wrap items-center gap-x-5 gap-y-2'>
                        {numbers.map((number) => (
                            <a
                                key={number}
                                href={`tel:${number}`}
                                dir='ltr'
                                className='flex items-center gap-2 text-[14px] font-semibold text-secondary transition-colors hover:text-primary'
                            >
                                <svg width='17' height='17' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' className='flex-none'>
                                    <path d='M5 4.5h3.5l1.7 4-2 1.5a11 11 0 0 0 5.8 5.8l1.5-2 4 1.7V19a1.5 1.5 0 0 1-1.6 1.5A15.5 15.5 0 0 1 3.5 6.1 1.5 1.5 0 0 1 5 4.5z' />
                                </svg>
                                {toPersianDigits(number)}
                            </a>
                        ))}
                    </div>

                    {numbers.length > 0 && (
                        <a
                            href={`tel:${numbers[0]}`}
                            className='flex items-center justify-center rounded-xl bg-gradient-orange px-7 py-3 text-[14.5px] font-bold text-white sm:self-start'
                        >
                            تماس با گالری
                        </a>
                    )}
                </div>
            </section>

            <div className='mx-auto max-w-screen-xl px-4 py-6 sm:px-8'>
                {autogallery?.Describe && (
                    <div className='flex items-start gap-3.5 rounded-[16px] border border-[#EEF1F6] bg-[#EFF2F6] p-4 sm:p-5'>
                        <span className='flex h-[42px] w-[42px] flex-none items-center justify-center rounded-xl bg-white text-primary'>
                            <svg width='21' height='21' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round'>
                                <path d='M4 17h16' />
                                <path d='M5.5 17v-3.5l1.7-4A2 2 0 0 1 9.04 8h5.92a2 2 0 0 1 1.84 1.5l1.7 4V17' />
                                <circle cx='8.5' cy='14.5' r='.9' />
                                <circle cx='15.5' cy='14.5' r='.9' />
                            </svg>
                        </span>
                        <div className='min-w-0 flex-1'>
                            <p className='m-0 text-[13.5px] font-bold leading-[2] sm:text-[15px]'>{autogallery.Describe}</p>
                        </div>
                    </div>
                )}

                <label className='mt-5 flex items-center gap-3 rounded-[14px] border border-[#EAEEF4] bg-white px-4 py-3 focus-within:border-primary'>
                    <svg width='19' height='19' viewBox='0 0 24 24' fill='none' stroke='#8E9AAC' strokeWidth='1.8' strokeLinecap='round' className='flex-none'>
                        <circle cx='11' cy='11' r='7' />
                        <path d='m21 21-4.3-4.3' />
                    </svg>
                    <input
                        type='text'
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder='جستجوی خودرو...'
                        className="min-w-0 flex-1 border-0 bg-transparent text-right text-[13.5px] text-secondary outline-none font-['vazir'] placeholder:text-[#A3ADBC]"
                    />
                </label>

                <div className='grid grid-cols-1 gap-3 pt-5 sm:grid-cols-2 lg:grid-cols-3'>
                    {ads.map((ad, index) => (<AdsItem key={index} ad={ad} />))}
                </div>

                {ads.length === 0 && (
                    <div className='flex flex-col items-center gap-3 py-20 text-center'>
                        <span className='flex h-[54px] w-[54px] items-center justify-center rounded-full bg-[#FFEDE3] text-primary'>
                            <svg width='26' height='26' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round'>
                                <path d='M4 17h16' />
                                <path d='M5.5 17v-3.5l1.7-4A2 2 0 0 1 9.04 8h5.92a2 2 0 0 1 1.84 1.5l1.7 4V17' />
                            </svg>
                        </span>
                        <p className='m-0 text-sm text-[#8B94A5]'>
                            {query ? 'خودرویی با این مشخصات پیدا نشد' : 'هنوز خودرویی در این گالری ثبت نشده است'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AutoGalleryDetail
