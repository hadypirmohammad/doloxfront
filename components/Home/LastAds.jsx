import { ImageURL } from '@/utils/URL'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import AdsItem from '../global/AdsItem'
import Link from 'next/link'
import { getAds } from '@/utils/Request'
import { filterRent, filterSales } from '@/utils/Cal'

const LastAds = ({ ads =[{}] }) => {
  const [category, setcategory] = useState("همه");
  const [lastads, setLastAds] = useState(ads);
  return (
    <section className='mx-auto  pt-32 bg-base-200 px-2 pb-64'>
      <div className='mx-auto max-w-screen-xl text-white bg-base-100 rounded-xl p-6 '>
        
       
        <div className='flex justify-between items-center '>
           <h2 className=' md:text-3xl text-2xl w-fit text-right md:pt-8 px-2'>
          آخرین اگهی ها
        </h2>
          <div className='w-fit  flex gap-4 md:justify-start justify-center py-4 px-2 '>
            <div
              className={`!font-["vazir"]  text-sm cursor-pointer py-2 px-4 rounded-[8px] text-primary ${category === 'همه' ? "bg-primary !text-white" : "border border-primary "} `}
              onClick={() => {
                setLastAds(ads)
                setcategory("همه")
              }}
            >همه</div>
            <div
              className={`!font-["vazir"] text-sm  cursor-pointer py-2 px-4 rounded-[8px] text-primary ${category === 'فروشی' ? "bg-primary !text-white " : "border border-primary "}} `}
              onClick={() => {
                setLastAds(filterSales(ads))
                setcategory("فروشی")
              }}
            >فروشی</div>
            <div
              className={`!font-["vazir"] text-sm cursor-pointer py-2 px-4 rounded-[8px] text-primary ${category === 'اجاره' ? "bg-primary !text-white " : "border border-primary "}} `}
              onClick={() => {
                setLastAds(filterRent(ads))
                setcategory("اجاره")
              }}
            >اجاره</div>
          </div>
          
       
        </div>
        <div className='grid lg:grid-cols-3  md:grid-cols-2 grid-cols-1 items-center text-center mt-6 gap-2 px-2  '>
          <AdsItem ad={lastads[0]} />
          <AdsItem ad={lastads[1]} />
          <AdsItem ad={lastads[2]} />
        </div>
        
        <div className='text-center py-10'>
        <Link href='/' className="text-primary  ">بیشتر</Link>
        </div>

      </div>
    </section >
  )
}

export default LastAds
