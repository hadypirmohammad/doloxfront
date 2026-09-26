import Body from '@/components/CreateAd/Body';
import AdSummary from '@/components/CreateAd/AdSummary';
import Brands from '@/components/CreateAd/Brands';
import CreateAdSteps from '@/components/CreateAd/CreateAdSteps';
import Description from '@/components/CreateAd/Description';
import Images from '@/components/CreateAd/Images';
import Location from '@/components/CreateAd/Location';
import Models from '@/components/CreateAd/Models';
import Package from '@/components/CreateAd/Package';
import Price from '@/components/CreateAd/Price';
import Year from '@/components/CreateAd/Year';
import { getToken, withAuth } from '@/utils/Auth';
import { AdImages, checkAds, createAdReq, getBrands, getBrandCategory, getColors } from '@/utils/Request';
import { useRouter } from 'next/router';
import { useStepHistory } from '@/hooks/useStepHistory';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export async function getServerSideProps(context) {
    // Use the withAuth function to check authentication
    const authResult = await withAuth(context);

    // If the user is not authenticated, they will be redirected
    if (authResult.redirect) {
        return authResult;
    }
    const token = await getToken(context);
    // const adable = await checkAds(token)
    const adable = {}

    try {

        const brandsCategory = await getBrandCategory()
        const categoryBrands = await Promise.all(
            brandsCategory.map((cat) => getBrands(cat.BrandId, 1).catch(() => null))
        );
        const brandsByCategory = Object.fromEntries(
            brandsCategory
                .map((cat, index) => [cat.BrandId, categoryBrands[index]])
                .filter(([, list]) => Array.isArray(list))
        );
        const brands = brandsByCategory[brandsCategory[0].BrandId] || [];
        // console.log(brandsCategory[0].BrandId)
        // console.log(brands)
      
        // const colorsdata = await getColors();
        // const colors = colorsdata["results"];
        const colors = []
        //   const colorsdata =  
        return { props: { brands, brandsByCategory, colors, token: token || "", adable, brandsCategory } }; // Pass the ads data to the page component as props
    } catch (error) {
        return { props: { brands: [], brandsByCategory: {}, colors: [], token: "", adable: {}, brandsCategory: [] } }; // Handle error or empty state
    }
  
}

const Createad = ({ brands, brandsByCategory = {}, colors, token, adable, user, brandsCategory }) => {
    const router = useRouter()

    const [step, setStep] = useState(0);//default0 
    useStepHistory(step, setStep, { initialStep: 0, lastStep: 8 });
    const [category, setCategory] = useState(brandsCategory[0]);

    const [brand, setBrand] = useState(null);
    const [model, setModel] = useState(null);
    const [year, setYear] = useState(null);
    const [body, setBody] = useState(null);
    const [bodyLabels, setBodyLabels] = useState([]);
    const [kilometer, setKilometer] = useState(null);
    const [description, setDescription] = useState(null);
    const [wheelnumber, setWheelNumber] = useState("");
    const [weight, setWeight] = useState("");
    const [maxweight, setMaxweight] = useState("");
    const [price,setPrice] = useState(null); // if was null me negotiable 
    const [installments, setInstallments] = useState(false); // pay montly or something
    const [rentorsale, setRentorsale] = useState("sale"); 
    const [images,setImages] = useState([])
    const [city,setCity] = useState("")
    const [packagePlan, setPackagePlan] = useState(-1)
    const [chatEnabled, setChatEnabled] = useState(true)

    const [loading, setLoading] = useState(false)
    // console.log(brands)
    useEffect(() => {
        // console.log(brand)
    }, [brand]);

    useEffect(() => {
        // getBrandCategory()
        // getBrands(1, 1);
        const submitAd = async () => {
            
            if (step === 9) {
                try {
                    let galleryid = -1
                     const { gl } = router.query
                     galleryid = gl
                    setLoading(true)
                    const result = await createAdReq(token, brand, model, year, body, description, kilometer, price, installments, rentorsale, city, images , packagePlan , galleryid, chatEnabled);
                    
                    if (result.status === 200 || result.status === 201) {
                            setStep(10)
                            // toast.success('اطلاعات با موفقیت ثبت شد!')
                            // console.log(result)
                            const paylink = await result.text();
                            if(paylink.includes("zibal")){
                            toast.success('در حال انتقال به صفحه پرداخت')
                                setTimeout(() => {
                                    // console.log(paylink)
                                    router.push(paylink)
                                   
                            }, 200);
                            }else{
                            toast.success('اطلاعات با موفقیت ثبت شد!')
                            setTimeout(() => {
                                router.push("/dashboard")
                            }, 200);
                            }
                          
                    } else {
                        setStep(11)
                    }
                } catch (error) {
                    // Handle the error
                    console.error("Error creating ad:", error);
                }
            }
        };

        submitAd();
    }, [step]);

    return (
        <div className='min-h-screen w-full bg-[#FAFAFA] px-4 pb-10 pt-6 text-secondary md:pt-8'>
            <div className='mx-auto max-w-screen-sm rounded-3xl border border-[#F0F0F0] bg-white py-8 shadow-[0_8px_24px_rgba(36, 59, 83,0.05)] sm:py-10'>
                <h1 className='text-center text-xl font-bold text-secondary sm:text-2xl'>ثبت آگهی</h1>
                <div className='flex items-center justify-center gap-1.5 pt-2.5'>
                    <span className='h-1 w-12 rounded-[3px] bg-primary' />
                    <span className='h-[5px] w-[5px] rounded-full bg-primary' />
                </div>
                {/* steps */}
                {(step !== 9 || adable.success) &&
                <CreateAdSteps step={step} setStep={setStep} category={category} />
                }
                {(step !== 9 || adable.success) &&
                <AdSummary step={step} setStep={setStep} brand={brand} model={model} year={year} bodyLabels={bodyLabels} price={price} />
                }

                <Brands brands={brands} brandsByCategory={brandsByCategory} setBrand={setBrand} setStep={setStep} step={step} category={category} setCategory={setCategory} categories={brandsCategory} />
                <Models setStep={setStep} step={step} setModel={setModel} brand={brand} />
                <Year setStep={setStep} step={step} setYear={setYear} model={model} />
                <Body setStep={setStep} step={step} colors={colors} setBody={setBody} setBodyLabels={setBodyLabels} model={model} />
                <Description setStep={setStep} step={step} setKilometer={setKilometer} setDescription={setDescription} category={category} setWheelnumber={setWheelNumber} setWeight={setWeight} setMaxweight={ setMaxweight } chatEnabled={chatEnabled} setChatEnabled={setChatEnabled} />
                <Price setStep={setStep} step={step} setInstallments={setInstallments} setPrice={setPrice} setRentorsale={setRentorsale} />
                <Images setStep={setStep} step={step} images={images} setImages={setImages} />
                <Location setStep={setStep} step={step} setCity={setCity} />
                <Package setStep={setStep} step={step} setPackage={setPackagePlan} />

                {step === 10 &&
                    <div>
                        <p className='px-8 text-center font-[vazir] py-36'>
                        اگهی شما با موفقیت ساخته شد
                        </p>
                    </div>
                }
                {step === 11 &&
                    <p className='px-8 text-center font-[vazir] py-36'>
                        اگهی شما ساخته نشد
                    </p>
                }
                {loading && step !== 11 &&
                    <div className='w-full mx-auto  text-center pt-8'>
                        <p className='text-lg font-[vazir] w-full  mx-auto font-bold '>
                        در حال ساخت اگهی 
                        </p>
                        <p className='text-sm font-[vazir] w-full  mx-auto  '>
                            لطفا صبر کنید
                        </p>
                       
                        <svg className="mx-auto" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path class="spinner_0XTQ mx-auto" d="M12,23a9.63,9.63,0,0,1-8-9.5,9.51,9.51,0,0,1,6.79-9.1A1.66,1.66,0,0,0,12,2.81h0a1.67,1.67,0,0,0-1.94-1.64A11,11,0,0,0,12,23Z"/></svg>
                        
                </div>
                }

                {/* user can't submit Ad */}
                {!adable.success && <p className='px-8 text-center font-[vazir] py-36'>
                    { adable.message }
                </p>}
            </div>
        </div>
    )
}

export default Createad
