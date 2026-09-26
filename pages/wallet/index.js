import React, { useState } from 'react';
import { useRouter } from 'next/router';
import WalletShell from '@/components/Wallet/WalletShell';
import WalletBalance from '@/components/Wallet/WalletBalance';
import WalletSummary from '@/components/Wallet/WalletSummary';
import FeatureStrip from '@/components/Wallet/FeatureStrip';
import DepositForm from '@/components/Wallet/DepositForm';
import TransactionList from '@/components/Wallet/TransactionList';
import TransactionDetailModal from '@/components/Wallet/TransactionDetailModal';
import EmptyState from '@/components/Wallet/EmptyState';
import { PREVIEW_WITHOUT_LOGIN, getToken, withAuth } from '@/utils/Auth';
import { getWalletBalance, getWalletSummary, getWalletTransactions } from '@/utils/Request';
import { mockBalance, mockSummary, filterMockTransactions } from '@/utils/services/wallet.mock';
import { emptyBalance, emptySummary, extractTransactions, normalizeBalance, normalizeSummary } from '@/utils/services/wallet';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { getLayout } from '@/utils/WalletUI';

export async function getServerSideProps(context) {
    const authResult = await withAuth(context);

    if (authResult.redirect) {
        return authResult;
    }

    const token = await getToken(context);

    const [balance, summary, transactions] = await Promise.all([
        getWalletBalance(token),
        getWalletSummary(token),
        getWalletTransactions(token, 1, 5),
    ]);

    return {
        props: {
            balance: normalizeBalance(balance),
            summary: normalizeSummary(summary),
            transactions: extractTransactions(transactions).items,
        },
    };
}

const Wallet = ({ user, balance, summary, transactions }) => {
    const router = useRouter();
    const isDesktop = useIsDesktop();
    const layout = getLayout(isDesktop);
    const [detail, setDetail] = useState(null);

    const balanceData = balance || (PREVIEW_WITHOUT_LOGIN ? mockBalance : emptyBalance);
    const summaryData = summary || (PREVIEW_WITHOUT_LOGIN ? mockSummary : emptySummary);
    const list = transactions?.length
        ? transactions
        : PREVIEW_WITHOUT_LOGIN
          ? filterMockTransactions({ page: 1, perPage: 5 }).items
          : [];

    const goToPayment = (amount) => router.push('/payment/confirm?amount=' + amount);

    return (
        <WalletShell
            user={user}
            layout={layout}
            title="کیف پول من"
            subtitle="مدیریت موجودی، تراکنش‌ها و شارژ کیف پول"
            crumb="کیف پول"
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: layout.gap }}>
                <div style={{ display: 'flex', flexDirection: layout.topDir, gap: 20, alignItems: 'center' }}>
                    <WalletSummary summary={summaryData} layout={layout} />
                    <WalletBalance
                        balance={balanceData.balance}
                        layout={layout}
                        onCharge={() => goToPayment(balanceData.balance)}
                    />
                </div>

                {isDesktop ? <FeatureStrip layout={layout} /> : null}

                <div style={{ display: 'grid', gridTemplateColumns: layout.twoCols, gap: 20, alignItems: 'start' }}>
                    <DepositForm limits={balanceData} onSubmit={goToPayment} />
                    {list.length > 0 ? (
                        <TransactionList transactions={list} layout={layout} onOpen={setDetail} />
                    ) : (
                        <EmptyState layout={layout} onAction={() => goToPayment(balanceData.minDeposit)} />
                    )}
                </div>
            </div>

            {detail ? <TransactionDetailModal transaction={detail} layout={layout} onClose={() => setDetail(null)} /> : null}
        </WalletShell>
    );
};

export default Wallet;
