import Image from "next/image";

const GalleryImage = ({
  step,
  setStep,
  imageProfile,
  setImageProfile,
  coverImage,
  setCoverImage,
}) => {
  if (step !== 2) return null;

  const handleProfileUpload = (file) => {
    if (!file) return;
    setImageProfile(file);
  };

  const removeProfileImage = (e) => {
    e.stopPropagation();
    setImageProfile(null);
  };

  const handleCoverUpload = (file) => {
    if (!file) return;
    setCoverImage(file);
  };

  const removeCoverImage = (e) => {
    e.stopPropagation();
    setCoverImage(null);
  };

  return (
    <div className="px-2 md:px-0 [&_*]:!font-['vazir']">
      <div dir="rtl" className="py-2 md:max-w-lg mx-auto px-4">
        <div dir="ltr" className="flex justify-between items-center w-full mb-3">
          <button
            type="button"
            className="btn btn-sm bg-primary text-white border-none"
            onClick={() => setStep(3)}
          >
            ثبت گالری
          </button>

          <button
            type="button"
            className="btn-sm text-primary bg-transparent shadow-none border-none"
            onClick={() => setStep(step - 1)}
          >
            قبلی
          </button>
        </div>

        <h2 className="text-base-content mb-3">
          افزودن تصویر پروفایل و بنر اختیاری است
        </h2>

        <h3 className="mb-2 font-bold">عکس پروفایل</h3>

        <div className="h-32 border-dashed border border-base-content rounded-lg flex items-center justify-center bg-base-200 mb-6">
          <input
            type="file"
            accept="image/*"
            hidden
            id="profile-upload"
            onChange={(e) => handleProfileUpload(e.target.files[0])}
          />

          <label htmlFor="profile-upload" className="cursor-pointer">
            {imageProfile ? (
              <div className="relative">
                <Image
                  src={URL.createObjectURL(imageProfile)}
                  alt="Profile"
                  width={120}
                  height={120}
                  className="rounded-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeProfileImage}
                  className="absolute -top-2 -right-2 bg-base-200 rounded-full p-1"
                >
                  ✕
                </button>
              </div>
            ) : (
              <span>انتخاب عکس پروفایل (اختیاری)</span>
            )}
          </label>
        </div>

        <h3 className="mb-2 font-bold">بنر</h3>

        <div className="h-36 border-dashed border border-base-content rounded-lg flex items-center justify-center bg-base-200">
          <input
            type="file"
            accept="image/*"
            hidden
            id="cover-upload"
            onChange={(e) => handleCoverUpload(e.target.files[0])}
          />

          <label htmlFor="cover-upload" className="cursor-pointer w-full text-center">
            {coverImage ? (
              <div className="relative">
                <Image
                  src={URL.createObjectURL(coverImage)}
                  alt="Banner"
                  width={400}
                  height={200}
                  className="w-full h-36 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={removeCoverImage}
                  className="absolute -top-2 -right-2 bg-base-200 rounded-full p-1"
                >
                  ✕
                </button>
              </div>
            ) : (
              <span>انتخاب بنر (اختیاری)</span>
            )}
          </label>
        </div>

        <p className="mt-3 text-sm">
          {!imageProfile && !coverImage
            ? "می‌توانید بدون تصویر ادامه دهید یا بعداً آن‌ها را اضافه کنید."
            : imageProfile && coverImage
              ? "هر دو تصویر با موفقیت انتخاب شدند."
              : "تصاویر انتخاب‌شده ذخیره خواهند شد."}
        </p>
      </div>
    </div>
  );
};

export default GalleryImage;
