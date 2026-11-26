import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getBodyFeatures } from "@/utils/Request";
import BodyTypePicker from "./BodyTypePicker";

const TYPED_CATEGORIES = [5, 6, 7];

const featureOrder = ['رنگ', 'داخل کابین', 'وضعیت بدنه', 'سلامت بدنه'];

const featureIcons = {
    'داخل کابین': 'cabin',
    'رنگ': 'color',
    'سلامت بدنه': 'heavybody',
    'وضعیت بدنه': 'body',
    'سلامت موتور': 'engine',
    'نوع سوخت': 'fuel',
    'سلامت شاسی': 'chassis',
    'گیربکس': 'gearbox',
};

const iconFor = (name) => {
    const key = Object.keys(featureIcons).find((item) => String(name || '').includes(item));
    return `/media/images/features/${featureIcons[key] || 'body'}.webp`;
};

const Body = ({ step, setStep, model, setBody, setBodyLabels, colors, category, bodyType, setBodyType }) => {

    const needsBodyType = TYPED_CATEGORIES.includes(Number(category?.BrandId));
    const [bodyTypeError, setBodyTypeError] = useState('');
    const [features, setFeatures] = useState([]);
    const [openId, setOpenId] = useState(null);
    const listRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!model?.BrandId) return;
            try {
                const fetched = await getBodyFeatures(model);
                setFeatures(Array.isArray(fetched) ? fetched : []);
            } catch {
                setFeatures([]);
            }
        };
        fetchData();
    }, [model]);

    const sortedFeatures = useMemo(() => {
        const rank = (name) => {
            const index = featureOrder.findIndex((item) => String(name || '').includes(item));
            return index === -1 ? featureOrder.length : index;
        };
        return [...features].sort((a, b) => rank(a.FeatureName) - rank(b.FeatureName));
    }, [features]);

    useEffect(() => {
        const handleOutside = (event) => {
            if (listRef.current && !listRef.current.contains(event.target)) setOpenId(null);
        };
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, []);

    // داینامیک کردن initialValues و schema
    const dynamicInitials = {};
    const dynamicSchema = {};

    features.forEach(f => {
        const key = `field_${f.FeatureId}`;
        dynamicInitials[key] = "";
        dynamicSchema[key] = Yup.string().required(`${f.FeatureName} را انتخاب کنید`);
    });

    const formik = useFormik({
        initialValues: dynamicInitials,
        enableReinitialize: true,
        validationSchema: Yup.object(dynamicSchema),

        onSubmit: (values) => {
            if (needsBodyType && !bodyType) {
                setBodyTypeError('نوع را انتخاب کنید');
                return;
            }
            const selectedIds = Object.values(values).map(v => Number(v));

            setBody(selectedIds); // خروجی فقط id ها
            setBodyLabels?.(
                features.map((feature) => ({
                    name: feature.FeatureName,
                    value: feature.ChildrenFeatures?.find(
                        (child) => String(child.FeatureId) === String(values[`field_${feature.FeatureId}`])
                    )?.FeatureName || '',
                }))
            );
            setStep(4);
        }
    });

    if (step !== 3) return null;

    return (
        <div dir='rtl' className='px-4 pt-5 sm:px-5 [&_*]:!font-["vazir"]'>
            <div className='mx-auto max-w-xl rounded-[20px] border border-[#EEF1F6] bg-white p-4 shadow-[0_2px_10px_rgba(20,36,63,.05)] sm:p-5'>
                <div className='flex items-center gap-2'>
                    <span className='h-5 w-[3px] rounded-[3px] bg-primary' />
                    <h2 className='m-0 text-[17px] font-bold text-secondary'>بدنه و ویژگی‌ها</h2>
                </div>
                <p className='m-0 py-3 text-[13px] text-[#98A2B3]'>اطلاعات دقیق‌تر باعث دیده شدن بهتر آگهی شما می‌شود.</p>

                {needsBodyType && (
                    <BodyTypePicker
                        headBrandId={Number(category?.BrandId)}
                        value={bodyType}
                        onChange={(id) => {
                            setBodyType?.(id);
                            setBodyTypeError('');
                        }}
                        error={bodyTypeError}
                    />
                )}

                {sortedFeatures.length === 0 ? (
                    <p className="py-10 text-center font-['vazir'] text-sm text-[#8A8A8A]">ویژگی‌ای برای این خودرو ثبت نشده است</p>
                ) : (
                    <form onSubmit={formik.handleSubmit} ref={listRef} className='flex flex-col gap-2'>
                        {sortedFeatures.map((feature) => {
                            const key = `field_${feature.FeatureId}`;
                            const open = openId === feature.FeatureId;
                            const selected = feature.ChildrenFeatures?.find(
                                (child) => String(child.FeatureId) === String(formik.values[key])
                            );
                            return (
                                <div key={feature.FeatureId}>
                                    <div
                                        onClick={() => setOpenId(open ? null : feature.FeatureId)}
                                        className='flex cursor-pointer flex-row-reverse items-center gap-3 rounded-[14px] bg-[linear-gradient(270deg,#FFF6F1,#FCFDFE_70%)] px-3.5 py-3'
                                    >
                                        <svg
                                            width='18'
                                            height='18'
                                            viewBox='0 0 24 24'
                                            fill='none'
                                            stroke='#8E9AAC'
                                            strokeWidth='1.8'
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            className={`flex-none transition-transform ${open ? 'rotate-180' : ''}`}
                                        >
                                            <path d='M6 9l6 6 6-6' />
                                        </svg>
                                        <span className='min-w-0 flex-1'>
                                            <span className='block text-[14.5px] font-bold text-secondary'>{feature.FeatureName}</span>
                                            <span className={`block pt-1 text-[13.5px] ${selected ? 'font-semibold text-[#42536B]' : 'text-[#A3ADBC]'}`}>
                                                {selected?.FeatureName || 'انتخاب کنید'}
                                            </span>
                                        </span>
                                        <span className='flex h-[42px] w-[42px] flex-none items-center justify-center rounded-[12px] bg-[#FFEDE3]'>
                                            <Image
                                                src={iconFor(feature.FeatureName)}
                                                alt=''
                                                width={128}
                                                height={128}
                                                className='h-[26px] w-[26px] object-contain'
                                            />
                                        </span>
                                    </div>

                                    {open && (
                                        <div className='mt-1.5 max-h-64 overflow-y-auto rounded-[14px] border border-[#EEF1F6] bg-white p-1.5 shadow-[0_8px_20px_rgba(20,36,63,.08)]'>
                                            {feature.ChildrenFeatures?.map(child => (
                                                <div
                                                    key={child.FeatureId}
                                                    onClick={() => {
                                                        formik.setFieldValue(key, String(child.FeatureId)); // ⬅ فقط ID ذخیره می‌شود
                                                        setOpenId(null);
                                                    }}
                                                    className={`cursor-pointer rounded-[10px] px-3.5 py-2.5 text-[14px] ${
                                                        String(formik.values[key]) === String(child.FeatureId)
                                                            ? 'bg-[#FFF3EA] font-bold text-primary'
                                                            : 'text-[#42536B] hover:bg-[#F7F9FC]'
                                                    }`}
                                                >
                                                    {child.FeatureName}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {formik.touched[key] && formik.errors[key] && (
                                        <div className="pt-1.5 text-sm text-red-500">{formik.errors[key]}</div>
                                    )}
                                </div>
                            );
                        })}
                    </form>
                )}
            </div>

            <div className='mx-auto mt-4 flex max-w-xl gap-3'>
                <button
                    type='button'
                    onClick={() => setStep(2)}
                    className='flex flex-1 items-center justify-center gap-2.5 rounded-2xl border border-[#E7EBF1] bg-white py-3.5 text-[14.5px] font-bold text-secondary'
                >
                    <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                        <path d='M5 12h14M12 5l7 7-7 7' />
                    </svg>
                    مرحله قبل
                </button>
                <button
                    type='button'
                    onClick={formik.handleSubmit}
                    className='flex flex-1 flex-row-reverse items-center justify-center gap-2.5 rounded-2xl bg-gradient-orange py-3.5 text-[14.5px] font-bold text-white'
                >
                    <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                        <path d='M19 12H5M12 19l-7-7 7-7' />
                    </svg>
                    مرحله بعد
                </button>
            </div>
        </div>
    );
};

export default Body;
