import { BackendURL } from '@/utils/URL'
import Image from 'next/image'
import React from 'react'
import Link from "next/link"
const GalleryDetail = (ad) => {
    const data = ad.ad.Gallery
    if(data == null) return null;
    console.log(data)
  return (
      <Link href={`/autogallery/${data.GalleryId}`} className="bg-white rounded-[15px] w-full h-fit p-6 mt-2 flex gap-6 items-center">
          <Image className=" w-24 h-24 rounded-[15px]" src={BackendURL.slice(0, -1) + data.Profile } width={200} height={200} />
        <div>

          <h2 className="text-lg">{data.Name}</h2>
              <p className='font-[vazir]'>{data.Describe} <span className='font-[vazir] text-[#FA4505]'>اطلاعات بیشتر</span></p>
        </div>

        
    </Link>
  )
}

export default GalleryDetail