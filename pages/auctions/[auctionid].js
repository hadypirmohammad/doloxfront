import React from 'react'
import { getAuctionDetail } from '@/utils/Request';
import { getToken } from '@/utils/Auth';
import AuctionDetailCard from '@/components/Auction/AuctionDetailCard';
import Image from 'next/image';
import { BackendURL } from './../../utils/URL';
import AuctionItem from '@/components/Auction/AuctionItem';

export async function getServerSideProps(context) {


    const { auctionid } = context.params;
    const token = await getToken(context);
    const current = await getAuctionDetail(token, auctionid)

    // console.log("current", current)
    return {
        props: {
            auction: current || {},
        },
    };
}




const AuctionDetail = ({ auction }) => {
    // console.log(auction)
  
    return (
        <div className='flex h-fit w-full flex-col justify-center bg-[#FAFAFA] px-4 pb-10 pt-6 md:pt-8'>
            <div className='mx-auto w-full max-w-screen-xl'>
                <div className='flex w-full flex-col gap-3 md:flex-row md:items-stretch md:gap-4'>
                    <div className='w-full shrink-0 md:w-[280px]'>
                        <AuctionDetailCard auction={auction} />
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

                <div className="mt-8 w-full">
                    <h2 className="w-fit rounded-full bg-white px-4 py-2 text-center text-secondary">مزایده های مشابه</h2>
                    <div className='mt-4 flex flex-col gap-2'>
                        {auction.Simular?.map((ac, index) => (
                            <AuctionItem key={index} auction={ac} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuctionDetail
