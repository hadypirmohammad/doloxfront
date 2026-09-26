import { verifyAccount } from '@/utils/Request';
import React, { useRef, useState, useEffect } from 'react';
import AuthShell, { ArrowIcon, authSubmitButton } from '@/components/Login/AuthShell';

const OTP = ({ setstep, phonenumber }) => {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [message, setmessage] = useState("");
    const inputRefs = useRef([]);

    useEffect(() => {
        // Focus on the first input when component mounts
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (element, index) => {
        const value = element.target.value;

        // Only allow numbers and make sure it's a single digit
        if (/^\d$/.test(value)) {
            let newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Automatically move to the next input
            if (index < 5 && value) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            if (!otp[index]) {
                // Move to the previous input when deleting
                if (index > 0) {
                    inputRefs.current[index - 1].focus();
                }
            } else {
                // Remove the digit from current input and stay focused
                let newOtp = [...otp];
                newOtp[index] = "";
                setOtp(newOtp);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpValue = otp.join("");
        if (otpValue.length === 6) {
            const response = await verifyAccount(otpValue, phonenumber);
            if (response.ok) {
                setstep(2);
            } else {
                setmessage("کد نا معتبر است");
            }
        } else {
            // Handle incomplete OTP case
        }
    };

    return (
        <AuthShell
            title='کد تایید را وارد کنید'
            subtitle={`کد ارسال شده به ${phonenumber} را وارد کنید`}
            footer={
                <p className='m-0 pt-4 text-center text-xs leading-[1.8] text-[#a3abb6]'>
                    کد را دریافت نکردید؟ چند لحظه صبر کنید و دوباره تلاش کنید.
                </p>
            }
        >
            <form className='pt-6' onSubmit={handleSubmit}>
                <div dir='ltr' className='mx-auto flex w-full justify-center gap-2'>
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            type='text'
                            inputMode='numeric'
                            maxLength='1'
                            className="h-12 w-11 rounded-xl border border-[#edeef2] bg-[#fdfdfe] text-center text-lg font-bold text-[#1c2b42] outline-none transition-colors focus:border-primary font-['vazir']"
                            value={digit}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            ref={(el) => (inputRefs.current[index] = el)}
                        />
                    ))}
                </div>

                {message ? (
                    <p className='m-0 pt-3 text-center text-[12px] text-red-500'>{message}</p>
                ) : null}

                <button type='submit' dir='ltr' className={authSubmitButton}>
                    <span>تایید و ادامه</span>
                    <ArrowIcon />
                </button>
            </form>
        </AuthShell>
    );
}

export default OTP;
