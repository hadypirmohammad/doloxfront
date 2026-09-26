const STORAGE_KEY = "dolox_chat_peer_ad_context";

export function buildAdContextFromAd(ad) {
  if (!ad) return null;

  const adId = ad.AdId ?? ad.adId;
  if (!adId && !ad.Title) return null;

  return {
    adId: adId ?? null,
    title: ad.Title ?? "",
    brand: ad.Brand ?? "",
    mainBrand: ad.MainBrand ?? "",
    headBrand: ad.HeadBrand ?? "",
    city: ad.City ?? "",
    year: ad.Year ?? "",
    price: ad.Price ?? null,
    worked: ad.Worked ?? null,
    isAgreement: Boolean(ad.IsAgreement),
    coverImage: ad.CoverImage ?? "",
    enTitle: ad.En_Title ?? ad.EnTitle ?? "",
  };
}

export function formatAdContextTitle(adContext) {
  if (!adContext) return "";
  if (adContext.title) return adContext.title;
  const parts = [adContext.brand, adContext.year].filter(Boolean);
  return parts.join(" ") || "";
}

export function formatAdContextSubtitle(adContext) {
  if (!adContext) return "";

  const parts = [];
  if (adContext.mainBrand && adContext.mainBrand !== adContext.brand) {
    parts.push(adContext.mainBrand);
  } else if (adContext.brand) {
    parts.push(adContext.brand);
  }
  if (adContext.city) parts.push(adContext.city);
  if (adContext.year) parts.push(String(adContext.year));

  return parts.join(" · ");
}

export function formatAdContextMeta(adContext, formatPrice) {
  if (!adContext) return "";

  if (adContext.isAgreement) return "قیمت توافقی";
  if (adContext.price > 0 && formatPrice) {
    return `${formatPrice(adContext.price)} تومان`;
  }
  if (adContext.worked != null && adContext.worked >= 0) {
    return `${adContext.worked} کیلومتر`;
  }
  return "";
}

export function getConversationDisplayLabel(conversation) {
  if (!conversation) return "";
  const fromAd = formatAdContextTitle(conversation.adContext);
  if (fromAd) return fromAd;
  if (conversation.peerLabel && !/^کاربر\s+\d+$/u.test(conversation.peerLabel)) {
    return conversation.peerLabel;
  }
  return "گفت‌وگو";
}

export function getSellerDisplayLabel(adContext) {
  if (adContext?.brand) return adContext.brand;
  return "فروشنده";
}

export function attachAdContextToConversation(conversation, adContext) {
  if (!conversation || !adContext) return conversation;
  return {
    ...conversation,
    adContext,
    peerLabel: formatAdContextTitle(adContext) || conversation.peerLabel,
  };
}

function loadAllPeerContexts() {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveAllPeerContexts(map) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function cachePeerAdContext(peerUserId, adContext) {
  if (!peerUserId || !adContext) return;
  const map = loadAllPeerContexts();
  map[String(peerUserId)] = adContext;
  saveAllPeerContexts(map);
}

export function loadPeerAdContext(peerUserId) {
  if (!peerUserId) return null;
  const map = loadAllPeerContexts();
  return map[String(peerUserId)] ?? null;
}

export function resolveAdCoverUrl(coverImage, backendUrl = "https://api.dolox.ir") {
  if (!coverImage) return "";
  if (coverImage.startsWith("http")) return coverImage;
  const base = backendUrl.replace(/\/$/, "");
  const path = coverImage.startsWith("/") ? coverImage : `/${coverImage}`;
  return `${base}${path}`;
}

export function enrichConversationsWithAdContext(conversations) {
  if (!Array.isArray(conversations)) return [];
  return conversations.map((conversation) => {
    if (conversation.adContext) return conversation;
    const cached = loadPeerAdContext(conversation.peerUserId);
    if (!cached) return conversation;
    return attachAdContextToConversation(conversation, cached);
  });
}
