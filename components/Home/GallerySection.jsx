import Link from 'next/link';
import GalleryCard from './GalleryCard';

const GallerySection = ({ galleries = [] }) => {
  if (!galleries?.length) return null;

  return (
    <section className="bg-[#FAFAFA] px-3 py-8 sm:px-4 sm:py-10">
      <div className="mx-auto max-w-screen-xl">
        <div className="mb-4 flex items-center justify-between sm:mb-6">
          <h2 className="text-lg text-secondary sm:text-2xl">آخرین اتوگالری ها</h2>
          <Link href="/autogallery" className="font-['vazir'] text-sm text-primary">
            مشاهده همه
          </Link>
        </div>

        <div className="hidden gap-4 lg:grid lg:grid-cols-5">
          {galleries.slice(0, 5).map((gallery, index) => (
            <GalleryCard key={gallery.GalleryId || index} gallery={gallery} />
          ))}
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 lg:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {galleries.slice(0, 8).map((gallery, index) => (
            <GalleryCard key={gallery.GalleryId || index} gallery={gallery} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
