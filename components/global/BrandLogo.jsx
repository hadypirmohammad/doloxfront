import { resolveBackendMediaUrl } from '@/utils/media';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const BrandLogo = ({ src, name = '', size = 24, imageClassName = 'h-4 w-4', className = '' }) => {
  const url = src ? resolveBackendMediaUrl(src, '') : '';
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [url]);

  return (
    <span
      className={`flex flex-none items-center justify-center overflow-hidden rounded-full bg-[#F4F6F9] ${className}`}
      style={{ width: size, height: size }}
    >
      {url && !failed ? (
        <Image
          src={url}
          alt={name}
          width={size}
          height={size}
          className={`${imageClassName} object-contain`}
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="text-[11px] text-[#5B6575]">{String(name).trim().charAt(0)}</span>
      )}
    </span>
  );
};

export default BrandLogo;
