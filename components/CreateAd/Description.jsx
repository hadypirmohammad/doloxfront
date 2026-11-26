import Image from 'next/image';
import React from 'react';
import { useFormik } from 'formik';
import { toPersianDigits } from '@/utils/Cal';
import * as Yup from 'yup';

const DESCRIPTION_MAX = 2000;

const statusOptions = [
  {
    value: 'کارکرده',
    hint: 'خودروی کارکرده',
    icon: '/media/images/features/usedkm.webp',
  },
  {
    value: 'حواله',
    hint: 'حواله خودرو به فروش میرسد',
    icon: '/media/images/features/havale.webp',
  },
  {
    value: 'صفر',
    hint: 'خودروی صفر کیلومتر',
    icon: '/media/images/features/zerokm.webp',
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
      setKilometer(values.status === 'کارکرده' ? values.kilometer : 0);
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
        <div className='flex items-center gap-2'>
          <span className='h-5 w-[3px] rounded-[3px] bg-primary' />
          <h2 className='m-0 text-[17px] font-bold text-secondary'>توضیحات آگهی</h2>
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

        <div className='grid gap-2 sm:grid-cols-3'>
          {statusOptions.map((option) => {
            const active = formik.values.status === option.value;
            return (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center gap-2 rounded-2xl border p-3 transition-colors sm:gap-2.5 sm:p-3.5 ${
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
                  className={`hidden h-5 w-5 flex-none items-center justify-center rounded-full border-[1.5px] sm:flex ${
                    active ? 'border-primary' : 'border-[#D4DAE3] bg-white'
                  }`}
                >
                  {active && <span className='h-2.5 w-2.5 rounded-full bg-primary' />}
                </span>
                <Image
                  src={option.icon}
                  alt=''
                  width={128}
                  height={128}
                  className={`h-[26px] w-[26px] flex-none object-contain transition-opacity sm:h-[30px] sm:w-[30px] ${
                    active ? 'opacity-100' : 'opacity-45'
                  }`}
                />
                <span className='min-w-0 flex-1'>
                  <span className='block text-[14px] font-bold text-secondary sm:text-[14.5px]'>{option.value}</span>
                  <span className='block pt-0.5 text-[11px] leading-[1.7] text-[#98A2B3] sm:text-[11.5px]'>{option.hint}</span>
                </span>
              </label>
            );
          })}
        </div>

        {formik.values.status === 'کارکرده' && numberField('kilometer', 'کارکرد', 'کیلومتر')}

        <div className='mt-5 rounded-[18px] bg-[#FFF3EA] p-4'>
          <div className='flex items-center gap-3'>
          <svg width='76' height='76' viewBox='0 0 64 64' fill='none' className='h-11 w-11 flex-none sm:h-[70px] sm:w-[70px]'>
            <path
              d='M35 15h14a9 9 0 0 1 9 9v10a9 9 0 0 1-9 9h-1.5v6.5L40 42.9h-5a9 9 0 0 1-9-9V24a9 9 0 0 1 9-9z'
              fill='#CC4B00'
            />
            <path
              d='M15 10h20a11 11 0 0 1 11 11v8a11 11 0 0 1-11 11H23l-8 7.5V40h-.5A11 11 0 0 1 3.5 29v-8A11 11 0 0 1 15 10z'
              fill='#FF5E00'
            />
            <path
              d='M16.5 13.5h17A8.5 8.5 0 0 1 42 22v6a8.5 8.5 0 0 1-8.5 8.5h-11L16 42v-5.5A8.5 8.5 0 0 1 8 28v-6a8.5 8.5 0 0 1 8.5-8.5z'
              fill='#FFFFFF'
            />
            <path
              d='M13 28.5c0-.6.3-1.2.8-1.5l1.4-1 1.3-2.4c.3-.6 1-1 1.7-1h4.3c.7 0 1.3.4 1.7 1l1.3 2.4 1.4 1c.5.3.8.9.8 1.5v1.9c0 .5-.4.8-.9.8h-1.1a.9.9 0 0 1-.9-.8v-.6h-8.9v.6c0 .5-.4.8-.9.8h-1.1a.9.9 0 0 1-.9-.8v-1.9z'
              fill='#FF5E00'
            />
            <path d='M16.2 27.4h8.6l-1.2-2.2h-6.2l-1.2 2.2z' fill='#FFFFFF' />
            <circle cx='31' cy='27' r='2.1' fill='#FF5E00' />
            <circle cx='36.5' cy='27' r='2.1' fill='#FF5E00' />
            <circle cx='42' cy='27' r='2.1' fill='#FF5E00' />
          </svg>
          <div className='min-w-0 flex-1'>
            <p className='m-0 text-[15px] font-bold text-secondary sm:text-[15.5px]'>چت آنلاین آگهی</p>
            <p className={`m-0 pt-1 text-[12.5px] font-bold ${chatEnabled ? 'text-primary' : 'text-[#98A2B3]'}`}>
              {chatEnabled ? 'چت فعال است' : 'چت غیرفعال است'}
            </p>
          </div>
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
          </div>
          <p className='m-0 pt-2.5 text-[12.5px] leading-[1.85] text-[#8B94A5]'>
            اگر فعال باشد، خریداران می‌توانند از طریق چت دولوکس با شما گفتگو کنند.
          </p>
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
