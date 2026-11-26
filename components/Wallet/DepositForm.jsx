import React, { useState } from 'react';
import Icon from './Icon';
import { formatNumber, parseAmount } from '@/utils/Cal';

const presets = [500000, 1000000, 2000000, 5000000];

const DepositForm = ({ limits, onSubmit }) => {
    const [presetIndex, setPresetIndex] = useState(0);
    const [custom, setCustom] = useState('');

    const activeAmount = custom ? parseAmount(custom) : presets[presetIndex];
    const isPresetActive = (index) => presetIndex === index && custom.length === 0;
    const isTooLow = activeAmount < limits.minDeposit;
    const isTooHigh = activeAmount > limits.maxDepositPerTransaction;
    const invalid = isTooLow || isTooHigh;

    return (
        <div
            style={{
                background: '#fff',
                border: '1px solid #EDEEF1',
                borderRadius: 16,
                padding: 22,
                display: 'flex',
                flexDirection: 'column',
                gap: 16
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end', flexDirection: 'row-reverse' }}>
                <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#17191D' }}>شارژ کیف پول</h2>
                <Icon
                    name="account_balance_wallet"
                    size={19}
                    color="#FF5E00"
                    style={{
                        width: 34,
                        height: 34,
                        borderRadius: 9,
                        background: '#FDEDE3',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                />
            </div>
            <p style={{ margin: 0, fontSize: 13, color: '#8A9096' }}>مبلغ مورد نظر خود را برای شارژ کیف پول وارد کنید.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(96px,1fr))', gap: 10 }}>
                {presets.map((preset, index) => (
                    <button
                        key={preset}
                        onClick={() => {
                            setPresetIndex(index);
                            setCustom('');
                        }}
                        style={{
                            padding: '12px 8px',
                            borderRadius: 10,
                            cursor: 'pointer',
                            fontSize: 13.5,
                            fontWeight: 600,
                            border: '1px solid ' + (isPresetActive(index) ? '#FF5E00' : '#E6E7EB'),
                            background: isPresetActive(index) ? '#FDEDE3' : '#fff',
                            color: isPresetActive(index) ? '#C9500F' : '#3B3F45'
                        }}
                    >
                        {formatNumber(preset)}
                    </button>
                ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'stretch',
                        border: '1px solid #E6E7EB',
                        borderRadius: 10,
                        overflow: 'hidden',
                        background: '#fff'
                    }}
                >
                    <input
                        value={custom}
                        onChange={(event) => setCustom(event.target.value)}
                        placeholder="مبلغ دلخواه را وارد کنید"
                        style={{
                            flex: 1,
                            border: 'none',
                            outline: 'none',
                            padding: '13px 14px',
                            fontSize: 14,
                            color: '#1B1E22',
                            textAlign: 'right',
                            background: 'transparent'
                        }}
                    />
                    <span
                        style={{
                            background: '#F5F6F8',
                            borderRight: '1px solid #E6E7EB',
                            padding: '0 16px',
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: 13,
                            color: '#6B7280'
                        }}
                    >
                        تومان
                    </span>
                </div>
                <p style={{ margin: 0, fontSize: 11.5, color: invalid ? '#C93F3F' : '#9AA0A8', lineHeight: 1.9 }}>
                    {'حداقل شارژ ' + formatNumber(limits.minDeposit) + ' تومان · حداکثر ' + formatNumber(limits.maxDepositPerTransaction) + ' تومان در هر تراکنش · سقف موجودی کیف پول ' + formatNumber(limits.maxBalance) + ' تومان'}
                </p>
            </div>
            <button
                className="dlx-primary"
                disabled={invalid}
                onClick={() => onSubmit(activeAmount)}
                style={{
                    border: 'none',
                    background: invalid ? '#F1B392' : '#FF5E00',
                    color: '#fff',
                    fontSize: 15,
                    fontWeight: 600,
                    padding: 15,
                    borderRadius: 11,
                    cursor: invalid ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10
                }}
            >
                <span>ادامه و پرداخت</span>
                <Icon name="west" size={19} />
            </button>
            <p style={{ margin: 0, textAlign: 'center', fontSize: 12, color: '#9AA0A8' }}>
                شارژ کیف پول بدون کارمزد و به صورت آنی انجام می‌شود.
            </p>
        </div>
    );
};

export default DepositForm;
