import React from 'react';
import Link from 'next/link';
import Icon from './Icon';

const PageHeading = ({ title, subtitle, crumb, layout }) => {
    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Icon
                    name="account_balance_wallet"
                    size={23}
                    color="#fff"
                    style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: '0 0 auto',
                        backgroundColor: '#F4661C'
                    }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}>
                    <h1 style={{ margin: 0, fontSize: layout.h1, fontWeight: 700, color: '#17191D' }}>{title}</h1>
                    <p style={{ margin: 0, fontSize: 13, color: '#8A9096' }}>{subtitle}</p>
                </div>
            </div>
            <div style={{ display: layout.crumbDisplay, alignItems: 'center', gap: 8, fontSize: 12.5, color: '#9AA0A8', paddingTop: 6 }}>
                <Link href="/dashboard">داشبورد</Link>
                <span>›</span>
                <Link href="/wallet">کیف پول</Link>
                <span>›</span>
                <span style={{ color: '#5D636A' }}>{crumb}</span>
            </div>
        </div>
    );
};

export default PageHeading;
