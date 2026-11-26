import { getLatestAds, searchAds } from '@/utils/Request';

export default async function handler(req, res) {
  const { headBrandId } = req.query;
  const id = Number(headBrandId) || 5;

  try {
    let ads = [];
    
    if (id === 5) {
      ads = await getLatestAds(8).catch(() => []);
    } else {
      ads = await searchAds(1, 8, '', null, null, null, null, null, null, null, null, null, id, null).catch(() => []);
    }

    res.status(200).json(Array.isArray(ads) ? ads : []);
  } catch (error) {
    console.error('Home ads error:', error);
    res.status(200).json([]);
  }
}