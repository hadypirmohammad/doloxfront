import React from 'react';
import { useRouter } from 'next/router';
import WalletShell from '@/components/Wallet/WalletShell';
import PaymentResult, { buildResultView } from '@/components/Wallet/PaymentResult';
import { PREVIEW_WITHOUT_LOGIN, getToken, withAuth } from '@/utils/Auth';
import { getWalletTransactions } from '@/utils/Request';
import { extractTransactions } from '@/utils/services/wallet';
import { mockVerifiedDeposit } from '@/utils/services/wallet.mock';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { getLayout } from '@/utils/WalletUI';

export async function getServerSideProps(context) {
    const authResult = await withAuth(context);

    if (authResult.redirect) {
        return authResult;
    }

    const token = await getToken(context);
    const query = context.query || {};

    const pick = (...names) => {
        for (const name of names) {
            const hit = Object.keys(query).find((key) => key.toLowerCase() === name.toLowerCase());
            if (hit && query[hit] !== '') return String(query[hit]);
        }
        return '';
    };

    const trackId = pick('trackId', 'trackid', 'tracking', 'trackingCode', 'refId', 'refid', 'authority', 'orderId');
    const amount = Number(pick('amount', 'Amount')) || 0;
    const rawStatus = pick('status', 'success', 'result', 'state');
    const failed = /^(0|-1|false|nok|fail|failed|cancel|canceled|cancelled)$/i.test(rawStatus) || /fail|cancel|ناموفق|لغو/i.test(rawStatus);
    const succeeded = !failed && (/^(1|2|100|ok|true|success|succeeded|paid)$/i.test(rawStatus) || /success|موفق/i.test(rawStatus));

    let latest = null;
    if (token) {
        try {
            const result = await getWalletTransactions(token, 1, 5);
            const { items } = extractTransactions(result);
            latest = items.find((item) => trackId && String(item.trackingCode) === String(trackId)) || items[0] || null;
        } catch (error) {
            console.error('Could not read wallet transactions:', error);
        }
    }

    const resolvedStatus = succeeded ? 'success' : failed ? 'failed' : latest?.status || '';
    const settled = Boolean(resolvedStatus);

    return {
        props: {
            forcedStatus: settled ? resolvedStatus : '',
            amount: amount || latest?.amount || 0,
            trackId: trackId || latest?.trackingCode || '',
            payload: settled
                ? {
                      status: resolvedStatus,
                      amount: amount || latest?.amount || 0,
                      trackingCode: trackId || latest?.trackingCode || '',
                      date: latest?.date || '',
                      time: latest?.time || '',
                  }
                : null,
        },
    };
}

const Result = ({ user, forcedStatus, amount, trackId, payload }) => {
    const router = useRouter();
    const isDesktop = useIsDesktop();
    const layout = getLayout(isDesktop);

    const data = payload || (PREVIEW_WITHOUT_LOGIN ? mockVerifiedDeposit(amount, trackId) : { status: 'pending', amount, trackingCode: trackId, date: '', time: '' });
    const status = forcedStatus || data.status;
    const dateTime = [data.date, data.time].filter(Boolean).join(' – ');
    const view = buildResultView(status, data.amount, data.trackingCode, dateTime);

    const primary = () => {
        if (status === 'success') router.push('/wallet');
        else if (status === 'failed') router.push('/payment/confirm?amount=' + data.amount);
        else router.replace(router.asPath);
    };

    const secondary = () => {
        if (status === 'success') router.push('/wallet/transactions');
        else router.push('/wallet');
    };

    return (
        <WalletShell
            user={user}
            layout={layout}
            title="نتیجه پرداخت"
            subtitle="وضعیت آخرین تراکنش شما"
            crumb="نتیجه پرداخت"
        >
            <PaymentResult view={view} layout={layout} onPrimary={primary} onSecondary={secondary} />
        </WalletShell>
    );
};

export default Result;
