import { useEffect, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react'

import OptimizedImage from '../../components/media/OptimizedImage'
import type { GalleryImage } from './types'

interface GalleryProps {
  images: GalleryImage[]
}

function Gallery({ images }: GalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<
    number | null
  >(null)

  const selectedImage =
    selectedIndex !== null
      ? images[selectedIndex]
      : undefined

  const openImage = (index: number) => {
    setSelectedIndex(index)
  }

  const closeImage = () => {
    setSelectedIndex(null)
  }

  const showPrevious = () => {
    if (
      selectedIndex === null ||
      images.length === 0
    ) {
      return
    }

    setSelectedIndex(
      selectedIndex === 0
        ? images.length - 1
        : selectedIndex - 1,
    )
  }

  const showNext = () => {
    if (
      selectedIndex === null ||
      images.length === 0
    ) {
      return
    }

    setSelectedIndex(
      selectedIndex === images.length - 1
        ? 0
        : selectedIndex + 1,
    )
  }

  useEffect(() => {
    if (selectedIndex === null) {
      return
    }

    const previousOverflow =
      document.body.style.overflow

    document.body.style.overflow = 'hidden'

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      switch (event.key) {
        case 'Escape':
          setSelectedIndex(null)
          break

        case 'ArrowLeft':
          setSelectedIndex((currentIndex) => {
            if (
              currentIndex === null ||
              images.length === 0
            ) {
              return currentIndex
            }

            return currentIndex === 0
              ? images.length - 1
              : currentIndex - 1
          })
          break

        case 'ArrowRight':
          setSelectedIndex((currentIndex) => {
            if (
              currentIndex === null ||
              images.length === 0
            ) {
              return currentIndex
            }

            return currentIndex === images.length - 1
              ? 0
              : currentIndex + 1
          })
          break

        default:
          break
      }
    }

    document.addEventListener(
      'keydown',
      handleKeyDown,
    )

    return () => {
      document.body.style.overflow =
        previousOverflow

      document.removeEventListener(
        'keydown',
        handleKeyDown,
      )
    }
  }, [selectedIndex, images.length])

  if (images.length === 0) {
    return (
      <div
        className="
          rounded-3xl
          border border-dashed border-[var(--border)]
          bg-[var(--surface)]
          p-12
          text-center
        "
      >
        <p className="text-sm text-[var(--text-muted)]">
          Location photography will appear here.
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Gallery grid */}
      <div
        className="
          grid grid-cols-2 gap-3
          md:grid-cols-3
          lg:grid-cols-4
        "
      >
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => openImage(index)}
            className="
              group
              relative
              aspect-[4/3]
              overflow-hidden
              rounded-2xl
              bg-[var(--surface-muted)]
              text-left
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--primary)]
              focus:ring-offset-2
              focus:ring-offset-[var(--background)]
            "
            aria-label={`Open ${image.alt}`}
          >
            <OptimizedImage
              src={image.src}
              alt={image.alt}
              className="
                h-full
                w-full
                object-cover
                transition-transform
                duration-700
                group-hover:scale-105
              "
            />

            <div
              className="
                pointer-events-none
                absolute inset-0
                bg-gradient-to-t
                from-black/55
                via-black/5
                to-transparent
                opacity-0
                transition-opacity
                duration-300
                group-hover:opacity-100
              "
            />

            {image.title && (
              <div
                className="
                  pointer-events-none
                  absolute inset-x-0 bottom-0
                  translate-y-2
                  px-4 pb-4
                  text-white
                  opacity-0
                  transition-all duration-300
                  group-hover:translate-y-0
                  group-hover:opacity-100
                "
              >
                <p className="text-sm font-medium">
                  {image.title}
                </p>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage &&
        selectedIndex !== null && (
          <div
            className="
              fixed inset-0 z-[2000]
              flex items-center justify-center
              bg-black/92
              px-4 py-6
              backdrop-blur-sm
            "
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                closeImage()
              }
            }}
          >
            {/* Close */}
            <button
              type="button"
              onClick={closeImage}
              aria-label="Close image viewer"
              className="
                absolute right-4 top-4 z-30
                flex h-11 w-11
                items-center justify-center
                rounded-full
                border border-white/20
                bg-white/10
                text-white
                transition
                hover:bg-white/20
                focus:outline-none
                focus:ring-2
                focus:ring-white/60
                sm:right-6
                sm:top-6
              "
            >
              <X
                className="h-5 w-5"
                aria-hidden="true"
              />
            </button>

            {/* Previous */}
            <button
              type="button"
              onClick={showPrevious}
              aria-label="Previous image"
              className="
                absolute left-3 top-1/2 z-30
                flex h-10 w-10
                -translate-y-1/2
                items-center justify-center
                rounded-full
                border border-white/20
                bg-white/10
                text-white
                transition
                hover:bg-white/20
                focus:outline-none
                focus:ring-2
                focus:ring-white/60
                sm:left-6
                sm:h-11
                sm:w-11
              "
            >
              <ChevronLeft
                className="h-5 w-5"
                aria-hidden="true"
              />
            </button>

            {/* Main image area */}
            <div
              className="
                flex
                h-full
                w-full
                max-w-[1200px]
                flex-col
                items-center
                justify-center
                px-12
                sm:px-16
              "
            >
              <div
                className="
                  flex
                  h-[72vh]
                  w-full
                  items-center
                  justify-center
                  sm:h-[76vh]
                "
              >
                <OptimizedImage
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  loading="eager"
                  className="
                    block
                    h-auto
                    max-h-full
                    w-auto
                    max-w-full
                    rounded-xl
                    object-contain
                    shadow-2xl
                  "
                />
              </div>

              {(selectedImage.title ||
                selectedImage.location) && (
                <div className="mt-4 text-center text-white">
                  {selectedImage.title && (
                    <p className="text-sm font-medium">
                      {selectedImage.title}
                    </p>
                  )}

                  {selectedImage.location && (
                    <p className="mt-1 text-xs text-white/60">
                      {selectedImage.location}
                    </p>
                  )}
                </div>
              )}

              <p className="mt-3 text-xs text-white/50">
                {selectedIndex + 1} / {images.length}
              </p>
            </div>

            {/* Next */}
            <button
              type="button"
              onClick={showNext}
              aria-label="Next image"
              className="
                absolute right-3 top-1/2 z-30
                flex h-10 w-10
                -translate-y-1/2
                items-center justify-center
                rounded-full
                border border-white/20
                bg-white/10
                text-white
                transition
                hover:bg-white/20
                focus:outline-none
                focus:ring-2
                focus:ring-white/60
                sm:right-6
                sm:h-11
                sm:w-11
              "
            >
              <ChevronRight
                className="h-5 w-5"
                aria-hidden="true"
              />
            </button>
          </div>
        )}
    </>
  )
}

export default Gallery