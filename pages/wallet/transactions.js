import React, { useState } from 'react';
import { useRouter } from 'next/router';
import WalletShell from '@/components/Wallet/WalletShell';
import TransactionFilters from '@/components/Wallet/TransactionFilters';
import { TransactionCard, TransactionRow } from '@/components/Wallet/TransactionItem';
import TransactionDetailModal from '@/components/Wallet/TransactionDetailModal';
import Pagination from '@/components/Wallet/Pagination';
import EmptyState from '@/components/Wallet/EmptyState';
import { PREVIEW_WITHOUT_LOGIN, getToken, withAuth } from '@/utils/Auth';
import { getWalletTransactions } from '@/utils/Request';
import { filterMockTransactions } from '@/utils/services/wallet.mock';
import { buildTransactionQuery, extractTransactions } from '@/utils/services/wallet';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { getLayout } from '@/utils/WalletUI';
import { toPersianDigits } from '@/utils/Cal';

const columns = '1.2fr .8fr .7fr .9fr .9fr .5fr';

export async function getServerSideProps(context) {
    const authResult = await withAuth(context);

    if (authResult.redirect) {
        return authResult;
    }

    const token = await getToken(context);

    const query = {
        kind: context.query.kind || 'all',
        status: context.query.status || 'all',
        fromDate: context.query.fromDate || '',
        toDate: context.query.toDate || '',
        page: Number(context.query.page) || 1,
        perPage: 8,
    };

    const filters = buildTransactionQuery(query);
    const result = await getWalletTransactions(
        token,
        query.page,
        query.perPage,
        filters.type,
        filters.status,
        filters.fromDate,
        filters.toDate
    );
    const { items, total } = extractTransactions(result);

    return {
        props: {
            query,
            items,
            total,
        },
    };
}

const Transactions = ({ user, query, items, total }) => {
    const router = useRouter();
    const isDesktop = useIsDesktop();
    const layout = getLayout(isDesktop);
    const [detail, setDetail] = useState(null);

    const mock = items.length || !PREVIEW_WITHOUT_LOGIN ? null : filterMockTransactions(query);
    const list = mock ? mock.items : items;
    const count = mock ? mock.total : total;

    const pushQuery = (next) => {
        const params = {};
        Object.entries({ ...query, ...next }).forEach(([key, value]) => {
            if (value && value !== 'all' && key !== 'perPage') {
                params[key] = value;
            }
        });
        router.push({ pathname: '/wallet/transactions', query: params });
    };

    return (
        <WalletShell
            user={user}
            layout={layout}
            title="همه تراکنش‌ها"
            subtitle="مشاهده و فیلتر تراکنش‌های کیف پول"
            crumb="تراکنش‌ها"
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <TransactionFilters
                    layout={layout}
                    initial={query}
                    onApply={(next) => pushQuery({ ...next, page: 1 })}
                    onReset={() => router.push('/wallet/transactions')}
                />

                {list.length === 0 ? (
                    <EmptyState layout={layout} onAction={() => router.push('/payment/confirm?amount=500000')} />
                ) : (
                    <div
                        style={{
                            background: '#fff',
                            border: '1px solid #EDEEF1',
                            borderRadius: 16,
                            padding: 22,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 14
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: 12.5, color: '#9AA0A8' }}>{toPersianDigits(count) + ' تراکنش'}</span>
                            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#17191D' }}>همه تراکنش‌ها</h2>
                        </div>

                        {isDesktop ? (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: columns,
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
                                    <span>شماره پیگیری</span>
                                    <span />
                                </div>
                                {list.map((transaction) => (
                                    <TransactionRow
                                        key={transaction.id}
                                        transaction={transaction}
                                        columns={columns}
                                        showTracking
                                        onOpen={setDetail}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {list.map((transaction) => (
                                    <TransactionCard key={transaction.id} transaction={transaction} showTracking onOpen={setDetail} />
                                ))}
                            </div>
                        )}

                        <Pagination
                            page={query.page}
                            perPage={query.perPage}
                            total={count}
                            onChange={(page) => pushQuery({ page })}
                        />
                    </div>
                )}
            </div>

            {detail ? <TransactionDetailModal transaction={detail} layout={layout} onClose={() => setDetail(null)} /> : null}
        </WalletShell>
    );
};

export default Transactions;
