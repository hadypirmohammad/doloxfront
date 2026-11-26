import React, { useCallback, useEffect, useState, useRef } from "react";

const DoubleSlider = ({ min, max, currentMin, currentMax, onChange, step = 10 }) => {
    // مقدار اولیه را از Props می‌گیریم (اگر وجود داشت)
    const [minVal, setMinVal] = useState(currentMin || min);
    const [maxVal, setMaxVal] = useState(currentMax || max);

    const minValRef = useRef(currentMin || min);
    const maxValRef = useRef(currentMax || max);
    const range = useRef(null);

    // همگام‌سازی استیت داخلی اگر مقادیر از والد تغییر کردند (مثلاً دکمه ریست)
    useEffect(() => {
        if (currentMin !== undefined) setMinVal(currentMin);
        if (currentMax !== undefined) setMaxVal(currentMax);
    }, [currentMin, currentMax]);

    const getPercent = useCallback(
        (value) => Math.round(((value - min) / (max - min)) * 100),
        [min, max]
    );

    // تغییر استایل نوار رنگی اسلایدر (Left)
    useEffect(() => {
        const minPercent = getPercent(minVal);
        const maxPercent = getPercent(maxVal); // استفاده از استیت به جای Ref برای دقت بیشتر در رندر

        if (range.current) {
            range.current.style.left = `${minPercent}%`;
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [minVal, maxVal, getPercent]);

    // هندل کردن تغییر مقدار Min
    const handleMinChange = (event) => {
        const value = Math.min(Number(event.target.value), maxVal - Number(step));
        setMinVal(value);
        minValRef.current = value;
        // فراخوانی مستقیم در اینجا به جای useEffect
        onChange({ min: value, max: maxVal });
    };

    // هندل کردن تغییر مقدار Max
    const handleMaxChange = (event) => {
        const value = Math.max(Number(event.target.value), minVal + Number(step));
        setMaxVal(value);
        maxValRef.current = value;
        // فراخوانی مستقیم در اینجا به جای useEffect
        onChange({ min: minVal, max: value });
    };

    return (
        <div dir="ltr" className="relative w-full px-2.5 pt-1">
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={minVal}
                onChange={handleMinChange}
                className="thumb thumb--left"
                style={{ zIndex: minVal > max - 100 ? "5" : "3" }}
            />
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={maxVal}
                onChange={handleMaxChange}
                className="thumb thumb--right"
                style={{ zIndex: "4" }}
            />

            <div className="slider">
                <div className="slider__track" />
                <div ref={range} className="slider__range" />
                {/* مقادیر نمایشی دو طرف اسلایدر */}
                     </div>

            <div dir="rtl" className="mt-3 flex items-center gap-2 text-[12.5px] text-secondary">
                <span className="font-[vazir] text-[#8B94A5]">از</span>
                <div className="min-w-0 flex-1 rounded-lg border border-[#E5E5E5] bg-white p-1.5 text-center font-[vazir]">
                    {minVal.toLocaleString('fa-IR')}
                </div>
                <span className="font-[vazir] text-[#8B94A5]">تا</span>
                <div className="min-w-0 flex-1 rounded-lg border border-[#E5E5E5] bg-white p-1.5 text-center font-[vazir]">
                    {maxVal.toLocaleString('fa-IR')}
                </div>
            </div>
        </div>
    );
};

export default DoubleSlider;
