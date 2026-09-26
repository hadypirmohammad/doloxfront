import ForgetPasswordSection from '@/components/ForgetPassword/ForgetPasswordSection'
import { useStepHistory } from '@/hooks/useStepHistory';
import ForgetPWOTP from '@/components/ForgetPassword/ForgetPWOTP'
import NewPW from '@/components/ForgetPassword/NewPW'
import PasswordChanged from '@/components/ForgetPassword/PasswordChanged'
import { ImageURL } from '@/utils/URL'
import Image from 'next/image'
import React, { useState } from 'react'

const Forgetpassword = () => {
  const [phonenumber, setphonenumber] = useState();
  const [OTP, setOTP] = useState(-1);
  const [step, setStep] = useState(0);
  useStepHistory(step, setStep, { initialStep: 0, lastStep: 2 });
  return (
      <div>
      {step === 0 &&
        <ForgetPasswordSection setphonenumber={setphonenumber} setStep={setStep} />
      }
      {step === 1 &&
        <ForgetPWOTP setOTP={setOTP} setStep={setStep} />
      }
      {step === 2 &&
        <NewPW OTP={OTP} setStep={setStep} />
      }
      {step === 3 &&
        <PasswordChanged />
      }
   </div>
  )
}

export default Forgetpassword
