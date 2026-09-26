import { formatPrice } from '@/utils/Cal'
import { verifyKhalafi } from '@/utils/Request'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const KhalafiResultPage = () => {
  const router = useRouter()
  const { trackId } = router.query

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  useEffect(() => {
    if (!router.isReady) return

    const run = async () => {
      if (!trackId) {
        setError('شناسه پیگیری یافت نشد')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await verifyKhalafi(trackId)
        setResult(data)
        if (data && typeof data === 'object' && data.success === false) {
          setError(data.message || 'استعلام ناموفق بود')
        }
      } catch (err) {
        setError(err.message || 'خطا در دریافت نتیجه')
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [router.isReady, trackId])

  const data = result?.data ?? (result?.success === undefined ? result : null)

  const fines =
    data?.Details ||
    data?.details ||
    data?.Items ||
    data?.items ||
    data?.Fines ||
    data?.fines ||
    (Array.isArray(data) ? data : null)

  const totalAmount =
    data?.TotalAmount ??
    data?.totalAmount ??
    data?.Amount ??
    data?.amount ??
    data?.Price ??
    null

  return (
    <div className='w-full bg-[#FAFAFA] px-4 pb-16 pt-6 md:pt-8' dir='rtl'>
      <div className='max-w-2xl mx-auto bg-white rounded-[34px] p-6 md:p-10 shadow-sm font-[vazir]'>
        <h1 className='text-xl md:text-2xl font-bold text-accent text-center mb-6'>
          نتیجه استعلام خلافی
        </h1>

        {loading && (
          <div className='flex flex-col items-center py-16 gap-3'>
            <span className='loading loading-spinner loading-lg text-primary' />
            <p className='text-sm text-base-content/70'>در حال دریافت نتیجه...</p>
          </div>
        )}

        {!loading && error && (
          <div className='text-center py-10 space-y-4'>
            <p className='text-primary'>{error}</p>
            {trackId && (
              <p className='text-xs text-base-content/50' dir='ltr'>
                trackId: {trackId}
              </p>
            )}
            <Link href='/khalafi' className='btn bg-primary text-white border-none'>
              استعلام مجدد
            </Link>
          </div>
        )}

        {!loading && !error && (
          <div className='space-y-6'>
            {totalAmount != null && (
              <div className='bg-base-200 rounded-2xl p-4 text-center'>
                <p className='text-sm text-base-content/70 mb-1'>مبلغ کل خلافی</p>
                <p className='text-2xl font-bold text-primary'>
                  {formatPrice(totalAmount)} تومان
                </p>
              </div>
            )}

            {Array.isArray(fines) && fines.length > 0 ? (
              <div className='space-y-3'>
                <h2 className='font-bold text-lg'>جزئیات جریمه‌ها</h2>
                {fines.map((item, index) => (
                  <div
                    key={index}
                    className='border border-base-300 rounded-xl p-4 text-sm space-y-1'
                  >
                    {(item.Type || item.type || item.Title || item.title) && (
                      <p className='font-bold'>
                        {item.Type || item.type || item.Title || item.title}
                      </p>
                    )}
                    {(item.Location || item.location || item.City || item.city) && (
                      <p>
                        محل:{' '}
                        {item.Location || item.location || item.City || item.city}
                      </p>
                    )}
                    {(item.Date || item.date || item.BillDate) && (
                      <p>تاریخ: {item.Date || item.date || item.BillDate}</p>
                    )}
                    {(item.Amount || item.amount || item.Price) != null && (
                      <p className='text-primary font-bold'>
                        {formatPrice(item.Amount || item.amount || item.Price)} تومان
                      </p>
                    )}
                    {!item.Type &&
                      !item.type &&
                      !item.Title &&
                      !item.Amount &&
                      !item.amount && (
                        <pre className='text-xs whitespace-pre-wrap break-all bg-base-200 rounded-lg p-2'>
                          {JSON.stringify(item, null, 2)}
                        </pre>
                      )}
                  </div>
                ))}
              </div>
            ) : data ? (
              <div className='bg-base-200 rounded-2xl p-4'>
                <p className='text-sm mb-2 text-base-content/70'>پاسخ سرویس:</p>
                <pre className='text-xs whitespace-pre-wrap break-all'>
                  {typeof data === 'string' ? data : JSON.stringify(data, null, 2)}
                </pre>
              </div>
            ) : (
              <p className='text-center text-base-content/70 py-8'>
                خلافی‌ای برای نمایش وجود ندارد
              </p>
            )}

            <div className='flex justify-center gap-3 pt-2'>
              <Link href='/khalafi' className='btn bg-primary text-white border-none'>
                استعلام جدید
              </Link>
              <Link href='/' className='btn bg-secondary text-white border-none'>
                صفحه اصلی
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default KhalafiResultPage
