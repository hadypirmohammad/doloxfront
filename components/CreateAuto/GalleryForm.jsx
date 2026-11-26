import StateCitySelect from '@/components/global/StateCitySelect';
import { GALLERY_TYPE_NAMES } from '@/utils/services/autoGalleries';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';

const DESCRIBE_LIMIT = 300;

const validationSchema = Yup.object({
  type: Yup.string().required('نوع گالری را انتخاب کنید'),
  name: Yup.string().trim().required('نام گالری الزامی است'),
  manager: Yup.string().trim().required('نام مدیر گالری الزامی است'),
  managerLast: Yup.string().trim().required('نام خانوادگی مدیر الزامی است'),
  address: Yup.string().trim().required('آدرس دقیق گالری الزامی است'),
  mobile: Yup.string()
    .matches(/^09\d{9}$/, 'شماره همراه نامعتبر است')
    .required('شماره همراه الزامی است'),
  phone: Yup.string().matches(/^0\d{9,10}$/, { message: 'شماره دوم نامعتبر است', excludeEmptyString: true }),
  email: Yup.string().email('ایمیل نامعتبر است'),
  describe: Yup.string().trim().max(DESCRIBE_LIMIT, 'توضیحات طولانی است').required('توضیحات فعالیت گالری الزامی است'),
});

const SectionHead = ({ title, children }) => (
  <div className='flex items-center gap-2.5'>
    <span className='flex h-7 w-7 flex-none items-center justify-center rounded-[7px] bg-primary text-white'>
      <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round'>
        {children}
      </svg>
    </span>
    <h2 className='m-0 whitespace-nowrap text-[17px] font-bold text-secondary sm:text-[19px]'>{title}</h2>
    <span className='h-px flex-1 bg-[#E6EDF5]' />
  </div>
);

const icons = {
  type: <path d='M3 9l2-5h14l2 5M3 9v11h18V9M3 9h18M9 20v-6h6v6' />,
  manager: (
    <>
      <circle cx='12' cy='8' r='4' />
      <path d='M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7' />
    </>
  ),
  location: (
    <>
      <path d='M12 21.5s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z' />
      <circle cx='12' cy='10.2' r='2.6' />
    </>
  ),
  contact: <path d='M5 4.5h3.5l1.7 4-2 1.5a11 11 0 0 0 5.8 5.8l1.5-2 4 1.7V19a1.5 1.5 0 0 1-1.6 1.5A15.5 15.5 0 0 1 3.5 6.1 1.5 1.5 0 0 1 5 4.5z' />,
  about: (
    <>
      <path d='M6 3.5h8l4 4v13H6z' />
      <path d='M14 3.5v4h4M9 12.5h6M9 16h4' />
    </>
  ),
};

const fieldLabel = 'text-[14.5px] font-bold text-secondary sm:text-[15.5px]';
const fieldBox =
  'h-[54px] w-full rounded-[10px] border border-[#E2E8F0] bg-[#F5F9FD] px-4 text-[14.5px] text-secondary outline-none transition-colors placeholder:text-[#94A3B8] focus:border-primary sm:text-[15.5px]';
const errorText = 'm-0 pt-1 text-[12.5px] text-[#dc2626]';

const Field = ({ label, required, error, children, hint }) => (
  <div className='flex flex-col gap-2'>
    <label className={fieldLabel}>
      {label} {required ? <span className='text-primary'>*</span> : <span className='text-[#94A3B8]'>{hint}</span>}
    </label>
    {children}
    {error ? <p className={errorText}>{error}</p> : null}
  </div>
);

const GalleryForm = ({ cities = [], loading, onSubmit }) => {
  const [typeOpen, setTypeOpen] = useState(false);
  const [city, setCity] = useState(null);
  const [cityError, setCityError] = useState('');

  const formik = useFormik({
    initialValues: {
      type: '',
      name: '',
      manager: '',
      managerLast: '',
      address: '',
      mobile: '',
      phone: '',
      email: '',
      describe: '',
    },
    validationSchema,
    onSubmit: (values) => {
      if (!city?.CityId) {
        setCityError('استان و شهر را انتخاب کنید');
        return;
      }
      setCityError('');
      onSubmit({ ...values, city });
    },
  });

  const err = (field) => (formik.touched[field] && formik.errors[field] ? formik.errors[field] : '');

  return (
    <form onSubmit={formik.handleSubmit} dir='rtl' className='flex flex-col gap-8'>
      <section className='flex flex-col gap-3.5'>
        <SectionHead title='نوع گالری'>{icons.type}</SectionHead>

        <Field label='نوع گالری' required error={err('type') || (!formik.values.type && cityError ? '' : '')}>
          <div className='relative'>
            <button
              type='button'
              onClick={() => setTypeOpen((prev) => !prev)}
              className={`${fieldBox} flex items-center justify-between gap-2 text-right ${
                formik.values.type ? 'text-secondary' : 'text-[#94A3B8]'
              }`}
            >
              <span>{formik.values.type || 'انتخاب کنید'}</span>
              <svg
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                stroke='#1c2b45'
                strokeWidth='2'
                strokeLinecap='round'
                className={`flex-none transition-transform ${typeOpen ? 'rotate-180' : ''}`}
              >
                <path d='M6 9l6 6 6-6' />
              </svg>
            </button>

            {typeOpen && (
              <div className='absolute inset-x-0 top-full z-30 mt-2 grid gap-2 rounded-xl border border-[#E6EDF5] bg-white p-2.5 shadow-[0_8px_24px_rgba(29,53,87,.08)]'>
                {GALLERY_TYPE_NAMES.map((item) => {
                  const active = formik.values.type === item;
                  return (
                    <button
                      key={item}
                      type='button'
                      onClick={() => {
                        formik.setFieldValue('type', item);
                        setTypeOpen(false);
                      }}
                      className={`flex items-center gap-2.5 rounded-[10px] border-[1.5px] px-3.5 py-3 text-right text-[14.5px] font-semibold text-secondary transition-colors ${
                        active ? 'border-primary bg-[#FFF6F1]' : 'border-[#E6EDF5] bg-white hover:border-primary'
                      }`}
                    >
                      <span
                        className={`flex h-[18px] w-[18px] flex-none items-center justify-center rounded-full border-2 ${
                          active ? 'border-primary' : 'border-[#CBD5E1]'
                        }`}
                      >
                        <span className={`h-2 w-2 rounded-full ${active ? 'bg-primary' : 'bg-transparent'}`} />
                      </span>
                      {item}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </Field>
        {err('type') ? <p className={`${errorText} -mt-2`}>{err('type')}</p> : null}

        <Field label='نام گالری' required error={err('name')}>
          <input
            id='name'
            type='text'
            placeholder='نام گالری خود را وارد کنید'
            className={fieldBox}
            {...formik.getFieldProps('name')}
            disabled={loading}
          />
        </Field>
      </section>

      <section className='flex flex-col gap-3.5'>
        <SectionHead title='اطلاعات مدیر'>{icons.manager}</SectionHead>

        <div className='grid gap-4 sm:grid-cols-2'>
          <Field label='نام مدیر گالری' required error={err('manager')}>
            <input
              id='manager'
              type='text'
              placeholder='نام مدیر گالری'
              className={fieldBox}
              {...formik.getFieldProps('manager')}
              disabled={loading}
            />
          </Field>

          <Field label='نام خانوادگی مدیر' required error={err('managerLast')}>
            <input
              id='managerLast'
              type='text'
              placeholder='نام خانوادگی مدیر'
              className={fieldBox}
              {...formik.getFieldProps('managerLast')}
              disabled={loading}
            />
          </Field>
        </div>
      </section>

      <section className='flex flex-col gap-3.5'>
        <SectionHead title='مکان گالری'>{icons.location}</SectionHead>

        <div className="[&_*]:!font-['vazir']">
          <StateCitySelect
            className='sm:flex-row sm:gap-4'
            cities={cities}
            value={city}
            returnObject
            onChange={(selected) => {
              setCity(selected);
              if (selected?.CityId) setCityError('');
            }}
            labelClassName='pb-2'
            labelTextClassName={fieldLabel}
            selectClassName={fieldBox}
          />
          {cityError ? <p className={errorText}>{cityError}</p> : null}
        </div>

        <Field label='آدرس دقیق گالری' required error={err('address')}>
          <input
            id='address'
            type='text'
            placeholder='آدرس کامل گالری را وارد کنید'
            className={fieldBox}
            {...formik.getFieldProps('address')}
            disabled={loading}
          />
        </Field>
      </section>

      <section className='flex flex-col gap-3.5'>
        <SectionHead title='اطلاعات تماس'>{icons.contact}</SectionHead>

        <div className='grid gap-4 sm:grid-cols-2'>
          <Field label='شماره همراه' required error={err('mobile')}>
            <input
              id='mobile'
              type='tel'
              inputMode='numeric'
              dir='ltr'
              placeholder='09xxxxxxxxx'
              className={`${fieldBox} text-left`}
              {...formik.getFieldProps('mobile')}
              disabled={loading}
            />
          </Field>

          <Field label='شماره دوم' hint='(اختیاری)' error={err('phone')}>
            <input
              id='phone'
              type='tel'
              inputMode='numeric'
              dir='ltr'
              placeholder='موبایل یا تلفن ثابت'
              className={`${fieldBox} text-left`}
              {...formik.getFieldProps('phone')}
              disabled={loading}
            />
          </Field>
        </div>

        <Field label='ایمیل' hint='(اختیاری)' error={err('email')}>
          <input
            id='email'
            type='email'
            dir='ltr'
            placeholder='example@domain.com'
            className={`${fieldBox} text-left`}
            {...formik.getFieldProps('email')}
            disabled={loading}
          />
        </Field>
      </section>

      <section className='flex flex-col gap-3.5'>
        <SectionHead title='درباره گالری'>{icons.about}</SectionHead>

        <Field label='توضیحات فعالیت گالری' required error={err('describe')}>
          <textarea
            id='describe'
            rows={5}
            maxLength={DESCRIBE_LIMIT}
            placeholder='در چند خط درباره فعالیت گالری خود توضیح دهید...'
            className={`${fieldBox} h-auto resize-none py-3.5 leading-[2]`}
            {...formik.getFieldProps('describe')}
            disabled={loading}
          />
        </Field>
        <span dir='ltr' className='-mt-2 text-[12.5px] text-[#94A3B8]'>
          {formik.values.describe.length} / {DESCRIBE_LIMIT}
        </span>
      </section>

      <button
        type='submit'
        disabled={loading}
        className='flex h-[54px] w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-orange text-[15.5px] font-bold text-white disabled:opacity-60'
      >
        {loading ? (
          <span className='loading loading-spinner loading-sm' />
        ) : (
          <>
            <svg width='19' height='19' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.9' strokeLinecap='round' strokeLinejoin='round'>
              <path d='M21.5 2.5 11 13' />
              <path d='M21.5 2.5 15 21l-4-8-8-4z' />
            </svg>
            ثبت گالری
          </>
        )}
      </button>

      <p className='m-0 flex items-start gap-2 text-center text-[12.5px] leading-[2] text-[#8B94A5]'>
        <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='#A3ADBC' strokeWidth='1.8' className='mt-1 flex-none'>
          <circle cx='12' cy='12' r='9' />
          <path d='M12 11v5.5M12 7.8h.01' />
        </svg>
        پس از ثبت اطلاعات، تیم پشتیبانی دولوکس اطلاعات شما را بررسی و در کوتاه‌ترین زمان با شما تماس خواهد گرفت.
      </p>
    </form>
  );
};

export default GalleryForm;
