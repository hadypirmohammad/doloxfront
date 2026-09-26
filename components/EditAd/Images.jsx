import { removeImageReq } from '@/utils/Request';
import { BackendURL } from '@/utils/URL';
import Image from 'next/image';
import React, { useState } from 'react';

const Images = ({ step, setStep, images, setImages, token }) => {
    const [selectedImageToDelete, setSelectedImageToDelete] = useState(null);

    const handleImageUpload = (files) => {
        if (files.length + images.length > 6) {
            alert("You can only upload a maximum of 6 images.");
            return;
        }
        setImages(prev => [...prev, ...Array.from(files)]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleImageUpload(e.dataTransfer.files);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const getImageSrc = (image) => {
        if (typeof image === 'string') return `${BackendURL}${image}`; // backend URL
        if (image instanceof File) return URL.createObjectURL(image); // new file
        if (image.ImageLink) return `${BackendURL}${image.ImageLink}`; // backend object
        return '';
    };

    const setCoverImage = (image) => {
        setImages(prev => [image, ...prev.filter(img => img !== image)]);
    };

    const confirmDelete = (e, image, index) => {
        e.stopPropagation();

        if (index === 0) {
            alert("کاور را نمی‌توانید حذف کنید، فقط می‌توانید جایگزین کنید.");
            return;
        }

        // differentiate backend vs newly added
        const isBackendImage = typeof image === 'string' || image?.ImageLink;

        if (!isBackendImage) {
            alert("این تصویر تازه اضافه شده و قابل حذف نیست، فقط می‌توانید کاور آن را تغییر دهید.");
            return;
        }

        setSelectedImageToDelete(image);
    };

    const removeImage = async () => {
        if (!selectedImageToDelete) return;

        try {

            const id = selectedImageToDelete.AdImageId; // use backend id if available
            if (id) {
                await removeImageReq(token, id);
            }
            setImages(prev => prev.filter(img => img !== selectedImageToDelete));
        } catch (err) {
            console.error(err);
            alert("حذف عکس با مشکل مواجه شد.");
        } finally {
            setSelectedImageToDelete(null);
        }
    };

    if (step !== 4) return null;

    return (
        <div className='px-2 md:px-0 [&_*]:!font-["vazir"]'>
            <div dir='rtl' className='py-2 md:w-96 mx-auto px-4'>
                <div dir='ltr' className='justify-between w-full flex items-center '>
                    <button
                        type='submit'
                        className='btn btn-sm bg-primary text-white border-none'
                        disabled={images.length < 1}
                        onClick={() => setStep(5)}
                    >
                        ادامه
                    </button>
                    <button
                        className='btn-sm text-primary bg-transparent shadow-none border-none'
                        onClick={() => setStep(step - 1)}
                    >
                        <span className='font-[vazir] font-bold'>قبلی</span>
                    </button>
                </div>

                <h2 className='text-base-content mt-2'>در آپلود عکس دقت کنید؛ تصاویر جذاب‌تر بازدید آگهی شما را افزایش می‌دهند.</h2>

                <div
                    className='h-36 border-dashed flex items-center bg-base-200 border-base-content border rounded-[8px] justify-center mt-2'
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    <input
                        type="file"
                        accept="image/png, image/jpeg"
                        multiple
                        onChange={(e) => handleImageUpload(e.target.files)}
                        id="file-upload"
                        style={{ display: 'none' }}
                       

                    />
                    <label htmlFor="file-upload" className="cursor-pointer flex items-center">
                        <span>برای آپلود عکس ها را اینجا رها کنید</span>
                    </label>
                </div>

                <div className='grid grid-cols-3 gap-2 mt-2'>
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className={`relative rounded-[10px] ${index === 0 ? "shadow-secondary shadow-lg border-secondary border-4" : ""}`}
                            onClick={() => setCoverImage(image)}
                        >
                            <Image
                                className='h-36 w-full object-cover rounded'
                                src={getImageSrc(image)}
                                alt={`Uploaded Image ${index + 1}`}
                                width={100}
                                height={100}
                            />
                            <button
                                onClick={(e) => confirmDelete(e, image, index)}
                                className="absolute -top-2 -right-2 bg-base-200 rounded-full flex items-center justify-center p-2"
                            >
                                ❌
                            </button>
                            {index === 0 && (
                                <div className='absolute bottom-0 w-full text-white bg-[#00000090] p-1 text-center'>
                                    کاور
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <p className='mt-2'>
                    {images.length < 1
                        ? "حداقل یک تصویر انتخاب کنید."
                        : images.length > 6
                            ? "حداکثر 6 تصویر می‌توانید انتخاب کنید."
                            : `${images.length} تصویر انتخاب شده.`}
                </p>
            </div>

            {/* Delete Modal */}
            {selectedImageToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg w-80">
                        <h3 className="text-lg font-bold mb-4">حذف تصویر</h3>
                        <p className="mb-4">آیا از حذف این تصویر مطمئن هستید؟ این کار قابل بازگشت نیست.</p>
                        <div className="flex justify-end gap-2">
                            <button
                                className="btn btn-sm bg-gray-300"
                                onClick={() => setSelectedImageToDelete(null)}
                            >
                                لغو
                            </button>
                            <button
                                className="btn btn-sm bg-red-500 text-white"
                                onClick={removeImage}
                            >
                                حذف
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Images;