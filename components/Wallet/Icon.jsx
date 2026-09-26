import React from 'react';

const glyphs = {
    account_balance_wallet: (
        <>
            <rect x="3" y="6" width="18" height="13" rx="2.5" />
            <path d="M3 10.5h18" />
            <path d="M16.5 14.5h.01" />
        </>
    ),
    visibility: (
        <>
            <path d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12z" />
            <circle cx="12" cy="12" r="3" />
        </>
    ),
    add: <path d="M12 5v14M5 12h14" />,
    calendar_month: (
        <>
            <rect x="3" y="5" width="18" height="16" rx="2.5" />
            <path d="M3 10h18M8 3v4M16 3v4" />
        </>
    ),
    swap_horiz: (
        <>
            <path d="M4 9h13M14 6l3 3-3 3" />
            <path d="M20 15H7M10 12l-3 3 3 3" />
        </>
    ),
    arrow_upward: <path d="M12 20V4M5 11l7-7 7 7" />,
    arrow_downward: <path d="M12 4v16M19 13l-7 7-7-7" />,
    west: <path d="M20 12H4M11 5l-7 7 7 7" />,
    headset_mic: (
        <>
            <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
            <rect x="2" y="13" width="4.5" height="6" rx="2" />
            <rect x="17.5" y="13" width="4.5" height="6" rx="2" />
            <path d="M19.5 19v.5a2.5 2.5 0 0 1-2.5 2.5h-2.5" />
        </>
    ),
    percent: (
        <>
            <path d="M19 5 5 19" />
            <circle cx="7.5" cy="7.5" r="2.5" />
            <circle cx="16.5" cy="16.5" r="2.5" />
        </>
    ),
    schedule: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3.5 2" />
        </>
    ),
    verified_user: (
        <>
            <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6z" />
            <path d="M9 12l2 2 4-4" />
        </>
    ),
    receipt_long: (
        <>
            <path d="M18 3v18l-3-2-3 2-3-2-3 2V3z" />
            <path d="M9 8h6M9 12h6" />
        </>
    ),
    error: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7.5v5M12 16.5h.01" />
        </>
    ),
    directions_car: (
        <>
            <path d="M5 11l1.4-4.2A2 2 0 0 1 8.3 5.5h7.4a2 2 0 0 1 1.9 1.3L19 11" />
            <rect x="3" y="11" width="18" height="6" rx="2" />
            <path d="M7.5 14h.01M16.5 14h.01" />
        </>
    ),
    star: <path d="M12 4l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 9.7l5.4-.8z" />,
    check: <path d="M5 12.5l5 5 9-11" />,
    close: <path d="M6 6l12 12M18 6L6 18" />,
    progress_activity: <path d="M12 3a9 9 0 1 0 9 9" />
};

const Icon = ({ name, size, color, style }) => {
    const glyph = glyphs[name];

    if (!glyph) {
        return null;
    }

    return (
        <span
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: '0 0 auto',
                color,
                ...style
            }}
        >
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                {glyph}
            </svg>
        </span>
    );
};

export default Icon;
