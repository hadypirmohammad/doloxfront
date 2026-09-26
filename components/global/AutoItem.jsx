import Image from 'next/image'
import React from 'react'
import { BackendURL } from "./../../utils/URL";
import Link from 'next/link';

const AutoItem = ({ auto = {} }) => {
    const imageSrc = auto.Profile
        ? `${BackendURL.slice(0, -1)}${auto.Profile}`
        : '/default-logo.png'

    return (
        <Link href={`/autogallery/${auto.GalleryId}`} className='block !rounded-[30px] shadow overflow-hidden'>
            <div className='relative z-10 mt-4 w-full aspect-[370/208] overflow-hidden rounded-t-[30px] bg-base-200'>
                <Image
                    className='object-cover object-center'
                    src={imageSrc}
                    alt={auto.Name || 'گالری'}
                    fill
                    sizes='(max-width: 768px) 100vw, 33vw'
                />
            </div>
            <div className='bg-white w-full text-right py-4 px-6 rounded-b-[30px]'>
                <h2>{auto.Name || 'Company Name'}</h2>
                <p className='font-["vazir"] h-36 overflow-hidden'>{auto.Describe || ''}</p>
            </div>
        </Link>
    )
}

export default AutoItem
