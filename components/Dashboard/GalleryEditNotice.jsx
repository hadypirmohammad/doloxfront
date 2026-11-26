import { editGallery } from '@/utils/Request';
import { serverMessage } from '@/utils/serverMessage';
import { resolveBackendMediaUrl } from '@/utils/media';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

const SUPPORT_NUMBERS = ['09139777207', '09130966206'];

const PhotoPicker = ({ label, hint, preview, onPick, onClear }) => {
  const input = useRef(null);

  return (
    <div className="flex flex-1 flex-col gap-2">
      <span className="text-[12.5px] font-bold text-[#1E2A3A]">{label}</span>
      <button
        type="button"
        onClick={() => input.current?.click()}
        className="relative flex h-[92px] w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-[#D6DAE2] bg-[#F6F7F9] transition-colors hover:border-primary"
      >
        {preview ? (
          <img src={preview} alt={label} className="h-full w-full object-cover" />
        ) : (
          <span className="flex flex-col items-center gap-1.5 text-[11.5px] text-[#8B94A5]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="14" rx="2.5" />
              <path d="M3 16l4.5-4.5 3.5 3 3-3.5L21 16" />
              <circle cx="8.5" cy="9.5" r="1.2" />
            </svg>
            {hint}
          </span>
        )}
      </button>
      {preview && (
        <button
          type="button"
          onClick={onClear}
          className="self-start text-[11.5px] font-semibold text-[#E03A3A] transition-opacity hover:opacity-70"
        >
          حذف انتخاب
        </button>
      )}
      <input
        ref={input}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = '';
          if (file) onPick(file);
        }}
      />
    </div>
  );
};

const GalleryEditNotice = ({ open, gallery, token, onClose }) => {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [cover, setCover] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) return;
    setProfile(null);
    setCover(null);
  }, [open]);

  useEffect(() => () => {
    if (profile?.url) URL.revokeObjectURL(profile.url);
    if (cover?.url) URL.revokeObjectURL(cover.url);
  }, [profile, cover]);

  if (!open) return null;

  const pick = (setter) => (file) => setter({ file, url: URL.createObjectURL(file) });

  const handleSave = async () => {
    if (!profile && !cover) return;
    setSaving(true);
    try {
      const result = await editGallery(
        token,
        gallery?.GalleryId,
        gallery?.Describe || '',
        gallery?.Adress || '',
        profile?.file || null,
        cover?.file || null,
        gallery?.GalleryType ?? null
      );
      const detail = await result.text().catch(() => '');
      const saved = (result.status === 200 || result.status === 201) && !/not found/i.test(detail);
      if (saved) {
        toast.success('تصاویر گالری به‌روز شد');
        onClose?.();
        router.reload();
      } else {
        console.error('EditGallery failed:', result.status, detail);
        toast.error(serverMessage(detail) || `به‌روزرسانی تصاویر انجام نشد (${result.status})`);
      }
    } catch (error) {
      console.error('EditGallery error:', error);
      toast.error(error?.message || 'به‌روزرسانی تصاویر انجام نشد');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      dir="rtl"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-[rgba(30,42,58,0.55)] p-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="gallery-edit-title"
        className="my-auto flex w-full max-w-[460px] flex-col gap-4 rounded-[18px] bg-white px-5 pb-5 pt-6 shadow-[0_20px_50px_rgba(30,42,58,0.25)] sm:px-[26px] sm:pb-6 sm:pt-7"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-[#FFF1E8] sm:h-16 sm:w-16">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF5E00" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
              <rect x="3.5" y="13.5" width="4" height="6" rx="1.5" />
              <rect x="16.5" y="13.5" width="4" height="6" rx="1.5" />
              <path d="M18.5 19.5c0 1.2-1.5 2-3.5 2h-2" />
            </svg>
          </span>

          <h2 id="gallery-edit-title" className="m-0 text-[16.5px] font-extrabold text-[#1E2A3A] sm:text-[19px]">
            برای ویرایش مشخصات، با پشتیبانی تماس بگیرید
          </h2>

          <p className="m-0 text-[13px] leading-[2] text-[#5B6575] sm:text-[14px]">
            نام گالری، شماره تماس، شهر و آدرس فقط توسط کارشناسان دولوکس تغییر می‌کند تا اعتبار گالری شما
            حفظ شود. برای ویرایش این موارد با یکی از شماره‌های زیر تماس بگیرید.
          </p>

          <div className="flex w-full flex-col gap-2">
            {SUPPORT_NUMBERS.map((number) => (
              <a
                key={number}
                href={`tel:${number}`}
                dir="ltr"
                className="flex min-h-[46px] items-center justify-center gap-2 rounded-xl border border-[#E6E8EC] bg-white text-[14px] font-bold text-[#1E2A3A] transition-colors hover:bg-[#F6F7F9]"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#FF5E00" strokeWidth="1.8" strokeLinejoin="round" className="flex-none">
                  <path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z" />
                </svg>
                {number}
              </a>
            ))}
          </div>
        </div>

        <div className="h-px bg-[#EEF0F4]" />

        <div className="flex flex-col gap-3">
          <p className="m-0 text-[13px] leading-[1.9] text-[#5B6575] sm:text-[13.5px]">
            تصاویر گالری را می‌توانید خودتان تغییر دهید.
          </p>

          <div className="flex gap-3">
            <PhotoPicker
              label="لوگو گالری"
              hint="انتخاب تصویر"
              preview={profile?.url || resolveBackendMediaUrl(gallery?.Profile, '')}
              onPick={pick(setProfile)}
              onClear={() => setProfile(null)}
            />
            <PhotoPicker
              label="تصویر بنر"
              hint="انتخاب تصویر"
              preview={cover?.url || resolveBackendMediaUrl(gallery?.Cover, '')}
              onPick={pick(setCover)}
              onClear={() => setCover(null)}
            />
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || (!profile && !cover)}
            className="min-h-[48px] w-full rounded-xl bg-gradient-orange text-[15px] font-bold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40 sm:min-h-[50px] sm:text-[16px]"
          >
            {saving ? 'در حال ذخیره…' : 'ذخیره تصاویر'}
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="min-h-[44px] w-full rounded-xl border border-[#E6E8EC] text-[14px] font-bold text-[#5B6575] transition-colors hover:bg-[#F6F7F9]"
        >
          بستن
        </button>
      </div>
    </div>
  );
};

export default GalleryEditNotice;
