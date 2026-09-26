import React, { useState } from 'react';
import { formatNumber } from '@/utils/Cal';

const Row = ({ label, value, valueColor }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 0', borderBottom: '1px solid #F2F3F5' }}>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: valueColor || '#2A2D31' }}>{value}</span>
            <span style={{ fontSize: 13, color: '#8A9096' }}>{label}</span>
        </div>
    );
};

const PaymentConfirm = ({ order, gateways, layout, onPay, onBack }) => {
    const [gatewayIndex, setGatewayIndex] = useState(0);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: layout.payCols, gap: 20, alignItems: 'start', maxWidth: 980 }}>
            <div
                style={{
                    background: '#fff',
                    border: '1px solid #EDEEF1',
                    borderRadius: 16,
                    padding: 24,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 18
                }}
            >
                <h2 style={{ margin: 0, fontSize: 16.5, fontWeight: 700, color: '#17191D' }}>اطلاعات پرداخت</h2>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Row label="نوع تراکنش" value="شارژ کیف پول" />
                    <Row label="مبلغ شارژ" value={formatNumber(order.amount) + ' تومان'} />
                    <Row label="کارمزد" value={formatNumber(order.fee) + ' تومان'} valueColor="#2E9E5B" />
                    {order.ownerName ? <Row label="صاحب کیف پول" value={order.ownerName} /> : null}
                    {order.orderId ? (
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 0' }}>
                            <span style={{ fontSize: 13.5, fontWeight: 600, color: '#2A2D31' }}>{order.orderId}</span>
                            <span style={{ fontSize: 13, color: '#8A9096' }}>شناسه سفارش</span>
                        </div>
                    ) : null}
                </div>
                {gateways.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: '#2A2D31' }}>انتخاب درگاه پرداخت</span>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))', gap: 10 }}>
                        {gateways.map((gateway, index) => (
                            <button
                                key={gateway.id}
                                onClick={() => setGatewayIndex(index)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    padding: 13,
                                    borderRadius: 11,
                                    cursor: 'pointer',
                                    textAlign: 'right',
                                    border: '1px solid ' + (gatewayIndex === index ? '#F4661C' : '#E6E7EB'),
                                    background: gatewayIndex === index ? '#FDEDE3' : '#fff'
                                }}
                            >
                                <span
                                    style={{
                                        width: 16,
                                        height: 16,
                                        borderRadius: '50%',
                                        flex: '0 0 auto',
                                        border: '5px solid ' + (gatewayIndex === index ? '#F4661C' : '#DDE0E4'),
                                        background: '#fff'
                                    }}
                                />
                                <span style={{ fontSize: 13, fontWeight: 600, color: '#2A2D31' }}>{gateway.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
                ) : null}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div
                    style={{
                        background: '#fff',
                        border: '1px solid #EDEEF1',
                        borderRadius: 16,
                        padding: 24,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 16
                    }}
                >
                    <span style={{ fontSize: 13, color: '#8A9096' }}>مبلغ قابل پرداخت</span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                        <span style={{ fontSize: 30, fontWeight: 700, color: '#17191D' }}>{formatNumber(order.amount)}</span>
                        <span style={{ fontSize: 14, color: '#8A9096' }}>تومان</span>
                    </div>
                    <div style={{ height: 1, background: '#F2F3F5' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 13, color: '#2A2D31' }}>{formatNumber(order.balanceAfter) + ' تومان'}</span>
                        <span style={{ fontSize: 13, color: '#8A9096' }}>موجودی پس از شارژ</span>
                    </div>
                    <button
                        className="dlx-primary"
                        onClick={() => onPay(gateways[gatewayIndex]?.id ?? '')}
                        style={{
                            border: 'none',
                            background: '#F4661C',
                            color: '#fff',
                            fontSize: 15,
                            fontWeight: 600,
                            padding: 15,
                            borderRadius: 11,
                            cursor: 'pointer'
                        }}
                    >
                        پرداخت و انتقال به درگاه
                    </button>
                    <button
                        onClick={onBack}
                        style={{
                            border: '1px solid #E6E7EB',
                            background: '#fff',
                            color: '#5D636A',
                            fontSize: 13.5,
                            fontWeight: 500,
                            padding: 13,
                            borderRadius: 11,
                            cursor: 'pointer'
                        }}
                    >
                        بازگشت و ویرایش مبلغ
                    </button>
                </div>
                <p style={{ margin: 0, fontSize: 12, color: '#9AA0A8', lineHeight: 2, textAlign: 'center' }}>
                    با زدن دکمه پرداخت به درگاه بانکی منتقل می‌شوید. اطلاعات کارت شما نزد دولوکس ذخیره نمی‌شود.
                </p>
            </div>
        </div>
    );
};

export default PaymentConfirm;
