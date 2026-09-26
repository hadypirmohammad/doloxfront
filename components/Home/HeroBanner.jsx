import Image from 'next/image';

const HeroBanner = () => {
  return (
    <section className="bg-[#FAFAFA] px-3 pt-4 sm:px-4 sm:pt-6">
      <div className="mx-auto max-w-screen-xl overflow-hidden rounded-2xl sm:rounded-3xl">
        <div className="relative aspect-[1280/596] w-full overflow-hidden bg-secondary sm:aspect-auto sm:h-[280px] lg:h-[360px]">
          <Image
            src="/media/images/dolox-hero-banner.jpg"
            alt="Dolox banner"
            fill
            priority
            className="object-cover object-center"
            sizes="(min-width: 1280px) 1280px, 100vw"
            quality={90}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
