import React, { useEffect, useState, useMemo, useRef } from "react";
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getBodyFeatures } from "@/utils/Request";
import EditStep from "./EditStep";

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

const Body = ({ step, setStep, model, setBody, colors, body = null, children }) => {
    const [features, setFeatures] = useState([]);
    const [openId, setOpenId] = useState(null);
    const listRef = useRef(null);

    // Fetch Features
    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetched = await getBodyFeatures(model);
                setFeatures(Array.isArray(fetched) ? fetched : []);
            } catch {
                setFeatures([]);
            }
        };

        if (model) fetchData();
    }, [model]);

    useEffect(() => {
        const handleOutside = (event) => {
            if (listRef.current && !listRef.current.contains(event.target)) setOpenId(null);
        };
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, []);

    // Build dynamic initialValues + validationSchema
    const { dynamicInitials, dynamicSchema } = useMemo(() => {
        const initials = {};
        const schema = {};

        features.forEach((feature) => {
            const key = `field_${feature.FeatureId}`;
            let selectedValue = "";

            // ✅ If body exists → find correct child for this feature
            if (body && Array.isArray(body)) {
                const found = body.find((id) =>
                    feature.ChildrenFeatures?.some(
                        (child) => child.FeatureId === id
                    )
                );

                if (found) selectedValue = String(found);
            }

            initials[key] = selectedValue;

            schema[key] = Yup.string().required(
                `${feature.FeatureName} را انتخاب کنید`
            );
        });

        return { dynamicInitials: initials, dynamicSchema: schema };
    }, [features, body]);

    const formik = useFormik({
        initialValues: dynamicInitials,
        enableReinitialize: true,
        validationSchema: Yup.object(dynamicSchema),

        onSubmit: (values) => {
            const selectedIds = Object.values(values).map((v) =>
                Number(v)
            );

            setBody(selectedIds); // only IDs
            setStep(2);
        },
    });

    if (step !== 1) return null;

    return (
        <EditStep
            title='بدنه و ویژگی‌ها'
            hint='اطلاعات دقیق‌تر باعث دیده شدن بهتر آگهی شما می‌شود.'
            onNext={formik.handleSubmit}
        >
            {children}

            <form onSubmit={formik.handleSubmit} ref={listRef} className='flex flex-col gap-2'>
                {features.map((feature) => {
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
                                <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='#8E9AAC' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' className={`flex-none transition-transform ${open ? 'rotate-180' : ''}`}>
                                    <path d='M6 9l6 6 6-6' />
                                </svg>
                                <span className='min-w-0 flex-1'>
                                    <span className='block text-[14.5px] font-bold text-secondary'>{feature.FeatureName}</span>
                                    <span className={`block pt-1 text-[13.5px] ${selected ? 'font-semibold text-[#42536B]' : 'text-[#A3ADBC]'}`}>
                                        {selected?.FeatureName || 'انتخاب کنید'}
                                    </span>
                                </span>
                                <span className='flex h-[42px] w-[42px] flex-none items-center justify-center rounded-[12px] bg-[#FFEDE3]'>
                                    <Image src={iconFor(feature.FeatureName)} alt='' width={128} height={128} className='h-[26px] w-[26px] object-contain' />
                                </span>
                            </div>

                            {open && (
                                <div className='mt-1.5 max-h-64 overflow-y-auto rounded-[14px] border border-[#EEF1F6] bg-white p-1.5 shadow-[0_8px_20px_rgba(20,36,63,.08)]'>
                                    {feature.ChildrenFeatures?.map((child) => (
                                        <div
                                            key={child.FeatureId}
                                            onClick={() => {
                                                formik.setFieldValue(key, String(child.FeatureId));
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
                                <div className='pt-1.5 text-sm text-red-500'>{formik.errors[key]}</div>
                            )}
                        </div>
                    );
                })}
            </form>
        </EditStep>
    );
};

export default Body;
