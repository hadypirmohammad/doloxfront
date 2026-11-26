import React from 'react';
import Icon from './Icon';

const features = [
    { icon: 'headset_mic', title: 'پشتیبانی ۲۴/۷', lines: ['در هر زمان در کنار شما هستیم', 'سوالات خود را با ما در میان بگذارید'] },
    { icon: 'percent', title: 'بدون کارمزد', lines: ['شارژ کیف پول در دولوکس', 'کاملاً رایگان و بدون کارمزد است'] },
    { icon: 'schedule', title: 'واریز آنی', lines: ['شارژ کیف پول در کمترین زمان', 'به صورت آنی انجام می‌شود'] },
    { icon: 'verified_user', title: 'امنیت بالا', lines: ['تراکنش‌های شما با بالاترین', 'استانداردهای امنیتی محافظت می‌شود'] }
];

const FeatureStrip = ({ layout }) => {
    return (
        <div
            style={{
                background: '#fff',
                border: '1px solid #EDEEF1',
                borderRadius: 16,
                padding: '26px 20px',
                display: 'grid',
                gridTemplateColumns: layout.featCols,
                gap: 24
            }}
        >
            {features.map((feature, index) => (
                <div
                    key={feature.title}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 9,
                        textAlign: 'center',
                        borderRight: index === 0 ? undefined : layout.featDiv,
                        paddingRight: index === 0 ? undefined : layout.featPad
                    }}
                >
                    <Icon name={feature.icon} size={26} color="#FF5E00" />
                    <span style={{ fontSize: 14.5, fontWeight: 600, color: '#1B1E22' }}>{feature.title}</span>
                    <span style={{ fontSize: 12.5, color: '#8A9096', lineHeight: 1.9 }}>
                        {feature.lines[0]}
                        <br />
                        {feature.lines[1]}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default FeatureStrip;
