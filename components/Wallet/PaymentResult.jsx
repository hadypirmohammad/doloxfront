import React from 'react';
import Icon from './Icon';
import { formatNumber } from '@/utils/Cal';

export function buildResultView(status, amount, trackingCode, dateTime) {
    if (status === 'success') {
        return {
            glyph: 'check',
            bg: '#E8F7EE',
            fg: '#1E8E4E',
            animation: 'none',
            title: 'پرداخت با موفقیت انجام شد',
            description: 'کیف پول شما شارژ شد و مبلغ بلافاصله قابل استفاده است.',
            amount: '+ ' + formatNumber(amount) + ' تومان',
            amountLabel: 'مبلغ شارژ شده',
            amountColor: '#1E8E4E',
            trackingCode,
            dateTime,
            primaryLabel: 'بازگشت به کیف پول',
            secondaryLabel: 'مشاهده تراکنش‌ها',
            note: 'رسید این تراکنش به شماره موبایل شما پیامک شد.'
        };
    }

    if (status === 'failed') {
        return {
            glyph: 'close',
            bg: '#FDECEC',
            fg: '#C93F3F',
            animation: 'none',
            title: 'پرداخت انجام نشد',
            description: 'تراکنش از سوی درگاه بانکی تایید نشد. در صورت کسر مبلغ، حداکثر تا ۷۲ ساعت به حساب شما باز می‌گردد.',
            amount: formatNumber(amount) + ' تومان',
            amountLabel: 'مبلغ درخواستی',
            amountColor: '#2A2D31',
            trackingCode,
            dateTime,
            primaryLabel: 'تلاش مجدد',
            secondaryLabel: 'بازگشت به کیف پول',
            note: 'کد خطا: PSP-۱۰۱ – انصراف کاربر یا اتمام زمان پرداخت'
        };
    }

    return {
        glyph: 'progress_activity',
        bg: '#FFF4E3',
        fg: '#A9740D',
        animation: 'dlxSpin 1.4s linear infinite',
        title: 'پرداخت شما در حال بررسی است',
        description: 'نتیجه تراکنش هنوز از درگاه بانکی دریافت نشده است. این صفحه به‌صورت خودکار به‌روزرسانی می‌شود.',
        amount: formatNumber(amount) + ' تومان',
        amountLabel: 'مبلغ در انتظار تایید',
        amountColor: '#2A2D31',
        trackingCode,
        dateTime,
        primaryLabel: 'بررسی مجدد وضعیت',
        secondaryLabel: 'بازگشت به کیف پول',
        note: 'در صورت کسر مبلغ و تایید نشدن تراکنش، وجه به‌صورت خودکار برگشت می‌خورد.'
    };
}

const PaymentResult = ({ view, layout, onPrimary, onSecondary }) => {
    return (
        <div
            style={{
                maxWidth: 520,
                width: '100%',
                margin: '0 auto',
                background: '#fff',
                border: '1px solid #EDEEF1',
                borderRadius: 18,
                padding: layout.resultPad,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 16,
                textAlign: 'center'
            }}
        >
            <Icon
                name={view.glyph}
                size={38}
                color={view.fg}
                style={{
                    width: 74,
                    height: 74,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: view.bg,
                    animation: view.animation
                }}
            />
            <h2 style={{ margin: 0, fontSize: 19, fontWeight: 700, color: '#17191D' }}>{view.title}</h2>
            <p style={{ margin: 0, fontSize: 13.5, color: '#8A9096', lineHeight: 2, maxWidth: 380 }}>{view.description}</p>
            <div
                style={{
                    width: '100%',
                    background: '#FAFAFB',
                    border: '1px solid #F0F1F4',
                    borderRadius: 14,
                    padding: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #F0F1F4' }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: view.amountColor }}>{view.amount}</span>
                    <span style={{ fontSize: 12.5, color: '#8A9096' }}>{view.amountLabel}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #F0F1F4' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#2A2D31', direction: 'ltr' }}>{view.trackingCode}</span>
                    <span style={{ fontSize: 12.5, color: '#8A9096' }}>شماره پیگیری</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0' }}>
                    <span style={{ fontSize: 13, color: '#2A2D31' }}>{view.dateTime}</span>
                    <span style={{ fontSize: 12.5, color: '#8A9096' }}>تاریخ و ساعت</span>
                </div>
            </div>
            <div style={{ width: '100%', display: 'grid', gridTemplateColumns: layout.resBtnCols, gap: 10 }}>
                <button
                    className="dlx-primary"
                    onClick={onPrimary}
                    style={{
                        border: 'none',
                        background: '#F4661C',
                        color: '#fff',
                        fontSize: 14.5,
                        fontWeight: 600,
                        padding: 14,
                        borderRadius: 11,
                        cursor: 'pointer'
                    }}
                >
                    {view.primaryLabel}
                </button>
                <button
                    onClick={onSecondary}
                    style={{
                        border: '1px solid #E6E7EB',
                        background: '#fff',
                        color: '#5D636A',
                        fontSize: 14,
                        fontWeight: 500,
                        padding: 14,
                        borderRadius: 11,
                        cursor: 'pointer'
                    }}
                >
                    {view.secondaryLabel}
                </button>
            </div>
            <p style={{ margin: 0, fontSize: 12, color: '#9AA0A8', lineHeight: 2 }}>{view.note}</p>
        </div>
    );
};

export default PaymentResult;
