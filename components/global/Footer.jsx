import Link from 'next/link';
import React from 'react';

const quickLinks = [
  { href: '/ads', label: 'خرید خودرو' },
  { href: '/auctions', label: 'مزایده ها' },
  { href: '/autogallery', label: 'اتوگالری ها' },
  { href: '/khalafi', label: 'خلافی خودرو' },
];

const supportNumbers = [
  { raw: '09139777207', intl: '989139777207', label: '۰۹۱۳۹۷۷۷۲۰۷' },
  { raw: '09130966206', intl: '989130966206', label: '۰۹۱۳۰۹۶۶۲۰۶' },
];

const samandehi = {
  src: '',
  href: '',
  code: '',
};

const enamad = {
  href: 'https://trustseal.enamad.ir/?id=502584&Code=8ydhKOGUWc2iafo26y456yeEb72ULJuk',
  src: 'https://trustseal.enamad.ir/logo.aspx?id=502584&Code=8ydhKOGUWc2iafo26y456yeEb72ULJuk',
  code: '8ydhKOGUWc2iafo26y456yeEb72ULJuk',
};

const WhatsappIcon = ({ size = 16, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.92C21.95 6.45 17.5 2 12.04 2zm5.8 14.02c-.24.68-1.4 1.31-1.93 1.36-.53.05-1.03.24-3.45-.76-2.92-1.2-4.74-4.22-4.88-4.42-.14-.2-1.15-1.57-1.15-3 0-1.43.74-2.13 1-2.42.27-.29.58-.36.78-.36.2 0 .4 0 .58.01.19.01.44.07.68.53.24.6.81 1.99.88 2.13.07.15.12.32.02.51-.1.2-.15.32-.29.49-.15.17-.31.39-.44.52-.15.15-.3.31-.13.6.17.29.76 1.26 1.63 2.04 1.12 1 2.06 1.31 2.35 1.46.29.15.46.12.63-.07.17-.2.73-.85.92-1.14.2-.29.39-.24.66-.15.27.1 1.7.8 1.99.95.29.15.49.22.56.34.07.12.07.71-.17 1.39z" />
  </svg>
);

const TelegramIcon = ({ size = 18, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M21.8 4.1 2.9 11.4c-1 .4-1 1 .1 1.3l4.5 1.4 1.7 5.2c.2.6.5.7 1 .3l2.6-2 4.6 3.4c.7.5 1.2.2 1.4-.6l3.3-15.1c.2-.9-.3-1.3-1.3-1.2zM8.9 14.4l9-5.7c.4-.3.8 0 .4.3l-7.4 6.8-.3 3z" />
  </svg>
);

const InstagramIcon = ({ size = 21, color = '#e9edf3' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1.1" fill={color} stroke="none" />
  </svg>
);

const ClockIcon = ({ color = '#8d97a3' }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" className="flex-none">
    <circle cx="12" cy="12" r="9" />
    <polyline points="12,7 12,12 16,14" />
  </svg>
);

const SamandehiPlaceholder = ({ height = 72, width = 56 }) => (
  <div className="flex flex-col items-center justify-center gap-2 p-1">
    <span
      className="flex items-center justify-center rounded-lg border-2 border-[#6a798d]"
      style={{ height, width }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6a798d" strokeWidth="1.6">
        <rect x="3" y="4" width="18" height="15" rx="2" />
        <circle cx="8.5" cy="9.5" r="1.5" />
        <polyline points="4,17 9,12 13,15 17,11 20,14" />
      </svg>
    </span>
    <span className="text-[11.5px] font-semibold leading-[1.5] text-[#dfe5ee]">محل لوگوی ساماندهی</span>
  </div>
);

const BadgeImage = ({ src, alt, code, height }) => (
  <img
    className="w-auto cursor-pointer rounded-md bg-white object-contain p-1"
    style={{ height }}
    referrerPolicy="origin"
    src={src}
    alt={alt}
    code={code}
  />
);

const MobileFooter = () => (
  <div dir="rtl" className="bg-[#0d1b2e] px-5 py-8 text-white lg:hidden">
    <Link href="/" dir="ltr" className="dolox-wordmark block text-[34px] leading-none text-white">
      DOLO<span className="text-primary">X</span>
    </Link>
    <p className="m-0 pt-4 text-sm leading-[2] text-[#c3ccd8]">
      دولوکس ،سامانه خرید و فروش خودرو و مرجع مزایدات دولتی و خصوصی کل کشور
    </p>

    <div className="mt-5 flex items-center gap-3">
      <a
        href={`https://wa.me/${supportNumbers[0].intl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="واتساپ"
        className="flex h-[46px] w-[46px] flex-none items-center justify-center rounded-full bg-[#152741] transition-colors hover:bg-[#1d3455]"
      >
        <WhatsappIcon size={22} color="#25D366" />
      </a>
      <a
        href="https://instagram.com/dolox.ir"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="اینستاگرام"
        className="flex h-[46px] w-[46px] flex-none items-center justify-center rounded-full bg-[#152741] transition-colors hover:bg-[#1d3455]"
      >
        <InstagramIcon />
      </a>
      <a
        href="https://t.me/Dolox_ir"
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 items-center gap-3 rounded-[14px] border border-[#21395a] bg-[#152741] px-3 py-2.5 transition-colors hover:bg-[#1d3455]"
      >
        <span className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-full bg-[#2aabee]">
          <TelegramIcon />
        </span>
        <span className="flex-1">
          <span dir="ltr" className="block text-right text-sm font-bold text-white">Dolox_ir</span>
          <span className="block text-[11.5px] text-[#9fadbe]">اخبار و مزایده‌های جدید</span>
        </span>
        <span className="text-sm font-bold text-primary">‹</span>
      </a>
    </div>

    <div className="my-6 h-px bg-[#1b2d47]" />

    <div className="grid grid-cols-[1fr_1px_1fr] gap-5">
      <div>
        <div className="mb-4 flex items-center gap-2">
          <span className="h-4 w-[3px] rounded-sm bg-primary" />
          <span className="text-[15px] font-bold text-white">تماس با ما</span>
        </div>
        <div className="flex flex-col gap-2.5">
          {supportNumbers.map((item) => (
            <a
              key={item.raw}
              href={`https://wa.me/${item.intl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 rounded-xl bg-[#152741] px-3 py-2.5 transition-colors hover:bg-[#1d3455]"
            >
              <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-primary">
                <WhatsappIcon size={14} />
              </span>
              <span dir="ltr" className="text-sm font-semibold text-[#e9edf3]">{item.label}</span>
            </a>
          ))}
        </div>
        <div className="mt-3.5 flex items-center gap-2 text-[11.5px] leading-[1.6] text-[#9fadbe]">
          <ClockIcon color="#9fadbe" />
          <span>پشتیبانی همه‌روزه از ۹ صبح تا ۹ عصر</span>
        </div>
      </div>

      <div className="bg-[#1b2d47]" />

      <div>
        <div className="mb-4 flex items-center gap-2">
          <span className="h-4 w-[3px] rounded-sm bg-primary" />
          <span className="text-[15px] font-bold text-white">دسترسی سریع</span>
        </div>
        <nav className="flex flex-col">
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 py-2.5 text-sm text-[#e9edf3] transition-colors hover:text-primary"
            >
              <span className="font-bold text-primary">‹</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>

    <div className="mt-6 grid grid-cols-[1fr_1px_1fr] gap-3.5 rounded-2xl border border-[#1b2d47] p-4 text-center">
      <a
        referrerPolicy="origin"
        target="_blank"
        rel="noopener noreferrer"
        href={enamad.href}
        className="flex flex-col items-center justify-center gap-2 rounded-xl p-1 transition-colors hover:bg-[#152741]"
      >
        <BadgeImage src={enamad.src} alt="نماد اعتماد الکترونیکی" code={enamad.code} height={72} />
        <span className="text-[11px] leading-[1.6] text-[#8d9bad]">جهت اطمینان کلیک کنید</span>
      </a>

      <div className="bg-[#1b2d47]" />

      {samandehi.src ? (
        <a
          referrerPolicy="origin"
          target="_blank"
          rel="noopener noreferrer"
          href={samandehi.href}
          className="flex flex-col items-center justify-center gap-2 rounded-xl p-1 transition-colors hover:bg-[#152741]"
        >
          <BadgeImage src={samandehi.src} alt="نماد ساماندهی" code={samandehi.code} height={72} />
          <span className="text-[11px] leading-[1.6] text-[#8d9bad]">جهت اطمینان کلیک کنید</span>
        </a>
      ) : (
        <SamandehiPlaceholder />
      )}
    </div>

    <div className="mt-6 flex justify-center">
      <span className="dolox-wordmark text-[22px] leading-none text-primary">X</span>
    </div>
    <div className="my-3.5 h-px bg-[#1b2d47]" />
    <p className="m-0 text-center text-[11.5px] leading-[1.8] text-[#8d9bad]">
      © تمامی حقوق این وبسایت متعلق به دولوکس است.
    </p>
  </div>
);

const DesktopFooter = () => (
  <div dir="rtl" className="hidden justify-center bg-[#0b0e12] px-4 py-6 lg:flex">
    <footer className="w-full max-w-screen-xl overflow-hidden rounded-[20px] border border-white/[0.06] bg-[#12161c]">
      <div className="flex flex-wrap gap-10 px-14 py-11">
        <div className="flex w-[330px] flex-none flex-col gap-5">
          <Link href="/" dir="ltr" className="dolox-wordmark text-[54px] leading-none text-white">
            DOLO<span className="text-primary">X</span>
          </Link>
          <span className="text-sm text-[#b7bfc9]">سامانه آگهی و خدمات خودرویی دولوکس</span>
          <p className="m-0 max-w-[34ch] text-sm leading-[2] text-[#8d97a3]">
            دولوکس ،سامانه خرید و فروش خودرو و مرجع مزایدات دولتی و خصوصی کل کشور
          </p>
          <div className="mt-1 flex gap-3">
            <a
              href={`https://wa.me/${supportNumbers[0].intl}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="واتساپ"
              className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[#1c2229] transition-colors hover:bg-primary"
            >
              <WhatsappIcon size={22} color="#25D366" />
            </a>
            <a
              href="https://instagram.com/dolox.ir"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="اینستاگرام"
              className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[#1c2229] text-[#e6eaf0] transition-colors hover:bg-primary"
            >
              <InstagramIcon size={19} color="currentColor" />
            </a>
            <a
              href="https://t.me/Dolox_ir"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="تلگرام"
              className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[#1c2229] text-[#e6eaf0] transition-colors hover:bg-primary"
            >
              <TelegramIcon size={20} color="currentColor" />
            </a>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-[18px]">
          <h3 className="m-0 text-[19px] font-bold text-white">دسترسی سریع</h3>
          <nav className="flex flex-col gap-3.5">
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 whitespace-nowrap text-[15px] text-[#b7bfc9] transition-colors hover:text-white"
              >
                <span className="text-xl leading-none text-primary">‹</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex w-[280px] flex-none flex-col gap-[18px]">
          <h3 className="m-0 text-[19px] font-bold text-white">پشتیبانی دولوکس</h3>
          {supportNumbers.map((item) => (
            <a
              key={item.raw}
              href={`https://wa.me/${item.intl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3.5 rounded-[14px] border border-white/5 bg-[#1b2128] px-3 py-2.5 transition-colors hover:border-primary"
            >
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary text-white">
                <WhatsappIcon size={18} />
              </span>
              <span dir="ltr" className="text-[17px] font-medium tracking-[0.04em] text-[#e9edf2]">{item.label}</span>
            </a>
          ))}
          <div className="flex items-center gap-2 text-[13.5px] text-[#8d97a3]">
            <ClockIcon />
            <span>پشتیبانی همه‌روزه از ۹ صبح تا ۹ عصر</span>
          </div>
        </div>

        <div className="w-[280px] flex-none">
          <h3 className="m-0 pb-[18px] text-center text-[19px] font-bold text-white">نمادها</h3>
          <div className="grid grid-cols-[1fr_1px_1fr] gap-3.5 rounded-2xl border border-white/[0.06] p-4 text-center">
            <a
              referrerPolicy="origin"
              target="_blank"
              rel="noopener noreferrer"
              href={enamad.href}
              className="flex flex-col items-center justify-center gap-2 rounded-xl p-1 transition-colors hover:bg-[#1b2128]"
            >
              <BadgeImage src={enamad.src} alt="نماد اعتماد الکترونیکی" code={enamad.code} height={82} />
              <span className="text-[11px] leading-[1.6] text-[#8d97a3]">جهت اطمینان کلیک کنید</span>
            </a>

            <div className="bg-white/[0.06]" />

            {samandehi.src ? (
              <a
                referrerPolicy="origin"
                target="_blank"
                rel="noopener noreferrer"
                href={samandehi.href}
                className="flex flex-col items-center justify-center gap-2 rounded-xl p-1 transition-colors hover:bg-[#1b2128]"
              >
                <BadgeImage src={samandehi.src} alt="نماد ساماندهی" code={samandehi.code} height={82} />
                <span className="text-[11px] leading-[1.6] text-[#8d97a3]">جهت اطمینان کلیک کنید</span>
              </a>
            ) : (
              <SamandehiPlaceholder height={82} width={62} />
            )}
          </div>
        </div>
      </div>

      <div className="px-14 pb-[30px]">
        <div className="flex items-center gap-[18px]">
          <span className="h-px flex-1 bg-gradient-to-l from-primary/[0.55] to-transparent" />
          <span className="dolox-wordmark text-[26px] leading-none text-primary">X</span>
          <span className="h-px flex-1 bg-gradient-to-r from-primary/[0.55] to-transparent" />
        </div>
        <div className="mt-[18px] flex flex-col gap-1.5 text-center">
          <span className="text-[15px] text-[#b7bfc9]">دولوکس</span>
          <span className="text-[13px] text-[#79828d]">© تمامی حقوق این وبسایت متعلق به دولوکس است.</span>
        </div>
      </div>
    </footer>
  </div>
);

const Footer = () => {
  return (
    <>
      <MobileFooter />
      <DesktopFooter />
    </>
  );
};

export default Footer;
