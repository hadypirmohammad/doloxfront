import { galleryCityLabel } from '@/utils/services/autoGalleries';
import { BackendURL } from '@/utils/URL';
import Image from 'next/image';
import Link from 'next/link';

const GalleryCard = ({ gallery }) => {
  const imageSrc = gallery?.Profile
    ? `${BackendURL.slice(0, -1)}${gallery.Profile}`
    : gallery?.logo || '/media/images/sampleautogallery.png';

  const name = gallery?.Name || gallery?.company_name || 'گالری';
  const city = galleryCityLabel(gallery);
  const href = gallery?.GalleryId ? `/autogallery/${gallery.GalleryId}` : '/autogallery';

  return (
    <Link
      href={href}
      className="flex w-[140px] shrink-0 flex-col items-center rounded-2xl border border-[#F2F2F2] bg-white px-3 py-4 shadow-[0_6px_18px_rgba(36, 59, 83,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(36, 59, 83,0.08)] sm:w-auto"
    >
      <div className="relative h-16 w-16 overflow-hidden rounded-full border border-[#F0F0F0] bg-base-300 sm:h-[72px] sm:w-[72px]">
        <Image src={imageSrc} alt={name} fill className="object-cover" sizes="72px" />
      </div>
      <h3 className="mt-3 line-clamp-1 text-center font-['vazir'] text-[13px] font-bold text-secondary sm:text-[14px]">
        {name}
      </h3>
      {city && <p className="mt-1 font-['vazir'] text-[12px] text-[#8A8A8A]">{city}</p>}
    </Link>
  );
};

export default GalleryCard;
