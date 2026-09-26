import React, { useCallback, useEffect, useState, useRef } from "react";

const DoubleSlider = ({ min, max, currentMin, currentMax, onChange }) => {
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
        const value = Math.min(Number(event.target.value), maxVal - 1);
        setMinVal(value);
        minValRef.current = value;
        // فراخوانی مستقیم در اینجا به جای useEffect
        onChange({ min: value, max: maxVal });
    };

    // هندل کردن تغییر مقدار Max
    const handleMaxChange = (event) => {
        const value = Math.max(Number(event.target.value), minVal + 1);
        setMaxVal(value);
        maxValRef.current = value;
        // فراخوانی مستقیم در اینجا به جای useEffect
        onChange({ min: minVal, max: value });
    };

    return (
        <div dir="ltr" className=" w-fit relative">
            <input
                type="range"
                min={min}
                max={max}
                step={10}
                value={minVal}
                onChange={handleMinChange}
                className="thumb thumb--left"
                style={{ zIndex: minVal > max - 100 ? "5" : "3" }}
            />
            <input
                type="range"
                min={min}
                max={max}
                step={10}
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

            <div className="!bg-transparent text-black pt-10 gap-2 text-sm items-center flex mt-1">
                <div className="!bg-transparent border w-1/2 border-black rounded-md font-[vazir] p-1 text-center">
                    {maxVal.toLocaleString()}
                </div>
                <span className="font-[vazir]">تا</span>
                <div className="!bg-transparent border w-1/2 border-black rounded-md font-[vazir] p-1 text-center">
                    {minVal.toLocaleString()}
                </div>
                <span className="font-[vazir]">از</span>
            </div>
        </div>
    );
};

export default DoubleSlider;
