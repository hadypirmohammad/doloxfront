import GalleryForm from '@/components/CreateAuto/GalleryForm';
import { galleryTypeId } from '@/utils/services/galleryPanel';
import { getToken, withAuth } from '@/utils/Auth';
import { createAutoGalleryreq, getcities } from '@/utils/Request';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export async function getServerSideProps(context) {
    const authResult = await withAuth(context);

    if (authResult.redirect) {
        return authResult;
    }
    const token = await getToken(context);

    return { props: { token: token || "" } }
}


const CrateAutoGallery = ({ token }) => {
    const router = useRouter()

    const [cities, setCities] = useState([])
    const [loading, setLoading] = useState(false)
    const [failed, setFailed] = useState(false)
    const [done, setDone] = useState(false)

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const result = await getcities();
                setCities(result || []);
            } catch (err) {
                setCities([]);
            }
        };

        fetchCities();
    }, []);

    const handleSubmit = async (values) => {
        setLoading(true)
        setFailed(false)

        const provinceName = values.city?.ProvinceName || ''
        const cityName = values.city?.CityName || ''
        const fullAddress = [provinceName, cityName, values.address].filter(Boolean).join('، ')

        try {
            const result = await createAutoGalleryreq(
                token,
                values.name,
                values.describe,
                fullAddress,
                null,
                null,
                {
                    type: galleryTypeId(values.type),
                    manager: [values.manager, values.managerLast].filter(Boolean).join(' '),
                    cityId: values.city?.CityId,
                    mobile: values.mobile,
                    phone: values.phone,
                    email: values.email,
                }
            );

            if (result.status === 200 || result.status === 201) {
                setDone(true)
                toast.success('گالری ثبت شد !')
                setTimeout(() => {
                    router.push("/dashboard/gallery")
                }, 1500);
            } else {
                setFailed(true)
            }
        } catch (error) {
            console.error("Error creating gallery:", error);
            setFailed(true)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='relative min-h-screen w-full overflow-hidden bg-[#F3F7FB] px-3 pb-12 pt-6 text-secondary sm:px-4 md:pt-8'>
            <span className='pointer-events-none absolute -left-28 -top-44 h-[420px] w-[420px] rounded-full bg-[#E9F0F8]' />
            <span className='pointer-events-none absolute -bottom-52 -right-40 h-[520px] w-[520px] rounded-full bg-[#E9F0F8]' />

            <div className='relative mx-auto w-full max-w-screen-lg rounded-[18px] bg-white p-5 shadow-[0_10px_40px_rgba(29,53,87,.07)] sm:p-8 lg:p-11'>
                {done ? (
                    <div dir='rtl' className='flex flex-col items-center px-4 py-20 text-center'>
                        <span className='flex h-20 w-20 items-center justify-center rounded-full bg-[#E8F7EE] text-[#1E9E5A]'>
                            <svg width='42' height='42' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round'>
                                <circle cx='12' cy='12' r='9' />
                                <path d='m8.5 12.3 2.5 2.5 4.5-5' />
                            </svg>
                        </span>
                        <p className='m-0 pt-5 text-lg font-bold text-secondary'>گالری شما با موفقیت ثبت شد</p>
                        <p className='m-0 max-w-sm pt-3 text-sm leading-[2] text-[#8B94A5]'>
                            تیم پشتیبانی دولوکس اطلاعات شما را بررسی و در کوتاه‌ترین زمان با شما تماس خواهد گرفت.
                        </p>
                    </div>
                ) : (
                    <>
                        {failed && (
                            <div dir='rtl' className='mb-6 flex items-center gap-2.5 rounded-[14px] bg-[#FDECEC] p-3.5 text-[13px] text-[#E03A3A]'>
                                <svg width='19' height='19' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.9' strokeLinecap='round' className='flex-none'>
                                    <circle cx='12' cy='12' r='9' />
                                    <path d='M12 7.5v5.5M12 16.2v.2' />
                                </svg>
                                ثبت گالری انجام نشد، لطفا دوباره تلاش کنید.
                            </div>
                        )}

                        <GalleryForm cities={cities} loading={loading} onSubmit={handleSubmit} />
                    </>
                )}
            </div>
        </div>
    )
}

export default CrateAutoGallery
