import { removeImageReq } from '@/utils/Request';
import { BackendURL } from '@/utils/URL';
import Image from 'next/image';
import React, { useState } from 'react';
import EditStep from './EditStep';

const Images = ({ step, setStep, images, setImages, token }) => {
    const [selectedImageToDelete, setSelectedImageToDelete] = useState(null);

    const handleImageUpload = (files) => {
        if (files.length + images.length > 6) {
            alert("حداکثر ۶ تصویر می‌توانید بارگذاری کنید.");
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
        <>
            <EditStep
                title='تصاویر'
                hint='تصاویر جذاب‌تر بازدید آگهی شما را افزایش می‌دهند. روی هر تصویر بزنید تا کاور شود.'
                onPrev={() => setStep(step - 1)}
                onNext={() => setStep(5)}
                nextDisabled={images.length < 1}
            >
                <div
                    className='flex h-36 items-center justify-center rounded-[16px] border-2 border-dashed border-[#F5C7A9] bg-[#FFF8F3]'
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    <input
                        type='file'
                        accept='image/png, image/jpeg'
                        multiple
                        onChange={(e) => handleImageUpload(e.target.files)}
                        id='file-upload'
                        style={{ display: 'none' }}
                    />
                    <label htmlFor='file-upload' className='flex cursor-pointer flex-col items-center gap-2 text-center'>
                        <span className='flex h-11 w-11 items-center justify-center rounded-full bg-[#FFEDE3] text-primary'>
                            <svg width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.9' strokeLinecap='round' strokeLinejoin='round'>
                                <path d='M12 16V4M7 9l5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3' />
                            </svg>
                        </span>
                        <span className='text-[13.5px] font-bold text-secondary'>افزودن تصویر</span>
                        <span className='text-[12px] text-[#8B94A5]'>یا تصاویر را اینجا رها کنید</span>
                    </label>
                </div>

                <div className='mt-3 grid grid-cols-3 gap-2'>
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className={`relative cursor-pointer overflow-hidden rounded-[12px] border-2 ${index === 0 ? 'border-primary' : 'border-transparent'}`}
                            onClick={() => setCoverImage(image)}
                        >
                            <Image
                                className='h-28 w-full object-cover'
                                src={getImageSrc(image)}
                                alt=''
                                width={160}
                                height={112}
                            />
                            {index !== 0 && (
                                <button
                                    type='button'
                                    onClick={(e) => confirmDelete(e, image, index)}
                                    aria-label='حذف تصویر'
                                    className='absolute left-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/55 text-white'
                                >
                                    <svg width='12' height='12' viewBox='0 0 14 14' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round'>
                                        <path d='M2 2l10 10M12 2 2 12' />
                                    </svg>
                                </button>
                            )}
                            {index === 0 && (
                                <div className='absolute bottom-0 w-full bg-primary/90 py-1 text-center text-[12px] text-white'>
                                    کاور
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <p className='m-0 pt-3 text-[12.5px] text-[#8B94A5]'>
                    {images.length < 1
                        ? "حداقل یک تصویر انتخاب کنید."
                        : images.length > 6
                            ? "حداکثر ۶ تصویر می‌توانید انتخاب کنید."
                            : `${images.length.toLocaleString('fa-IR')} تصویر انتخاب شده`}
                </p>
            </EditStep>

            {/* Delete Modal */}
            {selectedImageToDelete && (
                <div dir='rtl' className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 [&_*]:!font-["vazir"]'>
                    <div className='w-full max-w-sm rounded-[20px] bg-white p-5 text-center'>
                        <h3 className='m-0 text-[16px] font-bold text-secondary'>حذف تصویر</h3>
                        <p className='m-0 pt-2 text-[13px] leading-[2] text-[#8B94A5]'>آیا از حذف این تصویر مطمئن هستید؟ این کار قابل بازگشت نیست.</p>
                        <div className='flex gap-2.5 pt-5'>
                            <button
                                type='button'
                                className='flex-1 rounded-2xl border border-[#E7EBF1] bg-white py-3 text-[14px] font-bold text-secondary'
                                onClick={() => setSelectedImageToDelete(null)}
                            >
                                لغو
                            </button>
                            <button
                                type='button'
                                className='flex-1 rounded-2xl bg-[#E03A3A] py-3 text-[14px] font-bold text-white'
                                onClick={removeImage}
                            >
                                حذف
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Images;
