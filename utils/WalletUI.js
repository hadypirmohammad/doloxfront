export const C = {
    brand: '#FF5E00',
    brandDark: '#DB5814',
    brandDeep: '#C9500F',
    brandSoft: '#FDEDE3',
    brandInk: '#D9540F',
    ink: '#17191D',
    ink2: '#1B1E22',
    ink3: '#2A2D31',
    ink4: '#3B3F45',
    slate: '#5D636A',
    gray: '#6B7280',
    muted: '#8A9096',
    muted2: '#9AA0A8',
    line: '#EDEEF1',
    line2: '#F2F3F5',
    line3: '#F0F1F4',
    border: '#E6E7EB',
    surface: '#F7F7F9',
    head: '#F7F8FA',
    headText: '#7A8087',
    white: '#fff',
    green: '#1E8E4E',
    greenSoft: '#E8F7EE',
    greenIcon: '#2E9E5B',
    red: '#C93F3F',
    redSoft: '#FDECEC',
    redDeep: '#D64545',
    amber: '#A9740D',
    amberSoft: '#FFF4E3',
    footer: '#17191D'
};

export const card = {
    background: '#fff',
    border: '1px solid #EDEEF1',
    borderRadius: 16
};

export function getLayout(isDesktop) {
    return {
        isDesktop,
        gap: isDesktop ? '20px' : '16px',
        h1: isDesktop ? '22px' : '19px',
        topDir: isDesktop ? 'row' : 'column-reverse',
        balW: isDesktop ? '340px' : 'auto',
        statCols: isDesktop ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)',
        featCols: isDesktop ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)',
        featDiv: isDesktop ? '1px solid #F0F1F4' : 'none',
        featPad: isDesktop ? '24px' : '0px',
        balAlign: isDesktop ? 'flex-end' : 'center',
        amtDir: isDesktop ? 'row' : 'column-reverse',
        amtAlign: isDesktop ? 'baseline' : 'center',
        crumbDisplay: isDesktop ? 'flex' : 'none',
        twoCols: isDesktop ? '1fr 1.15fr' : '1fr',
        payCols: isDesktop ? '1.15fr .85fr' : '1fr',
        filterCols: isDesktop ? 'repeat(2, 1fr) 1fr 1fr auto' : '1fr',
        resultPad: isDesktop ? '34px 32px' : '26px 18px',
        statePad: isDesktop ? '54px 32px' : '34px 18px',
        resBtnCols: isDesktop ? '1fr 1fr' : '1fr',
        modalAlign: isDesktop ? 'center' : 'flex-end',
        modalPadBottom: isDesktop ? 18 : 'calc(76px + env(safe-area-inset-bottom))',
        modalMaxHeight: isDesktop ? '88dvh' : '72dvh'
    };
}

export const kindMeta = {
    deposit: { label: 'شارژ کیف پول', direction: 'in', icon: 'arrow_downward', iconBg: C.greenSoft, iconFg: C.greenIcon },
    purchase: { label: 'پرداخت', direction: 'out', icon: 'arrow_upward', iconBg: C.brandSoft, iconFg: '#E2732B' },
    refund: { label: 'بازگشت وجه', direction: 'in', icon: 'swap_horiz', iconBg: C.greenSoft, iconFg: C.greenIcon },
    adjustment: { label: 'کسر توسط ادمین', direction: 'out', icon: 'error', iconBg: C.redSoft, iconFg: C.redDeep }
};

export const statusMeta = {
    success: { label: 'موفق', chipBg: C.greenSoft, chipFg: C.green },
    failed: { label: 'ناموفق', chipBg: C.redSoft, chipFg: C.red },
    pending: { label: 'در حال پردازش', chipBg: C.amberSoft, chipFg: C.amber }
};

export const kindByCode = {
    1: 'deposit',
    2: 'purchase',
    3: 'refund',
    4: 'adjustment'
};

export const statusByCode = {
    1: 'success',
    2: 'failed',
    3: 'pending'
};

export const codeByKind = {
    deposit: 1,
    purchase: 2,
    refund: 3,
    adjustment: 4
};

export const codeByStatus = {
    success: 1,
    failed: 2,
    pending: 3
};

export const kindOptions = [
    { value: 'all', label: 'همه' },
    { value: 'deposit', label: 'شارژ کیف پول' },
    { value: 'purchase', label: 'پرداخت' },
    { value: 'refund', label: 'بازگشت وجه' },
    { value: 'adjustment', label: 'کسر توسط ادمین' }
];

export const statusOptions = [
    { value: 'all', label: 'همه' },
    { value: 'success', label: 'موفق' },
    { value: 'failed', label: 'ناموفق' },
    { value: 'pending', label: 'در حال پردازش' }
];

export const defaultKindMeta = kindMeta.deposit;
export const defaultStatusMeta = statusMeta.pending;
