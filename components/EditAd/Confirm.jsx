import React, { useState } from 'react';
import { EditAdReq } from '@/utils/Request'; // your backend request function
import { useRouter } from 'next/router';
import toast from 'react-hot-toast'
import EditStep from './EditStep';

const Confirm = ({ step, setStep, token, editData }) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleSave = async () => {
        setLoading(true);
        setMessage('');
        try {
            // send all edited data to backend
            await EditAdReq(token, editData);
            setMessage('ویرایش‌ها با موفقیت ذخیره شد');
            toast.success('اطلاعات ذخیره شد، درحال انتقال به داشبورد')

            setTimeout(() => {
                router.push("/dashboard");
            }, 1000);
        } catch (err) {
            console.error(err);
            setMessage('خطا در ذخیره ویرایش‌ها');
        } finally {
            setLoading(false);
        }
    };

    if (step !== 5) return null; // final step number

    return (
        <EditStep
            title='ثبت ویرایش'
            onPrev={() => setStep(step - 1)}
            onNext={handleSave}
            nextLabel={loading ? 'در حال ذخیره...' : 'ذخیره ویرایش'}
            loading={loading}
        >
            <div className='flex flex-col items-center px-2 py-6 text-center'>
                <span className='flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF1E7] text-primary'>
                    <svg width='30' height='30' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round'>
                        <path d='M4 20h4L19 9l-4-4L4 16z' />
                        <path d='m13.5 6.5 4 4' />
                    </svg>
                </span>
                <p className='m-0 pt-4 text-[15px] font-bold text-secondary'>لطفاً ویرایش‌های خود را بررسی کنید</p>
                <p className='m-0 pt-2 text-[13px] leading-[2] text-[#8B94A5]'>
                    برای ذخیره تغییرات روی دکمه «ذخیره ویرایش» بزنید.
                </p>

                {message && (
                    <p className={`m-0 pt-3 text-[13.5px] font-bold ${message.includes('موفقیت') ? 'text-[#1E9E5A]' : 'text-[#E03A3A]'}`}>
                        {message}
                    </p>
                )}
            </div>
        </EditStep>
    );
};

export default Confirm;
