import { parseCookies } from 'nookies';
import { setFavorite } from './Request';

const STORAGE_KEY = 'dolox_favorites';
const ITEMS_KEY = 'dolox_favorite_items';

const read = (key) => {
  if (typeof window === 'undefined') return {};

  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (error) {
    return {};
  }
};

const write = (key, value) => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save favorites:', error);
  }
};

export const favoriteToken = () => {
  if (typeof window === 'undefined') return '';
  return parseCookies(null)?.access || '';
};

export const getFavorites = (kind) => {
  const all = read(STORAGE_KEY);
  return Array.isArray(all[kind]) ? all[kind] : [];
};

export const isFavorite = (kind, id) => {
  if (id == null) return false;
  return getFavorites(kind).some((item) => String(item) === String(id));
};

export const getFavoriteItems = (kind) => {
  const all = read(ITEMS_KEY);
  const bucket = all[kind];
  if (!bucket || typeof bucket !== 'object') return [];

  return getFavorites(kind)
    .map((id) => bucket[String(id)])
    .filter(Boolean);
};

const storeLocally = (kind, id, favorite, snapshot) => {
  const ids = read(STORAGE_KEY);
  const list = Array.isArray(ids[kind]) ? ids[kind] : [];

  ids[kind] = favorite
    ? [...new Set([...list, String(id)])]
    : list.filter((item) => String(item) !== String(id));

  write(STORAGE_KEY, ids);

  const items = read(ITEMS_KEY);
  const bucket = items[kind] && typeof items[kind] === 'object' ? items[kind] : {};

  if (favorite) {
    if (snapshot) bucket[String(id)] = snapshot;
  } else {
    delete bucket[String(id)];
  }

  items[kind] = bucket;
  write(ITEMS_KEY, items);
};

export const toggleFavorite = async (kind, id, current, snapshot) => {
  if (id == null) return Boolean(current);

  const next = !current;
  storeLocally(kind, id, next, snapshot);

  const token = favoriteToken();
  if (token) {
    setFavorite(token, kind, id, next);
  }

  return next;
};
