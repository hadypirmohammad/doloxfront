import { getCarPriceDetail } from '@/utils/Request';
import { useEffect, useState } from 'react';

const cache = new Map();

export const loadModelBrand = (modelId) => {
  const key = String(modelId || '');
  if (!key) return Promise.resolve(null);
  if (!cache.has(key)) {
    cache.set(
      key,
      getCarPriceDetail(key)
        .then((detail) => {
          const car = detail?.car;
          return car ? { name: String(car.parentBrand || '').trim(), image: car.carImage || '' } : null;
        })
        .catch(() => null)
    );
  }
  return cache.get(key);
};

export const useModelBrand = (modelId, enabled = true) => {
  const [brand, setBrand] = useState(null);

  useEffect(() => {
    if (!enabled || !modelId) return undefined;
    let alive = true;
    loadModelBrand(modelId).then((value) => {
      if (alive) setBrand(value);
    });
    return () => {
      alive = false;
    };
  }, [modelId, enabled]);

  return brand;
};
