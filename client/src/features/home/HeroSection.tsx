import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import OptimizedImage from '../../components/media/OptimizedImage'
import { IMAGE_PATHS } from '../../config/images'

function HeroSection() {
  return (
    <section
      className="
        relative isolate min-h-screen overflow-hidden
        bg-[#211d18]
        text-white
      "
    >
      <div className="absolute inset-0 -z-30">
        <OptimizedImage
          src={IMAGE_PATHS.hero.placeholder}
          alt=""
          loading="eager"
          fetchPriority="high"
          className="h-full w-full object-cover"
          aria-hidden="true"
        />
      </div>

      <div
        className="
          absolute inset-0 -z-20
          bg-black/30
        "
        aria-hidden="true"
      />

      <div
        className="
          absolute inset-0 -z-10
          bg-gradient-to-b
          from-black/10
          via-black/25
          to-black/80
        "
        aria-hidden="true"
      />

      <div
        className="
          absolute inset-0 -z-10
          bg-[radial-gradient(circle_at_50%_36%,rgba(233,194,123,0.2),transparent_30%)]
        "
        aria-hidden="true"
      />

      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6 pb-24 pt-32 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p
            className="
              mb-6 text-sm font-medium uppercase
              tracking-[0.45em]
              text-[#e9c27b]
            "
          >
            Ramayana Journey
          </p>

          <h1
            className="
              text-balance text-5xl font-semibold
              tracking-[-0.04em]
              sm:text-6xl
              md:text-7xl
              lg:text-8xl
            "
          >
            Journey Through
            <span className="mt-2 block text-[#e9c27b]">
              the Ramayana
            </span>
          </h1>

          <p
            className="
              mx-auto mt-8 max-w-2xl
              text-base leading-7
              text-white/80
              sm:text-lg sm:leading-8
            "
          >
            Explore the places, landscapes, stories, and living heritage
            connected with the journey of Shri Ram across India.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/journey"
              className="
                inline-flex items-center gap-3
                rounded-full bg-[#a85422]
                px-7 py-3.5
                text-sm font-medium text-white
                shadow-lg shadow-black/20
                transition-all duration-300
                hover:-translate-y-0.5
                hover:bg-[#7d3e18]
              "
            >
              Explore the Journey
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>

            <Link
              to="/locations"
              className="
                inline-flex items-center
                rounded-full
                border border-white/25
                bg-white/10
                px-7 py-3.5
                text-sm font-medium text-white
                backdrop-blur-md
                transition-all duration-300
                hover:-translate-y-0.5
                hover:bg-white/15
              "
            >
              Discover Locations
            </Link>
          </div>
        </div>
      </div>

      <div
        className="
          absolute bottom-8 left-1/2
          -translate-x-1/2
          text-center text-white/70
        "
      >
        <p className="mb-2 text-[10px] uppercase tracking-[0.3em]">
          Begin the journey
        </p>

        <div
          className="
            mx-auto h-10 w-px
            bg-gradient-to-b
            from-[#e9c27b]
            to-transparent
          "
        />
      </div>
    </section>
  )
}

export default HeroSection