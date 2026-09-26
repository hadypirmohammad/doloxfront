import React from 'react'

const DescriptionDetail = ({ad}) => {
        const data = ad
      
  return (
      <div className="bg-white rounded-[15px] w-full h-fit p-6 mt-2">
          <h2>توضیحات</h2>
          <p className="font-[vazir] pt-1">
              {data.Description}
              
          </p>
          <div className=" flex items-center  gap-1 pt-1">
            {data.IsRent && 
              <div className="text-secondary rounded-full px-2 py-1 text-sm font-[vazir] font-bold border-secondary border">اجاره ای</div>
            }
        {data.IsGest && 
              <div className="text-secondary rounded-full px-2 py-1 text-sm font-[vazir] font-bold border-secondary border">اقساطی</div>
            }
            
          </div>
    </div>
  )
}

export default DescriptionDetail