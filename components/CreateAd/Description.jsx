import React from 'react';
import Image from 'next/image';
import { useFormik } from 'formik';
import { toPersianDigits } from '@/utils/Cal';
import * as Yup from 'yup';

const HEAVY_HEAD_BRAND_ID = 7;
const DESCRIPTION_MAX = 2000;

const statusOptions = [
  {
    value: 'کارکرده',
    hint: 'خودروی کارکرده',
    icon: (
      <>
        <path d='M4.5 15.5a8 8 0 1 1 15 0' />
        <path d='m12 13 4-3.5' />
        <circle cx='12' cy='15.5' r='1.3' />
      </>
    ),
  },
  {
    value: 'صفر',
    hint: 'خودروی صفر کیلومتر',
    icon: (
      <>
        <path d='M4 17h16' />
        <path d='M5.5 17v-3.5l1.7-4A2 2 0 0 1 9.04 8h5.92a2 2 0 0 1 1.84 1.5l1.7 4V17' />
        <path d='M5.5 13.5h13' />
      </>
    ),
  },
];

const Description = ({ step, setStep, setKilometer, setDescription, category, setWheelnumber , setWeight, setMaxweight, chatEnabled, setChatEnabled}) => {

  const formik = useFormik({
    initialValues: {
      description: '',
      status: 'صفر', // Default selection
      kilometer: '',
      wheelnumber: '',
      weight: '',
      maxweight: ''
    },
    validationSchema: Yup.object({
      description: Yup.string().required('توضیحات الزامی است'),
      status: Yup.string().required('لطفا یک گزینه را انتخاب کنید'),
      kilometer: Yup.number().min(0, 'کیلومتر نمی‌تواند منفی باشد').nullable(),
    }),
    onSubmit: (values) => {
      setDescription(values.description);
      setKilometer(values.status === 'صفر' ? 0 : values.kilometer);
      setWheelnumber(values.wheelnumber)
      setWeight(values.weight)
      setMaxweight(values.weight)
      setStep(5);
    },
  });

  const numberField = (id, label, unit) => (
    <label className='mt-4 block'>
      <span className='block pb-2 text-[12.5px] text-[#A3ADBC]'>{label}</span>
      <span className='flex items-center justify-between gap-3 rounded-[14px] border border-[#EDF0F5] bg-[#F4F6F9] px-4 py-3.5 focus-within:border-primary'>
        <input
          id={id}
          dir='ltr'
          type='number'
          placeholder='0'
          className="min-w-0 flex-1 border-0 bg-transparent text-left text-sm text-secondary outline-none placeholder:text-[#A3ADBC]"
          {...formik.getFieldProps(id)}
          onBlur={(e) => {
            const value = e.target.value;
            formik.setFieldValue(id, value ? parseInt(value, 10) : '');
          }}
        />
        {unit && <span className='flex-none text-[14.5px] font-bold text-secondary'>{unit}</span>}
      </span>
      {formik.touched[id] && formik.errors[id] ? (
        <span className='block pt-1.5 text-sm text-red-500'>{formik.errors[id]}</span>
      ) : null}
    </label>
  );

  if (step !== 4) return null;
  return (
    <div dir='rtl' className='px-4 pt-5 sm:px-5 [&_*]:!font-["vazir"]'>
      <div className='mx-auto max-w-xl rounded-[20px] border border-[#EEF1F6] bg-white p-4 shadow-[0_2px_10px_rgba(20,36,63,.04)] sm:p-5'>
        <div className='flex flex-row-reverse items-center justify-between gap-3'>
          <button
            type='button'
            onClick={formik.handleSubmit}
            className='flex flex-row-reverse items-center gap-2 rounded-xl bg-gradient-orange px-4 py-2.5 text-[12.5px] font-bold text-white'
          >
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
              <path d='M19 12H5M12 19l-7-7 7-7' />
            </svg>
            ادامه
          </button>
          <div className='flex items-center gap-2'>
            <span className='h-5 w-[3px] rounded-[3px] bg-primary' />
            <h2 className='m-0 text-[17px] font-bold text-secondary'>توضیحات آگهی</h2>
          </div>
        </div>

        <p className='m-0 py-3 text-[13px] text-[#98A2B3]'>در توضیحات به نکات مهم اشاره کنید</p>

        <div className='rounded-2xl border border-[#EDF0F5] bg-[#F4F6F9] p-4 focus-within:border-primary'>
          <textarea
            className="h-36 w-full resize-none border-0 bg-transparent text-right text-[13.5px] leading-[2] text-secondary outline-none placeholder:text-[#A3ADBC]"
            placeholder='توضیحات خود را بنویسید...'
            maxLength={DESCRIPTION_MAX}
            {...formik.getFieldProps('description')}
          />
          <p className='m-0 text-[11.5px] text-[#B6BECB]'>{toPersianDigits(formik.values.description.length)}/{toPersianDigits(DESCRIPTION_MAX)}</p>
        </div>
        {formik.touched.description && formik.errors.description ? (
          <div className='pt-1.5 text-sm text-red-500'>{formik.errors.description}</div>
        ) : null}

        <div className='flex items-center gap-2 pb-3 pt-5'>
          <span className='h-[18px] w-[3px] rounded-[3px] bg-primary' />
          <h3 className='m-0 text-[15.5px] font-bold text-secondary'>وضعیت خودرو</h3>
        </div>

        <div className='flex flex-row-reverse gap-2.5'>
          {statusOptions.map((option) => {
            const active = formik.values.status === option.value;
            return (
              <label
                key={option.value}
                className={`flex flex-1 cursor-pointer flex-row-reverse items-center gap-2.5 rounded-2xl border p-3.5 transition-colors ${
                  active ? 'border-[1.5px] border-primary bg-white' : 'border-[#EDF0F5] bg-[#F4F6F9]'
                }`}
              >
                <input
                  type='radio'
                  name='status'
                  value={option.value}
                  className='hidden'
                  onChange={formik.handleChange}
                  checked={active}
                />
                <span
                  className={`flex h-5 w-5 flex-none items-center justify-center rounded-full border-[1.5px] ${
                    active ? 'border-primary' : 'border-[#D4DAE3] bg-white'
                  }`}
                >
                  {active && <span className='h-2.5 w-2.5 rounded-full bg-primary' />}
                </span>
                <span className='flex-1'>
                  <span className='block text-[14.5px] font-bold text-secondary'>{option.value}</span>
                  <span className='block pt-0.5 text-[11.5px] text-[#98A2B3]'>{option.hint}</span>
                </span>
                <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke={active ? '#FF5E00' : '#8E9AAC'} strokeWidth='1.7' strokeLinecap='round' strokeLinejoin='round' className='flex-none'>
                  {option.icon}
                </svg>
              </label>
            );
          })}
        </div>

        {formik.values.status === 'کارکرده' && numberField('kilometer', 'کارکرد', 'کیلومتر')}

        {category?.BrandId === HEAVY_HEAD_BRAND_ID && (
          <div>
            {numberField('wheelnumber', 'تعداد چرخ', '')}
            {numberField('weight', 'وزن خودرو', 'تن')}
            {numberField('maxweight', 'حداکثر وزن مجاز', 'تن')}
          </div>
        )}

        <div className='mt-5 flex flex-row-reverse items-center gap-3.5 rounded-[18px] bg-[#FFF3EA] p-4'>
          <Image
            src='/media/images/default-ad.webp'
            alt=''
            width={86}
            height={70}
            className='h-[70px] w-[86px] flex-none rounded-xl object-cover'
          />
          <button
            type='button'
            dir='ltr'
            role='switch'
            aria-checked={!!chatEnabled}
            onClick={() => setChatEnabled(!chatEnabled)}
            className={`relative h-[30px] w-14 flex-none rounded-full transition-colors duration-200 ${
              chatEnabled ? 'bg-gradient-orange' : 'bg-[#D4DAE3]'
            }`}
          >
            <span
              className={`absolute top-[3px] h-6 w-6 rounded-full bg-white shadow transition-all duration-200 ${
                chatEnabled ? 'left-[27px]' : 'left-[3px]'
              }`}
            />
          </button>
          <div className='flex-1'>
            <p className='m-0 text-[15.5px] font-bold text-secondary'>چت آنلاین آگهی</p>
            <p className='m-0 pt-1.5 text-[12.5px] leading-[1.9] text-[#8B94A5]'>
              اگر فعال باشد، خریداران می‌توانند از طریق چت دولوکس با شما گفتگو کنند.
            </p>
            <p className={`m-0 pt-2 text-[13px] font-bold ${chatEnabled ? 'text-primary' : 'text-[#98A2B3]'}`}>
              {chatEnabled ? 'چت فعال است' : 'چت غیرفعال است'}
            </p>
          </div>
        </div>
      </div>

      <div className='mx-auto mt-4 flex max-w-xl gap-3'>
        <button
          type='button'
          onClick={() => setStep(step - 1)}
          className='flex flex-1 items-center justify-center gap-2.5 rounded-2xl border border-[#E7EBF1] bg-white py-3.5 text-[14.5px] font-bold text-secondary'
        >
          <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
            <path d='M5 12h14M12 5l7 7-7 7' />
          </svg>
          مرحله قبل
        </button>
        <button
          type='button'
          onClick={formik.handleSubmit}
          className='flex flex-1 flex-row-reverse items-center justify-center gap-2.5 rounded-2xl bg-gradient-orange py-3.5 text-[14.5px] font-bold text-white'
        >
          <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
            <path d='M19 12H5M12 19l-7-7 7-7' />
          </svg>
          مرحله بعد
        </button>
      </div>
    </div>
  );
};

export default Description;
