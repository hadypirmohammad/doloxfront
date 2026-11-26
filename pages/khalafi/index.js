import { inquireKhalafi } from '@/utils/Request'
import { useFormik } from 'formik'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import * as Yup from 'yup'

const PLATE_LETTERS = [
  'الف', 'ب', 'پ', 'ت', 'ث', 'ج', 'د', 'ز', 'س', 'ش',
  'ص', 'ط', 'ع', 'ف', 'ق', 'ک', 'گ', 'ل', 'م', 'ن', 'و', 'ه', 'ی',
]

const FEATURES = [
  {
    title: 'امنیت اطلاعات',
    text: 'حفاظت از اطلاعات شخصی شما',
    icon: (
      <>
        <path d="M12 2.5 20 5.5v6c0 5-3.4 8.5-8 10.5-4.6-2-8-5.5-8-10.5v-6z" />
        <polyline points="8.5,12 11,14.5 15.5,9.5" />
      </>
    ),
  },
  {
    title: 'صرفه‌جویی در زمان',
    text: 'بدون نیاز به مراجعه حضوری',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <polyline points="12,7 12,12 16,14" />
      </>
    ),
  },
  {
    title: 'دقت بالا',
    text: 'استعلام سریع و بدون خطا',
    icon: (
      <>
        <path d="M12 2.5 20 5.5v6c0 5-3.4 8.5-8 10.5-4.6-2-8-5.5-8-10.5v-6z" />
        <circle cx="12" cy="11.5" r="1.6" />
        <line x1="12" y1="13" x2="12" y2="15.5" />
      </>
    ),
  },
]

const buildPlateNumber = ({ left, letter, mid, iranCode }) =>
  `ایران ${iranCode} – ${mid} ${letter} ${left}`

const fieldWrap =
  'flex h-[52px] items-center gap-2.5 rounded-[14px] border-[1.5px] border-[#e9edf2] bg-[#fcfdfe] px-3.5 transition-colors focus-within:border-primary'
const fieldInput =
  "min-w-0 flex-1 border-0 bg-transparent text-left text-[13.5px] text-[#14233c] outline-none font-['vazir']"
const fieldLabel = 'mb-2.5 block text-sm font-bold text-[#14233c]'
const plateBox =
  'flex h-[52px] min-w-0 items-center justify-center overflow-hidden rounded-xl border-[1.5px] border-[#e9edf2] bg-[#fcfdfe] px-1 text-[15px] font-semibold text-[#14233c] transition-colors focus-within:border-primary'
const plateCaption = 'mt-1.5 text-center text-[11.5px] text-[#9aa3b0]'

const KhalafiPage = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      nationalCode: '',
      mobile: '',
      left: '',
      letter: 'ب',
      mid: '',
      iranCode: '',
    },
    validationSchema: Yup.object({
      nationalCode: Yup.string()
        .matches(/^\d{10}$/, 'کد ملی باید ۱۰ رقم باشد')
        .required('کد ملی الزامی است'),
      mobile: Yup.string()
        .matches(/^09\d{9}$/, 'شماره موبایل نامعتبر است')
        .required('شماره موبایل الزامی است'),
      left: Yup.string()
        .matches(/^\d{2}$/, '۲ رقم وارد کنید')
        .required('الزامی'),
      letter: Yup.string().required('حرف پلاک الزامی است'),
      mid: Yup.string()
        .matches(/^\d{3}$/, '۳ رقم وارد کنید')
        .required('الزامی'),
      iranCode: Yup.string()
        .matches(/^\d{2}$/, '۲ رقم وارد کنید')
        .required('الزامی'),
    }),
    onSubmit: async (values) => {
      setLoading(true)
      try {
        const plateNumber = buildPlateNumber(values)
        const result = await inquireKhalafi(
          values.nationalCode,
          values.mobile,
          plateNumber
        )

        if (result?.includes('zibal') || result?.startsWith('http')) {
          toast.success('در حال انتقال به درگاه پرداخت')
          setTimeout(() => {
            router.push(result)
          }, 200)
        } else {
          toast.error(result || 'پاسخ نامعتبر از سرور')
        }
      } catch (error) {
        toast.error(error.message || 'خطا در استعلام خلافی')
      } finally {
        setLoading(false)
      }
    },
  })

  const fieldError = (name) =>
    formik.touched[name] && formik.errors[name] ? (
      <p className='m-0 pt-1.5 text-[11.5px] text-red-500'>{formik.errors[name]}</p>
    ) : null

  const digitsOnly = (name, max) => (event) =>
    formik.setFieldValue(name, event.target.value.replace(/\D/g, '').slice(0, max))

  return (
    <div dir='rtl' className='w-full bg-[#f7f8fa] pb-16'>
      <div className='mx-auto flex max-w-screen-lg items-center gap-2 px-4 py-3.5 text-[12.5px] text-[#9aa3b0]'>
        <Link href='/' className='text-[#9aa3b0] hover:text-primary'>صفحه اصلی</Link>
        <span className='text-[#c3c9d2]'>›</span>
        <span className='font-semibold text-primary'>استعلام خلافی خودرو</span>
      </div>

      <div className='mx-auto flex max-w-screen-lg flex-col gap-4 px-4'>
        <div className='rounded-[18px] border border-[#edf0f4] bg-white p-5 sm:p-7'>
          <div className='flex items-center gap-2.5'>
            <h1 className='m-0 text-[21px] font-bold leading-[1.3] text-[#14233c]'>استعلام خلافی خودرو</h1>
            <svg width='30' height='22' viewBox='0 0 34 22' fill='none' stroke='#FF5E00' strokeWidth='1.8' className='flex-none'>
              <path d='M3 15h28M5 15v-3l3-6h18l3 6v3' />
              <circle cx='10' cy='17' r='2.4' />
              <circle cx='24' cy='17' r='2.4' />
            </svg>
          </div>
          <p className='m-0 pt-2.5 text-[13.5px] leading-[1.9] text-[#9aa3b0]'>
            با وارد کردن اطلاعات زیر، خلافی خودرو خود را استعلام کنید.
          </p>

          <div className='my-[18px] h-px bg-[#eef1f5]' />

          <form onSubmit={formik.handleSubmit} className='grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-x-8'>
            <div>
              <span className={fieldLabel}>کد ملی مالک</span>
              <label className={fieldWrap}>
                <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='#9aa3b0' strokeWidth='1.7' className='flex-none'>
                  <circle cx='12' cy='8' r='3.6' />
                  <path d='M5 20c0-3.6 3.1-5.6 7-5.6s7 2 7 5.6' />
                </svg>
                <input
                  dir='ltr'
                  type='text'
                  inputMode='numeric'
                  maxLength={10}
                  placeholder='0012345678'
                  className={fieldInput}
                  name='nationalCode'
                  value={formik.values.nationalCode}
                  onChange={digitsOnly('nationalCode', 10)}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                />
              </label>
              {fieldError('nationalCode')}
            </div>

            <div>
              <span className={fieldLabel}>شماره موبایل</span>
              <label className={fieldWrap}>
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='#9aa3b0' strokeWidth='1.7' className='flex-none'>
                  <rect x='6' y='2.5' width='12' height='19' rx='3' />
                  <line x1='10.5' y1='18.5' x2='13.5' y2='18.5' />
                </svg>
                <input
                  dir='ltr'
                  type='text'
                  inputMode='numeric'
                  maxLength={11}
                  placeholder='09121234567'
                  className={fieldInput}
                  name='mobile'
                  value={formik.values.mobile}
                  onChange={digitsOnly('mobile', 11)}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                />
              </label>
              {fieldError('mobile')}
            </div>

            <div className='md:col-span-2'>
              <span className={fieldLabel}>شماره پلاک</span>
              <div className='grid grid-cols-4 gap-2 sm:gap-2.5'>
                <div>
                  <div className={plateBox}>
                    <span className='flex min-w-0 items-center gap-1'>
                      <span className='h-[9px] w-[13px] flex-none overflow-hidden rounded-[2px] border border-[#e3e7ec] sm:h-[11px] sm:w-[15px]'>
                        <span className='block h-1/3 bg-[#22a45d]' />
                        <span className='block h-1/3 bg-white' />
                        <span className='block h-1/3 bg-[#e5233b]' />
                      </span>
                      <span className='flex-none text-[12px] font-semibold sm:text-sm'>ایران</span>
                      <input
                        type='text'
                        inputMode='numeric'
                        maxLength={2}
                        placeholder='۱۱'
                        className='w-6 min-w-0 flex-none border-0 bg-transparent text-center text-[13px] font-semibold text-[#14233c] outline-none sm:w-8 sm:text-[15px]'
                        name='iranCode'
                        value={formik.values.iranCode}
                        onChange={digitsOnly('iranCode', 2)}
                        onBlur={formik.handleBlur}
                        disabled={loading}
                      />
                    </span>
                  </div>
                  <div className={plateCaption}>استان</div>
                </div>

                <div>
                  <div className={plateBox}>
                    <input
                      type='text'
                      inputMode='numeric'
                      maxLength={3}
                      placeholder='۳۴۵'
                      className='w-full border-0 bg-transparent text-center text-[15px] font-semibold text-[#14233c] outline-none'
                      name='mid'
                      value={formik.values.mid}
                      onChange={digitsOnly('mid', 3)}
                      onBlur={formik.handleBlur}
                      disabled={loading}
                    />
                  </div>
                  <div className={plateCaption}>عدد</div>
                </div>

                <div>
                  <div className={`${plateBox} relative`}>
                    <select
                      className='absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0'
                      name='letter'
                      value={formik.values.letter}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={loading}
                    >
                      {PLATE_LETTERS.map((letter) => (
                        <option key={letter} value={letter}>
                          {letter}
                        </option>
                      ))}
                    </select>
                    <span className='pointer-events-none'>{formik.values.letter}</span>
                  </div>
                  <div className={plateCaption}>حرف</div>
                </div>

                <div>
                  <div className={plateBox}>
                    <input
                      type='text'
                      inputMode='numeric'
                      maxLength={2}
                      placeholder='۱۲'
                      className='w-full border-0 bg-transparent text-center text-[15px] font-semibold text-[#14233c] outline-none'
                      name='left'
                      value={formik.values.left}
                      onChange={digitsOnly('left', 2)}
                      onBlur={formik.handleBlur}
                      disabled={loading}
                    />
                  </div>
                  <div className={plateCaption}>اعداد</div>
                </div>
              </div>
              <div className='flex flex-wrap gap-3'>
                {fieldError('iranCode')}
                {fieldError('mid')}
                {fieldError('letter')}
                {fieldError('left')}
              </div>
            </div>

            <button
              type='submit'
              disabled={loading}
              className='mt-1 flex h-14 w-full items-center justify-center gap-3.5 rounded-[14px] bg-gradient-to-l from-[#ff7d1a] to-[#FF5E00] text-base font-bold text-white transition hover:brightness-105 disabled:opacity-60 md:col-span-2'
            >
              {loading ? (
                <span className='loading loading-spinner loading-sm' />
              ) : (
                <>
                  <span>استعلام خلافی</span>
                  <svg width='22' height='12' viewBox='0 0 22 12' fill='none' stroke='#fff' strokeWidth='1.8'>
                    <line x1='21' y1='6' x2='2' y2='6' />
                    <polyline points='7,1 2,6 7,11' />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>

        <div className='rounded-[18px] bg-[#0d1b2e] p-5 sm:p-7'>
          <div className='flex items-center justify-center gap-3'>
            <span className='h-[3px] w-6 rounded-sm bg-primary' />
            <span className='text-[15.5px] font-bold text-white'>چرا از دولوکس استعلام بگیریم؟</span>
            <span className='h-[3px] w-6 rounded-sm bg-primary' />
          </div>

          <div className='mt-5 grid grid-cols-[1fr_1px_1fr_1px_1fr] gap-2.5 text-center'>
            {FEATURES.map((feature, index) => (
              <React.Fragment key={feature.title}>
                {index > 0 ? <div className='bg-[#1b2d47]' /> : null}
                <div>
                  <svg width='28' height='28' viewBox='0 0 24 24' fill='none' stroke='#FF5E00' strokeWidth='1.7' className='mx-auto'>
                    {feature.icon}
                  </svg>
                  <div className='mt-2.5 text-[13.5px] font-bold text-white'>{feature.title}</div>
                  <div className='mt-1.5 text-[11.5px] leading-[1.8] text-[#9fadbe]'>{feature.text}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default KhalafiPage
