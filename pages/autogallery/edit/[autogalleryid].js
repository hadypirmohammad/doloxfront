import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import Image from "next/image";

import { getToken } from "@/utils/Auth";
import { getAutogalleriesByid, editGallery } from "@/utils/Request";
import { BackendURL } from "@/utils/URL";

import toast from 'react-hot-toast'
import { useRouter } from 'next/router';


export async function getServerSideProps(context) {
    const { autogalleryid } = context.params;

    const token = await getToken(context);
    const current = await getAutogalleriesByid(autogalleryid);

    return {
        props: {
            autogallery: current || {},
            token: token || null,
        },
    };
}

const AutogalleryEdit = ({ autogallery, token }) => {
    const router = useRouter()

    const [profilePreview, setProfilePreview] = useState(
        autogallery?.Profile
            ? `${BackendURL}${autogallery.Profile}`
            : null
    );

    const [coverPreview, setCoverPreview] = useState(
        autogallery?.Cover
            ? `${BackendURL}${autogallery.Cover}`
            : null
    );

    const [profileDragging, setProfileDragging] =
        useState(false);

    const [coverDragging, setCoverDragging] =
        useState(false);

    return (
        <div className="mx-auto w-full bg-[#FAFAFA] p-6 pt-6 md:pt-8">
            <div className="bg-white rounded-xl shadow p-6 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">
                    ویرایش نمایشگاه
                    <span className="px-4">
                        {autogallery.Name}
                    </span>
                </h1>

                <Formik
                    enableReinitialize
                    initialValues={{
                        GalleryId:
                            autogallery?.GalleryId || "",
                        Describe:
                            autogallery?.Describe || "",
                        Adress:
                            autogallery?.Adress || "",
                        Profile: null,
                        Cover: null,
                    }}
                    onSubmit={async (
                        values,
                        { setSubmitting }
                    ) => {
                        try {
                            await editGallery(
                                token,
                                values.GalleryId,
                                values.Describe,
                                values.Adress,
                                values.Profile,
                                values.Cover
                            );

                            
                            toast.success('اطلاعات با موفقیت ثبت شد!')
                            setTimeout(() => {
                                router.push("/dashboard/auto")
                            }, 200);
                      

                        } catch (error) {
                            toast.success('خطا در ذخیره اطلاعات')

                        }

                        setSubmitting(false);
                    }}
                >
                    {({
                        setFieldValue,
                        isSubmitting,
                    }) => (
                        <Form className="space-y-6">
                            <div>
                                <label className="block mb-2 font-medium">
                                    توضیحات
                                </label>

                                <Field
                                    as="textarea"
                                    rows={5}
                                    name="Describe"
                                    className="w-full bg-white border rounded-lg p-3 focus:outline-none focus:ring"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 font-medium">
                                    آدرس
                                </label>

                                <Field
                                    name="Adress"
                                    className="w-full  bg-white border rounded-lg p-3 focus:outline-none focus:ring "
                                />
                            </div>


                            {/* Profile Upload */}
                            <div>
                                <label className="block mb-2 font-medium">
                                    تصویر پروفایل
                                </label>

                                {profilePreview && (
                                    <div className="mb-3">
                                        <Image
                                            src={
                                                profilePreview
                                            }
                                            alt="profile"
                                            width={150}
                                            height={150}
                                            className="rounded-lg object-cover"
                                        />
                                    </div>
                                )}

                                <div
                                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${profileDragging
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-gray-300"
                                        }`}
                                    onClick={() =>
                                        document
                                            .getElementById(
                                                "profile-upload"
                                            )
                                            ?.click()
                                    }
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setProfileDragging(
                                            true
                                        );
                                    }}
                                    onDragLeave={() =>
                                        setProfileDragging(
                                            false
                                        )
                                    }
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        setProfileDragging(
                                            false
                                        );

                                        const file =
                                            e.dataTransfer
                                                .files?.[0];

                                        if (
                                            !file ||
                                            !file.type.startsWith(
                                                "image/"
                                            )
                                        )
                                            return;

                                        setFieldValue(
                                            "Profile",
                                            file
                                        );

                                        setProfilePreview(
                                            URL.createObjectURL(
                                                file
                                            )
                                        );
                                    }}
                                >
                                    <p className="font-medium">
                                        عکس را اینجا رها
                                        کنید
                                    </p>

                                    <p className="text-sm text-gray-500 mt-1">
                                        یا برای انتخاب فایل
                                        کلیک کنید
                                    </p>

                                    <input
                                        id="profile-upload"
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={(e) => {
                                            const file =
                                                e
                                                    .currentTarget
                                                    .files?.[0];

                                            if (
                                                !file
                                            )
                                                return;

                                            setFieldValue(
                                                "Profile",
                                                file
                                            );

                                            setProfilePreview(
                                                URL.createObjectURL(
                                                    file
                                                )
                                            );
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Cover Upload */}
                            <div>
                                <label className="block mb-2 font-medium">
                                    تصویر کاور
                                </label>

                                {coverPreview && (
                                    <div className="mb-3">
                                        <Image
                                            src={
                                                coverPreview
                                            }
                                            alt="cover"
                                            width={300}
                                            height={150}
                                            className="rounded-lg object-cover"
                                        />
                                    </div>
                                )}

                                <div
                                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${coverDragging
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-gray-300"
                                        }`}
                                    onClick={() =>
                                        document
                                            .getElementById(
                                                "cover-upload"
                                            )
                                            ?.click()
                                    }
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setCoverDragging(
                                            true
                                        );
                                    }}
                                    onDragLeave={() =>
                                        setCoverDragging(
                                            false
                                        )
                                    }
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        setCoverDragging(
                                            false
                                        );

                                        const file =
                                            e.dataTransfer
                                                .files?.[0];

                                        if (
                                            !file ||
                                            !file.type.startsWith(
                                                "image/"
                                            )
                                        )
                                            return;

                                        setFieldValue(
                                            "Cover",
                                            file
                                        );

                                        setCoverPreview(
                                            URL.createObjectURL(
                                                file
                                            )
                                        );
                                    }}
                                >
                                    <p className="font-medium">
                                        عکس را اینجا رها
                                        کنید
                                    </p>

                                    <p className="text-sm text-gray-500 mt-1">
                                        یا برای انتخاب فایل
                                        کلیک کنید
                                    </p>

                                    <input
                                        id="cover-upload"
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={(e) => {
                                            const file =
                                                e
                                                    .currentTarget
                                                    .files?.[0];

                                            if (
                                                !file
                                            )
                                                return;

                                            setFieldValue(
                                                "Cover",
                                                file
                                            );

                                            setCoverPreview(
                                                URL.createObjectURL(
                                                    file
                                                )
                                            );
                                        }}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-primary hover:bg-secondary text-white px-6 py-3 rounded-lg transition"
                            >
                                {isSubmitting
                                    ? "در حال ذخیره..."
                                    : "ذخیره تغییرات"}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default AutogalleryEdit;