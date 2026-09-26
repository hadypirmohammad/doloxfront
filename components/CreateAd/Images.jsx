import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toPersianDigits } from "@/utils/Cal";

const MAX_IMAGES = 6;

const Images = ({ step, setStep, images, setImages }) => {
    const [processing, setProcessing] = useState(false);

    const compressImage = async (file, quality = 0.75, maxWidth = 1280) => {
        if (typeof window === "undefined") return null;

        const bitmap = await createImageBitmap(file);

        const scale = Math.min(maxWidth / bitmap.width, 1);

        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width * scale;
        canvas.height = bitmap.height * scale;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

        return new Promise((resolve) => {
            canvas.toBlob(
                (blob) => {
                    const compressed = new File(
                        [blob],
                        file.name.replace(/\.[^/.]+$/, ".jpg"),
                        { type: "image/jpeg" }
                    );
                    resolve(compressed);
                },
                "image/jpeg",
                quality
            );
        });
    };

    const handleImageUpload = async (files) => {
        if (processing) return;

        const fileArray = Array.from(files);

        if (fileArray.length + images.length > MAX_IMAGES) {
            alert("حداکثر 6 تصویر مجاز است.");
            return;
        }

        setProcessing(true);

        try {
            const compressedFiles = await Promise.all(
                fileArray.map(async (file) => {
                    if (file.size > 15 * 1024 * 1024) {
                        throw new Error("image too large");
                    }
                    return compressImage(file);
                })
            );

            const newImages = compressedFiles.map((file) => ({
                file,
                preview: URL.createObjectURL(file),
            }));

            setImages((prev) => [...prev, ...newImages]);
        } catch (err) {
            alert("حجم تصویر خیلی بزرگ است.");
        }

        setProcessing(false);
    };

    const removeImage = (e, image) => {
        e.stopPropagation();
        URL.revokeObjectURL(image.preview);

        setImages((prev) =>
            prev.filter((img) => img.preview !== image.preview)
        );
    };

    const setCoverImage = (image) => {
        setImages((prev) => {
            const filtered = prev.filter((img) => img.preview !== image.preview);
            return [image, ...filtered];
        });
    };

    const handleDrop = (e) => {
        e.preventDefault();
        handleImageUpload(e.dataTransfer.files);
    };

    useEffect(() => {
        return () => {
            images.forEach((img) => URL.revokeObjectURL(img.preview));
        };
    }, [images]);

    if (step !== 6) return null;

    const emptySlots = Math.max(4 - images.length, 0);

    return (
        <div dir="rtl" className="px-4 pt-5 sm:px-5 [&_*]:!font-['vazir']">
            <div className="mx-auto max-w-xl rounded-[20px] border border-[#EEF1F6] bg-white p-4 shadow-[0_2px_10px_rgba(20,36,63,.04)] sm:p-5">
                <div className="flex flex-row-reverse items-center justify-between gap-3">
                    <button
                        type="button"
                        disabled={!images.length}
                        onClick={() => setStep(7)}
                        className={`flex flex-row-reverse items-center gap-2 rounded-xl px-4 py-2.5 text-[12.5px] font-bold text-white transition-opacity ${
                            images.length ? 'bg-gradient-orange' : 'cursor-not-allowed bg-[#F1B392]'
                        }`}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        ادامه
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="h-5 w-[3px] rounded-[3px] bg-primary" />
                        <h2 className="m-0 text-[17px] font-bold text-secondary">تصاویر آگهی</h2>
                    </div>
                </div>

                <p className="m-0 py-3 text-[13px] text-[#98A2B3]">تصاویر جذاب‌تر بازدید آگهی شما را افزایش می‌دهند.</p>

                <div
                    className="relative flex flex-col items-center gap-3.5 rounded-[18px] bg-[#F7F9FC] px-4 py-8"
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                >
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="absolute inset-0 cursor-pointer opacity-0"
                        onChange={(e) => handleImageUpload(e.target.files)}
                    />
                    <span className="flex h-24 w-24 items-center justify-center rounded-full bg-[#FFEDE3] text-primary">
                        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.5 13V7.5a2.5 2.5 0 0 0-2.5-2.5H6a2.5 2.5 0 0 0-2.5 2.5v9A2.5 2.5 0 0 0 6 19h7" />
                            <circle cx="9" cy="10" r="1.6" />
                            <path d="m4.5 16.5 4.5-4.5 3 2.5" />
                            <path d="M17.5 15.5v6M20.5 18.5h-6" />
                        </svg>
                    </span>
                    <p className="m-0 text-[16.5px] font-bold text-secondary">
                        {processing ? 'در حال پردازش...' : 'برای آپلود عکس لمس کنید'}
                    </p>
                    <p className="m-0 text-center text-[13px] text-[#98A2B3]">یا فایل‌ها را از گالری انتخاب و اینجا رها کنید</p>
                </div>

                <div className="mt-3.5 flex flex-row-reverse items-center gap-3 rounded-[14px] bg-[#F1F4F9] p-3.5">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#9AA6B8" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
                        <path d="M12 3 5 6v6c0 4 3 7.3 7 9 4-1.7 7-5 7-9V6z" />
                        <path d="m9 12 2 2 4-4" />
                    </svg>
                    <p className="m-0 flex-1 text-[12.5px] leading-[2] text-[#98A2B3]">
                        عکس‌ها باید واضح ، بدون لوگو و متعلق به خودتان باشند. حداکثر حجم هر تصویر ۵ مگابایت و فرمت مجاز JPG, PNG می‌باشد.
                    </p>
                </div>

                <div className="mt-3.5 rounded-[18px] border border-[#EEF1F6] p-3.5">
                    <div className="flex items-center gap-2 pb-3">
                        <span className="h-[18px] w-[3px] rounded-[3px] bg-primary" />
                        <h3 className="m-0 text-[15px] font-bold text-secondary">
                            {!images.length ? 'حداقل یک تصویر انتخاب کنید' : `${toPersianDigits(images.length)} تصویر انتخاب شده`}
                        </h3>
                    </div>

                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                        {images.map((image, index) => (
                            <div
                                key={image.preview}
                                onClick={() => setCoverImage(image)}
                                className={`relative aspect-square cursor-pointer overflow-hidden rounded-xl border ${
                                    index === 0 ? 'border-[1.5px] border-primary' : 'border-[#E7EBF1]'
                                }`}
                            >
                                <Image
                                    src={image.preview}
                                    alt=""
                                    width={200}
                                    height={200}
                                    priority={index === 0}
                                    className="h-full w-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={(e) => removeImage(e, image)}
                                    className="absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-xs text-secondary shadow"
                                >
                                    ✕
                                </button>
                                {index === 0 && (
                                    <span className="absolute bottom-0 w-full bg-black/60 py-1 text-center text-[10.5px] font-semibold text-white">
                                        کاور
                                    </span>
                                )}
                            </div>
                        ))}

                        {images.length < MAX_IMAGES && (
                            <label className="relative flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-[#E7EBF1] bg-[#F1F4F9] text-[#7C879A]">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="absolute inset-0 cursor-pointer opacity-0"
                                    onChange={(e) => handleImageUpload(e.target.files)}
                                />
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                                    <path d="M12 5v14M5 12h14" />
                                </svg>
                                <span className="text-[10.5px] font-semibold">افزودن عکس</span>
                            </label>
                        )}

                        {Array.from({ length: emptySlots }).map((_, index) => (
                            <span
                                key={index}
                                className="flex aspect-square items-center justify-center rounded-xl border-[1.5px] border-dashed border-[#DCE3EC] text-[#C3CBD7]"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3.5" y="5" width="17" height="14" rx="2.5" />
                                    <circle cx="9" cy="10" r="1.5" />
                                    <path d="M4.5 16.5 9 12l3 2.5 3.5-3 4 4.5" />
                                </svg>
                            </span>
                        ))}
                    </div>
                </div>

                <div className="mt-3.5 flex flex-row-reverse items-start gap-2.5 rounded-[14px] bg-[#FFF3EA] p-3.5">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F5A25F" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
                        <path d="M9 18h6M10 21h4" />
                        <path d="M12 3a6 6 0 0 0-3.5 10.9c.4.3.5.8.5 1.1h6c0-.3.1-.8.5-1.1A6 6 0 0 0 12 3z" />
                    </svg>
                    <div className="flex-1">
                        <p className="m-0 text-[12.5px] font-bold text-primary">نکته:</p>
                        <p className="m-0 pt-1 text-[12.5px] text-[#8B94A5]">
                            هرچه تصاویر شما بیشتر و با کیفیت‌تر باشد، احتمال فروش سریع‌تر آگهی شما بیشتر می‌شود.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mx-auto mt-4 flex max-w-xl gap-3">
                <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="flex flex-1 items-center justify-center gap-2.5 rounded-2xl border border-[#E7EBF1] bg-white py-3.5 text-[14.5px] font-bold text-secondary"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                    مرحله قبل
                </button>
                <button
                    type="button"
                    disabled={!images.length}
                    onClick={() => setStep(7)}
                    className={`flex flex-1 flex-row-reverse items-center justify-center gap-2.5 rounded-2xl py-3.5 text-[14.5px] font-bold text-white transition-opacity ${
                        images.length ? 'bg-gradient-orange' : 'cursor-not-allowed bg-[#F1B392]'
                    }`}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    مرحله بعد
                </button>
            </div>
        </div>
    );
};

export default Images;
