import { ImageURL } from '@/utils/URL'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const FreeAuto = () => {
  return (
      <section className='mx-auto   bg-base-100 px-4  !text-white'>
          <div className='mx-auto max-w-screen-xl text-black'>
              <div className='flex justify-between items-center  md:flex-row flex-col-reverse'>
                  
          
              <div className='  flex   flex-col mx-auto md:py-36 py-16 justify-center  text-center '>

                  <h2 className=' text-3xl w-full  text-white  '>
                          گالریت فقط تو خیابون نباشه!!
                  </h2>
 <p className='font-["vazir"] pt-2 max-w-md text-white text-center mx-auto'>یه صفحه اختصاصی تو دولوکس ،یه ویترین جلوی کل کشور</p>
                      <Link className='btn bg-secondary shadow px-8 text-xl h-14 mt-4 border-primary text-white border-none mx-auto' href="/createautogallery">
                      ثبت رایگان اتو گالری
                  </Link>
              </div>


            
              </div>
          </div>
      </section >
  )
}

export default FreeAuto
