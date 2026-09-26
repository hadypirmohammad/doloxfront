import { BackendURL } from './URL';

/**
 * Same algorithm as AdsItem / ImageGallery:
 * BackendURL without trailing slash + relative API path.
 */
export function resolveBackendMediaUrl(path, fallback = '/media/images/samplebrand.png') {
  if (!path) return fallback;
  if (path.startsWith('http') || path.startsWith('/media')) return path;
  const finalPath = `${BackendURL.slice(0, -1)}${path}`;
  console.log('resolveBackendMediaUrl:', { path, finalPath });
  return finalPath;
}
