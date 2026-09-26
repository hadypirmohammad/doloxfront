import jwt from "jsonwebtoken";

export function getUserIdFromToken(token) {
  if (!token) return null;
  const decoded = jwt.decode(token);
  if (!decoded || typeof decoded !== "object") return null;

  const id =
    decoded.user_id ??
    decoded.UserId ??
    decoded.sub ??
    decoded.nameid ??
    decoded.id;

  if (id === undefined || id === null || id === "") return null;
  const numeric = Number(id);
  return Number.isFinite(numeric) ? numeric : null;
}

export function getUserIdFromProfile(profile) {
  if (!profile) return null;
  const id = profile.Id ?? profile.UserId ?? profile.id;
  if (id === undefined || id === null || id === "") return null;
  const numeric = Number(id);
  return Number.isFinite(numeric) ? numeric : null;
}

export function resolveCurrentUserId(token, profile) {
  return getUserIdFromProfile(profile) ?? getUserIdFromToken(token);
}

function parseUserIdFromMediaPath(path) {
  if (typeof path !== "string") return null;
  const match = path.match(/\/user\((\d+)\)\//i);
  if (!match) return null;
  const numeric = Number(match[1]);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
}

function normalizeUserId(id) {
  if (id === undefined || id === null || id === "") return null;
  const numeric = Number(id);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
}

export function getSellerUserId(ad) {
  if (!ad) return null;

  const directId = normalizeUserId(
    ad.UserId ??
      ad.OwnerId ??
      ad.CreatedByUserId ??
      ad.Gallery?.UserId ??
      ad.Gallery?.User?.Id ??
      ad.Gallery?.User?.UserId ??
      ad.User?.Id ??
      ad.User?.UserId,
  );
  if (directId) return directId;

  // Ad detail API omits UserId but keeps it in media paths, e.g. /img/Ad/user(2)/...
  return (
    parseUserIdFromMediaPath(ad.CoverImage) ??
    parseUserIdFromMediaPath(ad.Gallery?.Profile) ??
    parseUserIdFromMediaPath(ad.Gallery?.Cover)
  );
}
