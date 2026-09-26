import DashboardPanel from '@/components/global/DashboardPanel'
import { getToken, withAuth } from '@/utils/Auth'
import {
    getAutogalleries,
    getGallerySubscriptionPlans,
    getGalleryQuota,
    prepareGallerySubscription,
} from '@/utils/Request'
import { BackendURL } from '@/utils/URL'
import { formatPrice, calculateDaysLeft } from '@/utils/Cal'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
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
                destination: '/dashboard/auto',
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
    const [quota, setQuota] = useState(null)
    const [selectedPlanId, setSelectedPlanId] = useState(null)
    const [buying, setBuying] = useState(false)

    useEffect(() => {
        const fetchQuota = async () => {
            const data = await getGalleryQuota(token, gallery.GalleryId)
            setQuota(data)
        }
        fetchQuota()
    }, [token, gallery.GalleryId])

    useEffect(() => {
        console.log('GetGallerySubscriptionPlans response:', plans)
    }, [plans])

    const imageSrc = (path) => {
        if (!path) return '/media/images/logo.png'
        return `${BackendURL.replace(/\/$/, '')}${path}`
    }

    const remainingNormal = quota?.RemainingNormal ?? 0
    const remainingLadder = quota?.RemainingLadder ?? 0
    const endDate = quota?.IsInFreePeriod
        ? quota?.FreePeriodEndDate
        : quota?.SubscriptionEndDate
    const daysLeft = endDate ? calculateDaysLeft(endDate) : null
    const periodLabel = quota?.IsInFreePeriod ? 'دوره رایگان' : 'اشتراک'

    const handleBuy = async (planId) => {
        try {
            setBuying(true)
            setSelectedPlanId(planId)

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

            <div className='h-full w-full md:px-6 px-2 justify-start gap-4 flex md:flex-row flex-col max-w-6xl'>
                {/* Gallery card */}
                <div className='bg-white md:w-[380px] md:min-w-[380px] w-full h-fit rounded-[34px] p-5 md:p-6 flex flex-col shadow-sm'>
                    <div className='relative mb-14'>
                        <Image
                            className='object-cover rounded-2xl w-full h-40 md:h-48'
                            src={imageSrc(gallery.Cover)}
                            width={400}
                            height={192}
                            alt='Gallery Cover'
                        />
                        <div className='absolute -bottom-10 right-4 flex items-end gap-3'>
                            <div className='rounded-2xl bg-gradient-to-r from-[#BC1526] to-[#560A11] p-1'>
                                <Image
                                    className='object-cover rounded-xl bg-white w-20 h-20 md:w-24 md:h-24'
                                    src={imageSrc(gallery.Profile)}
                                    width={96}
                                    height={96}
                                    alt='Gallery Profile'
                                />
                            </div>
                        </div>
                    </div>

                    <h1 className='text-xl md:text-2xl mb-1 pr-1'>{gallery.Name}</h1>
                    {gallery.Adress && (
                        <p className='font-[vazir] text-sm text-base-content/60 mb-4 pr-1 line-clamp-2'>
                            {gallery.Adress}
                        </p>
                    )}

                    <div className='mb-5 font-[vazir]'>
                        {!quota ? (
                            <div className='bg-base-200 rounded-2xl p-6 flex justify-center'>
                                <span className='loading loading-spinner loading-md text-primary'></span>
                            </div>
                        ) : (
                            <div className='rounded-2xl overflow-hidden border border-base-300'>
                                <div
                                    className={`px-4 py-3 text-white flex items-center justify-between ${
                                        quota.NeedsSubscription
                                            ? 'bg-primary'
                                            : quota.IsInFreePeriod
                                              ? 'bg-secondary'
                                              : 'bg-accent'
                                    }`}
                                >
                                    <span className='text-sm'>
                                        {quota.NeedsSubscription
                                            ? 'نیاز به اشتراک'
                                            : periodLabel}
                                    </span>
                                    {daysLeft !== null && daysLeft > 0 && (
                                        <span className='bg-white/20 rounded-full px-3 py-1 text-sm'>
                                            {daysLeft} روز باقی‌مانده
                                        </span>
                                    )}
                                    {daysLeft !== null && daysLeft <= 0 && (
                                        <span className='bg-white/20 rounded-full px-3 py-1 text-sm'>
                                            منقضی شده
                                        </span>
                                    )}
                                </div>

                                <div className='grid grid-cols-2 gap-px bg-base-300'>
                                    <div className='bg-white p-4 md:p-5 text-center'>
                                        <p className='text-3xl md:text-4xl font-bold text-secondary'>
                                            {remainingNormal}
                                        </p>
                                        <p className='text-xs text-base-content/70 mt-1'>
                                            آگهی معمولی
                                        </p>
                                    </div>
                                    <div className='bg-white p-4 md:p-5 text-center'>
                                        <p className='text-3xl md:text-4xl font-bold text-primary'>
                                            {remainingLadder}
                                        </p>
                                        <p className='text-xs text-base-content/70 mt-1'>
                                            پلکان
                                        </p>
                                    </div>
                                </div>

                                {quota.NeedsSubscription && (
                                    <div className='bg-base-200 px-4 py-3 text-sm text-primary text-center'>
                                        {quota.Reason ||
                                            'برای ثبت آگهی نیاز به خرید اشتراک دارید'}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className='flex flex-col gap-2'>
                        <Link
                            href={`/autogallery/${gallery.GalleryId}`}
                            className='btn text-white bg-secondary border-none hover:text-white'
                        >
                            مشاهده اتوگالری
                        </Link>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                            <Link
                                href={`/createad?gl=${gallery.GalleryId}`}
                                className='btn text-white bg-[#FCA474] border-none hover:text-white'
                            >
                                ثبت آگهی
                            </Link>
                            <Link
                                href={`/autogallery/edit/${gallery.GalleryId}`}
                                className='btn text-white bg-primary border-none hover:text-white'
                            >
                                ویرایش
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Plans card */}
                <div className='bg-white flex-1 w-full h-fit rounded-[34px] p-5 md:p-8 flex flex-col shadow-sm'>
                    <div className='flex justify-between items-center mb-6'>
                        <div className='h-1 flex-1 bg-[#D9D9D9]' />
                        <p className='text-xl md:text-2xl px-4 whitespace-nowrap'>اشتراک گالری</p>
                        <div className='h-1 flex-1 bg-[#D9D9D9]' />
                    </div>

                    <p className='font-[vazir] text-sm text-base-content/60 text-center mb-6 md:mb-8'>
                        با خرید اشتراک، سهمیه آگهی معمولی و پلکان گالری خود را افزایش دهید
                    </p>

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
                                        <div className='mb-1 flex flex-wrap items-center gap-2'>
                                            <h2 className='text-lg text-secondary md:text-xl'>{plan.Name}</h2>
                                            <span className='rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-[vazir] text-primary'>
                                                {plan.DurationDays} روز
                                            </span>
                                        </div>
                                        <p className='mt-1 font-[vazir] text-sm text-[#8A8A8A]'>
                                            {plan.Describe}
                                        </p>
                                        <div className='mt-3 flex flex-wrap gap-2 font-[vazir] text-xs'>
                                            <span className='rounded-lg bg-primary/10 px-2.5 py-1 text-primary'>
                                                {plan.NormalAdsCount} آگهی معمولی
                                            </span>
                                            <span className='rounded-lg bg-primary/10 px-2.5 py-1 text-primary'>
                                                {plan.LadderAdsCount} پلکان
                                            </span>
                                        </div>
                                        <p className='pt-3 font-[vazir] text-base font-bold text-primary md:text-lg'>
                                            {formatPrice(plan.Price)} تومان
                                        </p>
                                    </div>

                                    <button
                                        type='button'
                                        disabled={buying || !isSelected}
                                        className={`h-11 w-full rounded-xl font-[vazir] font-bold transition-all md:w-[120px] ${
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
