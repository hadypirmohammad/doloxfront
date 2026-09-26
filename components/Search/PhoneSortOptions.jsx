import React, { useState } from "react";

const PhoneSortOptions = ({ setSortoption,  sortlist, currentSortOption }) => {
    const [open, setOpen] = useState(false);

    const handleSelect = (option) => {
        setSortoption(option);
        setOpen(false);
    };
   

    return (
        <div className="relative md:hidden">

            {/* button */}
            <button
                onClick={() => setOpen(true)}
                className="flex px-3 py-2 shadow bg-white rounded-full mr-1 text-[#8B7676] items-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="11" viewBox="0 0 14 11" fill="none">
                    <path d="M13.3 1.94118H0.7C0.514348 1.94118 0.336301 1.83892 0.205025 1.6569C0.0737498 1.47488 0 1.228 0 0.970588C0 0.713172 0.0737498 0.466299 0.205025 0.284279C0.336301 0.102258 0.514348 0 0.7 0H13.3C13.4857 0 13.6637 0.102258 13.795 0.284279C13.9262 0.466299 14 0.713172 14 0.970588C14 1.228 13.9262 1.47488 13.795 1.6569C13.6637 1.83892 13.4857 1.94118 13.3 1.94118ZM10.9667 6.47059H3.03333C2.84768 6.47059 2.66963 6.36833 2.53836 6.18631C2.40708 6.00429 2.33333 5.75742 2.33333 5.5C2.33333 5.24258 2.40708 4.99571 2.53836 4.81369C2.66963 4.63167 2.84768 4.52941 3.03333 4.52941H10.9667C11.1523 4.52941 11.3304 4.63167 11.4616 4.81369C11.5929 4.99571 11.6667 5.24258 11.6667 5.5C11.6667 5.75742 11.5929 6.00429 11.4616 6.18631C11.3304 6.36833 11.1523 6.47059 10.9667 6.47059ZM8.16667 11H5.83333C5.64768 11 5.46963 10.8977 5.33836 10.7157C5.20708 10.5337 5.13333 10.2868 5.13333 10.0294C5.13333 9.772 5.20708 9.52512 5.33836 9.3431C5.46963 9.16108 5.64768 9.05882 5.83333 9.05882H8.16667C8.35232 9.05882 8.53037 9.16108 8.66164 9.3431C8.79292 9.52512 8.86667 9.772 8.86667 10.0294C8.86667 10.2868 8.79292 10.5337 8.66164 10.7157C8.53037 10.8977 8.35232 11 8.16667 11Z" fill="#8B7676" />
                </svg>

                <span className="font-[vazir] font-bold">
                    {currentSortOption.label}
                </span>
            </button>

            {/* overlay */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/30 z-40"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* drawer */}
            <div
                className={`fixed bottom-0 left-0 w-full bg-white rounded-t-2xl z-50 transition-transform duration-300 ${open ? "translate-y-0" : "translate-y-full"
                    }`}
            >
                <div className="p-5 flex flex-col gap-4">

                    {sortlist.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => handleSelect(item)}
                            className={`text-right py-2 border-b ${currentSortOption.label === item.label ? "text-black font-bold" : "text-gray-500"
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}

                </div>
            </div>
        </div>
    );
};

export default PhoneSortOptions;
