import { getBodyTypes } from '@/utils/Request';
import { vehicleTypeSet } from '@/utils/services/vehicleTypes';
import { useEffect, useState } from 'react';

const CAR_HEAD_BRAND_ID = 5;

const normalize = (value) =>
  String(value || '')
    .replace(/[‌\s]/g, '')
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .trim();

const headField = (type) => type?.HeadBrandId ?? type?.headBrandId ?? null;

const carLabels = () => vehicleTypeSet(CAR_HEAD_BRAND_ID).items.map((item) => normalize(item.label));

const scopeTypes = (apiTypes, head) => {
  if (apiTypes.some((type) => headField(type) != null)) {
    return apiTypes.filter((type) => Number(headField(type) ?? CAR_HEAD_BRAND_ID) === head);
  }
  if (head === CAR_HEAD_BRAND_ID) return apiTypes;
  const taken = carLabels();
  return apiTypes.filter((type) => !taken.includes(normalize(type.Name)));
};

export const bodyTypeItems = (headBrandId, apiTypes = []) => {
  const head = Number(headBrandId) || CAR_HEAD_BRAND_ID;
  const scoped = scopeTypes(apiTypes, head);

  return vehicleTypeSet(head).items.map((item) => {
    const match = scoped.find((type) => normalize(type.Name) === normalize(item.label));
    const fallback = apiTypes.length ? null : item.bodyTypeId ?? null;
    return { ...item, bodyTypeId: match ? match.Id : fallback };
  });
};

export const bodyTypeName = (apiTypes = [], id) =>
  apiTypes.find((type) => String(type.Id) === String(id))?.Name || '';

let cached = null;
let pending = null;

const loadBodyTypes = () => {
  if (cached) return Promise.resolve(cached);
  if (!pending) {
    pending = getBodyTypes()
      .then((list) => {
        cached = list;
        return list;
      })
      .catch(() => [])
      .finally(() => {
        pending = null;
      });
  }
  return pending;
};

export const useBodyTypeItems = (headBrandId) => {
  const [apiTypes, setApiTypes] = useState(cached || []);

  useEffect(() => {
    let alive = true;
    loadBodyTypes().then((list) => {
      if (alive) setApiTypes(list);
    });
    return () => {
      alive = false;
    };
  }, []);

  return bodyTypeItems(headBrandId, apiTypes);
};

export { CAR_HEAD_BRAND_ID };
