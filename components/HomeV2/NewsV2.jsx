import { convertToShamsiAndGregorian, toPersianDigits } from '@/utils/Cal';
import Image from 'next/image';
import Link from 'next/link';

const FALLBACK = '/media/images/sampleblog.png';

const readMinutes = (blog) => {
  const text = String(blog?.content?.rendered || blog?.excerpt?.rendered || '');
  const words = text.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).length;
  return Math.max(2, Math.round(words / 180));
};

const shape = (blog) => {
  const date = convertToShamsiAndGregorian(blog?.date || new Date());
  const href = blog?.link || 'https://blog.dolox.ir';
  return {
    key: blog?.id ?? href,
    title: blog?.title?.rendered || blog?.title || 'خبر',
    image: blog?.image || blog?.yoast_head_json?.og_image?.[0]?.url || FALLBACK,
    href,
    minutes: readMinutes(blog),
    shamsi:
      date.shamsi?.year != null
        ? toPersianDigits(`${date.shamsi.year}/${date.shamsi.month}/${date.shamsi.day}`)
        : '',
  };
};

const Meta = ({ item }) => (
  <span className="flex items-center gap-2 text-[11.5px] text-[#8B94A5] sm:text-[12.5px]">
    {item.shamsi}
    <span className="h-1 w-1 rounded-full bg-[#CBD2DC]" />
    {toPersianDigits(item.minutes)} دقیقه مطالعه
  </span>
);

const NewsV2 = ({ blogs = [] }) => {
  const items = blogs.slice(0, 4).map(shape);
  if (!items.length) return null;

  return (
    <>
      <div className="flex flex-col divide-y divide-[#E6E8EC] sm:hidden">
        {items.map((item) => (
          <Link key={item.key} href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 py-3">
            <span className="relative h-[74px] w-[74px] flex-none overflow-hidden rounded-2xl bg-[#EEF1F5]">
              <Image src={item.image} alt="" fill sizes="74px" className="object-cover" />
            </span>

            <span className="flex min-w-0 flex-1 flex-col gap-1.5">
              <span className="line-clamp-2 text-[13.5px] leading-[1.8] text-secondary">{item.title}</span>
              <Meta item={item} />
            </span>
          </Link>
        ))}
      </div>

      <div className="hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col overflow-hidden rounded-2xl border border-white/70 bg-white/70 transition-all hover:-translate-y-1 hover:border-primary/40 hover:bg-white"
          >
            <span className="relative block aspect-[16/10] w-full overflow-hidden bg-[#EEF1F5]">
              <Image
                src={item.image}
                alt=""
                fill
                sizes="(max-width:1024px) 50vw, 280px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </span>

            <span className="flex flex-1 flex-col gap-2 p-3.5">
              <span className="line-clamp-2 min-h-[48px] text-[14px] leading-[1.8] text-secondary transition-colors group-hover:text-primary">
                {item.title}
              </span>
              <span className="mt-auto flex items-center justify-between gap-2 border-t border-[#EEF0F4] pt-2.5">
                <Meta item={item} />
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C2410C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
                  <path d="M14 6l-6 6 6 6" />
                </svg>
              </span>
            </span>
          </Link>
        ))}
      </div>
    </>
  );
};

export default NewsV2;
