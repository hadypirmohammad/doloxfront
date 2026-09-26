import React from 'react';
import { useRouter } from 'next/router';
import WalletShell from '@/components/Wallet/WalletShell';
import PaymentConfirm from '@/components/Wallet/PaymentConfirm';
import { getToken, withAuth } from '@/utils/Auth';
import { prepareWalletDeposit } from '@/utils/Request';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { getLayout } from '@/utils/WalletUI';

export async function getServerSideProps(context) {
    const authResult = await withAuth(context);

    if (authResult.redirect) {
        return authResult;
    }

    const token = await getToken(context);
    const amount = Number(context.query.amount) || 500000;
    const payUrl = await prepareWalletDeposit(token, amount);

    return {
        props: {
            amount,
            payUrl: payUrl || '',
        },
    };
}

const Confirm = ({ user, amount, payUrl }) => {
    const router = useRouter();
    const isDesktop = useIsDesktop();
    const layout = getLayout(isDesktop);

    const ownerName = [user?.Name, user?.LastName].filter(Boolean).join(' ');

    const order = {
        orderId: '',
        amount,
        fee: 0,
        balanceAfter: amount,
        ownerName,
        redirectUrl: payUrl,
    };

    const pay = () => {
        if (payUrl && payUrl.startsWith('http')) {
            window.location.href = payUrl;
            return;
        }
        router.push('/payment/result?amount=' + amount);
    };

    return (
        <WalletShell
            user={user}
            layout={layout}
            title="تایید پرداخت"
            subtitle="اطلاعات پرداخت را بررسی و تایید کنید"
            crumb="تایید پرداخت"
        >
            <PaymentConfirm
                order={order}
                gateways={[]}
                layout={layout}
                onPay={pay}
                onBack={() => router.push('/wallet')}
            />
        </WalletShell>
    );
};

export default Confirm;
