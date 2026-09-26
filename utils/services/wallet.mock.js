export const mockBalance = {
    balance: 500000,
    currency: 'IRT',
    minDeposit: 1000,
    maxDepositPerTransaction: 10000000,
    maxBalance: 50000000
};

export const mockSummary = {
    lastTransactionDate: '۱۴۰۳/۰۳/۲۳',
    lastTransactionTime: '۱۴:۳۲',
    transactionCount: 24,
    totalWithdrawn: 7700000,
    totalDeposited: 8200000
};

export const mockGateways = [
    { id: 'zarinpal', label: 'زرین‌پال' },
    { id: 'mellat', label: 'درگاه بانک ملت' }
];

export const mockTransactions = [
    { id: '1', kind: 'deposit', title: 'شارژ کیف پول', amount: 500000, direction: 'in', status: 'success', date: '۱۴۰۳/۰۳/۲۳', time: '۱۴:۳۲', trackingCode: 'DLX-884521', bankRefId: '۱۰۲۹۳۴۴۵۷۸', gateway: 'زرین‌پال', balanceAfter: 500000 },
    { id: '2', kind: 'purchase', title: 'پرداخت اشتراک مزایده‌ها', amount: 250000, direction: 'out', status: 'success', date: '۱۴۰۳/۰۳/۲۱', time: '۱۱:۰۷', trackingCode: 'DLX-883904', bankRefId: '۱۰۲۹۳۴۴۵۷۸', gateway: 'زرین‌پال', balanceAfter: 250000 },
    { id: '3', kind: 'deposit', title: 'شارژ کیف پول', amount: 1000000, direction: 'in', status: 'success', date: '۱۴۰۳/۰۳/۱۸', time: '۰۹:۴۵', trackingCode: 'DLX-882760', bankRefId: '۱۰۲۹۳۴۴۵۷۸', gateway: 'زرین‌پال', balanceAfter: 750000 },
    { id: '4', kind: 'deposit', title: 'شارژ کیف پول', amount: 2000000, direction: 'in', status: 'failed', date: '۱۴۰۳/۰۳/۱۷', time: '۲۰:۱۲', trackingCode: 'DLX-882115', bankRefId: '۱۰۲۹۳۴۴۵۷۸', gateway: 'زرین‌پال', balanceAfter: 500000 },
    { id: '5', kind: 'purchase', title: 'پرداخت خلافی خودرو', amount: 180000, direction: 'out', status: 'success', date: '۱۴۰۳/۰۳/۱۵', time: '۱۶:۲۰', trackingCode: 'DLX-881433', bankRefId: '۱۰۲۹۳۴۴۵۷۸', gateway: 'زرین‌پال', balanceAfter: 320000 },
    { id: '6', kind: 'deposit', title: 'شارژ کیف پول', amount: 300000, direction: 'in', status: 'pending', date: '۱۴۰۳/۰۳/۱۴', time: '۰۸:۵۰', trackingCode: 'DLX-880921', bankRefId: '۱۰۲۹۳۴۴۵۷۸', gateway: 'زرین‌پال', balanceAfter: 320000 },
    { id: '7', kind: 'refund', title: 'بازگشت وجه خلافی خودرو', amount: 180000, direction: 'in', status: 'success', date: '۱۴۰۳/۰۳/۱۲', time: '۱۰:۱۰', trackingCode: 'DLX-880204', bankRefId: '۱۰۲۹۳۴۴۵۷۸', gateway: 'زرین‌پال', balanceAfter: 500000 },
    { id: '8', kind: 'adjustment', title: 'کسر توسط ادمین', amount: 120000, direction: 'out', status: 'success', date: '۱۴۰۳/۰۳/۰۹', time: '۱۷:۳۵', trackingCode: 'DLX-879688', bankRefId: '۱۰۲۹۳۴۴۵۷۸', gateway: '-', balanceAfter: 380000 }
];

export function filterMockTransactions(query = {}) {
    const page = Number(query.page) || 1;
    const perPage = Number(query.perPage) || 8;

    const items = mockTransactions.filter((item) => {
        if (query.kind && query.kind !== 'all' && item.kind !== query.kind) return false;
        if (query.status && query.status !== 'all' && item.status !== query.status) return false;
        return true;
    });

    return {
        items: items.slice((page - 1) * perPage, page * perPage),
        page,
        perPage,
        total: items.length
    };
}

export function mockPreparedDeposit(amount, gateway) {
    return {
        orderId: 'DLX-884521',
        amount,
        fee: 0,
        balanceAfter: mockBalance.balance + amount,
        ownerName: '',
        gateway,
        redirectUrl: ''
    };
}

export function mockVerifiedDeposit(amount, trackingCode) {
    return {
        status: 'success',
        amount,
        trackingCode: trackingCode || 'DLX-884521',
        date: '۱۴۰۳/۰۳/۲۳',
        time: '۱۴:۳۲'
    };
}
