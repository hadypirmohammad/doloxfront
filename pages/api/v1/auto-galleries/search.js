import { mockSearchAutoGalleries } from '@/utils/services/autoGalleries.mock'

/**
 * Mock HTTP surface for GET /api/v1/auto-galleries/search
 * Mirrors the future backend route so clients can call it the same way.
 */
export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const payload = mockSearchAutoGalleries({
    cityId: req.query.cityId,
    search: req.query.search,
    page: req.query.page,
    pageSize: req.query.pageSize,
  })

  return res.status(200).json(payload)
}
