import React, { useEffect, useState } from 'react'
import AuctionFilterFields from './AuctionFilterFields'
import { getAuctionCategories, getcities } from '@/utils/Request';
import { calculateDaysLeft, subscriptionEndDate } from '@/utils/Cal';

const DesktopAuctionPanel = ({ setPriceRange, setQuery, query, city, setCity, category, setCategory, setActiveAuctions, activeAuctions, updateAuction, user }) => {
    const [cities, setCities] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const citydata = await getcities();
                const categories = await getAuctionCategories();
                setCategories(Array.isArray(categories) ? categories : [])
                setCities(Array.isArray(citydata) ? citydata : []);
            } catch (err) {
                console.error(err);
            }
        };

        fetchCities();
    }, []);

    return (
        <div className='text-black'>
            <div className='bg-secondary h-28 flex justify-center items-center text-white flex-col rounded-[21px] '>
                <h2 className='text-xl'>
                    وضعیت پلن فعال شما
                </h2>
                <p className='pt-4'>  <span className="font-[vazir]">{calculateDaysLeft(subscriptionEndDate(user))}</span> <span className="px-2 font-[vazir]">روز باقی مانده</span> </p>
            </div>

            <div className='mt-3 rounded-[18px] bg-[#F6F7F9] p-3'>
                <h2 className='font-soft m-0 mb-3 px-1 text-[16px] text-secondary'>فیلترها</h2>
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
                <button
                    type='button'
                    onClick={updateAuction}
                    className='font-soft mt-3 h-12 w-full rounded-xl bg-gradient-orange text-[15px] text-white'
                >
                    نمایش نتایج
                </button>
            </div>
        </div>
    )
}

export default DesktopAuctionPanel
