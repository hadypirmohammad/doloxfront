# راهنمای اتصال Next.js به ChatHub (SignalR)

> این مستند برای توسعه‌دهنده فرانت‌اند نوشته شده تا بتواند اپلیکیشن چت را در **Next.js** با استفاده از **SignalR** پیاده‌سازی کند.

---

## ۱. مقدمه

سمت سرور از **SignalR** (ASP.NET Core) استفاده می‌کند. کلاس `ChatHub` یک Hub با احراز هویت (`[Authorize]`) است که ارتباط بلادرنگ (Real-time) چت را مدیریت می‌کند. کلاینت Next.js باید از طریق کتابخانه `@microsoft/signalr` به این Hub متصل شود.

### پیش‌نیازها

```bash
npm install @microsoft/signalr
```

---

## ۲. ساختار دیتای دریافتی (DTO ها)

### ۲.۱. `ChatMessageDto`

هر پیام دریافتی از سرور شامل فیلدهای زیر است:

| فیلد           | نوع    | توضیح                              |
|----------------|--------|------------------------------------|
| `messageId`    | `number` | شناسه یکتای پیام                  |
| `conversationId` | `number` | شناسه مکالمه                     |
| `senderId`     | `number` | شناسه کاربر فرستنده              |
| `content`      | `string` | محتوای پیام (متنی)               |
| `sentAt`       | `string` | زمان ارسال به فرمت ISO 8601 (UTC) |

### ۲.۲. وضعیت پیام (`MessageState`)

| مقدار    | توضیح                         |
|----------|-------------------------------|
| `Sent`   | پیام ارسال شده، هنوز دیده نشده |
| `Seen`   | پیام توسط گیرنده دیده شده      |

---

## ۳. متدهای سرور (Server Methods)

متدهایی که کلاینت می‌تواند **فراخوانی** کند:

### ۳.۱. `SendMessage(receiverId, content)`

ارسال یک پیام به کاربر دیگر.

| پارامتر     | نوع     | توضیح                            | اجباری |
|-------------|---------|----------------------------------|--------|
| `receiverId` | `number` | شناسه کاربر گیرنده               | بله    |
| `content`    | `string` | متن پیام (فیلد خالی نادیده گرفته می‌شود) | بله    |

**نکات رفتاری:**
- سرور به‌صورت خودکار مکالمه (`Conversation`) را ایجاد می‌کند در صورت عدم وجود.
- اگر `receiverId` با شناسه کاربر فعلی یکسان باشد، پیام به‌عنوان **پیام خودت** (Self-Chat) ذخیره می‌شود.
- پس از ذخیره، پیام از طریق رویداد `ReceiveMessage` به فرستنده و گیرنده ارسال می‌شود.

```ts
await connection.invoke("SendMessage", receiverId, "سلام!");
```

### ۳.۲. `MarkAsSeen(messageId)`

علامت‌گذاری یک پیام به‌عنوان دیده‌شده.

| پارامتر    | نوع     | توضیح                     | اجباری |
|------------|---------|---------------------------|--------|
| `messageId` | `number` | شناسه پیام                | بله    |

**نکات رفتاری:**
- فقط اگر پیام قبلاً `Seen` نباشد، تغییر وضعیت اعمال می‌شود.
- پس از تغییر، رویداد `MessageSeen` به فرستنده اصلی پیام ارسال می‌شود.

```ts
await connection.invoke("MarkAsSeen", messageId);
```

---

## ۴. رویدادهای دریافتی کلاینت (Client Methods)

رویدادهایی که سرور **ارسال** می‌کند و کلاینت باید به آن‌ها گوش دهد:

### ۴.۱. `ReceiveMessage(chatMessageDto)`

هر بار که پیام جدیدی ارسال یا دریافت می‌شود (هم برای فرستنده، هم برای گیرنده).

```ts
connection.on("ReceiveMessage", (message: ChatMessageDto) => {
  // اضافه کردن پیام به لیست مکالمه
  // اگر conversationId فعال نیست، آپدیت لیست مکالمات
});
```

### ۴.۲. `MessageSeen(messageId)`

زمانی که گیرنده پیام را دیده باشد، این رویداد به **فرستنده اصلی** ارسال می‌شود.

```ts
connection.on("MessageSeen", (messageId: number) => {
  // آپدیت آیکن وضعیت پیام به "دیده شده"
});
```

---

## ۵. مکانیزم اتصال و احراز هویت

### ۵.۱. نقطه اتصال (Hub Endpoint)

```text
POST  /hubs/chat/negotiate
GET   /hubs/chat (WebSocket)
```

URL پایه سرور را در متغیر محیطی `NEXT_PUBLIC_API_URL` قرار دهید.

### ۵.۲. توکن احراز هویت

Hub دارای ویژگی `[Authorize]` است. کلاینت باید توکن JWT خود را در هدر `Authorization` ارسال کند. در SignalR این کار از طریق `accessTokenFactory` انجام می‌شود.

### ۵.۳. رفتار اتصال

- هنگام اتصال، سرور کاربر را به گروهی با نام **شناسه عددی کاربر** (`UserId`) اضافه می‌کند.
- این یعنی پیام‌ها دقیقاً به کاربر صحیح路由 می‌شوند، حتی اگر کاربر چند تب باز داشته باشد (همه تب‌ها پیام را دریافت می‌کنند).

---

## ۶. پیاده‌سازی در Next.js

### ۶.۱. تایپ‌ها

```ts
// types/chat.ts

export interface ChatMessageDto {
  messageId: number;
  conversationId: number;
  senderId: number;
  content: string;
  sentAt: string; // ISO 8601 UTC
}

export type MessageState = "Sent" | "Seen";
```

### ۶.۲. سرویس اتصال SignalR

```ts
// lib/signalr.ts

import { HubConnectionBuilder, LogLevel, HubConnection } from "@microsoft/signalr";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

let connection: HubConnection | null = null;

export function getConnection(token: string): HubConnection {
  if (connection) return connection;

  connection = new HubConnectionBuilder()
    .withUrl(`${API_URL}/hubs/chat`, {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
    .configureLogging(LogLevel.Information)
    .build();

  return connection;
}

export async function startConnection(token: string): Promise<HubConnection> {
  const conn = getConnection(token);

  if (conn.state === "Disconnected") {
    await conn.start();
  }

  return conn;
}

export async function stopConnection(): Promise<void> {
  if (connection) {
    await connection.stop();
    connection = null;
  }
}
```

### ۶.۳. هوک React برای مدیریت چت

```tsx
// hooks/useChat.ts

"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { startConnection, stopConnection } from "@/lib/signalr";
import type { ChatMessageDto } from "@/types/chat";

interface UseChatOptions {
  token: string | null;
  userId: number;
  onReceiveMessage?: (message: ChatMessageDto) => void;
  onMessageSeen?: (messageId: number) => void;
}

export function useChat({
  token,
  userId,
  onReceiveMessage,
  onMessageSeen,
}: UseChatOptions) {
  const connectionRef = useRef<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    (async () => {
      const conn = await startConnection(token);
      if (cancelled) return;

      connectionRef.current = conn;

      conn.on("ReceiveMessage", (message: ChatMessageDto) => {
        onReceiveMessage?.(message);
      });

      conn.on("MessageSeen", (messageId: number) => {
        onMessageSeen?.(messageId);
      });

      conn.onreconnected(() => setIsConnected(true));
      conn.onclose(() => setIsConnected(false));
      setIsConnected(true);
    })();

    return () => {
      cancelled = true;
      stopConnection();
      setIsConnected(false);
    };
  }, [token]);

  const sendMessage = useCallback(
    async (receiverId: number, content: string) => {
      const conn = connectionRef.current;
      if (!conn) throw new Error("SignalR not connected");

      await conn.invoke("SendMessage", receiverId, content);
    },
    []
  );

  const markAsSeen = useCallback(
    async (messageId: number) => {
      const conn = connectionRef.current;
      if (!conn) throw new Error("SignalR not connected");

      await conn.invoke("MarkAsSeen", messageId);
    },
    []
  );

  return { isConnected, sendMessage, markAsSeen };
}
```

### ۶.۴. مثال استفاده در کامپوننت

```tsx
// app/chat/page.tsx

"use client";

import { useChat } from "@/hooks/useChat";
import { useState } from "react";
import type { ChatMessageDto } from "@/types/chat";

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessageDto[]>([]);
  const [input, setInput] = useState("");
  const receiverId = 2; // شناسه کاربر گیرنده

  const { isConnected, sendMessage, markAsSeen } = useChat({
    token: "YOUR_JWT_TOKEN",
    userId: 1, // شناسه کاربر فعلی
    onReceiveMessage: (msg) => {
      setMessages((prev) => [...prev, msg]);
    },
    onMessageSeen: (messageId) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.messageId === messageId ? { ...m, seen: true } : m
        )
      );
    },
  });

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(receiverId, input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto border">
      <header className="p-4 border-b font-bold">
        وضعیت: {isConnected ? "متصل" : "قطع"}
      </header>

      <ul className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <li
            key={msg.messageId}
            className={`p-2 rounded max-w-[75%] ${
              msg.senderId === 1 ? "self-end bg-blue-500 text-white" : "self-start bg-gray-200"
            }`}
          >
            {msg.content}
            <span className="block text-xs opacity-70 mt-1">
              {new Date(msg.sentAt).toLocaleTimeString("fa-IR")}
            </span>
          </li>
        ))}
      </ul>

      <div className="p-4 border-t flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="پیام خود را بنویسید..."
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          ارسال
        </button>
      </div>
    </div>
  );
}
```

---

## ۷. خلاصه فلوهای کلیدی

### ۷.۱. ارسال پیام

```
فرستنده                سرور (ChatHub)              گیرنده
   |                         |                         |
   |-- SendMessage ---------->|                         |
   |                         |-- ذخیره در دیتابیس ---->|
   |                         |                         |
   |<-- ReceiveMessage -------|<-- ReceiveMessage ------|
```

### ۷.۲. خواندن پیام (Seen)

```
گیرنده                 سرور (ChatHub)              فرستنده
   |                         |                         |
   |-- MarkAsSeen ---------->|                         |
   |                         |-- آپدیت در دیتابیس      |
   |                         |                         |
   |                         |-- MessageSeen ---------->|
```

---

## ۸. نکات مهم برای فرانت‌اند

1. **مدیریت توکن:** توکن JWT باید از طریق `accessTokenFactory` به SignalR پاس داده شود. اگر توکن منقضی شود، باید اتصال مجدد با توکن جدید برقرار شود.

2. **اتصال خودکار:** در نمونه کد بالا `withAutomaticReconnect` فعال است. اما پس از قطع اتصال به‌دلیل انقضای توکن، باید `connection.stop()` و اتصال مجدد با توکن جدید انجام شود.

3. **چند تب:** سرور کاربر را به گروه شناسه‌اش اضافه می‌کند. بنابراین همه تب‌های باز یک کاربر پیام‌ها را دریافت می‌کنند. فرانت باید Duplicate Message را مدیریت کند (بر اساس `messageId`).

4. **Self-Chat:** اگر `receiverId === senderId` باشد، سرور فقط یک `MessageStatus` (Seen) ایجاد می‌کند و پیام فقط به گروه خود کاربر ارسال می‌شود.

5. **زمان (`sentAt`):** سرور زمان را به UTC ذخیره و ارسال می‌کند. در نمایش باید به منطقه زمانی کاربر تبدیل شود.

6. **فیلد خالی:** اگر `content` خالی یا فقط فاصله باشد، سرور پیام را نادیده می‌گیرد و هیچ رویدادی ارسال نمی‌شود. فرانت باید قبل از ارسال اعتبارسنجی کند.