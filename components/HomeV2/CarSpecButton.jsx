import { useCarSpecLink } from '@/utils/services/carSpecLinks';

const CarSpecButton = ({ item }) => {
  const { loading, link } = useCarSpecLink(item);

  if (link) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="font-soft flex h-9 items-center justify-center rounded-xl border border-[#E6E8EC] bg-white text-[12.5px] text-secondary hover:border-primary/40"
      >
        مشخصات فنی
      </a>
    );
  }

  return (
    <span
      aria-disabled="true"
      title={loading ? '' : 'مشخصات فنی این خودرو هنوز در وبلاگ منتشر نشده است'}
      className="font-soft flex h-9 cursor-default items-center justify-center rounded-xl border border-[#EEF0F4] bg-[#F7F8FA] text-[12.5px] text-[#A7AEBA]"
    >
      {loading ? <span className="loading loading-spinner loading-xs" /> : 'مشخصات فنی به‌زودی'}
    </span>
  );
};

export default CarSpecButton;
