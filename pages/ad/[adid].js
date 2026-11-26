import BaseDetail from '@/components/Addetail/BaseDetail';
import ImageGallery from '@/components/Addetail/ImageGallery';
import DescriptionDetail from '@/components/Addetail/DescriptionDetail';
import VechicleCondition from '@/components/Addetail/VechicleCondition';
import TechSpecificDetail from '@/components/Addetail/TechSpecificDetail';
import LocationDetail from '@/components/Addetail/LocationDetail';
import GalleryDetail from '@/components/Addetail/GalleryDetail';
import React from 'react'
import AdsItem from '@/components/global/AdsItem';
import Link from 'next/link';
import { getAdbyId, getcities } from '@/utils/Request';
import { findCityById } from '@/utils/cities';
import { mapToAdFormat } from '@/utils/Cal';
import { getToken, withAuth } from '@/utils/Auth';

export async function getServerSideProps(context) {

    
    const { adid } = context.params;
    const token = await getToken(context);

    const [current, cities] = await Promise.all([getAdbyId(adid), getcities().catch(() => [])])
    const location = current ? findCityById(cities, current.CityId) : null
    if (current && !current.ProvinceName && location?.ProvinceName) current.ProvinceName = location.ProvinceName
    // console.log("current",current)
   
    return {
        props: {
            ad: current || {},
            token: token || "",
            EnTitle : adid || "",
            notAvailable: !current,
        },
    };
}




const AdDetail = ({ ad , token , EnTitle, notAvailable}) => {
    const mapped = (ad.Simulars || []).map(mapToAdFormat);
    // console.log(mapped)

    if (notAvailable) {
        return (
            <div dir='rtl' className='flex min-h-[60vh] w-full flex-col items-center justify-center bg-[#FAFAFA] px-4 py-16 text-center'>
                <span className='flex h-20 w-20 items-center justify-center rounded-full bg-[#FFEDE3] text-primary'>
                    <svg width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.7' strokeLinecap='round' strokeLinejoin='round'>
                        <circle cx='12' cy='12' r='9' />
                        <path d='M12 7.5v5.5M12 16.2v.2' />
                    </svg>
                </span>
                <p className="m-0 pt-5 text-lg font-bold font-['vazir'] text-secondary">اطلاعات این آگهی در دسترس نیست</p>
                <p className="m-0 max-w-sm pt-3 text-sm leading-[2] font-['vazir'] text-[#8B94A5]">
                    ممکن است آگهی حذف شده باشد یا به صورت موقت مشکلی در دریافت اطلاعات به وجود آمده باشد. کمی بعد دوباره تلاش کنید.
                </p>
                <Link
                    href='/ads'
                    className="mt-6 rounded-2xl bg-gradient-orange px-8 py-3 text-sm font-bold text-white font-['vazir']"
                >
                    بازگشت به آگهی ها
                </Link>
            </div>
        )
    }

  return (
      <div className='flex h-fit w-full flex-col justify-center bg-[#FAFAFA] px-4 pb-10 pt-6 md:pt-8'>

       {/* desktop */}
          <div className=' w-full mx-auto justify-center max-w-screen-xl gap-4 hidden md:flex'>
              <div className='w-1/3 max-w-sm shrink-0'>
           <div className='md:sticky md:top-24'>
           <BaseDetail ad={ad} token={token}  EnTitle={EnTitle}/>
          <VechicleCondition ad={ad}/>
          <TechSpecificDetail ad={ad} />
          <LocationDetail ad={ad} />
           </div>
                       {/* energing details  */}
              </div>
              <div className='min-w-0 flex-1 md:w-2/3'>
          <ImageGallery ad={ad} />
                  <DescriptionDetail ad={ad} />
                  <GalleryDetail ad={ad}/>
                     
              </div>
          </div>
        {/* mobile */}
          <div className=' w-full mx-auto justify-center max-w-screen-xl gap-4  md:hidden'>
              
          <ImageGallery ad={ad}/>
          <BaseDetail ad={ad} token={token}  EnTitle={EnTitle} />
          <VechicleCondition ad={ad}/>
          <TechSpecificDetail ad={ad} />
          <LocationDetail ad={ad} />
              <DescriptionDetail ad={ad} />
              <GalleryDetail ad={ad} />

             {/* energing details  */}
            
              
            
          </div>
          
          <div className="mx-auto mt-8 w-full max-w-screen-xl">
             <h2 className="w-fit rounded-full bg-white px-4 py-2 text-center text-secondary">آگهی های مشابه</h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                 {mapped[0] && <AdsItem ad={mapped[0]} />}
                 {mapped[1] && <AdsItem ad={mapped[1]} />}
                 {mapped[2] && <AdsItem ad={mapped[2]} />}
              </div>
          </div>


      </div>
  )
}

export default AdDetail
