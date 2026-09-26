import React, { useEffect, useState, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getBodyFeatures } from "@/utils/Request";

const Body = ({ step, setStep, model, setBody, colors, body = null }) => {
    const [features, setFeatures] = useState([]);

    // Fetch Features
    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetched = await getBodyFeatures(model);
                console.log("Fetched features:", fetched);
                setFeatures(Array.isArray(fetched) ? fetched : []);
            } catch {
                setFeatures([]);
            }
        };

        if (model) fetchData();
    }, [model]);

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
        <div>
            <div className='px-2 md:px-0 [&_*]:!font-["vazir"]'>
                <div dir='rtl' className='py-2 md:w-96  mx-auto'>

                    {/* Buttons */}
                    <div
                        dir='ltr'
                        className='justify-between w-full flex items-center'
                    >
                        <button
                            type="button"
                            className='btn btn-sm bg-primary text-white border-none'
                            onClick={formik.handleSubmit}
                        >
                            ادامه
                        </button>

                     
                    </div>

                    {/* Form */}
                    <form onSubmit={formik.handleSubmit} className='px-4'>

                        {features.map((feature) => {
                            const key = `field_${feature.FeatureId}`;

                            return (
                                <label
                                    key={feature.FeatureId}
                                    className="form-control w-full my-3"
                                >
                                    <div className="label">
                                        <span className="label-text">
                                            {feature.FeatureName}
                                        </span>
                                    </div>

                                    <select
                                        className="input focus:outline-primary border-none w-full bg-base-200 font-['vazir']"
                                        {...formik.getFieldProps(key)}
                                    >
                                        <option value="">
                                            انتخاب کنید
                                        </option>

                                        {feature.ChildrenFeatures?.map(
                                            (child) => (
                                                <option
                                                    key={child.FeatureId}
                                                    value={child.FeatureId}
                                                >
                                                    {child.FeatureName}
                                                </option>
                                            )
                                        )}
                                    </select>

                                    {formik.touched[key] &&
                                        formik.errors[key] && (
                                            <div className="text-red-500 text-sm pt-1">
                                                {formik.errors[key]}
                                            </div>
                                        )}
                                </label>
                            );
                        })}

                    </form>
                </div>
            </div>
        </div>
    );
};

export default Body;