const conversationsKey = (userId) => `dolox_chat_${userId}_conversations`;
const messagesKey = (userId, conversationId) =>
  `dolox_chat_${userId}_messages_${conversationId}`;

export function loadConversations(userId) {
  if (typeof window === "undefined" || !userId) return [];
  try {
    const raw = localStorage.getItem(conversationsKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveConversations(userId, conversations) {
  if (typeof window === "undefined" || !userId) return;
  localStorage.setItem(conversationsKey(userId), JSON.stringify(conversations));
}

export function loadMessages(userId, conversationId) {
  if (typeof window === "undefined" || !userId || !conversationId) return [];
  try {
    const raw = localStorage.getItem(messagesKey(userId, conversationId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveMessages(userId, conversationId, messages) {
  if (typeof window === "undefined" || !userId || !conversationId) return;
  localStorage.setItem(
    messagesKey(userId, conversationId),
    JSON.stringify(messages),
  );
}

export function upsertConversation(userId, conversation) {
  const list = loadConversations(userId);
  const index = list.findIndex(
    (item) =>
      item.peerUserId === conversation.peerUserId ||
      (conversation.conversationId &&
        item.conversationId === conversation.conversationId),
  );

  if (index >= 0) {
    list[index] = {
      ...list[index],
      ...conversation,
      adContext: conversation.adContext ?? list[index].adContext,
    };
  } else {
    list.unshift(conversation);
  }

  list.sort(
    (a, b) => new Date(b.lastSentAt || 0) - new Date(a.lastSentAt || 0),
  );

  saveConversations(userId, list);
  return list;
}

export function upsertMessage(userId, message) {
  const { conversationId } = message;
  if (!conversationId) return [];

  const list = loadMessages(userId, conversationId);
  const index = list.findIndex((item) => item.messageId === message.messageId);

  if (index >= 0) {
    list[index] = { ...list[index], ...message };
  } else {
    list.push(message);
  }

  list.sort(
    (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime(),
  );

  saveMessages(userId, conversationId, list);
  return list;
}

export function markMessageSeen(userId, conversationId, messageId) {
  const list = loadMessages(userId, conversationId);
  const next = list.map((item) =>
    item.messageId === messageId ? { ...item, seen: true } : item,
  );
  saveMessages(userId, conversationId, next);
  return next;
}
