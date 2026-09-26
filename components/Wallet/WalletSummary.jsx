import React from 'react';
import Icon from './Icon';
import { formatNumber, toPersianDigits } from '@/utils/Cal';

const StatCard = ({ icon, iconBg, iconFg, label, value, valueSize, hint }) => {
    return (
        <div
            style={{
                background: '#fff',
                border: '1px solid #EDEEF1',
                borderRadius: 16,
                padding: 18,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10
            }}
        >
            <Icon
                name={icon}
                size={21}
                color={iconFg}
                style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            />
            <span style={{ fontSize: 12.5, color: '#8A9096' }}>{label}</span>
            <span style={{ fontSize: valueSize, fontWeight: 700, color: '#1B1E22' }}>{value}</span>
            <span style={{ fontSize: 12, color: '#9AA0A8' }}>{hint}</span>
        </div>
    );
};

const WalletSummary = ({ summary, layout }) => {
    return (
        <div
            style={{
                flex: '1 1 320px',
                display: 'grid',
                gridTemplateColumns: layout.statCols,
                gap: 16,
                alignContent: 'center'
            }}
        >
            <StatCard
                icon="calendar_month"
                iconBg="#EFF0FE"
                iconFg="#5A62C7"
                label="آخرین تراکنش"
                value={summary.lastTransactionDate}
                valueSize={16}
                hint={summary.lastTransactionTime}
            />
            <StatCard
                icon="swap_horiz"
                iconBg="#EEF3FF"
                iconFg="#3F6FD8"
                label="تعداد تراکنش‌ها"
                value={toPersianDigits(summary.transactionCount)}
                valueSize={18}
                hint="تراکنش"
            />
            <StatCard
                icon="arrow_upward"
                iconBg="#FDEDE3"
                iconFg="#E2732B"
                label="مجموع مبلغ برداشت شده"
                value={formatNumber(summary.totalWithdrawn)}
                valueSize={17}
                hint="تومان"
            />
            <StatCard
                icon="arrow_downward"
                iconBg="#E8F7EE"
                iconFg="#2E9E5B"
                label="مجموع مبلغ واریز شده"
                value={formatNumber(summary.totalDeposited)}
                valueSize={17}
                hint="تومان"
            />
        </div>
    );
};

export default WalletSummary;
