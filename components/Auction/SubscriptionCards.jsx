import React, { useEffect, useState } from 'react';
import { getSubscription , buySubs, checkDiscountCode } from '@/utils/Request';
import { applyDiscount, discountLabel } from '@/utils/Cal';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

const planPrices = {
    1: 990000,
    2: 2690000,
    3: 4490000,
    4: 7900000,
};

const planMeta = {
    1: { tag: 'اقتصادی', gem: ['#4FA8FF', '#1667C8', '#8FD0FF'] },
    2: { tag: 'پیشنهاد ویژه', gem: ['#FF5B5B', '#C81616', '#FF9B9B'] },
    3: { tag: 'حرفه‌ای', gem: ['#A971FF', '#6B2FD6', '#CDB0FF'] },
    4: { tag: 'پرمیوم', gem: ['#FFC34D', '#F0820A', '#FFE0A3'] },
};

const isWalletPayment = (value) => /paid\s*with\s*wallet|از\s*کیف\s*پول/i.test(String(value || ""));

const isPaymentLink = (value) => {
    const link = String(value || "").trim();
    if (!/^https?:\/\//.test(link)) return false;

    try {
        return new URL(link).pathname.replace(/\/+$/, "").length > 0;
    } catch {
        return false;
    }
};

const GemIcon = ({ colors }) => (
    <svg width='30' height='30' viewBox='0 0 24 24' fill='none' className='flex-none'>
        <path d='M7.5 3h9l4.5 6-9 12-9-12z' fill={colors[0]} />
        <path d='M12 3h4.5L21 9l-9 12z' fill={colors[1]} />
        <path d='M7.5 3 12 9 16.5 3' fill={colors[2]} />
        <path d='M3 9h18' stroke='#FFFFFF' strokeWidth='.9' strokeOpacity='.65' />
        <path d='M7.5 3 3 9M16.5 3 21 9M12 9v12' stroke='#FFFFFF' strokeWidth='.9' strokeOpacity='.5' />
    </svg>
);

const planFeatures = [
    'دسترسی به مزایده‌ها در ربات تلگرام',
    'دسترسی کامل به تمامی مزایده‌ها',
    'اطلاع‌رسانی مزایده‌های جدید',
    'پشتیبانی آنلاین',
];

const highlights = [
    {
        title: 'اطلاع‌رسانی لحظه‌ای',
        text: 'مزایده‌های جدید را بلافاصله دریافت کنید',
        icon: (
            <>
                <path d='M18 8.5a6 6 0 1 0-12 0c0 6-2.5 7.5-2.5 7.5h17S18 14.5 18 8.5z' />
                <path d='M13.7 19.5a2 2 0 0 1-3.4 0' />
            </>
        ),
    },
    {
        title: 'دسترسی کامل',
        text: 'همه مزایده‌های دولتی و خصوصی کشور',
        icon: (
            <>
                <path d='M3.5 9.5 12 4l8.5 5.5' />
                <path d='M5.5 10.5v8h13v-8' />
                <path d='M3.5 18.5h17' />
                <path d='M9.5 18.5v-4h5v4' />
            </>
        ),
    },
    {
        title: 'پشتیبانی آنلاین',
        text: 'کارشناسان دولوکس پاسخگوی شما هستند',
        icon: (
            <>
                <path d='M4 11.5a8 8 0 0 1 16 0' />
                <rect x='3' y='11.5' width='3.5' height='6' rx='1.7' />
                <rect x='17.5' y='11.5' width='3.5' height='6' rx='1.7' />
                <path d='M20 17.5v1a2.5 2.5 0 0 1-2.5 2.5H13' />
            </>
        ),
    },
];

const SUPPORT_PHONES = [
    { raw: '09139777207', label: '۰۹۱۳۹۷۷۷۲۰۷' },
    { raw: '09130966206', label: '۰۹۱۳۰۹۶۶۲۰۶' },
];

const CheckIcon = () => (
    <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.6' strokeLinecap='round' strokeLinejoin='round'>
        <path d='M20 6 9 17l-5-5' />
    </svg>
);

const SubscriptionCards = (token) => {
    const router = useRouter()
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [checkoutPlan, setCheckoutPlan] = useState(null);
    const [discountInput, setDiscountInput] = useState("");
    const [discount, setDiscount] = useState(null);
    const [discountMessage, setDiscountMessage] = useState("");
    const [checkingDiscount, setCheckingDiscount] = useState(false);
    const [buying, setBuying] = useState(false);
    const [retryKey, setRetryKey] = useState(0);
    const [activated, setActivated] = useState(false);
    // console.log(token)
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getSubscription();
                setSubscriptions(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch subscriptions:", error);
                setSubscriptions([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [retryKey]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fa-IR').format(price);
    };

    const openCheckout = (plan) => {
        setCheckoutPlan(plan);
        setDiscountInput("");
        setDiscount(null);
        setDiscountMessage("");
        setBuying(false);
    };

    const closeCheckout = () => {
        if (buying) return;
        setCheckoutPlan(null);
    };

    const submitDiscount = async () => {
        const code = discountInput.trim();
        if (!code || checkingDiscount) return;

        setCheckingDiscount(true);
        setDiscountMessage("");
        const result = await checkDiscountCode(token?.token, code);
        setCheckingDiscount(false);

        if (!result?.valid) {
            setDiscount(null);
            setDiscountMessage(result?.message || "کد تخفیف معتبر نیست");
            return;
        }

        setDiscount({ code, ...result });
        setDiscountMessage(discountLabel(result));
    };

    const removeDiscount = () => {
        setDiscount(null);
        setDiscountInput("");
        setDiscountMessage("");
    };

    const buyPlan = async () => {
        if (!checkoutPlan || buying) return;

        setBuying(true);
        setDiscountMessage("");
        try {
            const link = await buySubs(token.token, checkoutPlan.SubscribtionId, discount?.code || "");

            if (isWalletPayment(link)) {
                setBuying(false);
                setActivated(true);
                setTimeout(() => router.replace(router.asPath), 2500);
                return;
            }

            if (!isPaymentLink(link)) {
                console.error('Invalid payment link from server:', link);
                setBuying(false);
                setDiscountMessage(link || "لینک پرداخت از سرور دریافت نشد، با پشتیبانی تماس بگیرید");
                return;
            }

            await router.push(link);
        } catch (error) {
            console.error('Failed to start payment:', error);
            setBuying(false);
            setDiscountMessage("شروع پرداخت ناموفق بود، دوباره تلاش کنید");
        }
    }

    const basePrice = checkoutPlan
        ? (planPrices[checkoutPlan.SubscribtionId] ?? checkoutPlan.Price)
        : 0;
    const payablePrice = applyDiscount(basePrice, discount);

    if (loading) {
        return (
            <div className='flex min-h-[400px] w-full items-center justify-center'>
                <span className='loading loading-spinner loading-lg text-primary' />
            </div>
        );
    }

    return (
        <div dir='rtl' className='w-full'>
            <div className='mx-auto flex max-w-screen-lg items-center gap-2 px-1 pb-3.5 text-[12.5px] text-[#9aa3b0]'>
                <Link href='/' className='text-[#9aa3b0] hover:text-primary'>صفحه اصلی</Link>
                <span className='text-[#c3c9d2]'>›</span>
                <span className='font-semibold text-primary'>اشتراک مزایده</span>
            </div>

            <div className='mx-auto flex max-w-screen-lg flex-col gap-4'>
                <div className='rounded-[18px] border border-[#edf0f4] bg-white p-5 sm:p-7'>
                    <div className='flex items-center gap-2.5'>
                        <h1 className="m-0 text-[22px] font-['vazir-bold'] font-extrabold leading-[1.3] text-[#14233c] sm:text-[25px]">اشتراک مزایده خودرو ، ملک و ...</h1>
                        <svg width='28' height='24' viewBox='0 0 24 24' fill='none' stroke='#FF5E00' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' className='flex-none'>
                            <path d='M3 20.5h9' />
                            <path d='m5.5 11 5-5' />
                            <path d='m8 8.5 5.5 5.5' />
                            <path d='M13 6.5 17.5 2 22 6.5 17.5 11z' />
                        </svg>
                    </div>
                    <p className='m-0 pt-3 text-[13.5px] leading-[2] text-[#6f7b8c]'>
                        با تهیه اشتراک به تمامی مزایده‌ها در سایت و ربات تلگرام به صورت لحظه‌ای دسترسی پیدا کنید.
                    </p>

                    <div className='mt-5 grid gap-2.5 sm:grid-cols-3'>
                        {highlights.map((item) => (
                            <div key={item.title} className='flex items-center gap-3 rounded-[14px] bg-[linear-gradient(270deg,#FFF6F1,#FCFDFE_70%)] px-3.5 py-3'>
                                <span className='flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[11px] bg-[#FFEDE3] text-primary'>
                                    <svg width='19' height='19' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.7' strokeLinecap='round' strokeLinejoin='round'>
                                        {item.icon}
                                    </svg>
                                </span>
                                <span className='min-w-0'>
                                    <span className='block text-[14px] font-bold text-[#14233c]'>{item.title}</span>
                                    <span className='block pt-1 text-[11.5px] text-[#98A2B3]'>{item.text}</span>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='rounded-[18px] border border-[#edf0f4] bg-white p-5 sm:p-7'>
                    <div className='flex items-center gap-2'>
                        <span className='h-5 w-[3px] rounded-[3px] bg-primary' />
                        <h2 className='m-0 text-[17px] font-bold text-[#14233c]'>پلن خود را انتخاب کنید</h2>
                    </div>

                    {!subscriptions.length && (
                        <div className='flex flex-col items-center gap-3.5 py-10 text-center'>
                            <span className='flex h-[54px] w-[54px] items-center justify-center rounded-full bg-[#FFEDE3] text-primary'>
                                <svg width='26' height='26' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round'>
                                    <circle cx='12' cy='12' r='9' />
                                    <path d='M12 7.5v5.5M12 16.2v.2' />
                                </svg>
                            </span>
                            <p className='m-0 text-[14.5px] font-bold text-[#14233c]'>دریافت پلن‌ها ناموفق بود</p>
                            <p className='m-0 text-[12.5px] text-[#8B94A5]'>اتصال اینترنت خود را بررسی کنید و دوباره تلاش کنید.</p>
                            <button
                                type='button'
                                onClick={() => setRetryKey((key) => key + 1)}
                                className='mt-1 rounded-2xl bg-gradient-orange px-8 py-2.5 text-[13.5px] font-bold text-white'
                            >
                                تلاش مجدد
                            </button>
                        </div>
                    )}

                    <div className='mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
                        {subscriptions.map((plan) => {
                            const meta = planMeta[plan.SubscribtionId] || { tag: 'اشتراک' };

                            return (
                                <div
                                    key={plan.SubscribtionId}
                                    className='relative flex flex-col rounded-[18px] border border-[#EEF1F6] bg-white p-4 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary hover:shadow-[0_18px_36px_rgba(20,36,63,.12)]'
                                >
                                    <div className='flex items-center justify-between gap-2'>
                                        <div className='flex items-center gap-2.5'>
                                            <GemIcon colors={meta.gem} />
                                            <h3 className='m-0 text-[17px] font-bold text-[#14233c]'>{plan.Describe}</h3>
                                        </div>
                                        <span className='rounded-lg bg-[#FFEDE3] px-2.5 py-1 text-[11px] font-bold text-primary'>{meta.tag}</span>
                                    </div>

                                    <div className='flex items-baseline gap-1.5 pt-4'>
                                        <span className='text-[24px] font-bold tracking-tight text-[#14233c]'>
                                            {formatPrice(planPrices[plan.SubscribtionId] ?? plan.Price)}
                                        </span>
                                        <span className='text-[12.5px] font-semibold text-[#8B94A5]'>تومان</span>
                                    </div>

                                    <ul className='m-0 flex flex-1 list-none flex-col gap-2.5 p-0 pt-4'>
                                        {planFeatures.map((feature) => (
                                            <li key={feature} className='flex items-start gap-2 text-[12.5px] leading-[1.9] text-[#42536B]'>
                                                <span className='mt-1 flex h-[18px] w-[18px] flex-none items-center justify-center rounded-full bg-[#E8F7EE] text-[#1E9E5A]'>
                                                    <CheckIcon />
                                                </span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        type='button'
                                        onClick={() => openCheckout(plan)}
                                        className='mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-[#E7EBF1] bg-white py-3 text-[14px] font-bold text-[#14233c] transition-colors hover:border-primary hover:text-primary'
                                    >
                                        خرید اشتراک
                                        <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                                            <path d='M19 12H5M12 19l-7-7 7-7' />
                                        </svg>
                                    </button>

                                    <div className='mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-[#CFEBD6] bg-[#F3FBF5] py-2.5 text-[12.5px] font-bold text-[#1E9E5A]'>
                                        پرداخت در ۴ قسط
                                        <Image
                                            src='/media/images/snapppay.png'
                                            alt='اسنپ پی'
                                            width={128}
                                            height={128}
                                            className='h-[22px] w-[22px] flex-none rounded-[6px] object-contain'
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className='rounded-[18px] border border-[#edf0f4] bg-white p-5 sm:p-7'>
                    <div className='flex items-center gap-2'>
                        <span className='h-5 w-[3px] rounded-[3px] bg-primary' />
                        <h2 className='m-0 text-[17px] font-bold text-[#14233c]'>پشتیبانی و راهنمایی</h2>
                    </div>
                    <p className='m-0 py-3 text-[13px] text-[#98A2B3]'>
                        برای انتخاب پلن مناسب یا هر سوالی درباره اشتراک، از راه‌های زیر با ما در تماس باشید.
                    </p>

                    <div className='grid gap-3 sm:grid-cols-3'>
                        <a
                            href={`https://wa.me/${SUPPORT_PHONES[0].intl}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex items-center gap-3 rounded-[16px] border-[1.5px] border-primary bg-[#FFF8F3] p-3.5 text-right transition-colors hover:bg-[#FFF3EA]'
                        >
                            <span className='flex h-[44px] w-[44px] flex-none items-center justify-center rounded-[13px] bg-gradient-orange text-white'>
                                <svg width='22' height='22' viewBox='0 0 24 24' fill='currentColor'>
                                    <path d='M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.92C21.95 6.45 17.5 2 12.04 2zm5.8 14.02c-.24.68-1.4 1.31-1.93 1.36-.53.05-1.03.24-3.45-.76-2.92-1.2-4.74-4.22-4.88-4.42-.14-.2-1.15-1.57-1.15-3 0-1.43.74-2.13 1-2.42.27-.29.58-.36.78-.36.2 0 .4 0 .58.01.19.01.44.07.68.53.24.6.81 1.99.88 2.13.07.15.12.32.02.51-.1.2-.15.32-.29.49-.15.17-.31.39-.44.52-.15.15-.3.31-.13.6.17.29.76 1.26 1.63 2.04 1.12 1 2.06 1.31 2.35 1.46.29.15.46.12.63-.07.17-.2.73-.85.92-1.14.2-.29.39-.24.66-.15.27.1 1.7.8 1.99.95.29.15.49.22.56.34.07.12.07.71-.17 1.39z' />
                                </svg>
                            </span>
                            <span className='min-w-0 flex-1'>
                                <span className='block text-[14.5px] font-bold text-[#14233c]'>چت آنلاین با پشتیبانی</span>
                                <span className='block pt-1 text-[11.5px] text-[#8B94A5]'>گفتگو در واتساپ</span>
                            </span>
                        </a>

                        {SUPPORT_PHONES.map((phone) => (
                            <Link
                                key={phone.raw}
                                href={`tel:${phone.raw}`}
                                className='flex items-center gap-3 rounded-[16px] border border-[#EEF1F6] bg-white p-3.5 transition-colors hover:border-primary'
                            >
                                <span className='flex h-[44px] w-[44px] flex-none items-center justify-center rounded-[13px] bg-[#FFEDE3] text-primary'>
                                    <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round'>
                                        <path d='M5 4.5h3.5l1.7 4-2 1.5a11 11 0 0 0 5.8 5.8l1.5-2 4 1.7V19a1.5 1.5 0 0 1-1.6 1.5A15.5 15.5 0 0 1 3.5 6.1 1.5 1.5 0 0 1 5 4.5z' />
                                    </svg>
                                </span>
                                <span className='min-w-0 flex-1'>
                                    <span className='block text-[14.5px] font-bold text-[#14233c]'>{phone.label}</span>
                                    <span className='block pt-1 text-[11.5px] text-[#8B94A5]'>تماس تلفنی</span>
                                </span>
                            </Link>
                        ))}
                    </div>

                    <p className='m-0 pt-3.5 text-[12px] text-[#98A2B3]'>پشتیبانی همه‌روزه از ۹ صبح تا ۹ عصر</p>
                </div>
            </div>

            {checkoutPlan && (
                <div className='fixed inset-0 z-[60] flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-4'>
                    <div className='absolute inset-0' onClick={closeCheckout} />

                    <div className='relative w-full max-w-md rounded-t-[22px] bg-white p-5 shadow-[0_18px_48px_rgba(20,36,63,.22)] sm:rounded-[22px] sm:p-6'>
                        <div className='flex items-center gap-3'>
                            <button
                                type='button'
                                onClick={closeCheckout}
                                aria-label='بستن'
                                className='flex h-9 w-9 flex-none items-center justify-center rounded-xl border border-[#E8E8E8]'
                            >
                                <svg width='14' height='14' viewBox='0 0 16 16' fill='none'>
                                    <path d='M4 4L12 12M12 4L4 12' stroke='#243b53' strokeWidth='2' strokeLinecap='round' />
                                </svg>
                            </button>
                            <h3 className='m-0 flex-1 text-[17px] font-bold text-[#14233c]'>تکمیل خرید اشتراک</h3>
                        </div>

                        <div className='mt-5 flex items-center justify-between gap-3 rounded-[16px] border border-[#EEF1F6] bg-[#FAFBFC] px-4 py-3.5'>
                            <span className='text-[14.5px] font-bold text-[#14233c]'>{checkoutPlan.Describe}</span>
                            <span className='flex items-baseline gap-1.5'>
                                <span className='text-[18px] font-bold text-[#14233c]'>{formatPrice(basePrice)}</span>
                                <span className='text-[12px] text-[#8B94A5]'>تومان</span>
                            </span>
                        </div>

                        <p className='m-0 pt-5 pb-2 text-[12.5px] text-[#8B94A5]'>کد تخفیف (اختیاری)</p>
                        <div className='flex items-stretch gap-2'>
                            <input
                                type='text'
                                dir='ltr'
                                value={discountInput}
                                onChange={(event) => setDiscountInput(event.target.value)}
                                disabled={!!discount || buying}
                                placeholder='DOLOX1404'
                                className="min-w-0 flex-1 rounded-[14px] border border-[#EDF0F5] bg-[#F4F6F9] px-4 py-3 text-left text-sm text-[#14233c] outline-none placeholder:text-[#A3ADBC] focus:border-primary disabled:opacity-60 font-['vazir']"
                            />
                            {discount ? (
                                <button
                                    type='button'
                                    onClick={removeDiscount}
                                    disabled={buying}
                                    className='flex-none rounded-[14px] border border-[#E7EBF1] bg-white px-4 text-[13.5px] font-bold text-[#42536B] disabled:opacity-60'
                                >
                                    حذف
                                </button>
                            ) : (
                                <button
                                    type='button'
                                    onClick={submitDiscount}
                                    disabled={!discountInput.trim() || checkingDiscount || buying}
                                    className='flex-none rounded-[14px] bg-secondary px-5 text-[13.5px] font-bold text-white disabled:opacity-50'
                                >
                                    {checkingDiscount ? <span className='loading loading-spinner loading-xs' /> : 'اعمال'}
                                </button>
                            )}
                        </div>

                        {discountMessage && (
                            <p className={`m-0 pt-2.5 text-[12.5px] ${discount ? 'text-[#1E9E5A]' : 'text-red-500'}`}>
                                {discountMessage}
                            </p>
                        )}

                        {activated && (
                            <div className='mt-4 flex items-center gap-2.5 rounded-[14px] bg-[#F3FBF5] px-4 py-3'>
                                <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='#1E9E5A' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='flex-none'>
                                    <circle cx='12' cy='12' r='9' />
                                    <path d='M8 12.5l2.5 2.5L16 9.5' />
                                </svg>
                                <span className='text-[13px] font-bold text-[#1E9E5A]'>اشتراک از موجودی کیف پول شما پرداخت و فعال شد</span>
                            </div>
                        )}

                        {discount && payablePrice !== basePrice && (
                            <div className='mt-4 flex items-center justify-between gap-3 rounded-[14px] bg-[#F3FBF5] px-4 py-3'>
                                <span className='text-[13px] font-bold text-[#1E9E5A]'>مبلغ قابل پرداخت</span>
                                <span className='flex items-baseline gap-1.5'>
                                    <span className='text-[17px] font-bold text-[#1E9E5A]'>{formatPrice(payablePrice)}</span>
                                    <span className='text-[12px] text-[#1E9E5A]'>تومان</span>
                                </span>
                            </div>
                        )}

                        <button
                            type='button'
                            onClick={buyPlan}
                            disabled={buying}
                            className='mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-orange py-3.5 text-[14.5px] font-bold text-white disabled:opacity-60'
                        >
                            {buying ? <span className='loading loading-spinner loading-sm' /> : 'پرداخت و فعال‌سازی'}
                        </button>

                        <p className='m-0 pt-3 text-center text-[11.5px] text-[#98A2B3]'>
                            پس از پرداخت، اشتراک شما بلافاصله فعال می‌شود.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubscriptionCards;
