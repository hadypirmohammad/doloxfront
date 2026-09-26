import React from 'react';
import Icon from './Icon';
import { formatNumber } from '@/utils/Cal';

const WalletBalance = ({ balance, layout, onCharge }) => {
    return (
        <div
            style={{
                flex: layout.isDesktop ? '0 0 ' + layout.balW : '1 1 auto',
                alignSelf: layout.isDesktop ? 'auto' : 'stretch',
                background: '#F4661C',
                borderRadius: 18,
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 26,
                minHeight: 210,
                width: layout.isDesktop ? 350 : '100%',
                height: layout.isDesktop ? 250 : 'auto'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: layout.balAlign, gap: 8, flexDirection: 'row-reverse' }}>
                <span style={{ fontSize: 13, color: '#FFE3D2', fontWeight: 500, textAlign: 'left' }}>موجودی فعلی کیف پول</span>
                <Icon
                    name="visibility"
                    size={16}
                    color="#fff"
                    style={{
                        width: 30,
                        height: 30,
                        borderRadius: 8,
                        background: 'rgba(255,255,255,.18)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                />
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: layout.amtDir,
                    alignItems: layout.amtAlign,
                    gap: 6,
                    justifyContent: layout.balAlign
                }}
            >
                <span style={{ fontSize: 15, color: '#FFEADD', fontWeight: 500 }}>تومان</span>
                <span style={{ fontSize: 34, fontWeight: 700, color: '#fff', letterSpacing: '.5px' }}>{formatNumber(balance)}</span>
            </div>
            <button
                onClick={onCharge}
                style={{
                    border: 'none',
                    background: '#fff',
                    color: '#D9540F',
                    fontSize: 14.5,
                    fontWeight: 600,
                    padding: '13px 18px',
                    borderRadius: 11,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8
                }}
            >
                <Icon name="add" size={19} />
                <span>شارژ کیف پول</span>
            </button>
        </div>
    );
};

export default WalletBalance;
