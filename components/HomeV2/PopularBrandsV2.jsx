import AllBrandsModal from '@/components/HomeV2/AllBrandsModal';
import { resolveBackendMediaUrl } from '@/utils/media';
import SectionShell from '@/components/HomeV2/SectionShell';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useState } from 'react';

const VISIBLE = 8;

const PopularBrandsV2 = ({ brands = [] }) => {
  const items = brands.filter((brand) => brand?.Image);
  const [showAll, setShowAll] = useState(false);
  const closeAll = useCallback(() => setShowAll(false), []);
  if (!items.length) return null;

  return (
    <SectionShell title="برندهای محبوب" onAction={items.length > VISIBLE ? () => setShowAll(true) : undefined}>
      <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
        {items.slice(0, VISIBLE).map((brand) => (
          <Link
            key={brand.BrandId}
            href={{ pathname: '/ads', query: { headBrandId: brand.headBrandId || 5, brandId: brand.BrandId } }}
            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-[#E9ECF1] bg-white px-2 py-3.5 transition-colors hover:border-primary/50 hover:bg-[#FFFBF8] sm:py-4"
          >
            <span className="relative h-7 w-full sm:h-8">
              <Image
                src={resolveBackendMediaUrl(brand.Image, '')}
                alt={brand.Name || ''}
                fill
                sizes="90px"
                className="object-contain"
              />
            </span>
            <span className="font-soft w-full truncate text-center text-[11.5px] text-secondary sm:text-[12.5px]">{brand.Name}</span>
          </Link>
        ))}
      </div>

      {showAll && <AllBrandsModal brands={items} onClose={closeAll} />}
    </SectionShell>
  );
};

export default PopularBrandsV2;
