import { WordPressURL } from '@/utils/URL';
import { useEffect, useState } from 'react';

const MAX_TAG_PAGES = 10;

const normalize = (value) =>
  String(value || '')
    .replace(/[‌\s]+/g, ' ')
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)))
    .trim()
    .toLowerCase();

let tagIndex = null;
let tagPending = null;
const linkCache = new Map();

const loadTags = () => {
  if (tagIndex) return Promise.resolve(tagIndex);
  if (!tagPending) {
    tagPending = (async () => {
      const index = new Map();
      for (let page = 1; page <= MAX_TAG_PAGES; page += 1) {
        const response = await fetch(`${WordPressURL}tags?per_page=100&page=${page}&hide_empty=true&_fields=id,name`);
        if (!response.ok) break;
        const list = await response.json();
        if (!Array.isArray(list) || list.length === 0) break;
        list.forEach((tag) => index.set(normalize(tag.name), tag.id));
        if (list.length < 100) break;
      }
      tagIndex = index;
      return index;
    })()
      .catch(() => new Map())
      .finally(() => {
        tagPending = null;
      });
  }
  return tagPending;
};

const postLinkForTag = async (tagId) => {
  const response = await fetch(`${WordPressURL}posts?tags=${tagId}&per_page=1&_fields=link`);
  if (!response.ok) return null;
  const list = await response.json();
  return list?.[0]?.link || null;
};

export const carSpecTagName = (item) => [item?.brand, item?.model].filter(Boolean).join(' ');

export async function findCarSpecLink(item) {
  const key = normalize(carSpecTagName(item));
  if (!key) return null;
  if (linkCache.has(key)) return linkCache.get(key);

  const index = await loadTags();
  const tagId = index.get(key);
  const link = tagId ? await postLinkForTag(tagId).catch(() => null) : null;
  linkCache.set(key, link);
  return link;
}

export const useCarSpecLink = (item) => {
  const key = carSpecTagName(item);
  const [state, setState] = useState({ key: null, link: null });

  useEffect(() => {
    let alive = true;
    findCarSpecLink(item).then((link) => {
      if (alive) setState({ key, link });
    });
    return () => {
      alive = false;
    };
  }, [key]);

  return { loading: state.key !== key, link: state.key === key ? state.link : null };
};
