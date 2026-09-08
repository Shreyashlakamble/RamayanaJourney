import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

function HeroSection() {
  return (
    <section
      className="
        relative isolate min-h-screen overflow-hidden
        bg-[var(--hero-start)]
        text-[var(--text)]
        transition-colors duration-500
        dark:bg-[var(--hero-start)]
        dark:text-white
      "
    >
      <div
        className="
          absolute inset-0 -z-20
          bg-[radial-gradient(circle_at_50%_35%,var(--hero-glow),transparent_36%)]
        "
        aria-hidden="true"
      />

      <div
        className="
          absolute inset-0 -z-10
          bg-gradient-to-br
          from-transparent
          via-transparent
          to-[var(--hero-end)]
        "
        aria-hidden="true"
      />

      <div
        className="
          absolute inset-0 -z-10
          bg-[radial-gradient(circle_at_20%_55%,rgba(196,147,69,0.08),transparent_28%)]
        "
        aria-hidden="true"
      />

      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6 pb-24 pt-32 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p
            className="
              mb-6 text-sm font-medium uppercase
              tracking-[0.45em]
              text-[var(--primary)]
              dark:text-[var(--accent)]
            "
          >
            Ramayana Journey
          </p>

          <h1
            className="
              text-balance text-5xl font-semibold
              tracking-[-0.04em]
              text-[var(--text)]
              sm:text-6xl
              md:text-7xl
              lg:text-8xl
            "
          >
            Journey Through
            <span
              className="
                mt-2 block
                text-[var(--primary)]
                dark:text-[var(--accent)]
              "
            >
              the Ramayana
            </span>
          </h1>

          <p
            className="
              mx-auto mt-8 max-w-2xl
              text-base leading-7
              text-[var(--text-muted)]
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
                rounded-full
                bg-[var(--primary)]
                px-7 py-3.5
                text-sm font-medium text-white
                shadow-lg shadow-black/10
                transition-all duration-300
                hover:-translate-y-0.5
                hover:bg-[var(--primary-dark)]
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
                border border-[var(--border)]
                bg-[var(--surface)]/60
                px-7 py-3.5
                text-sm font-medium
                text-[var(--text)]
                backdrop-blur-md
                transition-all duration-300
                hover:-translate-y-0.5
                hover:bg-[var(--surface)]
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
          text-center
          text-[var(--text-muted)]
        "
      >
        <p className="mb-2 text-[10px] uppercase tracking-[0.3em]">
          Begin the journey
        </p>

        <div
          className="
            mx-auto h-10 w-px
            bg-gradient-to-b
            from-[var(--accent)]
            to-transparent
          "
        />
      </div>
    </section>
  )
}

export default HeroSection