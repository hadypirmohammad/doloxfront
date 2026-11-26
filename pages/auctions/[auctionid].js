import React from 'react'
import { getAuctionDetail, getAuctions, getcities, getUser } from '@/utils/Request';
import { findCityById } from '@/utils/cities';
import { getToken, withAuth } from '@/utils/Auth';
import { hasActiveSubscription } from '@/utils/Cal';
import AuctionDetailCard from '@/components/Auction/AuctionDetailCard';
import Image from 'next/image';
import { BackendURL } from './../../utils/URL';

export async function getServerSideProps(context) {

    const authResult = await withAuth(context);

    if (authResult.redirect) {
        return authResult;
    }

    const { auctionid } = context.params;
    const token = await getToken(context);

    const { status, auction } = await getAuctionDetail(token, auctionid);

    if (auction && Object.keys(auction).length > 0) {
        const cities = await getcities().catch(() => []);
        const cityId = auction?.Auction?.City?.CityId ?? auction?.Auction?.CityId;
        const location = findCityById(cities, cityId);
        return {
            props: {
                auction,
                provinceName: location?.ProvinceName || '',
            },
        };
    }

    if (status === 403) {
        const locked = await getAuctions(token, '', '', '', undefined, undefined, undefined, 1, 100).catch(() => []);
        const match = (locked || []).find((item) => String(item?.AuctionId) === String(auctionid));

        return {
            redirect: {
                destination: match?.Title
                    ? `/auctions/subscription?title=${encodeURIComponent(match.Title)}`
                    : '/auctions/subscription',
                permanent: false,
            },
        };
    }

    if (status === 401) {
        return {
            redirect: {
                destination: `/login?next=${encodeURIComponent(context.resolvedUrl)}`,
                permanent: false,
            },
        };
    }

    const userdata = await getUser(token).catch(() => null);

    if (hasActiveSubscription(userdata)) {
        return {
            props: {
                auction: {},
            },
        };
    }

    return {
        redirect: {
            destination: '/auctions/subscription',
            permanent: false,
        },
    };
}




const AuctionDetail = ({ auction, provinceName = '' }) => {
    // console.log(auction)
  
    return (
        <div className='flex h-fit w-full flex-col justify-center bg-[#FAFAFA] px-4 pb-10 pt-6 md:pt-8'>
            <div className='mx-auto w-full max-w-screen-xl'>
                <div className='flex w-full flex-col gap-3 md:flex-row md:items-stretch md:gap-4'>
                    <div className='w-full shrink-0 md:w-[280px]'>
                        <AuctionDetailCard auction={auction} provinceName={provinceName} />
                    </div>
                    <div className='relative min-h-[240px] min-w-0 flex-1 overflow-hidden rounded-[15px] bg-white p-6 md:min-h-full'>
                        <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
                            <Image
                                src="/media/images/dolox-logo.png"
                                width={220}
                                height={64}
                                alt="Dolox"
                                className="h-14 w-auto object-contain opacity-[0.12] select-none sm:h-16"
                            />
                        </div>
                        {auction.Auction?.Image ? (
                            <Image
                                src={BackendURL.slice(0, -1) + auction.Auction.Image}
                                width={1000}
                                height={1000}
                                alt={auction.Auction.Title || 'مزایده'}
                                className="relative z-[1] mx-auto h-auto w-full max-h-[420px] object-contain"
                            />
                        ) : (
                            <div className="relative z-[1] min-h-[200px]">
                                <h2 className="mb-3 text-lg text-secondary">شرح مزایده</h2>
                                <p className="whitespace-pre-wrap leading-7 text-secondary">
                                    {auction.Auction?.ShortDescribe || auction.Auction?.Description || 'شرحی برای این مزایده ثبت نشده است.'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuctionDetail
