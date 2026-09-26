import React from 'react';
import Icon from './Icon';

const EmptyState = ({ layout, onAction }) => {
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
                name="receipt_long"
                size={40}
                color="#B3B8C0"
                style={{
                    width: 88,
                    height: 88,
                    borderRadius: '50%',
                    background: '#F5F6F8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            />
            <h2 style={{ margin: 0, fontSize: 17.5, fontWeight: 700, color: '#17191D' }}>هنوز تراکنشی ثبت نشده است</h2>
            <p style={{ margin: 0, fontSize: 13.5, color: '#8A9096', lineHeight: 2, maxWidth: 380 }}>
                با اولین شارژ کیف پول، تراکنش‌های شما در این صفحه نمایش داده می‌شود.
            </p>
            <button
                className="dlx-primary"
                onClick={onAction}
                style={{
                    border: 'none',
                    background: '#F4661C',
                    color: '#fff',
                    fontSize: 14.5,
                    fontWeight: 600,
                    padding: '13px 26px',
                    borderRadius: 11,
                    cursor: 'pointer'
                }}
            >
                شارژ کیف پول
            </button>
        </div>
    );
};

export default EmptyState;
