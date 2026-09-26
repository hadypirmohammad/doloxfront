import React, { useState } from 'react';
import { EditAdReq } from '@/utils/Request'; // your backend request function
import { useRouter } from 'next/router';
import toast from 'react-hot-toast'
const Confirm = ({ step, setStep, token, editData }) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
     const router = useRouter();
    const handleSave = async () => {
        console.log(editData)
        setLoading(true);
        setMessage('');
        try {
            // send all edited data to backend
            await EditAdReq(token, editData);
            setMessage('ویرایش‌ها با موفقیت ذخیره شد ✅');
            toast.success('اطلاعات ذخیره شد  درحال انتقال به داشبورد ')

            setTimeout(() => {
            router.push("/dashboard");
            }, 1000);
           


        } catch (err) {
            console.error(err);
            setMessage('خطا در ذخیره ویرایش‌ها ❌');
        } finally {
            setLoading(false);
        }
    };

    if (step !== 5) return null; // final step number

    return (
        <div className='px-2 md:px-0 [&_*]:!font-["vazir"]'>
            <div dir='rtl' className='py-4 md:w-96 mx-auto px-4 text-center'>
                <h2 className='text-lg font-bold mb-4'>
                    لطفاً ویرایش‌های خود را بررسی کنید
                </h2>
                <p className='text-base-content mb-6'>
                    در این مرحله می‌توانید تمامی تغییرات خود را تایید کنید.
                    برای ذخیره تغییرات روی دکمه ذخیره کلیک کنید.
                </p>

                {message && (
                    <p className={`mb-4 font-bold ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                    </p>
                )}

                <div className='flex justify-between'>
                    <button
                        className='btn btn-sm text-primary bg-transparent shadow-none border-none'
                        onClick={() => setStep(step - 1)}
                        disabled={loading}
                    >
                        قبلی
                    </button>

                    <button
                        className='btn btn-sm bg-primary text-white border-none'
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading ? 'در حال ذخیره...' : 'ذخیره'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Confirm;