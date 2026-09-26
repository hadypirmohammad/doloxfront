import React, { useEffect , useState} from 'react'
import DoubleSlider from '../global/DoubleSlider'
import StateCitySelect from '../global/StateCitySelect'
import { getAuctionCategories, getcities } from '@/utils/Request';
import { calculateDaysLeft } from '@/utils/Cal';

const DesktopAuctionPanel = ({ setPriceRange, setQuery, query, setCity, setCategory, setActiveAuctions, activeAuctions, updateAuction , user }) => {
    // console.log(user)
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const citydata = await getcities();
                const categories = await getAuctionCategories();
                setCategories(categories)
                setCities(citydata);
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
                <p className='pt-4'>  <span className="font-[vazir]">{calculateDaysLeft(user?.SubscribtionDate) }</span> <span className="px-2 font-[vazir]">روز باقی مانده</span> </p>
            </div>


            <div className='bg-white h-full mt-2 pt-10 rounded-[15px]'>
                <div className='flex items-center gap-2'>
                    <div className='h-[1px] w-full bg-black opacity-40' />
                    <h2 className='text-xl'>فیلتر</h2>
                    <div className='h-[1px] w-full bg-black opacity-40' />
                </div>

                <div className='px-4 !font-[vazir]'>

                    <div className="collapse collapse-arrow ">
                        <input type="checkbox" />
                        <div className="collapse-title text-md font-medium">جست وجو</div>
                        <div className="collapse-content">
                            <input type="text" placeholder="اینجا تایپ کنید" className="input w-full max-w-full text-black bg-white border-black border-2 font-[vazir]" value={query} onChange={(e) => setQuery(e.target.value)} />
                        </div>
                    </div>

                    <div className='h-[1px] w-full bg-black opacity-40' />

                    <div className="collapse collapse-arrow ">
                        <input type="checkbox" />
                        <div className="collapse-title text-md font-medium">شهر</div>
                        <div className="collapse-content">
                            <StateCitySelect
                                cities={cities}
                                onChange={(cityId) => setCity(cityId)}
                            />
                        </div>
                    </div>

                    <div className='h-[1px] w-full bg-black opacity-40' />

                    <div className="collapse collapse-arrow ">
                        <input type="checkbox" />
                        <div className="collapse-title text-md font-medium">دسته بندی</div>
                        <div className="collapse-content">
                            <select className="select select-bordered w-full text-black bg-white border-black border-2 selected font-[vazir]" onChange={(e) => setCategory(e.target.value)}>
                                {categories.map((cat, index) => (
                                    <option key={ index } className='font-[vazir]' value={cat.AuctionCategoryId} >{cat.CategoryName}</option>
                                ))}
                               
                    
                            </select>
                        </div>
                    </div>

                    <div className='h-[1px] w-full bg-black opacity-40' />

                    <div className="collapse collapse-arrow">
                        <input type="checkbox" />
                        <div className="collapse-title text-md font-medium">قیمت ها</div>
                        <div className="collapse-content">
                            <div className=' h-20 flex justify-center'>
                                <DoubleSlider max={100000} min={10} onChange={setPriceRange} />
                            </div>

                        </div>
                    </div>

                    <div className='h-[1px] w-full bg-black opacity-40' />
                    <div className='flex py-4 gap-1'>
                        <input
                            type="checkbox"
                            className="checkbox [--chkbg:theme(colors.primary)] [--chkfg:white] checked:border-indigo-800" checked={activeAuctions}
                            onClick={() => setActiveAuctions(!activeAuctions)}
                        />
                        <p className='font-[vazir]'>نمایش مزایده های جاری</p>
                    </div>
                    <button onClick={ updateAuction } className='btn  mx-auto bg-secondary text-white outline-none border-none w-full mb-4'>
                        اعمال فیلتر
                    </button>
                    <div className='mx-auto mt-auto h-4 w-24 rounded-t-3xl bg-[#FAFAFA]' />

                </div>
            </div>
        </div>
    )
}

export default DesktopAuctionPanel
