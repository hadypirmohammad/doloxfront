import React from 'react'
import { BackendURL } from '@/utils/URL';
import Image from 'next/image';

const VechicleCondition = (ad) => {
    const data= ad.ad;
    console.log("VechicleCondition: ",data);
  return (
      <div className="bg-white rounded-[15px] w-full h-fit p-6 mt-2  max-w-screen-sm">
          <h2 className="text-center pb-2">وضعیت {data.HeadBrand === 'سواری' ? 'خودرو' : data.HeadBrand}</h2>
         
         <div className="grid grid-cols-2 justify-center w-fit gap-2 mx-auto">
            <div className="relative border rounded-[7px] flex justify-center items-center text-center h-[46px] w-[145px] border-black mt-6">
            <div className="flex items-center px-2 -top-5 absolute bg-black text-white rounded-full w-5/6">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 16" fill="none">
                          <path d="M8.62236 11.5267C8.95726 11.8675 9.39442 12.0239 9.93382 11.996C10.4747 11.9674 10.8741 11.7732 11.1319 11.4136L16.9702 3.13161L8.78907 9.03065C8.42156 9.28248 8.21447 9.67266 8.16779 10.2012C8.12111 10.7297 8.27263 11.1715 8.62236 11.5267ZM2.33397 15.8333C2.12651 15.8333 1.93683 15.7802 1.76493 15.6739C1.59303 15.5668 1.4478 15.4213 1.32925 15.2373C0.890614 14.4675 0.559412 13.654 0.335647 12.7967C0.111882 11.9395 0 11.0667 0 10.1786C0 8.77317 0.263035 7.45147 0.789104 6.21345C1.31591 4.97544 2.02981 3.89839 2.9308 2.98232C3.83105 2.06474 4.88948 1.33829 6.10611 0.802976C7.32274 0.267659 8.62161 0 10.0027 0C11.3794 0 12.6705 0.263135 13.876 0.789405C15.0815 1.31567 16.1381 2.03232 17.0458 2.93935C17.9534 3.84637 18.6714 4.90833 19.1997 6.12524C19.728 7.34214 19.9947 8.65103 19.9999 10.0519C20.0036 10.9868 19.8947 11.895 19.6732 12.7764C19.4516 13.6578 19.1171 14.5071 18.6695 15.3244C18.5658 15.5084 18.4243 15.6392 18.245 15.7168C18.0664 15.7945 17.873 15.8333 17.6648 15.8333H2.33397Z" fill="white" />
                      </svg>
                      <span className="w-full py-1 text-sm">کارکرد</span>
            </div>
            <span className="font-[vazir] pt-1">{data.Worked}</span>
            </div>
            
              {data?.Features?.map((item,index)=>(

                <div key={index} className="relative border rounded-[7px] flex justify-center items-center text-center h-[46px] w-[145px] border-black mt-6">
            <div className="flex items-center px-2 -top-5 absolute bg-black text-white rounded-full w-5/6">
                          <Image className="w-[18px] height-[18px]" src={BackendURL.slice(0, -1) + item.FeatureIcon}  width="100" height="100"/>
                      <span className="w-full py-1 text-sm">{item.ParentFeatureName}</span>
            </div>
                      <span className="font-[vazir] pt-1">{item.FeatureName}</span>
            </div>
            ))}
            
       
            
        
            
             </div>
      </div>
  )
}

export default VechicleCondition