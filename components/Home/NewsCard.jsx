import { convertToShamsiAndGregorian } from '@/utils/Cal';
import Image from 'next/image';
import Link from 'next/link';

const NewsCard = ({ blog }) => {
  const date = convertToShamsiAndGregorian(blog?.date || new Date());
  const image =
    blog?.image ||
    blog?.yoast_head_json?.og_image?.[0]?.url ||
    '/media/images/sampleblog.png';
  const title = blog?.title?.rendered || blog?.title || 'خبر';
  const href = blog?.link || 'https://blog.dolox.ir';
  const shamsi =
    date.shamsi?.year != null
      ? `${date.shamsi.year}/${date.shamsi.month}/${date.shamsi.day}`
      : '';

  return (
    <Link
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      className="block w-full overflow-hidden rounded-2xl border border-[#F2F2F2] bg-white shadow-[0_6px_20px_rgba(36, 59, 83,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(36, 59, 83,0.1)]"
    >
      <div className="relative h-[150px] w-full bg-base-300 sm:h-[160px]">
        <Image src={image} alt={title} fill className="object-cover" sizes="(max-width:1024px) 100vw, 25vw" />
      </div>
      <div className="p-3.5 text-right sm:p-4">
        <h3
          className="line-clamp-2 min-h-[40px] font-['vazir'] text-[13px] font-bold text-secondary sm:min-h-[44px] sm:text-[14px]"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        {shamsi && (
          <p className="mt-3 flex items-center justify-end gap-1.5 font-['vazir'] text-[12px] text-[#8A8A8A]">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 20 21" fill="none">
              <path d="M2 7.8C2 6.29 2 5.54 2.47 5.07C2.94 4.6 3.69 4.6 5.2 4.6H14.8C16.31 4.6 17.06 4.6 17.53 5.07C18 5.54 18 6.29 18 7.8C18 8.18 18 8.37 17.88 8.48C17.77 8.6 17.58 8.6 17.2 8.6H2.8C2.42 8.6 2.23 8.6 2.12 8.48C2 8.37 2 8.18 2 7.8ZM2 15C2 16.51 2 17.26 2.47 17.73C2.94 18.2 3.69 18.2 5.2 18.2H14.8C16.31 18.2 17.06 18.2 17.53 17.73C18 17.26 18 16.51 18 15V11C18 10.62 18 10.43 17.88 10.32C17.77 10.2 17.58 10.2 17.2 10.2H2.8C2.42 10.2 2.23 10.2 2.12 10.32C2 10.43 2 10.62 2 11V15Z" fill="#8A8A8A" />
              <path d="M6 3V5.4M14 3V5.4" stroke="#8A8A8A" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>{shamsi}</span>
          </p>
        )}
      </div>
    </Link>
  );
};

export default NewsCard;
