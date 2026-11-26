export const VEHICLE_TYPES = {
  5: {
    label: 'خودرو',
    heading: 'خرید خودرو بر اساس نوع',
    items: [
      { label: 'سدان', image: '/media/images/body-sedan.webp', bodyTypeId: 1 },
      { label: 'شاسی بلند', image: '/media/images/body-suv.webp', bodyTypeId: 2 },
      { label: 'کوپه', image: '/media/images/body-coupe.webp', bodyTypeId: 3 },
      { label: 'کروک', image: '/media/images/body-convertible.webp', bodyTypeId: 4 },
      { label: 'کراس‌اوور', image: '/media/images/body-crossover.webp', bodyTypeId: 5 },
      { label: 'هاچ‌بک', image: '/media/images/body-hatchback.webp', bodyTypeId: 6 },
      { label: 'وانت', image: '/media/images/body-pickup.webp', bodyTypeId: 7 },
      { label: 'ون', image: '/media/images/body-van.webp', bodyTypeId: 8 },
      { label: 'کلاسیک', image: '/media/images/body-classic.webp', bodyTypeId: 9 },
    ],
  },
  6: {
    label: 'موتورسیکلت',
    heading: 'خرید موتورسیکلت بر اساس نوع',
    items: [
      { label: 'استریت', image: '/media/images/moto-street.webp' },
      { label: 'اسکوتر', image: '/media/images/moto-scooter.webp' },
      { label: 'کروزر', image: '/media/images/moto-cruiser.webp' },
      { label: 'ریس', image: '/media/images/moto-race.webp' },
      { label: 'آفرود', image: '/media/images/moto-offroad.webp' },
      { label: 'سی جی', image: '/media/images/moto-cg.webp' },
      { label: 'چهار چرخ', image: '/media/images/moto-atv.webp' },
      { label: 'مینی', image: '/media/images/moto-mini.webp' },
      { label: 'کلاسیک', image: '/media/images/moto-classic.webp' },
    ],
  },
  7: {
    label: 'سنگین',
    heading: 'خرید خودروی سنگین بر اساس نوع',
    items: [
      { label: 'کامیون', image: '/media/images/heavy-truck.webp' },
      { label: 'کشنده', image: '/media/images/heavy-tractor.webp' },
      { label: 'تریلر', image: '/media/images/heavy-trailer.webp' },
      { label: 'کامیونت', image: '/media/images/heavy-light-truck.webp' },
      { label: 'مینی بوس', image: '/media/images/heavy-minibus.webp' },
      { label: 'اتوبوس', image: '/media/images/heavy-bus.webp' },
      { label: 'کلاسیک', image: '/media/images/heavy-classic.webp' },
    ],
  },
};

export const vehicleTypeSet = (headBrandId) => VEHICLE_TYPES[headBrandId] || VEHICLE_TYPES[5];
