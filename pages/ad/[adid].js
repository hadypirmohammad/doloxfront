import BaseDetail from '@/components/Addetail/BaseDetail';
import ImageGallery from '@/components/Addetail/ImageGallery';
import DescriptionDetail from '@/components/Addetail/DescriptionDetail';
import VechicleCondition from '@/components/Addetail/VechicleCondition';
import TechSpecificDetail from '@/components/Addetail/TechSpecificDetail';
import GalleryDetail from '@/components/Addetail/GalleryDetail';
import React from 'react'
import AdsItem from '@/components/global/AdsItem';
import { getAdbyId } from '@/utils/Request';
import { mapToAdFormat } from '@/utils/Cal';
import { getToken, withAuth } from '@/utils/Auth';

export async function getServerSideProps(context) {

    
    const { adid } = context.params;
    const token = await getToken(context);

    const current = await getAdbyId(adid)
    // console.log("current",current)
   
    return {
        props: {
            ad: current || {},
            token: token || "",
            EnTitle : adid || "",
        },
    };
}




const AdDetail = ({ ad , token , EnTitle}) => {
    console.log(ad)
    const mapped = (ad.Simulars || []).map(mapToAdFormat);
    // console.log(mapped)
  return (
      <div className='flex h-fit w-full flex-col justify-center bg-[#FAFAFA] px-4 pb-10 pt-6 md:pt-8'>

       {/* desktop */}
          <div className=' w-full mx-auto justify-center max-w-screen-xl gap-4 hidden md:flex'>
              <div className='w-1/3 max-w-sm shrink-0'>
           <div className='md:sticky md:top-24'>
           <BaseDetail ad={ad} token={token}  EnTitle={EnTitle}/>
          <VechicleCondition ad={ad}/>
          <TechSpecificDetail ad={ad} />
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
