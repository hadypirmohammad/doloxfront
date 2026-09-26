import DashboardPanel from '@/components/global/DashboardPanel'
import { useStepHistory } from '@/hooks/useStepHistory';
import { getToken, withAuth } from '@/utils/Auth';
import { getProfile, getUser, updateUserProfile, getCities, getMyads, deleteAd  , getSpecifics} from '@/utils/Request';
import React, { useState } from 'react'
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import { BackendURL } from '@/utils/URL';
import Link from 'next/link';
import Body from '@/components/EditAd/Body';
import Description from '@/components/EditAd/Description';
import Price from '@/components/EditAd/Price';
import Images from '@/components/EditAd/Images';
import Confirm from '@/components/EditAd/Confirm';


export async function getServerSideProps(context) {
    const authResult = await withAuth(context);
    if (authResult.redirect) {
        return authResult;
    }

    const token = await getToken(context);
    const { adid } = context.params;
    const currentad = await getSpecifics(token, adid);
    
    const cities = await getCities(token);

    return {
        props: {
            cities: cities || [],
            ad: currentad || {},
            token: token || null
        },
    };
}

const Edit = ({ cities, ad, token, user }) => {
    // console.log(ad)
    const router = useRouter();
    // console.log(ad);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [step, setStep ] = useState(1);
    useStepHistory(step, setStep, { initialStep: 1, lastStep: 5 });
    const currentFeatures = ad.AdFeatures.map(featu => featu.FeatureId)
    const [body, setBody ] = useState([currentFeatures]);
    const [description, setDescription] = useState(ad.Description);
    const [kilometer, setKilometter] = useState(ad.Worked);
    const [price, setPrice] = useState(ad.Price);
    const [installments, setInstallments] = useState(false);
    const [rentororsale, setRentorsale] = useState(false);
    const [images, setImages] = useState([ad.CoverImage,...ad.AdImages]);


    // console.log(currentFeatures)
    const handleDelete = async () => {
        try {
            setDeleting(true);

            await deleteAd(token, ad.AdId);

            toast.success("آگهی با موفقیت حذف شد");

            setShowDeleteModal(false);

            router.push("/dashboard");

        } catch (error) {
            // console.log(error);
            toast.error("خطا در حذف آگهی");
        } finally {
        setDeleting(false);
        }
    };

    return (
        <div className='flex h-fit w-full justify-start bg-[#FAFAFA] px-4 pb-10 pt-6 md:pt-8'>

            <DashboardPanel user={user} />

            <div className=' h-full w-full px-4 justify-start gap-2 flex md:flex-row flex-col'>

                <div className=' bg-white md:max-w-xl max-w-screen-lg h-fit rounded-[34px] p-8 flex flex-col'>
                    <p>ویرایش اگهی </p>
                    <Body step={step} setStep={setStep} model={{ BrandId: ad.BrandId }} body={currentFeatures} setBody={setBody}  />
                    <Description step={step} setStep={setStep} description={description} kilometer={kilometer} setDescription={setDescription} setKilometer={setKilometter}  /> 
                    <Price step={step} setStep={setStep} Price={price} setPrice={setPrice} setInstallments={setInstallments} installments={installments} setRentorsale={setRentorsale} RentorSale={rentororsale} />
                    <Images setStep={setStep} step={step} images={images} setImages={setImages} token={token} />
                    <Confirm step={step} setStep={setStep} token={token} editData={{ body, description, kilometer, price, installments, rentororsale, images , ad }} />
                </div>

            </div>

        
        </div>
    )
}

export default Edit;