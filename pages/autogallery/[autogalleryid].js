import React from 'react'

import { getToken, withAuth } from '@/utils/Auth';
import Image from 'next/image';
import { BackendURL } from './../../utils/URL';
import Link from 'next/link';
import { getAutogalleriesByid } from '@/utils/Request';
import AdsItem from '@/components/global/AdsItem';

export async function getServerSideProps(context) {


    const { autogalleryid } = context.params;
    const token = await getToken(context);
    const current = await getAutogalleriesByid( autogalleryid )


    // console.log("current", current)
    return {
        props: {
            autogallery: current || {},
        },
    };
}




const AutoGalleryDetail = ({ autogallery }) => {
    // console.log(  autogallery )

    return (
        <div className='flex h-fit w-full flex-col justify-center bg-[#FAFAFA] px-4 pb-10 pt-6 md:pt-8'>

            {/* desktop */}
            <div className=' w-full mx-auto justify-center max-w-screen-xl gap-4  md:flex'>
                
                <div className='md:w-full  rounded-[15px]    bg-white relative min-h-[500px] '>
                   
                    <div className="relative">  
                         <Link className='btn bg-[#FCA474] mx-auto border-[#FCA474] text-white border-none w-fit  mt-2 absolute top-4 left-4  md:flex' href="/auto/edit/1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
<path d="M3 21V16.75L16.2 3.575C16.4 3.39167 16.621 3.25 16.863 3.15C17.105 3.05 17.359 3 17.625 3C17.891 3 18.1493 3.05 18.4 3.15C18.6507 3.25 18.8673 3.4 19.05 3.6L20.425 5C20.625 5.18333 20.771 5.4 20.863 5.65C20.955 5.9 21.0007 6.15 21 6.4C21 6.66667 20.9543 6.921 20.863 7.163C20.7717 7.405 20.6257 7.62567 20.425 7.825L7.25 21H3ZM17.6 7.8L19 6.4L17.6 5L16.2 6.4L17.6 7.8Z" fill="white"/>
</svg>
                            ویرایش
                        </Link>
                    <Image className="rounded-[15px] rounded-b-none object-cover w-full object-center md:h-64 h-36"  width={1000} height={200}  src={ BackendURL.slice(0,-1) + autogallery.Cover }  />
                        <div className="md:absolute -bottom-36 md:w-[150px] right-6 mx-auto">
                            <div className="w-fit mx-auto">
                                <div className=" rounded-[15px] mx-auto w-fit bg-gradient-to-r from-[#BC1526] to-[#560A11] p-[1px]  md:p-2 ">
                                    
                        <Image className="rounded-[15px] mx-auto object-cover md:w-36 md:h-36 h-24 w-24 -mt-10  md:mt-0 object-center  " width={300} height={300}  src={ BackendURL.slice(0,-1) + autogallery.Profile } />
                                </div>
                     <h1 className="text-2xl mt-4 md:hidden text-center w-full">{autogallery.Name}</h1>
                     
                        <Link href={"tel:0" + autogallery?.User?.PhoneNumber} className='btn bg-primary mx-auto flex justify-center border-primary text-white border-none w-fit  mt-2  md:flex' >
                            تماس با اتو گالری
                        </Link>
                        </div>
                        <p className="font-[vazir] text-sm mt-2 px-2 text-center md:text-right">{autogallery.Adress}</p>
                    </div>
                    </div>
                    <div className="md:pr-[206px] px-10 md:px-0 py-4"> 
                   <h1 className="text-2xl mt-6 hidden md:flex ">{autogallery.Name}</h1>
                   <p className="text-md mt-6 font-[vazir]">{autogallery.Describe}</p>
                    </div>
                 
                  


                </div>
            </div>


            <div className=" mx-auto w-full  max-w-screen-xl">
                <h2 className="bg-white rounded-full w-full mt-2     py-2 px-4 text-xl text-center " >خودرو ها</h2>
                <div className='grid lg:grid-cols-3  md:grid-cols-2 grid-cols-1 items-center text-center mt-6 gap-2 px-2  '>
                    {autogallery?.Ads?.map((ad, index) => (<AdsItem key={index} ad={ad} />))}
                </div>

            </div>


        </div>
    )
}

export default AutoGalleryDetail
