import AccountCreated from '@/components/Register/AccountCreated';
import { useStepHistory } from '@/hooks/useStepHistory';
import OTP from '@/components/Register/OTP';
import RegisterSection from '@/components/Register/RegisterSection'
import { createUserReq, verifyAccount } from '@/utils/Request';
import React,{ useState } from 'react'

const Register = () => {
  // step 0 userinformation
  // step 1 otp code 
  
  // step 2 success 
  const  [phonenumber, setphonenumber] = useState(-1);
  const [step, setStep] = useState(0);
  useStepHistory(step, setStep, { initialStep: 0, lastStep: 1 });
  return (
    <div>
      {step === 0 &&
        <RegisterSection setstep={setStep} setphonenumber={setphonenumber} />
      }
      {step === 1 && 
        <OTP  phonenumber={phonenumber} setstep={setStep} />
      }
      {step === 2 && 
        <AccountCreated />
      }
    </div>
  )
}

export default Register
