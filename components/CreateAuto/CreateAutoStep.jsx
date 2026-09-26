import React from 'react'

const CreateAutoStep = ({ step }) => {
  return (
      <div className='mx-auto flex w-full justify-center gap-4 px-2 pt-4 text-center text-sm text-[#8B8B8B] md:text-base'>
          <span className={`${step === 0 ? "text-primary underline underline-offset-8" : ""} cursor-pointer`} >مشخصات </span>
          <span className={`${step === 1 ? "text-primary underline underline-offset-8" : ""} cursor-pointer`} >آدرس</span>
          <span className={`${step === 2 ? "text-primary underline underline-offset-8" : ""} cursor-pointer`} >تصاویر</span>
      </div>
  )
}

export default CreateAutoStep
