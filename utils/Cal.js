import { toJalaali } from 'jalaali-js';

export function filterSales(items) {
    return items.filter(item => item.sale_or_rent === 'sale');
}

// Function to filter for 'rent'
export function filterRent(items) {
    return items.filter(item => item.sale_or_rent === 'rent');
}

export function calculateDaysLeft(endDateStr) {
    if (!endDateStr) return 0;

    const today = new Date();
    const endDate = new Date(endDateStr);

    if (Number.isNaN(endDate.getTime())) return 0;

    // Calculate the difference in milliseconds
    const differenceInMillis = endDate - today;

    // Convert milliseconds to days
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const daysLeft = Math.ceil(differenceInMillis / millisecondsPerDay);

    return Number.isFinite(daysLeft) ? daysLeft : 0;
}
export function formatPrice(price) {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function convertToShamsiAndGregorian(dateString) {
    const fallback = {
        gregorian: { year: null, month: null, day: null },
        shamsi: { year: null, month: null, day: null },
    };

    if (dateString === null || dateString === undefined || dateString === '') {
        return fallback;
    }

    const date = dateString instanceof Date ? dateString : new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return fallback;
    }

    // Extract Gregorian date
    const gregorianYear = date.getFullYear();
    const gregorianMonth = date.getMonth() + 1; // Months are zero-indexed
    const gregorianDay = date.getDate();

    // jalaali-js fails on placeholder/.NET min dates like 0001-01-01
    if (gregorianYear < 622 || gregorianYear > 9999) {
        return fallback;
    }

    try {
        const jalaaliDate = toJalaali(gregorianYear, gregorianMonth, gregorianDay);

        return {
            gregorian: {
                year: gregorianYear,
                month: gregorianMonth,
                day: gregorianDay,
            },
            shamsi: {
                year: jalaaliDate.jy,
                month: jalaaliDate.jm,
                day: jalaaliDate.jd,
            },
        };
    } catch {
        return fallback;
    }
}

export function mapToAdFormat(item) {
   console.log(item.Brand)
    return {
     
       
        BrandName : item.MainBrand,
        EnTitle: item.EnTitle,
        Title: item.Title,
        CityName:  item.Location,
        CoverImage: item.CoverImage,
        Price: item.Price,
        IsAgreement: item.IsAgreement,
        isGest: item.IsGest,
        isRent: item.IsRent,
        Worked: item.Worked,
        Year:  Number(item.Year),
        AdFeatures: []
    };
}

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigits(value) {
    return String(value ?? '').replace(/[0-9]/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

export function formatNumber(value) {
    return toPersianDigits(formatPrice(value ?? 0));
}

export function formatToman(value) {
    return formatNumber(value) + ' تومان';
}

export function formatSigned(value, direction) {
    return (direction === 'in' ? '+ ' : '- ') + formatNumber(value);
}

export function parseAmount(value) {
    const normalized = String(value ?? '')
        .replace(/[۰-۹]/g, (d) => String(PERSIAN_DIGITS.indexOf(d)))
        .replace(/[^0-9]/g, '');
    return normalized ? Number(normalized) : 0;
}

export function normalizeSearchTerm(value) {
    return String(value ?? '')
        .replace(/[يى]/g, 'ی')
        .replace(/ك/g, 'ک')
        .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
        .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
        .replace(/[\u200c\u200e\u200f]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}
