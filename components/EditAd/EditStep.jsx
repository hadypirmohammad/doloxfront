const EditStep = ({ title, hint, children, onPrev, onNext, nextLabel = 'مرحله بعد', nextDisabled = false, loading = false }) => (
    <div dir='rtl' className='px-4 pt-5 sm:px-5 [&_*]:!font-["vazir"]'>
        <div className='mx-auto max-w-xl rounded-[20px] border border-[#EEF1F6] bg-white p-4 shadow-[0_2px_10px_rgba(20,36,63,.05)] sm:p-5'>
            <div className='flex items-center gap-2'>
                <span className='h-5 w-[3px] rounded-[3px] bg-primary' />
                <h2 className='m-0 text-[17px] font-bold text-secondary'>{title}</h2>
            </div>
            {hint && <p className='m-0 py-3 text-[13px] text-[#98A2B3]'>{hint}</p>}
            {children}
        </div>

        <div className='mx-auto mt-4 flex max-w-xl gap-3'>
            {onPrev && (
                <button
                    type='button'
                    onClick={onPrev}
                    disabled={loading}
                    className='flex flex-1 items-center justify-center gap-2.5 rounded-2xl border border-[#E7EBF1] bg-white py-3.5 text-[14.5px] font-bold text-secondary disabled:opacity-50'
                >
                    <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                        <path d='M5 12h14M12 5l7 7-7 7' />
                    </svg>
                    مرحله قبل
                </button>
            )}
            <button
                type='button'
                onClick={onNext}
                disabled={nextDisabled || loading}
                className='flex flex-1 flex-row-reverse items-center justify-center gap-2.5 rounded-2xl bg-gradient-orange py-3.5 text-[14.5px] font-bold text-white disabled:opacity-50'
            >
                <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                    <path d='M19 12H5M12 19l-7-7 7-7' />
                </svg>
                {nextLabel}
            </button>
        </div>
    </div>
);

export default EditStep;
