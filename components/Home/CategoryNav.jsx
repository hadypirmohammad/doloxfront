import Image from 'next/image';
import Link from 'next/link';

export const PASSENGER_HEAD_BRAND_ID = 0;
export const ALL_CATEGORY_ID = 0;

export const VEHICLE_CATEGORIES = [
  {
    id: 5,
    name: 'خودرو',
    image: '/media/images/savari.webp',
    width: 333,
    height: 237,
    imageClass: 'h-8 w-auto object-contain sm:h-12',
  },
  {
    id: 7,
    name: 'سنگین',
    image: '/media/images/kamion.webp',
    width: 333,
    height: 237,
    imageClass: 'h-8 w-auto object-contain sm:h-12',
  },
  {
    id: 6,
    name: 'موتور سیکلت',
    image: '/media/images/motorcycle.webp',
    width: 333,
    height: 237,
    imageClass: 'h-8 w-auto object-contain sm:h-12',
  },
];

export const HOME_CATEGORIES = [
  ...VEHICLE_CATEGORIES,
  {
    id: ALL_CATEGORY_ID,
    name: 'همه',
    image: '/media/images/vanet.webp',
    width: 333,
    height: 237,
    imageClass: 'h-8 w-auto object-contain sm:h-12',
  },
];

export const getCategoryQuery = (categoryId) =>
  categoryId === ALL_CATEGORY_ID
    ? { headBrandId: 'all' }
    : { headBrandId: categoryId };

const CategoryNav = () => {
  return (
    <section className="bg-[#FAFAFA] px-3 pt-4 sm:px-4 sm:pt-5">
      <div className="mx-auto grid max-w-screen-xl grid-cols-4 gap-2 sm:gap-4">
        {HOME_CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={{ pathname: '/ads', query: getCategoryQuery(cat.id) }}
            className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-[#F0F0F0] bg-white px-1 py-3 shadow-[0_6px_18px_rgba(36,59,83,0.05)] transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_10px_24px_rgba(255,94,0,0.12)] sm:gap-3 sm:px-4 sm:py-4"
          >
            <Image
              src={cat.image}
              alt={cat.name}
              width={cat.width}
              height={cat.height}
              unoptimized
              className={cat.imageClass}
            />
            <span className="whitespace-nowrap text-center text-[11px] font-bold text-secondary sm:text-[14px]">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryNav;
