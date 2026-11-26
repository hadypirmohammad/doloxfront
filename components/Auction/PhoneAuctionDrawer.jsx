import React, { useEffect, useState } from 'react'
import AuctionFilterFields from './AuctionFilterFields'
import { getAuctionCategories, getcities } from '@/utils/Request';
import { calculateDaysLeft, subscriptionEndDate } from '@/utils/Cal';

const PhoneAuctionDrawer = ({ setPriceRange, setQuery, query, city, setCity, category, setCategory, setActiveAuctions, activeAuctions, updateAuction, user }) => {
    const [drawer, setdrawer] = useState(false);
    const [cities, setCities] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const citydata = await getcities();
                const categories = await getAuctionCategories();
                setCategories(Array.isArray(categories) ? categories : [])
                setCities(Array.isArray(citydata) ? citydata : []);
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, []);

    const active = Boolean(query) || (Array.isArray(city) && city.length > 0) || Boolean(category) || activeAuctions;

    return (
        <div className='md:hidden'>
            <div className='bg-secondary h-28 flex justify-center items-center text-white flex-col rounded-[21px]'>
                <h2 className='text-xl'>
                    پلن فعال شما
                </h2>
                <p className='pt-4'>  <span className="font-[vazir]">{calculateDaysLeft(subscriptionEndDate(user))}</span> <span className="px-2 font-[vazir]">روز باقی مانده</span> </p>
            </div>

            <div className='my-3 flex justify-end'>
                <button
                    type='button'
                    onClick={() => setdrawer(true)}
                    className={`font-soft flex h-[42px] items-center gap-2 rounded-full border px-4 text-[14px] transition-colors ${
                        active ? 'border-primary bg-[#FFF6F0] text-[#C2410C]' : 'border-[#E6E8EC] bg-white text-secondary'
                    }`}
                >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
                        <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
                        <circle cx="16" cy="7" r="2" />
                        <circle cx="10" cy="17" r="2" />
                    </svg>
                    فیلتر
                    {active && <span className='h-2 w-2 rounded-full bg-primary' />}
                </button>
            </div>

            {drawer && <div className='fixed inset-0 z-40 bg-black/40' onClick={() => setdrawer(false)} />}

            <div
                className={`fixed inset-x-0 bottom-0 z-50 flex h-[85dvh] flex-col rounded-t-[22px] bg-[#F6F7F9] transition-transform duration-300 ${
                    drawer ? 'translate-y-0' : 'pointer-events-none translate-y-full'
                }`}
                aria-hidden={!drawer}
            >
                <div className='flex-none rounded-t-[22px] bg-white px-4 pb-3 pt-3'>
                    <div className='mx-auto mb-3 h-1.5 w-12 rounded-full bg-[#DDE1E7]' />
                    <div className='flex items-center justify-between'>
                        <h2 className='font-soft m-0 text-[17px] text-secondary'>فیلترها</h2>
                        <button
                            type='button'
                            onClick={() => setdrawer(false)}
                            aria-label='بستن'
                            className='flex h-9 w-9 items-center justify-center rounded-full bg-[#F1F3F7] text-secondary'
                        >
                            <svg width='14' height='14' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round'>
                                <path d='M4 4l8 8M12 4l-8 8' />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className='flex-1 overflow-y-auto overscroll-contain p-3'>
                    <AuctionFilterFields
                        cities={cities}
                        categories={categories}
                        query={query}
                        setQuery={setQuery}
                        city={city}
                        setCity={setCity}
                        category={category}
                        setCategory={setCategory}
                        setPriceRange={setPriceRange}
                        activeAuctions={activeAuctions}
                        setActiveAuctions={setActiveAuctions}
                    />
                </div>

                <div className='flex-none border-t border-[#EEF0F4] bg-white p-3 pb-[calc(12px+env(safe-area-inset-bottom))]'>
                    <button
                        type='button'
                        onClick={() => {
                            updateAuction();
                            setdrawer(false);
                        }}
                        className='font-soft h-12 w-full rounded-xl bg-gradient-orange text-[15px] text-white'
                    >
                        نمایش نتایج
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PhoneAuctionDrawer
