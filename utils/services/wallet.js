import { toGregorian, toJalaali } from 'jalaali-js';
import { toPersianDigits } from '@/utils/Cal';
import { codeByKind, codeByStatus, defaultKindMeta, kindByCode, kindMeta, statusByCode, statusMeta } from '@/utils/WalletUI';

const TEHRAN_OFFSET_MINUTES = 210;

const kindByName = {
    deposit: 'deposit',
    purchase: 'purchase',
    buy: 'purchase',
    refund: 'refund',
    adjustment: 'adjustment',
    adminadjustment: 'adjustment',
    admindeduction: 'adjustment'
};

const statusByName = {
    success: 'success',
    succeeded: 'success',
    paid: 'success',
    failed: 'failed',
    failure: 'failed',
    canceled: 'failed',
    cancelled: 'failed',
    pending: 'pending',
    processing: 'pending'
};

function pick(source, keys) {
    for (const key of keys) {
        const value = source?.[key];
        if (value !== undefined && value !== null && value !== '') return value;
    }
    return undefined;
}

function pad(value) {
    return String(value).padStart(2, '0');
}

function toTehran(value) {
    if (!value) return null;

    const raw = String(value);
    const zoned = /(Z|[+-]\d{2}:?\d{2})$/.test(raw) ? raw : raw + 'Z';
    const date = new Date(zoned);

    if (Number.isNaN(date.getTime())) return null;

    return new Date(date.getTime() + TEHRAN_OFFSET_MINUTES * 60000);
}

function formatDate(value) {
    const date = toTehran(value);
    if (!date) return '';

    try {
        const shamsi = toJalaali(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
        return toPersianDigits(shamsi.jy + '/' + pad(shamsi.jm) + '/' + pad(shamsi.jd));
    } catch {
        return '';
    }
}

function formatTime(value) {
    const date = toTehran(value);
    if (!date) return '';
    return toPersianDigits(pad(date.getUTCHours()) + ':' + pad(date.getUTCMinutes()));
}

export function resolveKind(value) {
    if (value === undefined || value === null || value === '') return 'deposit';
    if (kindMeta[value]) return value;

    const name = kindByName[String(value).toLowerCase().replace(/[\s_-]/g, '')];
    return name || kindByCode[Number(value)] || 'deposit';
}

export function resolveStatus(value) {
    if (value === undefined || value === null || value === '') return 'pending';
    if (statusMeta[value]) return value;

    const name = statusByName[String(value).toLowerCase().replace(/[\s_-]/g, '')];
    return name || statusByCode[Number(value)] || 'pending';
}

export function toGregorianDate(value) {
    const parts = String(value ?? '')
        .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
        .split(/[\/\-]/)
        .map((part) => Number(part.trim()));

    if (parts.length !== 3 || parts.some((part) => !Number.isFinite(part) || part <= 0)) return '';

    try {
        const { gy, gm, gd } = toGregorian(parts[0], parts[1], parts[2]);
        return gy + '-' + pad(gm) + '-' + pad(gd);
    } catch {
        return '';
    }
}

export function buildTransactionQuery(query = {}) {
    return {
        type: codeByKind[query.kind] || '',
        status: codeByStatus[query.status] || '',
        fromDate: toGregorianDate(query.fromDate),
        toDate: toGregorianDate(query.toDate)
    };
}

export const depositLimits = {
    minDeposit: 1000,
    maxDepositPerTransaction: 10000000,
    maxBalance: 50000000
};

export const emptyBalance = {
    balance: 0,
    isBlocked: false,
    updatedAt: '',
    currency: 'IRT',
    ...depositLimits
};

export const emptySummary = {
    balance: 0,
    isBlocked: false,
    lastTransactionDate: '—',
    lastTransactionTime: '',
    transactionCount: 0,
    totalDeposited: 0,
    totalWithdrawn: 0,
    totalRefunded: 0,
    recentTransactions: []
};

export function normalizeBalance(data) {
    if (!data) return null;

    return {
        balance: Number(pick(data, ['balanceToman', 'BalanceToman', 'balance', 'Balance']) ?? 0),
        isBlocked: Boolean(pick(data, ['isBlocked', 'IsBlocked'])),
        updatedAt: pick(data, ['updatedAt', 'UpdatedAt']) ?? '',
        currency: 'IRT',
        ...depositLimits
    };
}

export function normalizeSummary(data) {
    if (!data) return null;

    const stats = pick(data, ['statistics', 'Statistics']) || {};
    const recent = normalizeTransactions(pick(data, ['recentTransactions', 'RecentTransactions']) || []);
    const updatedAt = pick(data, ['updatedAt', 'UpdatedAt']);

    return {
        balance: Number(pick(data, ['balanceToman', 'BalanceToman', 'balance']) ?? 0),
        isBlocked: Boolean(pick(data, ['isBlocked', 'IsBlocked'])),
        lastTransactionDate: recent[0]?.date || formatDate(updatedAt),
        lastTransactionTime: recent[0]?.time || formatTime(updatedAt),
        transactionCount: Number(pick(stats, ['totalTransactions', 'TotalTransactions']) ?? 0),
        totalDeposited: Number(pick(stats, ['totalDeposits', 'TotalDeposits']) ?? 0),
        totalWithdrawn: Number(pick(stats, ['totalPurchases', 'TotalPurchases']) ?? 0),
        totalRefunded: Number(pick(stats, ['totalRefunds', 'TotalRefunds']) ?? 0),
        recentTransactions: recent
    };
}

export function normalizeTransaction(item, index = 0) {
    const kind = resolveKind(pick(item, ['type', 'Type', 'transactionType', 'TransactionType', 'kind', 'Kind']));
    const meta = kindMeta[kind] || defaultKindMeta;
    const createdAt = pick(item, ['createdAt', 'CreatedAt', 'CreateDate', 'TransactionDate', 'Date', 'date']);
    const amount = Number(pick(item, ['amountToman', 'AmountToman', 'amount', 'Amount', 'Price', 'Value']) || 0);

    return {
        id: pick(item, ['id', 'Id', 'transactionId', 'TransactionId', 'WalletTransactionId']) ?? index + 1,
        kind,
        title: pick(item, ['description', 'Description', 'title', 'Title', 'Describe']) || meta.label,
        amount: Math.abs(amount),
        direction: meta.direction,
        status: resolveStatus(pick(item, ['status', 'Status', 'State'])),
        date: formatDate(createdAt) || pick(item, ['date']) || '',
        time: formatTime(createdAt) || pick(item, ['time']) || '',
        trackingCode: pick(item, ['gatewayTrackId', 'GatewayTrackId', 'trackId', 'TrackId', 'trackingCode', 'orderId']) ?? '',
        bankRefId: pick(item, ['referenceCode', 'ReferenceCode', 'refId', 'RefId', 'bankRefId', 'ReferenceId']) ?? '',
        gateway: pick(item, ['gateway', 'Gateway', 'PaymentGateway']) ?? '',
        balanceAfter: Number(pick(item, ['balanceAfterToman', 'BalanceAfterToman', 'balanceAfter', 'BalanceAfter', 'RemainBalance']) ?? 0)
    };
}

export function normalizeTransactions(list) {
    return Array.isArray(list) ? list.map(normalizeTransaction) : [];
}

export function extractTransactions(result) {
    const items = Array.isArray(result)
        ? result
        : result?.items ?? result?.Items ?? result?.Queryable ?? [];

    return {
        items: normalizeTransactions(items),
        total: result?.totalCount ?? result?.TotalCount ?? result?.RowCount ?? result?.total ?? items.length
    };
}
