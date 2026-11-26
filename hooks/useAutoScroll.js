import { useEffect, useRef } from 'react';

export const useAutoScroll = ({ interval = 2600, pause = 5000, resetKey } = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    element.scrollTo({ left: 0 });
    let resumeAt = 0;
    const hold = () => {
      resumeAt = Date.now() + pause;
    };

    element.addEventListener('touchstart', hold, { passive: true });
    element.addEventListener('pointerdown', hold);
    element.addEventListener('wheel', hold, { passive: true });

    const timer = setInterval(() => {
      if (Date.now() < resumeAt || document.hidden) return;
      const max = element.scrollWidth - element.clientWidth;
      if (max < 8) return;

      const first = element.firstElementChild;
      const gap = parseFloat(getComputedStyle(element).columnGap) || 0;
      const step = first ? first.getBoundingClientRect().width + gap : element.clientWidth / 3;
      const rtl = getComputedStyle(element).direction === 'rtl';

      if (Math.abs(element.scrollLeft) >= max - 4) {
        element.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        element.scrollBy({ left: rtl ? -step : step, behavior: 'smooth' });
      }
    }, interval);

    return () => {
      clearInterval(timer);
      element.removeEventListener('touchstart', hold);
      element.removeEventListener('pointerdown', hold);
      element.removeEventListener('wheel', hold);
    };
  }, [interval, pause, resetKey]);

  return ref;
};
