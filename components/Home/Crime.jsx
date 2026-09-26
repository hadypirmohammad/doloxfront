import { ImageURL } from '@/utils/URL'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import AdsItem from '../global/AdsItem'
import Link from 'next/link'
import { getAds } from '@/utils/Request'
import { filterRent, filterSales } from '@/utils/Cal'

const Crime = ({ ads = [{}] }) => {
    
    return (
        <section className='mx-auto   bg-base-100  '>
            <div className='mx-auto max-w-screen-xl py-2 md:py-0 text-white bg-base-100 rounded-xl relative  '>


                <div className='flex justify-between   items-center h-full min-h-96  '>
                    <div className='mx-auto max-w-screen-xl text-black  z-10 px-16 '>

                        <h2 className=' md:text-3xl text-2xl w-full text-right    text-white  '>

استعلام خلافی خودرو؛ سریع،
 دقیق و بدون دردسر

                        </h2>
                        <p className=' max-w-4xl mx-auto font-["vazir"] pt-4 text-right text-white'>با سرویس دولوکس استعلام خلافی خودرو، در چند ثانیه از جزئیات کامل جریمه‌ها و مبلغ کل خلافی به‌صورت آنلاین و به‌روز مطلع شوید؛ سریع، دقیق و بدون مراجعه حضوری.</p>
                        <div className='flex  py-2'>
                            <Link  className='btn bg-primary shadow px-8 text-xl h-14 mt-4 border-primary text-white border-none ' href="/khalafi">
                                استعلام خلافی
                            </Link>
                        </div>

                    </div>
                    <Image className=' animate-pulse md:static absolute opacity-50 md:opacity-100  ' src="/media/images/khalaficamera.png" width={520} height={520}/>

                </div>
               

             

            </div>
        </section >
    )
}

export default Crime
