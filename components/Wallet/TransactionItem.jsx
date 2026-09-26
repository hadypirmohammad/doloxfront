import React from 'react';
import Icon from './Icon';
import { formatSigned } from '@/utils/Cal';
import { kindMeta, statusMeta, defaultKindMeta, defaultStatusMeta } from '@/utils/WalletUI';

export const TransactionRow = ({ transaction, columns, showTracking, onOpen }) => {
    const kind = kindMeta[transaction.kind] || defaultKindMeta;
    const status = statusMeta[transaction.status] || defaultStatusMeta;

    return (
        <div
            className="dlx-row"
            onClick={() => onOpen(transaction)}
            style={{
                display: 'grid',
                gridTemplateColumns: columns,
                gap: 8,
                alignItems: 'center',
                padding: 14,
                borderBottom: '1px solid #F2F3F5',
                cursor: 'pointer'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icon
                    name={kind.icon}
                    size={18}
                    color={kind.iconFg}
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: 9,
                        flex: '0 0 auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: kind.iconBg
                    }}
                />
                <span style={{ fontSize: 13, color: '#2A2D31', fontWeight: 500, lineHeight: 1.6 }}>{transaction.title}</span>
            </div>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: transaction.direction === 'in' ? '#1E8E4E' : '#C93F3F' }}>
                {formatSigned(transaction.amount, transaction.direction)}
            </span>
            <span
                style={{
                    justifySelf: 'start',
                    fontSize: 11.5,
                    fontWeight: 600,
                    padding: '5px 12px',
                    borderRadius: 20,
                    background: status.chipBg,
                    color: status.chipFg
                }}
            >
                {status.label}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span style={{ fontSize: 12.5, color: '#4A4F55' }}>{transaction.date}</span>
                <span style={{ fontSize: 11.5, color: '#9AA0A8' }}>{transaction.time}</span>
            </div>
            {showTracking ? (
                <>
                    <span style={{ fontSize: 12, color: '#6B7280', direction: 'ltr', textAlign: 'right' }}>{transaction.trackingCode}</span>
                    <span style={{ justifySelf: 'start', fontSize: 12, color: '#F4661C', fontWeight: 500 }}>جزئیات</span>
                </>
            ) : null}
        </div>
    );
};

export const TransactionCard = ({ transaction, showTracking, onOpen }) => {
    const kind = kindMeta[transaction.kind] || defaultKindMeta;
    const status = statusMeta[transaction.status] || defaultStatusMeta;

    const head = (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icon
                    name={kind.icon}
                    size={18}
                    color={kind.iconFg}
                    style={{
                        width: 34,
                        height: 34,
                        borderRadius: 10,
                        flex: '0 0 auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: kind.iconBg
                    }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#2A2D31' }}>{transaction.title}</span>
                    <span style={{ fontSize: 11.5, color: '#9AA0A8' }}>{transaction.date + ' · ' + transaction.time}</span>
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: transaction.direction === 'in' ? '#1E8E4E' : '#C93F3F' }}>
                    {formatSigned(transaction.amount, transaction.direction)}
                </span>
                <span
                    style={{
                        fontSize: 10.5,
                        fontWeight: 600,
                        padding: '3px 9px',
                        borderRadius: 20,
                        background: status.chipBg,
                        color: status.chipFg
                    }}
                >
                    {status.label}
                </span>
            </div>
        </div>
    );

    if (!showTracking) {
        return (
            <div
                onClick={() => onOpen(transaction)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    border: '1px solid #F0F1F4',
                    borderRadius: 12,
                    padding: 12,
                    cursor: 'pointer'
                }}
            >
                <div style={{ width: '100%' }}>{head}</div>
            </div>
        );
    }

    return (
        <div
            onClick={() => onOpen(transaction)}
            style={{
                border: '1px solid #F0F1F4',
                borderRadius: 12,
                padding: 12,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                cursor: 'pointer'
            }}
        >
            {head}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px dashed #EDEEF1',
                    paddingTop: 9
                }}
            >
                <span style={{ fontSize: 12, color: '#F4661C', fontWeight: 500 }}>جزئیات ›</span>
                <span style={{ fontSize: 11.5, color: '#9AA0A8', direction: 'ltr' }}>{transaction.trackingCode}</span>
            </div>
        </div>
    );
};
