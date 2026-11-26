import { getBrands } from '@/utils/Request';

export default async function handler(req, res) {
  const { headBrandId } = req.query;
  const id = Number(headBrandId) || 5;

  try {
    const brands = await getBrands(id, 1).catch(() => []);
    const formatted = Array.isArray(brands) ? brands.map((brand) => ({
      BrandId: brand.BrandId,
      Name: brand.Name || '',
      Image: brand.Image || '',
      headBrandId: id,
    })) : [];

    res.status(200).json(formatted);
  } catch (error) {
    console.error('Home brands error:', error);
    res.status(200).json([]);
  }
}