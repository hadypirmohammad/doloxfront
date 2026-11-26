import DashboardPanel from '@/components/global/DashboardPanel'
import { getToken, withAuth } from '@/utils/Auth'
import {
    getAutogalleries,
    getGallerySubscriptionPlans,
    prepareGallerySubscription,
} from '@/utils/Request'
import { formatPrice, toPersianDigits } from '@/utils/Cal'

const GALLERY_PLAN_PRICES = {
    1: 599000,
    2: 999000,
    3: 1799000,
}
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'

export async function getServerSideProps(context) {
    const authResult = await withAuth(context)

    if (authResult.redirect) {
        return authResult
    }

    const token = await getToken(context)
    const { galleryid } = context.params

    const myGalleries = await getAutogalleries(token)
    const gallery = (myGalleries || []).find(
        (item) => String(item.GalleryId) === String(galleryid)
    )

    if (!gallery) {
        return {
            redirect: {
                destination: '/dashboard/gallery',
                permanent: false,
            },
        }
    }

    const plans = await getGallerySubscriptionPlans()

    return {
        props: {
            gallery,
            plans: plans || [],
            token: token || null,
        },
    }
}

const ManageAuto = ({ gallery, plans, token, user }) => {
    const router = useRouter()
    const [selectedPlanId, setSelectedPlanId] = useState(null)
    const [buying, setBuying] = useState(false)

    const handleBuy = async (planId) => {
        try {
            setBuying(true)
            const result = await prepareGallerySubscription(
                token,
                planId,
                gallery.GalleryId
            )

            if (result?.includes('zibal') || result?.startsWith('http')) {
                toast.success('در حال انتقال به صفحه پرداخت')
                setTimeout(() => {
                    router.push(result)
                }, 200)
            } else {
                toast.error('خطا در ایجاد لینک پرداخت')
            }
        } catch (error) {
            toast.error('خطا در خرید اشتراک')
        } finally {
            setBuying(false)
        }
    }

    return (
        <div className='flex h-fit w-full justify-start bg-[#FAFAFA] px-4 pb-10 pt-6 md:pt-8'>
            <DashboardPanel user={user} />

            <div className='h-full w-full justify-start gap-4 flex flex-col max-w-3xl px-2 md:px-6'>
                <div className='bg-white w-full h-fit rounded-[28px] p-5 md:p-8 flex flex-col shadow-sm'>
                    <div className='mb-6 flex flex-col gap-1.5'>
                        <Link
                            href='/dashboard/gallery'
                            className='flex w-fit items-center gap-1.5 font-[vazir] text-[13px] text-[#8A8A8A] transition-colors hover:text-primary'
                        >
                            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                                <path d='M10 6l6 6-6 6' />
                            </svg>
                            بازگشت به گالری من
                        </Link>
                        <p className='font-soft m-0 text-[19px] text-secondary md:text-[22px]'>اشتراک گالری</p>
                        <p className='m-0 font-[vazir] text-[13px] text-[#8A8A8A]'>
                            برای گالری «{gallery.Name}» — سهمیه آگهی و صدرنشین خود را افزایش دهید.
                        </p>
                    </div>

                    <div dir='rtl' className='flex flex-col gap-3 md:gap-4'>
                        {(plans || []).map((plan) => {
                            const isSelected =
                                selectedPlanId === plan.GallerySubscriptionPlanId

                            return (
                                <div
                                    key={plan.GallerySubscriptionPlanId}
                                    className={`flex cursor-pointer flex-col justify-between gap-4 rounded-2xl border bg-white p-4 transition-all duration-200 md:flex-row md:items-center md:p-6 ${
                                        isSelected
                                            ? 'border-primary shadow-[0_8px_24px_rgba(255,94,0,0.18)] ring-2 ring-primary/25'
                                            : 'border-[#F0F0F0] shadow-[0_4px_16px_rgba(36,59,83,0.05)] hover:border-primary/35 hover:shadow-[0_8px_22px_rgba(255,94,0,0.1)]'
                                    }`}
                                    onClick={() =>
                                        setSelectedPlanId(plan.GallerySubscriptionPlanId)
                                    }
                                >
                                    <div className='w-full md:flex-1'>
                                        <h2 className='font-soft m-0 text-[16px] text-secondary md:text-[18px]'>{plan.Name}</h2>

                                        <div className='mt-2.5 flex flex-wrap gap-2 font-[vazir] text-xs'>
                                            <span className='rounded-lg bg-primary/10 px-2.5 py-1 text-primary'>
                                                {toPersianDigits(plan.NormalAdsCount)} آگهی
                                            </span>
                                            <span className='rounded-lg bg-primary/10 px-2.5 py-1 text-primary'>
                                                {toPersianDigits(plan.LadderAdsCount)} صدرنشین
                                            </span>
                                        </div>

                                        <p className='font-soft pt-3 text-[15px] text-primary md:text-[17px]'>
                                            {toPersianDigits(formatPrice(plan.Price ?? GALLERY_PLAN_PRICES[plan.GallerySubscriptionPlanId]))} تومان
                                        </p>
                                    </div>

                                    <button
                                        type='button'
                                        disabled={buying || !isSelected}
                                        className={`font-soft h-11 w-full rounded-xl transition-all md:w-[120px] ${
                                            isSelected
                                                ? 'bg-primary text-white hover:opacity-90'
                                                : 'bg-[#F5F5F5] text-[#A0A0A0] cursor-default'
                                        } disabled:opacity-60`}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            if (isSelected) {
                                                handleBuy(plan.GallerySubscriptionPlanId)
                                            }
                                        }}
                                    >
                                        {buying && isSelected ? '...' : 'خرید'}
                                    </button>
                                </div>
                            )
                        })}

                        {!plans?.length && (
                            <p className='py-10 text-center font-[vazir] text-secondary'>
                                پلانی برای نمایش وجود ندارد
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManageAuto
