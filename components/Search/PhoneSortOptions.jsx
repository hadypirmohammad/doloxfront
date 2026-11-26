import React, { useState } from "react";

const PhoneSortOptions = ({ setSortoption, sortlist, currentSortOption }) => {
    const [open, setOpen] = useState(false);

    const handleSelect = (option) => {
        setSortoption(option);
        setOpen(false);
    };

    return (
        <div className="relative lg:hidden">
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="font-soft flex h-[42px] items-center gap-2 rounded-full border border-[#E6E8EC] bg-white px-4 text-[14px] text-secondary"
            >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
                    <path d="M4 7h16M7 12h10M10 17h4" />
                </svg>
                {currentSortOption.label}
            </button>

            {open && <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setOpen(false)} />}

            <div
                className={`fixed inset-x-0 bottom-0 z-50 rounded-t-[22px] bg-white pb-[calc(12px+env(safe-area-inset-bottom))] transition-transform duration-300 ${
                    open ? "translate-y-0" : "pointer-events-none translate-y-full"
                }`}
                aria-hidden={!open}
            >
                <div className="mx-auto mb-2 mt-3 h-1.5 w-12 rounded-full bg-[#DDE1E7]" />
                <h2 className="font-soft m-0 px-5 pb-2 pt-1 text-[16px] text-secondary">مرتب‌سازی</h2>
                <div className="flex flex-col px-3">
                    {sortlist.map((item) => {
                        const active = currentSortOption.label === item.label;
                        return (
                            <button
                                key={item.label}
                                type="button"
                                onClick={() => handleSelect(item)}
                                className={`flex h-12 items-center justify-between rounded-xl px-3 text-right text-[14px] transition-colors ${
                                    active ? "bg-[#FFF6F0] text-[#C2410C]" : "text-secondary hover:bg-[#F6F7F9]"
                                }`}
                            >
                                {item.label}
                                {active && (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m5 12.5 4.5 4.5L19 7" />
                                    </svg>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PhoneSortOptions;
