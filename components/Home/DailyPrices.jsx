import PriceRow from './PriceRow';
import Link from 'next/link';

const defaultPrices = [
  { name: 'پژو ۲۰۶ تیپ ۲', price: '620000000', change: 1.25, direction: 'up', icon: '/media/images/samplebrand.png' },
  { name: 'سمند سورن پلاس', price: '780000000', change: -0.75, direction: 'down', icon: '/media/images/samplebrand.png' },
  { name: 'دنا پلاس توربو', price: '1150000000', change: 0.45, direction: 'up', icon: '/media/images/samplebrand.png' },
  { name: 'شاهین G', price: '890000000', change: -1.1, direction: 'down', icon: '/media/images/samplebrand.png' },
  { name: 'تیبا ۲', price: '410000000', change: 2.05, direction: 'up', icon: '/media/images/samplebrand.png' },
  { name: 'کوییک R', price: '455000000', change: -0.35, direction: 'down', icon: '/media/images/samplebrand.png' },
];

const DailyPrices = ({ prices = defaultPrices }) => {
  const rows = prices?.length ? prices : defaultPrices;

  return (
    <section id="daily-prices" className="scroll-mt-24 bg-[#FAFAFA] px-3 py-8 sm:px-4 sm:py-10">
      <div className="mx-auto max-w-screen-xl">
        <div className="mb-4 flex items-center justify-between sm:mb-6">
          <h2 className="text-lg text-secondary sm:text-2xl">قیمت روز خودرو ها</h2>
          <Link href="/car-prices" className="font-['vazir'] text-sm text-primary">
            مشاهده همه
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          {rows.map((item, index) => (
            <PriceRow key={`${item.name}-${item.brandId || index}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DailyPrices;
