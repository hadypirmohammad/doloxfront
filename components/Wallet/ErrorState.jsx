import React from 'react';
import Icon from './Icon';

const ErrorState = ({ layout, errorCode, onRetry, onBack }) => {
    return (
        <div
            style={{
                background: '#fff',
                border: '1px solid #EDEEF1',
                borderRadius: 16,
                padding: layout.statePad,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 14,
                textAlign: 'center'
            }}
        >
            <Icon
                name="error"
                size={40}
                color="#D64545"
                style={{
                    width: 84,
                    height: 84,
                    borderRadius: '50%',
                    background: '#FDECEC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            />
            <h2 style={{ margin: 0, fontSize: 17.5, fontWeight: 700, color: '#17191D' }}>اطلاعات کیف پول دریافت نشد</h2>
            <p style={{ margin: 0, fontSize: 13.5, color: '#8A9096', lineHeight: 2, maxWidth: 400 }}>
                ارتباط با سرور برقرار نشد. اتصال اینترنت خود را بررسی کنید و دوباره تلاش کنید.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                    className="dlx-primary"
                    onClick={onRetry}
                    style={{
                        border: 'none',
                        background: '#FF5E00',
                        color: '#fff',
                        fontSize: 14.5,
                        fontWeight: 600,
                        padding: '13px 26px',
                        borderRadius: 11,
                        cursor: 'pointer'
                    }}
                >
                    تلاش مجدد
                </button>
                <button
                    onClick={onBack}
                    style={{
                        border: '1px solid #E6E7EB',
                        background: '#fff',
                        color: '#5D636A',
                        fontSize: 14,
                        padding: '13px 22px',
                        borderRadius: 11,
                        cursor: 'pointer'
                    }}
                >
                    بازگشت به داشبورد
                </button>
            </div>
            <p style={{ margin: 0, fontSize: 11.5, color: '#B0B5BB', direction: 'ltr' }}>{errorCode || 'ERR-WALLET-503'}</p>
        </div>
    );
};

export default ErrorState;
