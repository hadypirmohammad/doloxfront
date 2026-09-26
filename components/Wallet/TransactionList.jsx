import React from 'react';
import Link from 'next/link';
import { TransactionCard, TransactionRow } from './TransactionItem';

const recentColumns = '1.3fr .9fr .7fr .9fr';

const TransactionList = ({ transactions, layout, onOpen }) => {
    return (
        <div
            style={{
                background: '#fff',
                border: '1px solid #EDEEF1',
                borderRadius: 16,
                padding: 22,
                display: 'flex',
                flexDirection: 'column',
                gap: 4
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 12,
                    flexDirection: 'row-reverse'
                }}
            >
                <Link href="/wallet/transactions" style={{ fontSize: 12.5, fontWeight: 500, color: '#F4661C' }}>
                    مشاهده همه
                </Link>
                <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#17191D' }}>تراکنش‌های اخیر</h2>
            </div>

            {layout.isDesktop ? (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: recentColumns,
                            gap: 8,
                            background: '#F7F8FA',
                            borderRadius: 10,
                            padding: '12px 14px',
                            fontSize: 12,
                            color: '#7A8087',
                            fontWeight: 500
                        }}
                    >
                        <span>نوع تراکنش</span>
                        <span>مبلغ (تومان)</span>
                        <span>وضعیت</span>
                        <span>تاریخ و ساعت</span>
                    </div>
                    {transactions.map((transaction) => (
                        <TransactionRow key={transaction.id} transaction={transaction} columns={recentColumns} onOpen={onOpen} />
                    ))}
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {transactions.map((transaction) => (
                        <TransactionCard key={transaction.id} transaction={transaction} onOpen={onOpen} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TransactionList;
