import SectionShell from '@/components/HomeV2/SectionShell';
import { useAutoScroll } from '@/hooks/useAutoScroll';
import { bodyTypeItems } from '@/utils/services/bodyTypes';
import { vehicleTypeSet } from '@/utils/services/vehicleTypes';
import Image from 'next/image';
import Link from 'next/link';

const VehicleTypesV2 = ({ headBrandId = 5, bodyTypes = [], connect = true }) => {
  const set = vehicleTypeSet(headBrandId);
  const items = bodyTypeItems(headBrandId, bodyTypes);
  const rowRef = useAutoScroll({ resetKey: headBrandId });
  if (!items.length) return null;

  const centered = items.length < 9;
  const rowClass = centered
    ? '-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:justify-center sm:gap-3 sm:overflow-visible sm:px-4 lg:gap-5 lg:px-8'
    : '-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-5 sm:gap-3 sm:overflow-visible sm:px-0 lg:grid-cols-9';
  const itemClass = centered
    ? 'group flex w-[86px] flex-none flex-col items-center gap-1 rounded-2xl px-1 py-2 transition-colors hover:bg-white/60 sm:w-[112px] lg:w-[120px]'
    : 'group flex w-[86px] flex-none flex-col items-center gap-1 rounded-2xl px-1 py-2 transition-colors hover:bg-white/60 sm:w-auto';

  return (
    <SectionShell title={set.heading} connect={connect}>
      <div ref={rowRef} className={rowClass}>
        {items.map((type) => {
          return (
            <Link
              key={type.label}
              href={{ pathname: '/ads', query: { headBrandId, ...(type.bodyTypeId ? { bodyTypeId: type.bodyTypeId } : {}) } }}
              className={itemClass}
            >
              <span className="relative aspect-[2/1] w-full">
                <Image
                  src={type.image}
                  alt={type.label}
                  fill
                  sizes="(max-width:640px) 86px, 130px"
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </span>
              <span className="font-soft text-[11.5px] text-secondary transition-colors group-hover:text-primary sm:text-[12.5px]">
                {type.label}
              </span>
            </Link>
          );
        })}
      </div>
    </SectionShell>
  );
};

export default VehicleTypesV2;
