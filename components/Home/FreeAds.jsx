import { ImageURL } from '@/utils/URL'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const FreeAds = () => {
  return (
      <section className='mx-auto   bg-base-200 px-2 pb-36'>
          <div className='mx-auto max-w-screen-xl text-black relative'>
           
              <h2 className=' md:text-3xl text-2xl w-full text-center md:pt-72 pt-24'>
                  ثبت رایگان آگهی فروش خودرو
              </h2>
              <p className='font-["vazir"] pt-4 max-w-md text-black text-center mx-auto'>خریدار دست به نقد، فقط تو دولوکس</p>
              <p className='font-["vazir"]  max-w-md text-black text-center mx-auto'> آگهیش کن، راحت بفروش</p>

              <div className='flex justify-center py-2'>
              <Link className='btn bg-primary shadow px-8 text-xl h-14 mt-4 border-primary text-white border-none mx-auto' href="/createad">
                  ثبت رایگان آگهی
              </Link>
              </div>
            
          </div>
      </section >
  )
}

export default FreeAds
