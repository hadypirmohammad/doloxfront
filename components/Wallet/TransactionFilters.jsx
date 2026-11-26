import React, { useState } from 'react';
import { kindOptions, statusOptions } from '@/utils/WalletUI';

const fieldStyle = {
    padding: 11,
    border: '1px solid #E6E7EB',
    borderRadius: 10,
    fontSize: 13,
    color: '#2A2D31',
    background: '#fff'
};

const TransactionFilters = ({ layout, initial, onApply, onReset }) => {
    const [kind, setKind] = useState(initial?.kind || 'all');
    const [status, setStatus] = useState(initial?.status || 'all');
    const [fromDate, setFromDate] = useState(initial?.fromDate || '');
    const [toDate, setToDate] = useState(initial?.toDate || '');

    const reset = () => {
        setKind('all');
        setStatus('all');
        setFromDate('');
        setToDate('');
        onReset();
    };

    return (
        <div
            style={{
                background: '#fff',
                border: '1px solid #EDEEF1',
                borderRadius: 16,
                padding: 18,
                display: 'grid',
                gridTemplateColumns: layout.filterCols,
                gap: 12,
                alignItems: 'end'
            }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <span style={{ fontSize: 12.5, color: '#6B7280' }}>نوع تراکنش</span>
                <select value={kind} onChange={(event) => setKind(event.target.value)} style={fieldStyle}>
                    {kindOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <span style={{ fontSize: 12.5, color: '#6B7280' }}>وضعیت</span>
                <select value={status} onChange={(event) => setStatus(event.target.value)} style={fieldStyle}>
                    {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <span style={{ fontSize: 12.5, color: '#6B7280' }}>از تاریخ</span>
                <input
                    value={fromDate}
                    onChange={(event) => setFromDate(event.target.value)}
                    placeholder="۱۴۰۳/۰۳/۰۱"
                    style={{ ...fieldStyle, textAlign: 'right' }}
                />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <span style={{ fontSize: 12.5, color: '#6B7280' }}>تا تاریخ</span>
                <input
                    value={toDate}
                    onChange={(event) => setToDate(event.target.value)}
                    placeholder="۱۴۰۳/۰۳/۳۱"
                    style={{ ...fieldStyle, textAlign: 'right' }}
                />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
                <button
                    onClick={() => onApply({ kind, status, fromDate, toDate })}
                    style={{
                        flex: 1,
                        border: 'none',
                        background: '#FF5E00',
                        color: '#fff',
                        fontSize: 13.5,
                        fontWeight: 600,
                        padding: '12px 14px',
                        borderRadius: 10,
                        cursor: 'pointer'
                    }}
                >
                    اعمال فیلتر
                </button>
                <button
                    onClick={reset}
                    style={{
                        border: '1px solid #E6E7EB',
                        background: '#fff',
                        color: '#6B7280',
                        fontSize: 13,
                        padding: '12px 14px',
                        borderRadius: 10,
                        cursor: 'pointer'
                    }}
                >
                    پاک کردن
                </button>
            </div>
        </div>
    );
};

export default TransactionFilters;
