import React from 'react';
import DashboardPanel from '@/components/global/DashboardPanel';
import PageHeading from './PageHeading';

const WalletShell = ({ user, layout, title, subtitle, crumb, children }) => {
    return (
        <div dir="rtl" className="flex h-fit w-full justify-start bg-[#FAFAFA] px-4 pb-10 pt-6 md:pt-8">
            <DashboardPanel user={user} />
            <div className="h-full w-full px-2 sm:px-4">
                <div
                    className="mx-auto w-full max-w-screen-lg"
                    style={{ display: 'flex', flexDirection: 'column', gap: layout.gap }}
                >
                    <PageHeading title={title} subtitle={subtitle} crumb={crumb} layout={layout} />
                    {children}
                </div>
            </div>
        </div>
    );
};

export default WalletShell;
