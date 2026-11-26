import DashboardPanel from '@/components/global/DashboardPanel'
import { getToken, withAuth } from '@/utils/Auth';
import {
    getCities,
    getMyads,
    getPlans,
    buyPlan
} from '@/utils/Request';

import React, { useState, useEffect } from 'react'
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import { formatPrice } from '@/utils/Cal';
import { defaultAdImage, resolveAdImage } from '@/utils/adImage';

const LadderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="24" viewBox="0 0 54 43" fill="none">
    <path d="M17.919 42.833C13.0835 42.833 8.94209 41.1991 5.49487 37.9314C2.04764 34.6636 0.322143 30.6308 0.318365 25.833C0.314587 21.0352 2.13359 17.0591 5.77537 13.9047C9.41714 10.7502 13.721 9.05214 18.6869 8.81036L12.8644 2.93969L14.8675 0.936523L24.1892 10.2497L14.8732 19.5685L12.8672 17.5455L18.7322 11.6777C14.5464 11.9025 10.9037 13.3229 7.80403 15.939C4.70625 18.5532 3.15737 21.8512 3.15737 25.833C3.15737 29.8261 4.61181 33.1855 7.5207 35.9112C10.4258 38.6369 13.9089 39.9997 17.97 39.9997H23.75V42.833H17.919ZM32.25 19.6224V3.16636H53.5V19.6224H32.25ZM32.25 42.833V26.377H53.5V42.833H32.25ZM35.0834 39.9997H50.6667V29.2104H35.0834V39.9997Z" fill="currentColor" />
  </svg>
);

const CitiesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="32" viewBox="0 0 51 64" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M14.3438 0L39.8438 9.6V32H46.2188C46.6414 32 47.0468 32.1686 47.3457 32.4686C47.6446 32.7687 47.8125 33.1757 47.8125 33.6V60.8H49.4062C49.8289 60.8 50.2343 60.9686 50.5332 61.2686C50.8321 61.5687 51 61.9757 51 62.4C51 62.8243 50.8321 63.2313 50.5332 63.5314C50.2343 63.8314 49.8289 64 49.4062 64H1.59375C1.17106 64 0.765685 63.8314 0.466799 63.5314C0.167913 63.2313 0 62.8243 0 62.4C0 61.9757 0.167913 61.5687 0.466799 61.2686C0.765685 60.9686 1.17106 60.8 1.59375 60.8H3.1875V27.2C3.1875 26.7757 3.35541 26.3687 3.6543 26.0686C3.95318 25.7686 4.35856 25.6 4.78125 25.6H7.96875V14.4H11.1562V25.6H14.3438V0ZM17.5312 4.6176L36.6562 11.8176V32H31.875C31.4523 32 31.0469 32.1686 30.748 32.4686C30.4492 32.7687 30.2812 33.1757 30.2812 33.6V60.8H17.5312V4.6176ZM6.375 28.8V60.8H14.3438V28.8H6.375ZM44.625 60.8H41.4375V57.6H36.6562V60.8H33.4688V35.2H44.625V60.8Z" fill="currentColor" />
  </svg>
);

const FeaturedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round">
    <path d="M13.2 2 4.8 13.2h5.4L9.6 22l8.6-11.4h-5.6z" />
  </svg>
);

const ComboIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="28" viewBox="0 0 121 64" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M14.3438 0L39.8438 9.6V32H46.2188C46.6414 32 47.0468 32.1686 47.3457 32.4686C47.6446 32.7687 47.8125 33.1757 47.8125 33.6V60.8H49.4062C49.8289 60.8 50.2343 60.9686 50.5332 61.2686C50.8321 61.5687 51 61.9757 51 62.4C51 62.8243 50.8321 63.2313 50.5332 63.5314C50.2343 63.8314 49.8289 64 49.4062 64H1.59375C1.17106 64 0.765685 63.8314 0.466799 63.5314C0.167913 63.2313 0 62.8243 0 62.4C0 61.9757 0.167913 61.5687 0.466799 61.2686C0.765685 60.9686 1.17106 60.8 1.59375 60.8H3.1875V27.2C3.1875 26.7757 3.35541 26.3687 3.6543 26.0686C3.95319 25.7686 4.35856 25.6 4.78125 25.6H7.96875V14.4H11.1562V25.6H14.3438V0ZM17.5312 4.6176L36.6562 11.8176V32H31.875C31.4523 32 31.0469 32.1686 30.748 32.4686C30.4492 32.7687 30.2812 33.1757 30.2812 33.6V60.8H17.5312V4.6176ZM6.375 28.8V60.8H14.3438V28.8H6.375ZM44.625 60.8H41.4375V57.6H36.6562V60.8H33.4688V35.2H44.625V60.8Z" fill="currentColor" />
    <path d="M96 17.5C99.2728 17.5008 102.5 18.2666 105.424 19.7362C108.349 21.2057 110.889 23.3384 112.842 25.9641C114.796 28.5898 116.109 31.6357 116.677 34.8589C117.244 38.0821 117.05 41.3933 116.111 44.5283C115.171 47.6633 113.512 50.5353 111.266 52.9152C109.019 55.2951 106.247 57.117 103.172 58.2355C100.096 59.354 96.8014 59.7382 93.5509 59.3573C90.3004 58.9765 87.1838 57.8412 84.45 56.042V56H84.387C80.6273 53.5061 77.7707 49.8676 76.2403 45.6234C74.7099 41.3792 74.587 36.755 75.8899 32.4355C77.1928 28.1161 79.8522 24.331 83.4742 21.641C87.0962 18.951 91.4883 17.499 96 17.5ZM75.8925 52.5C76.7722 53.76 77.7592 54.9267 78.8535 56H62.75C62.2859 56 61.8408 56.1844 61.5126 56.5126C61.1844 56.8408 61 57.2859 61 57.75C61 58.2141 61.1844 58.6592 61.5126 58.9874C61.8408 59.3156 62.2859 59.5 62.75 59.5H83.372C87.0894 61.7339 91.3332 62.941 95.6699 62.9979C100.006 63.0548 104.281 61.9596 108.055 59.824C111.83 57.6884 114.97 54.5891 117.155 50.8427C119.34 47.0963 120.491 42.837 120.491 38.5C120.491 34.163 119.34 29.9037 117.155 26.1573C114.97 22.4109 111.83 19.3116 108.055 17.176C104.281 15.0404 100.006 13.9452 95.6699 14.0021C91.3332 14.059 87.0894 15.2661 83.372 17.5H66.25C65.7859 17.5 65.3408 17.6844 65.0126 18.0126C64.6844 18.3408 64.5 18.7859 64.5 19.25C64.5 19.7141 64.6844 20.1592 65.0126 20.4874C65.3408 20.8156 65.7859 21 66.25 21H78.8535C76.5222 23.2788 74.6705 26.0011 73.4076 29.0066C72.1447 32.0121 71.4961 35.24 71.5 38.5C71.5 42.259 72.347 45.815 73.859 49H69.75C69.2859 49 68.8408 49.1844 68.5126 49.5126C68.1844 49.8408 68 50.2859 68 50.75C68 51.2141 68.1844 51.6592 68.5126 51.9874C68.8408 52.3156 69.2859 52.5 69.75 52.5H75.8925ZM86.1895 31.164C84.6058 33.2819 83.75 35.8554 83.75 38.5C83.75 41.251 84.66 43.792 86.1895 45.836L89.9695 42.056C89.3345 40.9786 88.9997 39.7507 89 38.5C89 37.205 89.3535 35.987 89.9695 34.944L86.1895 31.164ZM88.664 28.6895L92.444 32.4695C93.5214 31.8345 94.7493 31.4997 96 31.5C97.295 31.5 98.513 31.8535 99.556 32.4695L103.336 28.6895C101.218 27.1058 98.6446 26.25 96 26.25C93.249 26.25 90.708 27.16 88.664 28.6895ZM105.814 31.164L102.034 34.944C102.669 36.0217 103.003 37.2497 103.003 38.5005C103.002 39.7512 102.666 40.979 102.03 42.056L105.811 45.836C107.344 43.792 108.25 41.251 108.25 38.5C108.25 35.749 107.343 33.208 105.814 31.164ZM103.333 48.314L99.5525 44.534C98.4757 45.1672 97.2491 45.5007 96 45.5C94.705 45.5 93.487 45.1465 92.444 44.5305L88.664 48.3105C90.708 49.8435 93.249 50.75 96 50.75C98.751 50.75 101.292 49.84 103.336 48.3105M80.25 38.5C80.25 36.4317 80.6574 34.3836 81.4489 32.4727C82.2404 30.5619 83.4005 28.8256 84.8631 27.3631C86.3256 25.9005 88.0619 24.7404 89.9727 23.9489C91.8836 23.1574 93.9317 22.75 96 22.75C98.0683 22.75 100.116 23.1574 102.027 23.9489C103.938 24.7404 105.674 25.9005 107.137 27.3631C108.599 28.8256 109.76 30.5619 110.551 32.4727C111.343 34.3836 111.75 36.4317 111.75 38.5C111.75 42.6772 110.091 46.6832 107.137 49.6369C104.183 52.5906 100.177 54.25 96 54.25C91.8228 54.25 87.8168 52.5906 84.8631 49.6369C81.9094 46.6832 80.25 42.6772 80.25 38.5ZM92.5 38.5C92.5 39.4283 92.8687 40.3185 93.5251 40.9749C94.1815 41.6313 95.0717 42 96 42C96.9283 42 97.8185 41.6313 98.4749 40.9749C99.1312 40.3185 99.5 39.4283 99.5 38.5C99.5 37.5717 99.1312 36.6815 98.4749 36.0251C97.8185 35.3687 96.9283 35 96 35C95.0717 35 94.1815 35.3687 93.5251 36.0251C92.8687 36.6815 92.5 37.5717 92.5 38.5Z" fill="currentColor" />
  </svg>
);

const UPGRADE_PLANS = [
  {
    id: 5,
    title: 'صدرنشین',
    description: 'آگهی خود را به صدر فهرست آگهی‌ها بیاورید.',
    fallbackPrice: 14900,
    Icon: LadderIcon,
  },
  {
    id: 2,
    title: 'سراسری',
    description: 'نمایش آگهی شما در تمام شهرها',
    fallbackPrice: 39900,
    Icon: CitiesIcon,
  },
  {
    id: 3,
    title: 'سفارشی',
    description: 'آگهی خود را با نشان ویژه متمایز کنید.',
    fallbackPrice: 39900,
    Icon: FeaturedIcon,
  },
  {
    id: 4,
    title: 'سفارشی سراسری',
    description: 'نمایش آگهی با نشان ویژه در تمام شهرها.',
    fallbackPrice: 69900,
    Icon: ComboIcon,
  },
];

export async function getServerSideProps(context) {
    const authResult = await withAuth(context);

    if (authResult.redirect) {
        return authResult;
    }

    const token = await getToken(context);
    const { adid } = context.params;

    const myads = await getMyads(token);
    const current = myads.find(ad => ad.AdId == adid);

    const cities = await getCities(token);

    return {
        props: {
            cities: cities || [],
            ad: current || {},
            token: token || null
        },
    };
}

const ManageAd = ({ cities, ad, token, user }) => {
    const router = useRouter();

    const [plans, setPlans] = useState([]);
    const [selectedPlanId, setSelectedPlanId] = useState(null);

    const activePlanId = ad?.PlanId;

    const fetchPlans = async () => {
        try {
            const response = await getPlans(ad.AdId);
            setPlans(response);
        } catch (error) {
            console.error("Error fetching plans:", error);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const [image, setImage] = useState(resolveAdImage(ad?.CoverImage, ad));

    const getPlanById = (planId) => (Array.isArray(plans) ? plans : []).find((p) => Number(p.PlanId) === planId);

    const handlePlanSelect = (planId) => {
        if (getPlanById(planId)) {
            setSelectedPlanId(planId);
        }
    };

    const isPlanActive = (planId) => {
        return (
            (planId !== 5 && activePlanId === planId) ||
            (
                activePlanId === 4 &&
                (planId === 2 || planId === 3)
            )
        );
    };

    const canBuyPlan = (planId) => {
        if (selectedPlanId !== planId) return false;
        if (planId === 5) return Boolean(getPlanById(5));
        if (planId === 2) return activePlanId !== 2 && activePlanId !== 4;
        if (planId === 3) return activePlanId !== 3 && activePlanId !== 4;
        if (planId === 4) return activePlanId !== 4;
        return false;
    };

    const upgradePlan = async (planid) => {
        const result = await buyPlan(token, ad.AdId, planid);
        if (result?.includes("zibal")) {
            toast.success('در حال انتقال به صفحه پرداخت')
            setTimeout(() => {
                router.push(result)
            }, 200);
        } else {
            console.error('Invalid payment link from server:', result);
            toast.error(result || 'لینک پرداخت از سرور دریافت نشد')
        }
    };

    return (
        <div className='flex h-fit w-full justify-start bg-[#FAFAFA] px-4 pb-10 pt-6 md:pt-8'>
            <DashboardPanel user={user} />

            <div className='flex h-full w-full flex-col justify-start gap-2 px-4 md:flex-row'>
                <div className='flex h-fit w-full flex-col gap-4 rounded-[34px] bg-white p-5 md:max-w-sm md:p-6'>
                    <div className='relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#EEF1F5]'>
                        <Image
                            className='object-cover'
                            src={image}
                            fill
                            sizes='(max-width:768px) 100vw, 360px'
                            alt=''
                            onError={() => setImage(defaultAdImage(ad))}
                        />
                    </div>

                    <p className='font-soft m-0 text-center text-[17px] text-secondary md:text-[19px]'>
                        {ad.Title}
                    </p>
                </div>

                <div className='flex h-fit max-w-screen-lg flex-col rounded-[34px] bg-white p-8 md:max-w-xl'>
                    <div className='flex items-center justify-between'>
                        <div className='h-1 w-14 bg-[#D9D9D9] md:w-1/2' />
                        <div className="flex w-1/2 items-center justify-center gap-2">
                            <svg width="28" height="26" viewBox="0 0 39 37" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                                <path d="M19.5 0L0 12.5959V21.296L19.5 8.70003L39 21.296V12.5959L19.5 0ZM19.5 10.4729L6.75325 18.8094V26.1938L19.5 17.8572L32.2468 26.1938V18.8094L19.5 10.4729ZM19.5 19.6336L12.1558 24.4368V29.9659L19.5 25.222L26.8442 29.9659V24.4368L19.5 19.6336ZM19.5 26.9913L12.1558 31.7352V37L19.5 32.2561L26.8442 37V31.7352L19.5 26.9913Z" fill="currentColor" />
                            </svg>
                            <p className="text-xl text-secondary">ارتقا اگهی</p>
                        </div>
                        <div className='h-1 w-14 bg-[#D9D9D9] md:w-1/2' />
                    </div>

                    <div className="mt-5 space-y-3" dir="rtl">
                        {UPGRADE_PLANS.map(({ id, title, description, fallbackPrice, Icon }) => {
                            const plan = getPlanById(id);
                            const exists = Boolean(plan);
                            const active = isPlanActive(id);
                            const selected = selectedPlanId === id;
                            const price = plan?.PlanPrice ?? fallbackPrice;
                            const showBuy = canBuyPlan(id);

                            return (
                                <div
                                    key={id}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => exists && handlePlanSelect(id)}
                                    onKeyDown={(e) => {
                                        if (exists && (e.key === 'Enter' || e.key === ' ')) {
                                            handlePlanSelect(id);
                                        }
                                    }}
                                    className={`flex w-full items-center gap-3 rounded-2xl border bg-white p-4 text-right transition sm:gap-4 sm:p-5 ${
                                        !exists ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                                    } ${
                                        active
                                            ? 'border-success/40 shadow-[0_8px_24px_rgba(22,163,74,0.12)] ring-2 ring-success/20'
                                            : selected
                                              ? 'border-primary shadow-[0_8px_24px_rgba(255,94,0,0.18)] ring-2 ring-primary/25'
                                              : 'border-[#F0F0F0] shadow-[0_4px_16px_rgba(36,59,83,0.05)] hover:border-primary/35 hover:shadow-[0_8px_22px_rgba(255,94,0,0.1)]'
                                    }`}
                                >
                                    <div
                                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl sm:h-16 sm:w-16 ${
                                            active
                                                ? 'bg-success/15 text-success'
                                                : selected
                                                  ? 'bg-primary text-white'
                                                  : 'bg-primary/10 text-primary'
                                        }`}
                                    >
                                        <Icon />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <h2 className="text-[14px] font-bold text-secondary sm:text-[15px]">{title}</h2>
                                            {active && (
                                                <span className="shrink-0 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold text-success">
                                                    پلن فعال
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-1 font-['vazir'] text-[12px] leading-5 text-[#8A8A8A] sm:text-[13px]">
                                            {description}
                                        </p>
                                        {!active && price != null && (
                                            <p className="mt-2 font-['vazir'] text-[13px] font-bold text-primary">
                                                {formatPrice(price)} تومان
                                            </p>
                                        )}
                                    </div>

                                    {showBuy && (
                                        <button
                                            type="button"
                                            className="shrink-0 rounded-xl bg-primary px-4 py-2.5 text-sm text-white transition hover:opacity-90"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                upgradePlan(selectedPlanId);
                                            }}
                                        >
                                            خرید
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ManageAd;
