const GalleryBadgeNotice = ({ tone }) => {
  if (tone !== 'gold' && tone !== 'orange') return null;

  const gold = tone === 'gold';

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border p-3.5 sm:gap-3.5 sm:px-5 sm:py-[18px] ${
        gold ? 'border-[#F3D88E] bg-[#FFF9EA]' : 'border-[#FFC9A3] bg-[#FFF4EC]'
      }`}
    >
      <span
        className={`flex h-11 w-11 flex-none items-center justify-center rounded-xl sm:h-12 sm:w-12 ${
          gold ? 'bg-[#FFEFC2]' : 'bg-[#FFE2CC]'
        }`}
      >
        {gold ? (
          <svg width="28" height="28" viewBox="0 0 24 24">
            <path
              d="M3 8l4.5 3.5L12 5l4.5 6.5L21 8l-2 10H5z"
              fill="#E4A500"
              stroke="#B07D00"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="14" r="1.6" fill="#FFF4D0" />
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24">
            <path d="M12 2.5l7.5 3v6c0 4.8-3.2 8.6-7.5 10-4.3-1.4-7.5-5.2-7.5-10v-6z" fill="#FF5E00" />
            <path
              d="M8.3 12.2l2.6 2.6 4.9-5"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>

      <div className="flex min-w-0 flex-col gap-1">
        <strong className="font-soft text-[13.5px] text-[#1E2A3A] sm:text-[16px]">
          {gold ? 'گالری شما دارای نشان معتبر طلایی دولوکس است' : 'گالری شما تأیید هویت شده است'}
        </strong>
        <span className="text-[11.5px] leading-[1.8] text-[#5B6575] sm:text-[13px]">
          {gold
            ? 'و از اعتماد ویژه کاربران برخوردار می‌شود.'
            : 'و با نشان نارنجی، اعتماد کاربران را جلب می‌کند.'}
        </span>
      </div>
    </div>
  );
};

export default GalleryBadgeNotice;
