import { ImageURL } from '@/utils/URL'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import RectAuctionItem from '../global/RectAuctionItem'

const LastAuctions = ({ auctions }) => {
  return (
      <section className='mx-auto  pt-24 bg-black  pb-64  '>
          <div className='mx-auto max-w-screen-xl text-white relative '>
              
              <div className=' w-full h-full  z-30  relative     bg-transparent'>
                  <h2 className=' text-3xl w-full text-center '>
                      آخرین مزایده ها
                  </h2>
                  <div className=' px-4 py-2 mt-2 !font-[vazir] h-10 w-fit mx-auto bg-secondary rounded-full text-white flex justify-center gap-2 items-center' >
                      <svg className="w-8" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 34 25" fill="none">
                          <path d="M19.8462 5.57032e-10C20.2743 -1.11034e-05 20.6857 0.165988 20.9939 0.463089L21.1378 0.620208L27.2554 8.26944H28.1154C29.3809 8.26937 30.5987 8.75291 31.5194 9.62114C32.4402 10.4894 32.9944 11.6766 33.0687 12.94L33.0769 13.2311V19.8467C33.0769 20.2853 32.9027 20.706 32.5925 21.0161C32.2824 21.3263 31.8617 21.5005 31.4231 21.5005H29.4864C29.1441 22.4678 28.5103 23.3052 27.6724 23.8974C26.8346 24.4897 25.8337 24.8077 24.8077 24.8077C23.7816 24.8077 22.7808 24.4897 21.9429 23.8974C21.1051 23.3052 20.4713 22.4678 20.129 21.5005H12.948C12.6056 22.4678 11.9719 23.3052 11.134 23.8974C10.2961 24.4897 9.29528 24.8077 8.26923 24.8077C7.24318 24.8077 6.24235 24.4897 5.40448 23.8974C4.56661 23.3052 3.93287 22.4678 3.5905 21.5005H1.65385C1.21522 21.5005 0.794557 21.3263 0.4844 21.0161C0.174244 20.706 0 20.2853 0 19.8467V9.92333L0.0115769 9.72982L0.0248079 9.6372L0.0529232 9.5082L0.0727691 9.44866L0.0959232 9.36597L3.42677 1.0403C3.54938 0.733398 3.76111 0.470269 4.03467 0.284846C4.30823 0.0994233 4.63106 0.000209179 4.96154 5.57032e-10H19.8462ZM8.26923 18.1928C7.8306 18.1928 7.40994 18.367 7.09979 18.6772C6.78963 18.9873 6.61538 19.408 6.61538 19.8467C6.61538 20.2853 6.78963 20.706 7.09979 21.0161C7.40994 21.3263 7.8306 21.5005 8.26923 21.5005C8.70786 21.5005 9.12852 21.3263 9.43868 21.0161C9.74883 20.706 9.92308 20.2853 9.92308 19.8467C9.92308 19.408 9.74883 18.9873 9.43868 18.6772C9.12852 18.367 8.70786 18.1928 8.26923 18.1928ZM24.8077 18.1928C24.3691 18.1928 23.9484 18.367 23.6382 18.6772C23.3281 18.9873 23.1538 19.408 23.1538 19.8467C23.1538 20.2853 23.3281 20.706 23.6382 21.0161C23.9484 21.3263 24.3691 21.5005 24.8077 21.5005C25.2463 21.5005 25.667 21.3263 25.9771 21.0161C26.2873 20.706 26.4615 20.2853 26.4615 19.8467C26.4615 19.408 26.2873 18.9873 25.9771 18.6772C25.667 18.367 25.2463 18.1928 24.8077 18.1928ZM14.8846 3.30778H6.07954L4.09492 8.26944H14.8846V3.30778ZM19.0523 3.30778H18.1923V8.26944H23.0215L19.0523 3.30778Z" fill="white" />
                      </svg>
                      <p className='!font-[vazir]'>خودرو</p>
                      <svg className="w-8 pb-1" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 35 30" fill="none">
                          <path d="M14 30V19.4118H21V30H29.75V15.8824H35L17.5 0L0 15.8824H5.25V30H14Z" fill="white" />
                      </svg>
                      <p className='!font-[vazir]'>ملک</p>
                    <p className='!font-[vazir]'>وچیزای دیگه</p>
                      
                  </div>
                

                  <Link href="/auctions" className='grid lg:grid-cols-4  md:grid-cols-2 grid-cols-1 items-center text-center mt-24 gap-6 px-4   '>
                      <RectAuctionItem auction={auctions[0]}  />
                      <RectAuctionItem auction={auctions[1]}  />
                      <RectAuctionItem auction={auctions[2]}  />
                      <RectAuctionItem auction={auctions[3]}  />
                  </Link>

                  <div className='text-center py-10'>
                      <Link href='/auction' className="text-primary pb-64 ">مشاهده بیشتر</Link>
                  </div>
              </div>

                  <Image className='absolute top-0  object-cover w-full h-full ' src={ImageURL + 'carbanner3.png'} width={1930} height={856} alt="hero image" />
            
            
           

          </div>
      </section >
  )
}

export default LastAuctions
