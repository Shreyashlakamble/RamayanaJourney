function HomePage() {
  return (
    <section className="flex min-h-[calc(100vh-9rem)] items-center justify-center bg-stone-100 px-6">
      <div className="max-w-3xl text-center">
        <p className="mb-5 text-sm font-medium uppercase tracking-[0.3em] text-stone-500">
          Ramayana Journey
        </p>

        <h1 className="text-5xl font-semibold tracking-tight text-stone-900 md:text-7xl">
          Walking through the story.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-stone-600">
          Explore the places, landscapes, stories, and memories connected with
          the Ramayana across India.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button
            type="button"
            className="rounded-full bg-stone-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-700"
          >
            Explore the Journey
          </button>

          <button
            type="button"
            className="rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-medium text-stone-800 transition hover:bg-stone-50"
          >
            Discover Locations
          </button>
        </div>
      </div>
    </section>
  )
}

export default HomePage