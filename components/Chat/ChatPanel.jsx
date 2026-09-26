import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { useChat } from "@/hooks/useChat";
import {
  buildConversationFromMessage,
  ensureDraftConversation,
  findConversationForPeer,
  formatChatTime,
  mergeMessages,
} from "@/utils/chat/helpers";
import {
  enrichConversationsWithAdContext,
  formatAdContextMeta,
  formatAdContextSubtitle,
  formatAdContextTitle,
  getConversationDisplayLabel,
  getSellerDisplayLabel,
  loadPeerAdContext,
  resolveAdCoverUrl,
} from "@/utils/chat/adContext";
import {
  loadConversations,
  loadMessages,
  markMessageSeen,
  saveMessages,
  upsertConversation,
  upsertMessage,
} from "@/utils/chat/storage";
import { getChatConversations, getChatMessages } from "@/utils/Request";
import { formatPrice } from "@/utils/Cal";
import { BackendURL } from "@/utils/URL";
import styles from "./chat-panel.module.css";

const QUICK_REPLIES = ["سلام، وقت بخیر", "هنوز موجوده؟", "محل بازدید کجاست؟", "امکان تخفیف هست؟"];

function buildPeerLabel(item) {
  const fullName = [item.otherUserFirstName, item.otherUserLastName]
    .filter(Boolean)
    .join(" ");

  return (
    item.peerLabel ??
    item.otherUserName ??
    item.otherUserFullName ??
    (fullName ? fullName : undefined) ??
    item.title ??
    item.adTitle ??
    "گفت‌وگو"
  );
}

function normalizeApiConversations(items) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => ({
      peerUserId: Number(
        item.otherUserId ?? item.peerUserId ?? item.userId ?? item.OtherUserId,
      ),
      peerLabel: buildPeerLabel(item),
      conversationId: item.conversationId ?? item.id ?? null,
      lastContent: item.lastMessage ?? item.lastContent ?? "",
      lastSentAt: item.lastSentAt ?? item.updatedAt ?? null,
    }))
    .filter((item) => Number.isFinite(item.peerUserId));
}

function normalizeApiMessages(items) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => ({
      messageId: Number(item.messageId ?? item.id),
      conversationId: Number(item.conversationId),
      senderId: Number(item.senderId),
      receiverId: item.receiverId ? Number(item.receiverId) : undefined,
      content: item.content ?? "",
      sentAt: item.sentAt ?? item.createdAt,
      seen: item.state === "Seen" || item.seen === true,
    }))
    .filter(
      (item) =>
        Number.isFinite(item.messageId) &&
        Number.isFinite(item.conversationId) &&
        Number.isFinite(item.senderId),
    );
}

function isMessageForCurrentChat(message, conversationId, activeReceiverId, currentUserId) {
  if (!activeReceiverId) return false;
  if (conversationId) return message.conversationId === conversationId;
  return (
    message.senderId === activeReceiverId || message.senderId === currentUserId
  );
}

function mergeConversationEntries(existing, incoming) {
  const adContext = incoming.adContext ?? existing?.adContext;
  const peerLabel =
    incoming.peerLabel ||
    formatAdContextTitle(adContext) ||
    existing?.peerLabel;

  return {
    ...existing,
    ...incoming,
    adContext,
    peerLabel,
  };
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const update = () => setIsMobile(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, [breakpoint]);

  return isMobile;
}

const ChatPanel = ({ token, userId, initialReceiverId, initialPeerLabel, previewConversations, previewMessages }) => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const messagesEndRef = useRef(null);
  const conversationIdRef = useRef(null);
  const markAsSeenRef = useRef(null);

  const [conversations, setConversations] = useState([]);
  const [activeReceiverId, setActiveReceiverId] = useState(0);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const selectedConversation = useMemo(
    () => findConversationForPeer(conversations, activeReceiverId),
    [conversations, activeReceiverId],
  );

  const conversationId = selectedConversation?.conversationId ?? null;
  conversationIdRef.current = conversationId;

  const activeAdContext = useMemo(() => {
    if (selectedConversation?.adContext) return selectedConversation.adContext;
    if (activeReceiverId) return loadPeerAdContext(activeReceiverId);
    return null;
  }, [activeReceiverId, selectedConversation]);

  const activePeerLabel = useMemo(() => {
    const fromAd = formatAdContextTitle(activeAdContext);
    if (fromAd) return fromAd;
    if (selectedConversation?.peerLabel) {
      const label = selectedConversation.peerLabel;
      if (!/^کاربر\s+\d+$/u.test(label)) return label;
    }
    if (activeReceiverId === initialReceiverId && initialPeerLabel) {
      return initialPeerLabel;
    }
    return "گفت‌وگو";
  }, [
    activeAdContext,
    activeReceiverId,
    initialPeerLabel,
    initialReceiverId,
    selectedConversation,
  ]);

  const activeSellerLabel = useMemo(
    () => getSellerDisplayLabel(activeAdContext),
    [activeAdContext],
  );

  const activeAdSubtitle = useMemo(
    () => formatAdContextSubtitle(activeAdContext),
    [activeAdContext],
  );

  const activeCoverUrl = useMemo(
    () => resolveAdCoverUrl(activeAdContext?.coverImage, BackendURL),
    [activeAdContext],
  );

  const updateSidebarFromMessage = useCallback(
    (message, peerUserId, peerLabel) => {
      const patch = buildConversationFromMessage(
        { ...message, receiverId: peerUserId },
        userId,
        peerLabel,
      );
      if (!patch) return;

      setConversations((prev) => {
        const next = upsertConversation(userId, patch);
        return next.length ? next : prev;
      });
    },
    [userId],
  );

  const handleIncomingMessage = useCallback(
    (message) => {
      const normalized = {
        messageId: Number(message.messageId),
        conversationId: Number(message.conversationId),
        senderId: Number(message.senderId),
        content: message.content ?? "",
        sentAt: message.sentAt,
        seen: false,
      };

      if (
        !Number.isFinite(normalized.messageId) ||
        !Number.isFinite(normalized.conversationId) ||
        !Number.isFinite(normalized.senderId)
      ) {
        return;
      }

      const peerUserId =
        normalized.senderId === userId ? activeReceiverId : normalized.senderId;
      if (!peerUserId) return;

      const peerLabel = getConversationDisplayLabel(
        peerUserId === activeReceiverId
          ? selectedConversation
          : findConversationForPeer(conversations, peerUserId),
      ) || "گفت‌وگو";

      updateSidebarFromMessage(normalized, peerUserId, peerLabel);
      upsertMessage(userId, normalized);

      if (
        isMessageForCurrentChat(
          normalized,
          conversationIdRef.current,
          activeReceiverId,
          userId,
        )
      ) {
        setMessages((prev) => mergeMessages(prev, [normalized]));

        if (normalized.senderId !== userId) {
          void markAsSeenRef.current?.(normalized.messageId).catch(() => {});
        }
      }
    },
    [activeReceiverId, conversations, selectedConversation, updateSidebarFromMessage, userId],
  );

  const handleMessageSeen = useCallback(
    (messageId) => {
      const currentConversationId = conversationIdRef.current;
      if (!currentConversationId) return;

      const next = markMessageSeen(userId, currentConversationId, messageId);
      setMessages((prev) =>
        prev.map((item) =>
          item.messageId === messageId ? { ...item, seen: true } : item,
        ),
      );

      if (next.length) {
        saveMessages(userId, currentConversationId, next);
      }
    },
    [userId],
  );

  const { isConnected, error, sendMessage, markAsSeen } = useChat({
    token,
    onReceiveMessage: handleIncomingMessage,
    onMessageSeen: handleMessageSeen,
  });

  markAsSeenRef.current = markAsSeen;

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    (async () => {
      const cached = enrichConversationsWithAdContext(loadConversations(userId));
      if (cached.length) setConversations(cached);
      else if (previewConversations?.length) {
        setConversations(enrichConversationsWithAdContext(previewConversations));
      }
      if (!token) return;

      const remote = normalizeApiConversations(await getChatConversations(token));
      if (cancelled) return;

      const mergedMap = new Map();
      [...cached, ...remote].forEach((item) => {
        mergedMap.set(
          item.peerUserId,
          mergeConversationEntries(mergedMap.get(item.peerUserId), item),
        );
      });

      const merged = Array.from(mergedMap.values()).sort(
        (a, b) => new Date(b.lastSentAt || 0) - new Date(a.lastSentAt || 0),
      );

      if (!merged.length && previewConversations?.length) return;

      setConversations(enrichConversationsWithAdContext(merged));
    })();

    return () => {
      cancelled = true;
    };
  }, [token, userId]);

  useEffect(() => {
    if (!initialReceiverId || !userId) return;

    if (initialReceiverId === userId) {
      toast.error("نمی‌توانید با خودتان چت کنید");
      return;
    }

    const adContext = loadPeerAdContext(initialReceiverId);
    const label =
      formatAdContextTitle(adContext) || initialPeerLabel || "گفت‌وگو";

    setConversations((prev) => {
      const next = ensureDraftConversation(
        prev,
        initialReceiverId,
        label,
        adContext,
      );
      const conversation = findConversationForPeer(next, initialReceiverId);
      if (conversation) {
        upsertConversation(userId, conversation);
      }
      return next;
    });
    setActiveReceiverId(initialReceiverId);
  }, [initialReceiverId, initialPeerLabel, userId]);

  useEffect(() => {
    if (!activeReceiverId || !userId) {
      setMessages([]);
      return;
    }

    let cancelled = false;

    (async () => {
      setLoadingHistory(true);

      const conversation = findConversationForPeer(conversations, activeReceiverId);
      let nextMessages = [];

      if (conversation?.conversationId) {
        nextMessages = loadMessages(userId, conversation.conversationId);

        const preview = previewMessages?.[conversation.conversationId];

        if (!nextMessages.length && preview) {
          nextMessages = preview;
        }

        if (token) {
          const remote = normalizeApiMessages(
            await getChatMessages(token, conversation.conversationId),
          );

          if (remote.length || !preview) {
            nextMessages = mergeMessages(nextMessages, remote);
            saveMessages(userId, conversation.conversationId, nextMessages);
          }
        }
      }

      if (!cancelled) {
        setMessages(nextMessages);
        setLoadingHistory(false);

        nextMessages.forEach((message) => {
          if (message.senderId !== userId && !message.seen) {
            void markAsSeen(message.messageId).catch(() => {});
          }
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeReceiverId, conversations, markAsSeen, token, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const navigateToReceiver = (receiverId, peerLabel = "") => {
    if (!Number.isFinite(receiverId) || receiverId <= 0) {
      toast.error("شناسه گیرنده معتبر نیست");
      return;
    }

    if (receiverId === userId) {
      toast.error("نمی‌توانید با خودتان چت کنید");
      return;
    }

    const conversation = findConversationForPeer(conversations, receiverId);
    const adContext =
      conversation?.adContext ?? loadPeerAdContext(receiverId) ?? null;
    const label =
      peerLabel ||
      formatAdContextTitle(adContext) ||
      getConversationDisplayLabel(conversation) ||
      "گفت‌وگو";

    setConversations((prev) =>
      ensureDraftConversation(prev, receiverId, label, adContext),
    );

    setActiveReceiverId(receiverId);

    const query = { receiverId: String(receiverId) };
    if (adContext?.adId) {
      query.adId = String(adContext.adId);
    }

    router.replace(
      { pathname: "/dashboard/chat", query },
      undefined,
      { shallow: true },
    );
  };

  const handleSend = async () => {
    const content = input.trim();
    if (!content || !activeReceiverId || sending) return;

    setSending(true);
    try {
      await sendMessage(activeReceiverId, content);
      setInput("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "ارسال پیام ناموفق بود");
    } finally {
      setSending(false);
    }
  };

  const handleMobileBack = () => {
    setActiveReceiverId(0);
    setMessages([]);
    router.replace({ pathname: "/dashboard/chat" }, undefined, { shallow: true });
  };

  const visibleConversations = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return conversations;
    return conversations.filter((chat) => {
      const label = getConversationDisplayLabel(chat).toLowerCase();
      const preview = (chat.lastContent || "").toLowerCase();
      return label.includes(term) || preview.includes(term);
    });
  }, [conversations, search]);

  const activeAdPrice = useMemo(
    () => formatAdContextMeta(activeAdContext, formatPrice),
    [activeAdContext]
  );

  const chatDisabled = !activeReceiverId;
  const mobileChatOpen = isMobile && activeReceiverId > 0;
  const adDetailHref = activeAdContext?.enTitle
    ? `/ad/${activeAdContext.enTitle}`
    : activeAdContext?.adId
      ? `/ad/${activeAdContext.adId}`
      : null;

  return (
    <div
      className={`${styles.container} ${mobileChatOpen ? styles.mobileChatOpen : ""}`}
    >
      <div className={styles.sidebar}>
        <div className={styles.sidebarHead}>
          <h3 className={styles.sidebarTitle}>گفت‌وگوها</h3>
          <div className={styles.sidebarStatus}>
            {error ? error : isConnected ? "متصل" : "در حال اتصال..."}
          </div>
          <label className={styles.searchBox}>
            <input
              type="text"
              className={styles.searchInput}
              value={search}
              placeholder="جست وجو در چت..."
              onChange={(event) => setSearch(event.target.value)}
            />
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="6.6" />
              <path d="M16 16l4 4" />
            </svg>
          </label>
        </div>

        <ul className={styles.list}>
          {visibleConversations.length === 0 ? (
            <li className={`${styles.listPreview} ${styles.listEmpty}`}>
              {search.trim()
                ? "گفت‌وگویی با این عنوان پیدا نشد."
                : "هنوز گفت‌وگویی ندارید. از صفحه آگهی دکمه چت را بزنید."}
            </li>
          ) : (
            visibleConversations.map((chat) => {
              const displayLabel = getConversationDisplayLabel(chat);
              const adMeta = formatAdContextSubtitle(chat.adContext);

              return (
              <li key={chat.peerUserId}>
                <button
                  type="button"
                  className={`${styles.listItem} ${
                    activeReceiverId === chat.peerUserId ? styles.listItemActive : ""
                  }`}
                  onClick={() =>
                    navigateToReceiver(chat.peerUserId, displayLabel)
                  }
                >
                  <div className={styles.listItemRow}>
                    {chat.adContext?.coverImage ? (
                      <img
                        src={resolveAdCoverUrl(chat.adContext.coverImage, BackendURL)}
                        alt=""
                        className={styles.listThumb}
                      />
                    ) : (
                      <div className={styles.listThumbPlaceholder} aria-hidden="true">
                        🚗
                      </div>
                    )}
                    <div className={styles.listItemContent}>
                      <div className={styles.listItemTitle}>
                        <strong>{displayLabel}</strong>
                        {chat.adContext ? <span className={styles.listBadge}>آگهی</span> : null}
                      </div>
                      {adMeta ? (
                        <div className={styles.listAdMeta}>{adMeta}</div>
                      ) : null}
                      <div className={styles.listPreview}>
                        {chat.lastContent || "شروع گفت‌وگو..."}
                      </div>
                    </div>
                    {chat.lastSentAt ? (
                      <span className={styles.listTime}>{formatChatTime(chat.lastSentAt)}</span>
                    ) : null}
                  </div>
                </button>
              </li>
            );
            })
          )}
        </ul>
      </div>

      <div className={styles.main}>
        {activeReceiverId > 0 ? (
          <>
            <div className={styles.header}>
              {isMobile ? (
                <button
                  type="button"
                  className={styles.backBtn}
                  onClick={handleMobileBack}
                  aria-label="بازگشت به لیست گفت‌وگوها"
                >
                  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                    <path
                      d="M9 18l6-6-6-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              ) : null}

              <div className={styles.headerMain}>
                <div className={styles.headerTitleBlock}>
                  <div className={styles.headerTitleRow}>
                    <h2 className={styles.headerTitle}>{activePeerLabel}</h2>
                    {activeAdContext ? (
                      <span className={styles.headerKicker}>آگهی</span>
                    ) : null}
                  </div>
                  <span className={styles.headerAdMeta}>
                    {activeAdSubtitle || activeSellerLabel}
                  </span>
                  {activeAdPrice ? (
                    <div className={styles.headerPrice}>
                      <span className={styles.headerPriceLabel}>قیمت</span>
                      <span className={styles.headerPriceValue} dir="ltr">
                        {activeAdPrice}
                      </span>
                    </div>
                  ) : null}
                  <span
                    className={`${styles.headerSubtitle} ${isConnected && !error ? styles.headerOnline : ""}`}
                  >
                    {isConnected && !error ? <span className={styles.onlineDot} /> : null}
                    {error ? error : isConnected ? "آنلاین" : "در حال اتصال..."}
                  </span>
                </div>
                {activeCoverUrl ? (
                  <img
                    src={activeCoverUrl}
                    alt=""
                    className={styles.headerThumb}
                  />
                ) : (
                  <div className={styles.headerThumbPlaceholder} aria-hidden="true">
                    🚗
                  </div>
                )}
                {adDetailHref ? (
                  <Link href={adDetailHref} className={styles.headerLink} aria-label="مشاهده آگهی">
                    ›
                  </Link>
                ) : null}
              </div>
            </div>

            <div className={styles.messagesArea}>
              {activeAdContext ? (
                <div className={styles.adBanner}>
                  <span className={styles.adBannerRule} />
                  {adDetailHref ? (
                    <Link href={adDetailHref} className={styles.adBannerLink}>
                      <span className={styles.adBannerText}>{`درباره آگهی ${activePeerLabel}`}</span>
                      <span aria-hidden="true">‹</span>
                    </Link>
                  ) : (
                    <span className={styles.adBannerLink}>
                      <span className={styles.adBannerText}>{`درباره آگهی ${activePeerLabel}`}</span>
                    </span>
                  )}
                  <span className={styles.adBannerRule} />
                </div>
              ) : null}

              {loadingHistory ? (
                <div className={styles.empty}>در حال بارگذاری پیام‌ها...</div>
              ) : messages.length === 0 ? (
                <div className={styles.empty}>اولین پیام را ارسال کنید.</div>
              ) : (
                messages.map((message) => {
                  const isMine = message.senderId === userId;
                  return (
                    <div
                      key={message.messageId}
                      data-message-id={message.messageId}
                      className={`${styles.msg} ${isMine ? styles.msgMe : styles.msgOther} ${
                        message.seen ? styles.msgSeen : ""
                      }`}
                    >
                      {!isMine ? (
                        <span className={styles.msgAvatar} aria-hidden="true">X</span>
                      ) : null}
                      <div className={styles.msgBubble}>
                        <div className={styles.msgBody}>{message.content}</div>
                        <div className={styles.msgInfo}>
                          <span dir="ltr">{formatChatTime(message.sentAt)}</span>
                          {isMine ? (
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                              <path d="M2 13l3.5 3.5L13 9" />
                              <path d="M9.5 13L13 16.5 20.5 9" />
                            </svg>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className={styles.quickReplies}>
              {QUICK_REPLIES.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={styles.quickReply}
                  disabled={chatDisabled}
                  onClick={() => setInput(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className={styles.inputArea}>
              <input
                type="text"
                className={styles.textInput}
                value={input}
                disabled={chatDisabled}
                placeholder="پیام خود را بنویسید..."
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    void handleSend();
                  }
                }}
              />
              <button
                type="button"
                className={styles.sendBtn}
                disabled={chatDisabled || !isConnected || sending || !input.trim()}
                onClick={() => void handleSend()}
                aria-label="ارسال پیام"
              >
                <span className={styles.sendBtnText}>ارسال</span>
                <svg
                  className={styles.sendBtnIcon}
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M3 11.5 20.5 3.5 12.5 21l-2-7.2-7.5-2.3Z" />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <div className={styles.empty}>
            یک گفت‌وگو را از لیست انتخاب کنید یا از صفحه آگهی وارد چت شوید.
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPanel;
