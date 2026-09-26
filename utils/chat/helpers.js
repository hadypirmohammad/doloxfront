import { getSellerUserId } from "./userId";

function normalizeBooleanFlag(value) {
  if (value === true || value === 1 || value === "1" || value === "true") {
    return true;
  }
  if (value === false || value === 0 || value === "0" || value === "false") {
    return false;
  }
  return null;
}

function getChatAvailabilityFlag(ad) {
  const keys = ["IsChatAvalaible", "IsChatAvailable", "isChatAvalaible", "isChatAvailable"];

  for (const key of keys) {
    if (ad[key] !== undefined && ad[key] !== null) {
      return normalizeBooleanFlag(ad[key]);
    }
  }

  return undefined;
}

export function isChatEnabledForAd(ad) {
  if (!ad) return false;

  const chatAvailability = getChatAvailabilityFlag(ad);
  if (chatAvailability === false) return false;
  if (chatAvailability === true) return true;

  const explicitFlags = [
    ad.IsChatEnabled,
    ad.HasChat,
    ad.CanChat,
    ad.EnableChat,
    ad.IsChatActive,
    ad.ChatEnabled,
    ad.IsChat,
    ad.EnableChatForAd,
  ];

  for (const flag of explicitFlags) {
    if (flag === true || flag === 1) return true;
    if (flag === false || flag === 0) return false;
  }

  const planId = Number(ad.PlanId ?? ad.PlanBuyed ?? ad.Plan?.PlanId);
  if (Number.isFinite(planId) && planId > 0) {
    // Plan 1 = free — chat is a paid feature on Dolox
    return planId !== 1;
  }

  // Detail endpoint often omits PlanId/chat flags but includes seller media paths
  return Boolean(getSellerUserId(ad));
}

export function formatChatTime(sentAt) {
  if (!sentAt) return "";
  try {
    return new Date(sentAt).toLocaleTimeString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export function getPeerUserId(message, currentUserId) {
  if (!message) return null;
  if (message.senderId === currentUserId) {
    return message.receiverId ?? null;
  }
  return message.senderId;
}

export function buildConversationFromMessage(message, currentUserId, peerLabel) {
  const peerUserId =
    message.senderId === currentUserId
      ? message.receiverId
      : message.senderId;

  if (!peerUserId) return null;

  return {
    peerUserId,
    peerLabel: peerLabel || `کاربر ${peerUserId}`,
    conversationId: message.conversationId,
    lastContent: message.content,
    lastSentAt: message.sentAt,
  };
}

export function mergeMessages(existing, incoming) {
  const map = new Map();

  existing.forEach((item) => {
    map.set(item.messageId, item);
  });

  incoming.forEach((item) => {
    map.set(item.messageId, { ...map.get(item.messageId), ...item });
  });

  return Array.from(map.values()).sort(
    (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime(),
  );
}

export function findConversationForPeer(conversations, peerUserId) {
  return conversations.find((item) => item.peerUserId === peerUserId) ?? null;
}

export function ensureDraftConversation(
  conversations,
  peerUserId,
  peerLabel,
  adContext = null,
) {
  const existing = findConversationForPeer(conversations, peerUserId);
  if (existing) {
    if (!adContext) return conversations;
    return conversations.map((item) =>
      item.peerUserId === peerUserId
        ? { ...item, adContext, peerLabel: peerLabel || item.peerLabel }
        : item,
    );
  }

  return [
    {
      peerUserId,
      peerLabel: peerLabel || `کاربر ${peerUserId}`,
      adContext: adContext || null,
      conversationId: null,
      lastContent: "",
      lastSentAt: null,
    },
    ...conversations,
  ];
}
