import Address from '@/components/CreateAuto/Address';
import { useStepHistory } from '@/hooks/useStepHistory';
import CreateAutoStep from '@/components/CreateAuto/CreateAutoStep';
import GalleryImage from '@/components/CreateAuto/GalleryImage';
import GalleryInformation from '@/components/CreateAuto/Galleryinformation';
import { getToken, withAuth } from '@/utils/Auth';
import { createAutoGalleryreq } from '@/utils/Request';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export async function getServerSideProps(context) {
    const authResult = await withAuth(context);

    if (authResult.redirect) {
        return authResult;
    }
    const token = await getToken(context);

    return { props: { token: token || "" } }
}


const CrateAutoGallery = ({ user, token }) => {
    const router = useRouter()

    const [step, setStep] = useState(0)
    useStepHistory(step, setStep, { initialStep: 0, lastStep: 2 })
    const [description, setDescription] = useState("")
    const [name, setName] = useState("")
    const [address, setAddress] = useState("")
    const [coverImage, setCoverImage] = useState(null)
    const [profileImage, setProfileImage] = useState(null)

    const [loading, setLoading] = useState(false)


    useEffect(() => {
        const submitAd = async () => {
            if (step === 3) {
                try {
                    setLoading(true)

                    const result = await createAutoGalleryreq(
                        token,
                        name,
                        description,
                        address,
                        profileImage,
                        coverImage
                    );

                    if (result.status === 200 || result.status === 201) {
                        setStep(5)
                        toast.success('گالری ثبت شد !')
                        setTimeout(() => {
                            router.push("/dashboard")
                        }, 200);
                    } else {
                        setStep(4)
                    }
                } catch (error) {
                    console.error("Error creating gallery:", error);
                    setStep(4)
                } finally {
                    setLoading(false)
                }
            }
        };

        submitAd();
    }, [step]);

    return (
        <div className='min-h-screen w-full bg-[#FAFAFA] px-4 pb-10 pt-6 text-secondary md:pt-8'>
            <div className='mx-auto max-w-screen-sm rounded-3xl border border-[#F0F0F0] bg-white py-8 shadow-[0_8px_24px_rgba(36, 59, 83,0.05)] sm:py-10'>
                <h1 className='text-center text-xl text-secondary sm:text-2xl'>ثبت اتوگالری</h1>
                {(step !== 4) &&
                    <CreateAutoStep step={step} setStep={setStep} />
                }
                <GalleryInformation step={step} setStep={setStep} setDescription={setDescription} setName={setName} />
                <Address step={step} setStep={setStep} setAddress={setAddress} />
                <GalleryImage
                    step={step}
                    setStep={setStep}
                    setCoverImage={setCoverImage}
                    setImageProfile={setProfileImage}
                    coverImage={coverImage}
                    imageProfile={profileImage}
                />

                {step === 5 &&
                    <div>
                        <p className='px-8 text-center font-[vazir] py-36'>
                            اتوگالری شما با موفقیت ساخته شد
                        </p>
                    </div>
                }
                {step === 4 &&
                    <p className='px-8 text-center font-[vazir] py-36'>
                        اتوگالری شما ساخته نشد
                    </p>
                }
                {loading &&
                    <div className='w-full mx-auto  text-center pt-8'>
                        <p className='text-lg font-[vazir] w-full  mx-auto font-bold '>
                            در حال ساخت اتوگالری
                        </p>
                        <p className='text-sm font-[vazir] w-full  mx-auto  '>
                            لطفا صبر کنید
                        </p>
                        <span className="loading loading-ball loading-lg"></span>
                    </div>
                }
            </div>
        </div>
    )
}

export default CrateAutoGallery
