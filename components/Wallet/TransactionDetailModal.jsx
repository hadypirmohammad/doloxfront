import React, { useState } from 'react';
import Icon from './Icon';
import { formatNumber, formatSigned } from '@/utils/Cal';
import { kindMeta, statusMeta, defaultKindMeta, defaultStatusMeta } from '@/utils/WalletUI';

const Row = ({ label, value, ltr }) => {
    if (!value) return null;

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 0', borderBottom: '1px solid #F0F1F4' }}>
            <span style={{ fontSize: 13, color: '#2A2D31', direction: ltr ? 'ltr' : undefined }}>{value}</span>
            <span style={{ fontSize: 12.5, color: '#8A9096' }}>{label}</span>
        </div>
    );
};

const TransactionDetailModal = ({ transaction, layout, onClose }) => {
    const [copied, setCopied] = useState(false);
    const kind = kindMeta[transaction.kind] || defaultKindMeta;
    const status = statusMeta[transaction.status] || defaultStatusMeta;

    const copy = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(transaction.trackingCode);
        }
        setCopied(true);
    };

    return (
        <div
            onClick={onClose}
            dir="rtl"
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(16,18,22,.5)',
                display: 'flex',
                alignItems: layout.modalAlign,
                justifyContent: 'center',
                padding: 18,
                paddingBottom: layout.modalPadBottom ?? 18,
                zIndex: 60,
                overflowY: 'auto'
            }}
        >
            <div
                onClick={(event) => event.stopPropagation()}
                style={{
                    width: '100%',
                    maxWidth: 440,
                    maxHeight: layout.modalMaxHeight ?? '88dvh',
                    overflowY: 'auto',
                    background: '#fff',
                    borderRadius: 18,
                    padding: 22,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16
                }}
            >
                <div
                    style={{
                        position: 'sticky',
                        top: -22,
                        background: '#fff',
                        padding: '4px 0 8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                    <button
                        onClick={onClose}
                        style={{
                            border: 'none',
                            background: '#F5F6F8',
                            color: '#6B7280',
                            width: 30,
                            height: 30,
                            borderRadius: 8,
                            cursor: 'pointer',
                            fontSize: 14
                        }}
                    >
                        ✕
                    </button>
                    <h2 style={{ margin: 0, fontSize: 16.5, fontWeight: 700, color: '#17191D' }}>جزئیات تراکنش</h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '6px 0 10px' }}>
                    <Icon
                        name={kind.icon}
                        size={22}
                        color={kind.iconFg}
                        style={{
                            width: 52,
                            height: 52,
                            borderRadius: 14,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: kind.iconBg
                        }}
                    />
                    <span style={{ fontSize: 20, fontWeight: 700, color: transaction.direction === 'in' ? '#1E8E4E' : '#C93F3F' }}>
                        {formatSigned(transaction.amount, transaction.direction) + ' تومان'}
                    </span>
                    <span
                        style={{
                            fontSize: 11.5,
                            fontWeight: 600,
                            padding: '4px 12px',
                            borderRadius: 20,
                            background: status.chipBg,
                            color: status.chipFg
                        }}
                    >
                        {status.label}
                    </span>
                </div>

                <div
                    style={{
                        background: '#FAFAFB',
                        border: '1px solid #F0F1F4',
                        borderRadius: 14,
                        padding: '6px 14px',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <Row label="نوع تراکنش" value={transaction.title} />
                    <Row label="شماره پیگیری" value={transaction.trackingCode} ltr />
                    <Row label="شماره مرجع بانکی" value={transaction.bankRefId} ltr />
                    <Row label="درگاه پرداخت" value={transaction.gateway} />
                    <Row label="تاریخ و ساعت" value={[transaction.date, transaction.time].filter(Boolean).join(' – ')} />
                    {transaction.balanceAfter ? (
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 0' }}>
                            <span style={{ fontSize: 13, color: '#2A2D31' }}>{formatNumber(transaction.balanceAfter) + ' تومان'}</span>
                            <span style={{ fontSize: 12.5, color: '#8A9096' }}>موجودی پس از تراکنش</span>
                        </div>
                    ) : null}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <button
                        onClick={copy}
                        style={{
                            border: '1px solid #E6E7EB',
                            background: '#fff',
                            color: '#5D636A',
                            fontSize: 13.5,
                            fontWeight: 500,
                            padding: 12,
                            borderRadius: 11,
                            cursor: 'pointer'
                        }}
                    >
                        {copied ? 'کپی شد ✓' : 'کپی شماره پیگیری'}
                    </button>
                    <button
                        className="dlx-primary"
                        onClick={onClose}
                        style={{
                            border: 'none',
                            background: '#FF5E00',
                            color: '#fff',
                            fontSize: 14,
                            fontWeight: 600,
                            padding: 12,
                            borderRadius: 11,
                            cursor: 'pointer'
                        }}
                    >
                        بستن
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetailModal;
