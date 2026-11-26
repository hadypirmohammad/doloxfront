'use client'
import { ImageURL } from '@/utils/URL'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const Hero = () => {
    const [Swiper, setSwiper] = useState(null)
    const [SwiperSlide, setSwiperSlide] = useState(null)
    const [modules, setModules] = useState([])

    useEffect(() => {
        import('swiper/react').then(({ Swiper: S, SwiperSlide: SS }) => {
            setSwiper(() => S)
            setSwiperSlide(() => SS)
        })

        import('swiper/modules').then((mod) => {
            setModules([
                mod.Navigation,
                mod.Autoplay
            ])
        })

        import('swiper/css')
        import('swiper/css/navigation')
        import('swiper/css/pagination')
        import('swiper/css/autoplay')
    }, [])


    const items = ['🚗 سواری', '🚛 وانت', '🏍️ موتور', '🚚 کامیون', '🚜 تجهیزات']

    if (!Swiper || !SwiperSlide || !modules.length) {
        return (
            <div className="h-40 bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse rounded-xl shadow-2xl">
                <div className="h-full flex items-center justify-center text-2xl">Loading Swiper...</div>
            </div>
        )
    }

    return (
        <>
            <style jsx global>{`
                .mySwiper .swiper-button-next,
                .mySwiper .swiper-button-prev {
                    color: #FF5E00 !important;
                    background: rgba(255, 255, 255, 0.2);
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                }
                
                .mySwiper .swiper-button-next:after,
                .mySwiper .swiper-button-prev:after {
                    font-size: 18px;
                }
            `}</style>

            <section className='mx-auto  pt-36   bg-black  text-white relative '>
                <div className='mx-auto  text-white flex  !justify-end '>


                    <Image className='absolute top-0 object-cover w-full h-full flex justify-end  ' src={ImageURL + 'homepagebanner.png'} width={1280} height={721} alt="hero image" />

                    <div className='w-full text-white   !justify-end z-10  pr-4 pl-4 flex py-16 bg-[#00000099] sm:bg-transparent '>
                        <div className="w-1/2 lg:w-7/12 md:w-1/2 hidden text-white">

                        </div>

                        <div className="w-1/2 lg:w-5/12 md:w-1/2 w-full text-white flex justify-end  flex-col items-center  md:py-16">
                            <Image className=' w-full h-full' src={ImageURL + 'logobanner.png'} width={524} height={229} alt="hero image" />
                            <div className="p-8  text-white w-full mx-auto">


                                <Swiper
                                    modules={modules}
                                    spaceBetween={24}
                                    slidesPerView={1}
                                    centeredSlides={true}
                                    autoplay={{
                                        delay: 2500,
                                        disableOnInteraction: false,
                                        pauseOnMouseEnter: true
                                    }}
                                    speed={600}
                                    breakpoints={{
                                        640: {
                                            slidesPerView: 3,
                                            centeredSlides: false,
                                            autoplay: {
                                                delay: 3000
                                            }
                                        }
                                    }}

                                    navigation={true}
                                    loop={true}
                                    className="h-24 mySwiper shadow-2xl py-4 "
                                >

                                    <SwiperSlide >
                                        <div>
                                            <Image className='mx-auto ' src={ImageURL + 'savari.png'} width={145} height={50} alt="سواری" />
                                            <h2 className='text-[16px] pt-2 text-center'>سواری</h2>
                                        </div>
                                    </SwiperSlide>

                                    <SwiperSlide >
                                        <div>
                                            <Image className='mx-auto  ' src={ImageURL + 'vanet.png'} width={122} height={53} alt="وانت" />
                                            <h2 className='text-[16px] pt-2 text-center'>وانت وکامیونت</h2>
                                        </div>
                                    </SwiperSlide>
                                    <SwiperSlide >
                                        <div>
                                            <Image className='mx-auto ' src={ImageURL + 'motorcycle.png'} width={104} height={62} alt="موتور سیکلت" />
                                            <h2 className='text-[16px] pt-2 text-center'>موتور سیکلت</h2>
                                        </div>
                                    </SwiperSlide>
                                    <SwiperSlide >
                                        <div>
                                            <Image className='mx-auto  p-1' src={ImageURL + 'kamion.png'} width={143} height={66} alt="کامیون" />
                                            <h2 className='text-[16px] pt-2 text-center'>کامیون</h2>
                                        </div>
                                    </SwiperSlide>
                                    <SwiperSlide >
                                        <div>
                                            <Image className='mx-auto ' src={ImageURL + 'tractor.png'} width={102} height={66} alt="تجهیزات" />
                                            <h2 className='text-[16px] pt-2 text-center'>تجهیزات</h2>
                                        </div>
                                    </SwiperSlide>

                                </Swiper>


                            </div>

                            <div className=" flex bg-gradient-to-r from-primary to-secoundary mt-4  md:rounded-full  rounded-xl md:w-full w-fit md:h-[100px] max-w-screen-sm justify-center  flex items-center  px-[2px] py-[2px]">

                                <div className="flex    bg-[#100000] md:rounded-full rounded-xl flex-end md:w-full w-fit  md:h-[90px] p-4 justify-left items-center  justify-center gap-2 md:flex-row flex-col">
                                    <div className='flex    bg-[#100000] rounded-full   justify-center items-center'>

                                        <div className="text-left pl-2 ">
                                            <h2 className='text-secondary text-md '>مزایده های ویژه</h2>
                                            <p className="text-sm">فرصت های طلایی با بهترین قیمت</p>
                                        </div>
                                        <div className="bg-secondary rounded-full h-35 w-35 p-3 max-h-35 max-w-35" >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 32 30" fill="none">
                                                <path d="M21 10.5925L23.2171 7.90574C23.249 7.86715 23.2474 7.81097 23.2134 7.77422L16.9814 1.03141C16.9423 0.989006 16.8754 0.988509 16.8356 1.03032L14.2867 3.70722M21 10.5925L14.2867 3.70722M21 10.5925L18.7622 12.8876M14.2867 3.70722L7.81818 10.5925M14.2867 17.4777L11.9826 19.7018C11.9423 19.7408 11.8778 19.7389 11.8397 19.6977L5.61039 12.9578C5.57407 12.9185 5.57512 12.8576 5.61277 12.8196L7.81818 10.5925M14.2867 17.4777L7.81818 10.5925M14.2867 17.4777L15.5455 16.1007M18.7622 12.8876L30.9374 24.7609C30.9733 24.7959 30.9777 24.852 30.9479 24.8922L28.3409 28.4023C28.3048 28.4509 28.2342 28.4566 28.1908 28.4144L15.5455 16.1007M18.7622 12.8876L15.5455 16.1007M1.1 28.9531H16.4245C16.4797 28.9531 16.5245 28.9084 16.5245 28.8531V24.922C16.5245 24.8667 16.4797 24.822 16.4245 24.822H1.1C1.04477 24.822 1 24.8667 1 24.922V28.8531C1 28.9084 1.04477 28.9531 1.1 28.9531Z" stroke="white" stroke-width="2" />
                                            </svg>
                                        </div>

                                    </div>
                                    <div className="h-1/2 w-[1px] text-primary bg-primary rounded-full"></div>
                                    <div className='flex    bg-[#100000] rounded-full   justify-center items-center'>

                                        <div className="text-left pl-2">
                                            <h2 className='text-primary text-md'>اگهی های کاربران </h2>
                                            <p className="text-sm ">خرید  و فروش    سریع وآسان</p>

                                        </div>
                                        <div className="bg-primary rounded-full h-35 w-35 p-3 max-h-35 max-w-35" >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none">
                                                <path d="M1.02802 13.0109L12.5805 1.03059C12.5993 1.01104 12.6253 1 12.6524 1H22.0001C22.0554 1 22.1001 1.04477 22.1001 1.1V10.8801C22.1001 10.9067 22.0896 10.9321 22.0709 10.9509L10.0957 22.926C10.0554 22.9663 9.98959 22.9648 9.95115 22.9227L1.02616 13.1477C0.990585 13.1088 0.991401 13.0489 1.02802 13.0109Z" stroke="white" stroke-width="2" />
                                                <circle cx="17.3551" cy="5.74475" r="2.15686" fill="white" />
                                            </svg>
                                        </div>

                                    </div>

                                    <div>


                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >
        </>
    )
}

export default Hero
