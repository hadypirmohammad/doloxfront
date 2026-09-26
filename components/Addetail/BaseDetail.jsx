import { formatPrice } from '@/utils/Cal'
import { reportAd } from '@/utils/Request'
import { buildAdContextFromAd, cachePeerAdContext } from '@/utils/chat/adContext'
import { isChatEnabledForAd } from '@/utils/chat/helpers'
import { getSellerUserId } from '@/utils/chat/userId'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { toast } from "react-hot-toast"

const BaseDetail = ({ad , token , EnTitle}) => {
    const data = ad
    const router = useRouter()
    const chatEnabled = isChatEnabledForAd(data)
    // modal states
    const [showReportModal, setShowReportModal] = useState(false)
    const [showTipsModal, setShowTipsModal] = useState(false)
    const [showCallModal, setShowCallModal] = useState(false)
    const [reportReasonValue, setReportReasonValue] = useState(3)

    const handleCopyLink = async () => {
        if (typeof window === "undefined") return;
        try {
            await navigator.clipboard.writeText(window.location.href)
            toast.success("لینک اگهی کپی شد")
        } catch (err) {
            toast.error("خطا در کپی لینک")
        }
    }
    
    const sendReport = () => {
        console.log(data) 
        reportAd(token, EnTitle, reportReasonValue)
        toast.success("گزارش شما ثبت شد")
        setShowReportModal(false)

    }

    const handleChatClick = () => {
        if (!chatEnabled) {
            toast.error("چت برای این آگهی فعال نیست")
            return
        }

        if (!token) {
            toast.error("برای چت ابتدا وارد حساب کاربری شوید")
            router.push(`/login?redirect=${encodeURIComponent(router.asPath)}`)
            return
        }

        const sellerId = getSellerUserId(data)
        if (!sellerId) {
            toast.error("اطلاعات فروشنده برای شروع چت در دسترس نیست")
            return
        }

        const adContext = buildAdContextFromAd(data)
        if (adContext) {
            cachePeerAdContext(sellerId, adContext)
        }

        const query = { receiverId: String(sellerId) }
        if (adContext?.adId) {
            query.adId = String(adContext.adId)
        }

        router.push({ pathname: "/dashboard/chat", query })
    }

    return (
        <>
            <div className='bg-white rounded-[15px] w-full h-fit p-6'>
                <h1 className='text-xl'>{data.Title}</h1>
                <div className="flex justify-between pt-2">
                    <div className="flex justify-center gap-1 items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="19" viewBox="0 0 16 19" fill="none">
                            <path d="M13.6562 2.30475C10.5322 -0.76825 5.46716 -0.76825 2.34316 2.30475C1.60145 3.02938 1.01207 3.89498 0.60968 4.85066C0.207288 5.80634 0 6.83281 0 7.86975C0 8.90669 0.207288 9.93316 0.60968 10.8888C1.01207 11.8445 1.60145 12.7101 2.34316 13.4347L7.99917 18.9998L13.6562 13.4347C14.3979 12.7101 14.9873 11.8445 15.3897 10.8888C15.792 9.93316 15.9993 8.90669 15.9993 7.86975C15.9993 6.83281 15.792 5.80634 15.3897 4.85066C14.9873 3.89498 14.3979 3.02938 13.6562 2.30475ZM7.99917 10.4998C7.33117 10.4998 6.70417 10.2397 6.23117 9.76775C5.76292 9.2985 5.49994 8.66266 5.49994 7.99975C5.49994 7.33684 5.76292 6.701 6.23117 6.23175C6.70317 5.75975 7.33117 5.49975 7.99917 5.49975C8.66716 5.49975 9.29516 5.75975 9.76716 6.23175C10.2354 6.701 10.4984 7.33684 10.4984 7.99975C10.4984 8.66266 10.2354 9.2985 9.76716 9.76775C9.29516 10.2397 8.66716 10.4998 7.99917 10.4998Z" fill="#8B7676" />
                        </svg>
                        <span className="font-[vazir] text-md font-bold text-[#8B7676]">{data.City}</span>
                    </div>
                    <div className="flex justify-center gap-1 items-center">
                        {data.Price > 0 ? (
                            <>
                                <span>تومان</span>
                                <span>{formatPrice(data.Price)}</span>
                            </>
                        ) : (
                            <span>توافقی</span>
                        )}
                    </div>
                </div>

                <div className="flex justify-between pt-4 gap-2">
                    <button onClick={() => setShowCallModal(true)} className="w-3/6 px-4 py-2 bg-primary gap-2 text-white rounded-lg flex justify-center items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M19.9532 15.0955C19.7201 14.8473 18.8973 14.1134 17.3848 13.1424C15.8611 12.1629 14.7374 11.5522 14.4151 11.4097C14.3867 11.3971 14.3554 11.3925 14.3245 11.3964C14.2937 11.4002 14.2645 11.4124 14.2401 11.4316C13.7209 11.8365 12.8467 12.5803 12.7999 12.6205C12.4972 12.8799 12.4972 12.8799 12.2494 12.7991C11.8137 12.6562 10.4601 11.9374 9.28057 10.7553C8.10107 9.57311 7.34525 8.18603 7.20239 7.75075C7.12069 7.50253 7.12069 7.50253 7.38097 7.19985C7.42115 7.15297 8.16536 6.27885 8.57028 5.76009C8.58949 5.73566 8.60167 5.70646 8.60553 5.67563C8.60938 5.64479 8.60476 5.61349 8.59216 5.58509C8.44975 5.26231 7.83901 4.13908 6.85952 2.61539C5.88718 1.1033 5.15412 0.280521 4.9059 0.0474806C4.88312 0.025986 4.85497 0.0110331 4.8244 0.00419761C4.79384 -0.00263791 4.762 -0.00110294 4.73223 0.00864062C3.86457 0.306822 3.02741 0.687281 2.23217 1.14482C1.46448 1.59109 0.737682 2.10425 0.0602358 2.67833C0.0365878 2.69844 0.0188583 2.7246 0.00894859 2.75401C-0.00096112 2.78343 -0.00267715 2.81499 0.00398441 2.8453C0.0972905 3.28013 0.543284 5.09534 1.92725 7.60968C3.33934 10.1758 4.31794 11.4906 6.39165 13.5571C8.46537 15.6237 9.82166 16.6612 12.3905 18.0733C14.9048 19.4572 16.7209 19.9037 17.1549 19.9961C17.1853 20.0027 17.2169 20.0009 17.2463 19.991C17.2758 19.9811 17.3021 19.9634 17.3223 19.9398C17.8963 19.2624 18.4093 18.5356 18.8554 17.7679C19.3129 16.9726 19.6933 16.1355 19.9916 15.2679C20.0011 15.2383 20.0026 15.2068 19.9958 15.1765C19.9891 15.1462 19.9744 15.1182 19.9532 15.0955Z" fill="white" />
                        </svg>
                        <span className="font-[vazir] font-bold">تماس</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleChatClick}
                        disabled={!chatEnabled}
                        className={`w-2/6 px-6 py-2 border gap-2 rounded-lg flex justify-center items-center font-[vazir] font-bold transition-colors ${
                            chatEnabled
                                ? "bg-white text-primary border-primary hover:bg-primary/5 cursor-pointer"
                                : "opacity-30 text-primary border-primary cursor-not-allowed"
                        }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="39" height="30" viewBox="0 0 18 18" fill="none">
                            <path d="M9.00302 5.10154e-07C7.4416 -0.000525151 5.9069 0.405187 4.54972 1.17727C3.19255 1.94936 2.05959 3.06125 1.26217 4.4037C0.464749 5.74615 0.0303069 7.27296 0.00152905 8.83412C-0.0272488 10.3953 0.350628 11.9371 1.09803 13.308L0.0330301 17.043C-0.00444392 17.1742 -0.00544228 17.313 0.0301426 17.4447C0.0657276 17.5764 0.136548 17.6959 0.234983 17.7903C0.333417 17.8847 0.455738 17.9505 0.58878 17.9806C0.721823 18.0107 0.860549 18.0039 0.990029 17.961L4.49702 16.7925C5.69231 17.4832 7.03048 17.8897 8.40799 17.9805C9.78551 18.0713 11.1655 17.844 12.4411 17.3162C13.7167 16.7884 14.8538 15.9742 15.7644 14.9366C16.675 13.899 17.3347 12.6658 17.6925 11.3325C18.0503 9.99915 18.0965 8.60138 17.8277 7.2473C17.5588 5.89323 16.9821 4.61914 16.1421 3.52362C15.3021 2.4281 14.2213 1.54051 12.9834 0.929501C11.7454 0.318497 10.3835 0.000461924 9.00302 5.10154e-07ZM6.00302 7.5C6.00302 7.30109 6.08204 7.11032 6.22269 6.96967C6.36335 6.82902 6.55411 6.75 6.75302 6.75H11.253C11.4519 6.75 11.6427 6.82902 11.7833 6.96967C11.924 7.11032 12.003 7.30109 12.003 7.5C12.003 7.69891 11.924 7.88968 11.7833 8.03033C11.6427 8.17098 11.4519 8.25 11.253 8.25H6.75302C6.55411 8.25 6.36335 8.17098 6.22269 8.03033C6.08204 7.88968 6.00302 7.69891 6.00302 7.5ZM6.75302 9.75H9.75302C9.95193 9.75 10.1427 9.82902 10.2833 9.96967C10.424 10.1103 10.503 10.3011 10.503 10.5C10.503 10.6989 10.424 10.8897 10.2833 11.0303C10.1427 11.171 9.95193 11.25 9.75302 11.25H6.75302C6.55411 11.25 6.36335 11.171 6.22269 11.0303C6.08204 10.8897 6.00302 10.6989 6.00302 10.5C6.00302 10.3011 6.08204 10.1103 6.22269 9.96967C6.36335 9.82902 6.55411 9.75 6.75302 9.75Z" fill="#FA4505" />
                        </svg>
                        <span className="font-[vazir] font-bold">چت</span>
                    </button>

                    <button onClick={handleCopyLink} className="px-4 py-3 h-full border text-primary border-primary gap-1 rounded-lg flex justify-between items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" viewBox="0 0 20 22" fill="none">
                            <path d="M16.6667 15.5502C15.8222 15.5502 15.0667 15.8815 14.4889 16.4006L6.56667 11.8173C6.62222 11.5633 6.66667 11.3092 6.66667 11.0442C6.66667 10.7791 6.62222 10.5251 6.56667 10.2711L14.4 5.73193C15 6.28414 15.7889 6.62651 16.6667 6.62651C18.5111 6.62651 20 5.14659 20 3.31325C20 1.47992 18.5111 0 16.6667 0C14.8222 0 13.3333 1.47992 13.3333 3.31325C13.3333 3.57831 13.3778 3.83233 13.4333 4.08635L5.6 8.6255C5 8.07329 4.21111 7.73092 3.33333 7.73092C1.48889 7.73092 0 9.21084 0 11.0442C0 12.8775 1.48889 14.3574 3.33333 14.3574C4.21111 14.3574 5 14.0151 5.6 13.4629L13.5111 18.0572C13.4556 18.2892 13.4222 18.5321 13.4222 18.7751C13.4222 20.5532 14.8778 22 16.6667 22C18.4556 22 19.9111 20.5532 19.9111 18.7751C19.9111 16.997 18.4556 15.5502 16.6667 15.5502Z" fill="#FA4505" />
                        </svg>
                    </button>
                </div>

                <div className="flex justify-between pt-2">
                    <div
                        onClick={() => setShowTipsModal(true)}
                        className="flex justify-center gap-1 items-center cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 16" fill="none">
                            <path d="M11.5303 0.980326C11.3958 0.708945 11.1829 0.474901 10.9138 0.302507C10.6447 0.130114 10.3292 0.025661 10 0C9.67258 0.0272013 9.35914 0.132366 9.09194 0.30467C8.82473 0.476974 8.61341 0.710194 8.47972 0.980326L0.35826 13.6256C-0.481891 14.9297 0.208233 16 1.87853 16H18.1215C19.7918 16 20.4819 14.9297 19.6417 13.6256L11.5303 0.980326ZM11.0002 13.3019H8.99982V11.5031H11.0002V13.3019ZM11.0002 9.70433H8.99982V4.30804H11.0002V9.70433Z" fill="#BC1526" />
                        </svg>
                        <span className="font-[vazir] text-md text-secondary">نکات قبل از معامله</span>
                    </div>

                    <div
                        onClick={() => setShowReportModal(true)}
                        className="flex justify-center gap-1 items-center cursor-pointer"
                    >
                        <span className="text-secondary font-[vazir]">گزارش تخلف</span>
                    </div>
                </div>
            </div>

            {/* --- Report Modal --- */}
            {showReportModal && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl p-6 w-[350px] font-[vazir]">
                        <h2 className="font-bold text-lg mb-4">گزارش تخلف</h2>
                        <select className="w-full border p-2 bg-white rounded-lg" onClick={(e) => setReportReasonValue(e.target.value)}>
                            <option>انتخاب دلیل</option>
                            <option value={0}>کلاهبرداری</option>
                            <option value={1}>اطلاعات نادرست</option>
                            <option value={2}>کالای ممنوعه</option>
                            <option value={3}>سایر</option>
                        </select>

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setShowReportModal(false)}
                                className="px-4 py-2 border rounded-lg"
                            >
                                انصراف
                            </button>
                            <button onClick={()=>sendReport()} className="px-4 py-2 bg-primary text-white rounded-lg">
                                ثبت گزارش
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Tips Modal --- */}
            {showTipsModal && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl p-6 w-[400px] font-[vazir]">
                        <h2 className="font-bold text-lg mb-4">نکات قبل از معامله</h2>
                        <ul className="text-sm text-gray-600 space-y-2">
                            <li>از پرداخت بیعانه قبل از دیدن کالا خودداری کنید.</li>
                            <li>کالا را حضوری بررسی کنید.</li>
                            <li>در مکان‌های عمومی قرار ملاقات بگذارید.</li>
                            <li>از انتقال وجه به حساب‌های ناشناس خودداری کنید.</li>
                        </ul>

                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => setShowTipsModal(false)}
                                className="px-4 py-2 bg-primary text-white rounded-lg"
                            >
                                متوجه شدم
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showCallModal && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl p-6 w-[350px] font-[vazir] text-center">

                        <p className="text-gray-700 mb-6">
                            تماس از طریق دولوکس؛ امن و قابل اعتماد
                        </p>

                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => setShowCallModal(false)}
                                className="px-4 py-2 border rounded-lg"
                            >
                                بستن
                            </button>

                            <a
                                href={`tel:${"0" + data.UserPhoneNumber}`}
                                className="px-4 py-2 bg-primary text-white rounded-lg"
                            >
                                تماس با فروشنده
                            </a>
                        </div>

                    </div>
                </div>
            )}

        </>
    )
}

export default BaseDetail
