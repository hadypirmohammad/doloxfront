import React from 'react';
import { useRouter } from 'next/router';
import WalletShell from '@/components/Wallet/WalletShell';
import PaymentResult, { buildResultView } from '@/components/Wallet/PaymentResult';
import { PREVIEW_WITHOUT_LOGIN, getToken, withAuth } from '@/utils/Auth';
import { verifyWalletDeposit } from '@/utils/Request';
import { mockVerifiedDeposit } from '@/utils/services/wallet.mock';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { getLayout } from '@/utils/WalletUI';

export async function getServerSideProps(context) {
    const authResult = await withAuth(context);

    if (authResult.redirect) {
        return authResult;
    }

    const token = await getToken(context);
    const trackId = context.query.trackId || context.query.trackid || context.query.tracking || '';
    const amount = Number(context.query.amount) || 0;

    const verified = trackId ? await verifyWalletDeposit(token, trackId) : '';
    const succeeded = /true|success|موفق/i.test(verified);

    return {
        props: {
            forcedStatus: context.query.status || (trackId ? (succeeded ? 'success' : 'failed') : ''),
            amount,
            trackId,
            payload: verified
                ? {
                      status: succeeded ? 'success' : 'failed',
                      amount,
                      trackingCode: trackId,
                      date: '',
                      time: '',
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
