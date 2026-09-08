const IMAGE_BASE_URL =
  import.meta.env.VITE_IMAGE_BASE_URL?.replace(/\/$/, '') || ''

export function getImageUrl(path: string) {
  if (!path) {
    return ''
  }

  if (/^https?:\/\//i.test(path)) {
    return path
  }

  const normalizedPath = path.replace(/^\/+/, '')

  return IMAGE_BASE_URL
    ? `${IMAGE_BASE_URL}/${normalizedPath}`
    : `/${normalizedPath}`
}

export const IMAGE_PATHS = {
  hero: {
    placeholder: '/images/hero/hero-placeholder.svg',
  },
} as const