import React, { useEffect, useState } from 'react';
import { getSubscription , buySubs } from '@/utils/Request';
import Link from 'next/link';
import { useRouter } from 'next/router';

const SubscriptionCards = (token) => {
    const router = useRouter()
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    // console.log(token)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getSubscription();
                setSubscriptions(data);
            } catch (error) {
                console.error("Failed to fetch subscriptions:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fa-IR').format(price);
    };

    const buyPlan = async(id) => {
        const link = await buySubs(token.token,id)
        await router.push(link)
        // console.log(link)
    }

    // Pure SVG Icons for zero dependencies
    const Icons = {
        Check: () => (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        ),
        Zap: () => (
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.5a3.5 3.5 0 0 1 3.5-3.5 3.5 3.5 0 0 1 3.5 3.5V15h-7v-.5Z" /><path d="M13 14.5a3.5 3.5 0 0 1 3.5-3.5 3.5 3.5 0 0 1 3.5 3.5V15h-7v-.5Z" /><path d="m10 10-2-2 2-2" /><path d="m14 10 2-2-2-2" /></svg>
        ),
        Star: () => (
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
        ),
        Crown: () => (
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" /></svg>
        ),
        Gem: () => (
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 12L2 9Z" /><path d="M11 3 8 9l4 12 4-12-3-6" /><path d="M2 9h20" /></svg>
        )
    };

    const getPlanMeta = (id) => {
        switch (id) {
            case 1: return { icon: <Icons.Zap />, tag: "اقتصادی", popular: false };
            case 2: return { icon: <Icons.Star />, tag: "پیشنهاد ویژه", popular: false };
            case 3: return { icon: <Icons.Crown />, tag: "حرفه‌ای", popular: false };
            case 4: return { icon: <Icons.Gem />, tag: "الماسی", popular: true };
            default: return { icon: <Icons.Zap />, tag: "اشتراک", popular: false };
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="py-20 px-4 bg-base-200 min-h-screen text-right" dir="rtl">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-accent mt-3 mb-6">
                        💎 پلن‌های مزایده
                    </h2>
                    <p className="text-base-content text-lg max-w-2xl mx-auto leading-relaxed">
                        دسترسی به مزایده‌ها در ربات تلگرام
                    </p>
                </div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-end">
                    {subscriptions.map((plan) => {
                        const meta = getPlanMeta(plan.SubscribtionId);

                        return (
                            <div
                                key={plan.SubscribtionId}
                                className={`relative flex flex-col bg-white rounded-[3rem] p-8 transition-all duration-500 border-2 group
                ${meta.popular
                                        ? 'border-gold shadow-[0_30px_60px_-15px_rgba(255,215,0,0.3)] scale-105 z-10 pb-12'
                                        : 'border-white hover:border-primary/20 shadow-xl shadow-gray-200/50 hover:shadow-2xl'}`}
                            >
                                {/* Popular Badge */}
                                {meta.popular && (
                                    <div className="absolute -top-5 inset-x-0 flex justify-center">
                                        <span className="bg-gradient-to-r from-gold to-yellow-500 text-accent px-8 py-2 rounded-full text-sm font-black shadow-lg">
                                            محبوب‌ترین پلن
                                        </span>
                                    </div>
                                )}

                                {/* Icon Section */}
                                <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-8 rotate-3 group-hover:rotate-0 transition-transform duration-500
                  ${meta.popular ? 'bg-gold text-accent shadow-lg shadow-gold/20' : 'bg-base-300 text-primary'}`}>
                                    {meta.icon}
                                </div>

                                {/* Title */}
                                <h3 className="text-3xl font-black text-accent mb-1">{plan.Describe}</h3>
                                <div className="flex items-center gap-2 mb-8">
                                    <div className="h-1 w-8 bg-primary rounded-full"></div>
                                    <span className="text-sm font-bold text-primary">{meta.tag}</span>
                                </div>

                                {/* Pricing */}
                                <div className="mb-10">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-black text-accent tracking-tighter">
                                            {formatPrice(plan.Price)}
                                        </span>
                                        <span className="text-base-content font-bold">تومان</span>
                                    </div>
                                </div>

                                {/* Features List */}
                                <ul className="space-y-5 mb-12 flex-grow">
                                    <li className="flex items-start gap-3 text-info font-medium">
                                        <span className="mt-1 p-0.5 bg-success/20 rounded text-success"><Icons.Check /></span>
                                        دسترسی به مزایده‌ها در ربات تلگرام
                                    </li>
                                    <li className="flex items-start gap-3 text-info font-medium">
                                        <span className="mt-1 p-0.5 bg-success/20 rounded text-success"><Icons.Check /></span>
                                        دسترسی کامل به تمامی مزایده‌ها
                                    </li>
                                    <li className="flex items-start gap-3 text-info font-medium">
                                        <span className="mt-1 p-0.5 bg-success/20 rounded text-success"><Icons.Check /></span>
                                        اطلاع‌رسانی مزایده‌های جدید
                                    </li>
                                    <li className="flex items-start gap-3 text-info font-medium">
                                        <span className="mt-1 p-0.5 bg-success/20 rounded text-success"><Icons.Check /></span>
                                        پشتیبانی آنلاین VIP
                                    </li>
                                </ul>

                                {/* Purchase Button */}
                                <button onClick={() => buyPlan(plan.SubscribtionId)}
                                    className={`btn border-none h-16 rounded-[1.5rem] text-xl font-black shadow-xl transition-all duration-300 active:scale-95
                  ${meta.popular
                                            ? 'bg-gold hover:bg-yellow-500 text-accent hover:shadow-gold/40'
                                            : 'bg-accent hover:bg-primary text-white shadow-accent/20 hover:shadow-primary/30'}`}
                                >
                                    خرید و تمدید
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Info Box */}
                <div className="mt-20 p-8 rounded-[2.5rem] bg-accent text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                    <div className="text-right">
                        <h4 className="text-2xl font-bold mb-2">نیاز به راهنمایی بیشتری دارید؟</h4>
                        <p className="text-white/70">کارشناسان ما آماده پاسخگویی به سوالات شما در مورد پلن‌ها هستند.</p>
                    </div>
                    <button className="btn btn-outline border-white/20 text-white hover:bg-white hover:text-accent rounded-2xl px-10 h-14">
                        ارسال پیام به پشتیبانی
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionCards;
