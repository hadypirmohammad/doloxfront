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
import EditSteps from '@/components/EditAd/EditSteps';
import BodyTypePicker from '@/components/CreateAd/BodyTypePicker';
import { useBodyTypeItems } from '@/utils/services/bodyTypes';


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
    const currentFeatures = (ad.AdFeatures || []).map(featu => featu.FeatureId)
    const [body, setBody ] = useState([currentFeatures]);
    const [description, setDescription] = useState(ad.Description || '');
    const [kilometer, setKilometter] = useState(ad.Worked);
    const [price, setPrice] = useState(ad.Price);
    const [installments, setInstallments] = useState(false);
    const [rentororsale, setRentorsale] = useState(false);
    const [images, setImages] = useState([ad.CoverImage, ...(ad.AdImages || [])].filter(Boolean));
    const headBrandId = Number(ad?.Brand?.ParentBrand?.ParentId);
    const isTyped = [5, 6, 7].includes(headBrandId);
    const bodyTypes = useBodyTypeItems(headBrandId);
    const currentBodyTypeId = Number(ad?.BodyType ?? ad?.BodyTypeId) || null;
    const [bodyType, setBodyType] = useState(null);
    const selectedLabel = bodyType ?? bodyTypes.find((item) => item.bodyTypeId === currentBodyTypeId)?.label ?? null;
    const bodyTypeId = bodyTypes.find((item) => item.label === selectedLabel)?.bodyTypeId || null;


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
        <div className='min-h-screen w-full bg-[#FAFAFA] px-4 pb-10 pt-6 text-secondary md:pt-8'>
            <div className='mx-auto max-w-screen-sm rounded-3xl border border-[#F0F0F0] bg-white py-8 shadow-[0_8px_24px_rgba(36,59,83,0.05)] sm:py-10'>
                <h1 className='text-center text-xl font-bold text-secondary sm:text-2xl'>ویرایش آگهی</h1>
                <div className='flex items-center justify-center gap-1.5 pt-2.5'>
                    <span className='h-1 w-12 rounded-[3px] bg-primary' />
                    <span className='h-[5px] w-[5px] rounded-full bg-primary' />
                </div>
                {ad?.Title && <p dir='rtl' className="m-0 px-4 pt-3 text-center font-['vazir'] text-[13.5px] text-[#8B94A5]">{ad.Title}</p>}

                <EditSteps step={step} />

                <Body step={step} setStep={setStep} model={{ BrandId: ad.BrandId }} body={currentFeatures} setBody={setBody}>
                    {isTyped && (
                        <div className='pb-2'>
                            <BodyTypePicker headBrandId={headBrandId} value={selectedLabel} onChange={setBodyType} />
                        </div>
                    )}
                </Body>
                <Description step={step} setStep={setStep} description={description} kilometer={kilometer} setDescription={setDescription} setKilometer={setKilometter} />
                <Price step={step} setStep={setStep} Price={price} setPrice={setPrice} setInstallments={setInstallments} installments={installments} setRentorsale={setRentorsale} RentorSale={rentororsale} />
                <Images setStep={setStep} step={step} images={images} setImages={setImages} token={token} />
                <Confirm step={step} setStep={setStep} token={token} editData={{ body, description, kilometer, price, installments, rentororsale, images , ad, bodyType: isTyped ? bodyTypeId : null }} />
            </div>
        </div>
    )
}

export default Edit;