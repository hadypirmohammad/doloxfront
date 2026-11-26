import Link from 'next/link'
import React from 'react'

const AboutPage = () => {
    return (
        <div className='w-full bg-[#FAFAFA] px-4 pb-16 pt-6 md:pt-8' dir='rtl'>
            <div className='max-w-3xl mx-auto bg-white rounded-[34px] p-6 md:p-10 font-[vazir] leading-8 text-base-content'>
                <div className='flex items-center justify-between gap-4 mb-8'>
                    <h1 className='text-xl md:text-2xl font-bold text-accent'>
                        درباره ما
                    </h1>
                    <Link href='/' className='btn btn-sm bg-primary text-white border-none'>
                        بازگشت
                    </Link>
                </div>

                <div className='h-1 w-20 bg-primary rounded-full mb-8' />

                <div className='space-y-6 text-sm md:text-base text-base-content/90'>
                    <p>
                        دولوکس یک پلتفرم تخصصی و هوشمند در حوزه خودرو و آگهی‌های آنلاین است که با هدف ایجاد بستری سریع، مطمئن و حرفه‌ای برای خرید، فروش و دسترسی به فرصت‌های ارزشمند بازار راه‌اندازی شده است.
                    </p>

                    <p>
                        ما فعالیت خود را در سال ۱۴۰۵ تحت مجموعه دولوکس آغاز کردیم تا تجربه‌ای متفاوت از خدمات آنلاین در حوزه خودرو و مزایده را ارائه دهیم؛ جایی که کاربران بتوانند بدون پیچیدگی، در محیطی امن و شفاف به نیازهای خود دست پیدا کنند.
                    </p>

                    <p>
                        در دولوکس کاربران می‌توانند آگهی فروش خودرو ثبت کنند، خودروهای موردنظر خود را جستجو و مقایسه کنند و به فرصت‌های ویژه دسترسی داشته باشند. همچنین بخشی اختصاصی برای انتشار مزایده‌های خودرو، ملک و سایر مزایده‌های دولتی فراهم کرده‌ایم تا دسترسی به این اطلاعات ساده‌تر، سریع‌تر و یکپارچه‌تر باشد.
                    </p>

                    <p>
                        یکی دیگر از بخش‌های متمایز دولوکس، اتوگالری آنلاین است؛ فضایی اختصاصی برای نمایشگاه‌داران و فعالان بازار خودرو که می‌توانند صفحه اختصاصی خود را داشته باشند، خودروهایشان را معرفی کنند و برند خود را حرفه‌ای‌تر به مخاطبان نمایش دهند.
                    </p>

                    <p>
                        ما باور داریم آینده بازار، ترکیبی از اعتماد، سرعت و فناوری است. دولوکس با همین نگاه شکل گرفته؛ تا پلی میان کاربران، فروشندگان، نمایشگاه‌داران و فرصت‌های واقعی بازار باشد.
                    </p>

                    <p className='bg-base-200 rounded-2xl p-4 text-center font-bold text-accent'>
                        دولوکس؛ فراتر از یک سایت آگهی، یک مسیر هوشمند برای معاملات بهتر.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default AboutPage
