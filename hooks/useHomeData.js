'use client';

import { useEffect, useRef, useState } from 'react';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const cache = new Map();

function getCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

export function useHomeData(headBrandId) {
  const [ads, setAds] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      const cacheKey = `home-${headBrandId}`;
      const cached = getCache(cacheKey);
      
      if (cached) {
        if (!cancelled) {
          setAds(cached.ads || []);
          setBrands(cached.brands || []);
          setLoading(false);
        }
        return;
      }

      if (!cancelled) setLoading(true);

      try {
        const [adsRes, brandsRes] = await Promise.all([
          fetch(`/api/home/ads?headBrandId=${headBrandId}`).then(r => r.ok ? r.json() : []),
          fetch(`/api/home/brands?headBrandId=${headBrandId}`).then(r => r.ok ? r.json() : []),
        ]);

        if (!cancelled) {
          setAds(Array.isArray(adsRes) ? adsRes : []);
          setBrands(Array.isArray(brandsRes) ? brandsRes : []);
          setCache(cacheKey, { ads: adsRes, brands: brandsRes });
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [headBrandId]);

  return { ads, brands, loading, error };
}