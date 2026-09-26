import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { getTelegramLink } from '@/utils/Request';

const TelegramButton = ({ token }) => {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        try {
            setLoading(true);
            const link = await getTelegramLink(token);

            if (link && (link.startsWith('http') || link.startsWith('tg://'))) {
                toast.success('در حال انتقال به تلگرام');
                setTimeout(() => {
                    window.location.href = link;
                }, 200);
            } else {
                toast.error('دریافت لینک تلگرام ناموفق بود');
            }
        } catch (error) {
            toast.error('دریافت لینک تلگرام ناموفق بود');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={loading}
            className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#229ED9] px-4 text-sm text-white duration-300 hover:bg-[#1c87b9] disabled:opacity-60"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.94 4.6l-3.02 14.25c-.23 1.01-.83 1.26-1.68.78l-4.64-3.42-2.24 2.16c-.25.25-.46.46-.94.46l.33-4.73L17.36 7c.37-.33-.08-.52-.58-.19l-10.6 6.68-4.57-1.43c-.99-.31-1.01-.99.21-1.47l17.85-6.88c.83-.3 1.55.2 1.27 1.89z" />
            </svg>
            <span>{loading ? 'در حال دریافت لینک...' : 'کانال تلگرام'}</span>
        </button>
    );
};

export default TelegramButton;
