export const PREVIEW_USER_ID = 1001;

export const mockProfile = {
    Id: PREVIEW_USER_ID,
    FirstName: 'فرشاد',
    LastName: 'ذوالفقاری',
    Email: 'farshad@example.com',
    PhoneNumber: '09308380803',
    CityId: '',
    GenderId: 1,
    UserAvatar: '',
};

const minutesAgo = (minutes) => new Date(Date.now() - minutes * 60000).toISOString();

const previewAdContext = {
    adId: 79,
    title: 'ریرا 1405',
    brand: 'ری را',
    mainBrand: 'ایران خودرو',
    headBrand: 'سواری',
    city: 'ارومیه',
    year: '1405',
    price: 160000000,
    worked: 0,
    isAgreement: false,
    coverImage: '',
    enTitle: '',
};

export const mockConversations = [
    {
        peerUserId: 2001,
        conversationId: 9001,
        peerLabel: 'ریرا 1405',
        lastContent: 'سلام وقت شما هم بخیر 🙂',
        lastSentAt: minutesAgo(20),
        adContext: previewAdContext,
    },
    {
        peerUserId: 2002,
        conversationId: 9002,
        peerLabel: 'پژو 207 اتوماتیک',
        lastContent: 'ممنون از پاسخگویی شما',
        lastSentAt: minutesAgo(420),
        adContext: {
            ...previewAdContext,
            adId: 80,
            title: 'پژو 207 اتوماتیک',
            brand: 'پژو 207',
            mainBrand: 'ایران خودرو',
            city: 'تهران',
            year: '1403',
            price: 980000000,
        },
    },
];

export function buildMockMessages(currentUserId) {
    const swap = (id) => (id === PREVIEW_USER_ID ? currentUserId : id);

    return Object.fromEntries(
        Object.entries(mockMessages).map(([conversationId, list]) => [
            conversationId,
            list.map((message) => ({
                ...message,
                senderId: swap(message.senderId),
                receiverId: swap(message.receiverId),
            })),
        ])
    );
}

export const mockMessages = {
    9001: [
        {
            messageId: 90011,
            conversationId: 9001,
            senderId: 2001,
            receiverId: PREVIEW_USER_ID,
            content: 'سلام! 👋\nبه چت آگهی ریرا 1405 خوش اومدید.\nهر سوالی درباره این آگهی دارید همینجا بپرسید.',
            sentAt: minutesAgo(25),
            seen: true,
        },
        {
            messageId: 90012,
            conversationId: 9001,
            senderId: PREVIEW_USER_ID,
            receiverId: 2001,
            content: 'سلام وقت بخیر\nشرایط شرکت در مزایده چطوره؟',
            sentAt: minutesAgo(22),
            seen: true,
        },
        {
            messageId: 90013,
            conversationId: 9001,
            senderId: 2001,
            receiverId: PREVIEW_USER_ID,
            content: 'سلام وقت شما هم بخیر 🙂\nبرای شرکت در مزایده ابتدا باید ثبت‌نام کنید و احراز هویت را کامل نمایید.',
            sentAt: minutesAgo(20),
            seen: true,
        },
    ],
    9002: [
        {
            messageId: 90021,
            conversationId: 9002,
            senderId: PREVIEW_USER_ID,
            receiverId: 2002,
            content: 'سلام، این خودرو هنوز موجوده؟',
            sentAt: minutesAgo(430),
            seen: true,
        },
        {
            messageId: 90022,
            conversationId: 9002,
            senderId: 2002,
            receiverId: PREVIEW_USER_ID,
            content: 'بله موجوده، برای بازدید هماهنگ کنید.',
            sentAt: minutesAgo(425),
            seen: true,
        },
        {
            messageId: 90023,
            conversationId: 9002,
            senderId: PREVIEW_USER_ID,
            receiverId: 2002,
            content: 'ممنون از پاسخگویی شما',
            sentAt: minutesAgo(420),
            seen: true,
        },
    ],
};
