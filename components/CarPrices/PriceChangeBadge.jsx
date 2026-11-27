import { formatPercentText } from '@/utils/carPrices';

const TONES = {
  increase: 'bg-[#16A34A]/12 text-[#0F9D58]',
  decrease: 'bg-[#EF4444]/12 text-[#E02424]',
  new: 'bg-[#2563EB]/12 text-[#2563EB]',
};

const DARK_TONE = 'bg-white/20 text-white';

/* Small colored badge showing the price change direction.
 * Supported directions: increase | decrease | new */
const PriceChangeBadge = ({ direction, percentText, onDark = false }) => {
  if (direction !== 'increase' && direction !== 'decrease' && direction !== 'new') return null;

  const label =
    direction === 'new'
      ? 'جدید'
      : formatPercentText(percentText) || (direction === 'increase' ? 'افزایش' : 'کاهش');

  return (
    <span
      className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold ${
        onDark ? DARK_TONE : TONES[direction]
      }`}
    >
      {direction !== 'new' && (
        <svg width="9" height="9" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
          <path d={direction === 'increase' ? 'M6 2.2L10.2 9H1.8z' : 'M6 9.8L1.8 3h8.4z'} />
        </svg>
      )}
      <span dir="ltr">{label}</span>
    </span>
  );
};

export default PriceChangeBadge;
