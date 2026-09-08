
import type {
  ImgHTMLAttributes,
  SyntheticEvent,
} from 'react'
import { getImageUrl } from '../../config/images'

interface OptimizedImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string
  alt: string
  fallbackSrc?: string
}

function OptimizedImage({
  src,
  alt,
  fallbackSrc,
  loading = 'lazy',
  decoding = 'async',
  ...props
}: OptimizedImageProps) {
  const imageUrl = getImageUrl(src)
  const fallbackUrl = fallbackSrc ? getImageUrl(fallbackSrc) : ''

  const handleError = (event: SyntheticEvent<HTMLImageElement>) => {
    if (!fallbackUrl) {
      return
    }

    const image = event.currentTarget

    if (image.src === fallbackUrl) {
      return
    }

    image.src = fallbackUrl
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      loading={loading}
      decoding={decoding}
      onError={handleError}
      {...props}
    />
  )
}

export default OptimizedImage