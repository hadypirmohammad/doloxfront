import React from 'react';

const MOTORCYCLE_HEAD_BRAND_ID = 6;

const icons = {
  brand: (
    <>
      <path d="M5 16.5h14" />
      <path d="M6.5 16.5v-4l1.8-4.2A2 2 0 0 1 10.14 7h3.72a2 2 0 0 1 1.84 1.3l1.8 4.2v4" />
      <path d="M6.5 12.5h11" />
      <circle cx="8.5" cy="14.5" r=".8" />
      <circle cx="15.5" cy="14.5" r=".8" />
    </>
  ),
  model: (
    <>
      <path d="M4 17h16" />
      <path d="M5.5 17v-3.5l1.7-4A2 2 0 0 1 9.04 8h5.92a2 2 0 0 1 1.84 1.5l1.7 4V17" />
      <path d="M5.5 13.5h13" />
    </>
  ),
  year: (
    <>
      <rect x="4" y="5.5" width="16" height="14" rx="2.5" />
      <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" />
    </>
  ),
  body: (
    <>
      <rect x="5" y="3.5" width="14" height="17" rx="2.5" />
      <path d="M9 8h6M9 12h6M9 16h3.5" />
    </>
  ),
  description: (
    <>
      <path d="M6 3.5h8l4 4v13H6z" />
      <path d="M14 3.5v4h4" />
      <path d="M9 12.5h6M9 16h4" />
    </>
  ),
  price: (
    <>
      <path d="M12.5 3.5H20v7.5l-8.6 8.6a2 2 0 0 1-2.8 0l-4.7-4.7a2 2 0 0 1 0-2.8z" />
      <circle cx="16.5" cy="7.5" r="1.2" />
    </>
  ),
  images: (
    <>
      <rect x="3.5" y="5" width="17" height="14" rx="2.5" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="M4.5 16.5 9 12l3 2.5 3.5-3 4 4.5" />
    </>
  ),
  location: (
    <>
      <path d="M12 21.5s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z" />
      <circle cx="12" cy="10.2" r="2.6" />
    </>
  ),
  submit: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.2 12.3l2.6 2.6 5-5.4" />
    </>
  ),
  check: <path d="M6 12.5l4 4 8-8.5" />,
};

const getSteps = (category) => [
  { label: 'برند', icon: 'brand' },
  { label: 'مدل', icon: 'model' },
  { label: 'سال', icon: 'year' },
  { label: category?.BrandId === MOTORCYCLE_HEAD_BRAND_ID ? 'فنی' : 'بدنه', icon: 'body' },
  { label: 'توضیحات', icon: 'description' },
  { label: 'قیمت', icon: 'price' },
  { label: 'تصاویر', icon: 'images' },
  { label: 'مکان', icon: 'location' },
  { label: 'ثبت', icon: 'submit' },
];

const CreateAdSteps = ({ step = 0, category }) => {
  const steps = getSteps(category);

  return (
    <div dir="rtl" className="px-2 pt-5 sm:px-5">
      <div className="relative mx-auto flex max-w-xl items-start justify-between gap-0 sm:gap-1">
        <div className="absolute right-4 left-4 top-[15px] h-px bg-[#E4E9F0] sm:right-5 sm:left-5 sm:top-[21px]" />
        {steps.map((item, index) => {
          const done = index < step;
          const active = index === step;
          const circle = done
            ? 'bg-secondary border-secondary text-white'
            : active
              ? 'bg-white border-primary text-primary'
              : 'bg-white border-[#E7EBF1] text-[#9AA6B8]';

          return (
            <div key={item.label} className="relative z-10 flex w-[34px] flex-col items-center gap-1.5 sm:w-11">
              <span
                className={`flex h-[30px] w-[30px] items-center justify-center rounded-full border-[1.5px] transition-colors sm:h-[42px] sm:w-[42px] ${circle}`}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 sm:h-[19px] sm:w-[19px]"
                >
                  {done ? icons.check : icons[item.icon]}
                </svg>
              </span>
              <span
                className={`whitespace-nowrap text-[8.5px] font-semibold sm:text-[11px] ${
                  done ? 'text-secondary' : active ? 'text-primary' : 'text-[#9AA6B8]'
                }`}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CreateAdSteps;
