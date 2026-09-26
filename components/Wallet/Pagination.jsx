import React from 'react';
import { toPersianDigits } from '@/utils/Cal';

const Pagination = ({ page, perPage, total, onChange }) => {
    const pageCount = Math.max(1, Math.ceil(total / perPage));
    const from = total === 0 ? 0 : (page - 1) * perPage + 1;
    const to = Math.min(page * perPage, total);
    const numbers = Array.from({ length: pageCount }, (_, index) => index + 1);

    const button = (label, targetPage, active, disabled) => (
        <button
            key={label + targetPage}
            onClick={() => !disabled && onChange(targetPage)}
            style={{
                minWidth: 34,
                height: 34,
                borderRadius: 9,
                fontSize: 12.5,
                fontWeight: 600,
                cursor: disabled ? 'default' : 'pointer',
                padding: '0 10px',
                border: '1px solid ' + (active ? '#F4661C' : '#E6E7EB'),
                background: active ? '#F4661C' : '#fff',
                color: active ? '#fff' : '#5D636A',
                opacity: disabled ? 0.5 : 1
            }}
        >
            {label}
        </button>
    );

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 10,
                paddingTop: 6
            }}
        >
            <span style={{ fontSize: 12, color: '#9AA0A8' }}>
                {'نمایش ' + toPersianDigits(from) + ' تا ' + toPersianDigits(to) + ' از ' + toPersianDigits(total) + ' تراکنش'}
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
                {button('›', page - 1, false, page === 1)}
                {numbers.map((number) => button(toPersianDigits(number), number, number === page, false))}
                {button('‹', page + 1, false, page === pageCount)}
            </div>
        </div>
    );
};

export default Pagination;
