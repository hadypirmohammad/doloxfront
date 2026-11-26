const STEPS = ['بدنه', 'توضیحات', 'قیمت', 'تصاویر', 'ثبت'];

const EditSteps = ({ step = 1 }) => (
    <div dir='rtl' className='mx-auto flex max-w-xl items-start justify-between px-4 pt-6 sm:px-5'>
        {STEPS.map((label, index) => {
            const number = index + 1;
            const done = number < step;
            const current = number === step;
            return (
                <div key={label} className='flex flex-1 flex-col items-center gap-1.5'>
                    <span
                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-[13px] font-bold ${
                            done
                                ? 'border-secondary bg-secondary text-white'
                                : current
                                    ? 'border-primary bg-white text-primary'
                                    : 'border-[#E3E7ED] bg-white text-[#A3ADBC]'
                        }`}
                    >
                        {done ? (
                            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.6' strokeLinecap='round' strokeLinejoin='round'>
                                <path d='m5 12.5 4.5 4.5L19 7' />
                            </svg>
                        ) : (
                            number.toLocaleString('fa-IR')
                        )}
                    </span>
                    <span className={`text-[12px] ${current ? 'font-bold text-primary' : done ? 'font-bold text-secondary' : 'text-[#A3ADBC]'}`}>
                        {label}
                    </span>
                </div>
            );
        })}
    </div>
);

export default EditSteps;
