import Button from '../components/ui/Button'

function HomePage() {
  return (
    <section className="flex min-h-[calc(100vh-9rem)] items-center bg-[#f7f3eb] px-6">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-5 text-sm font-medium uppercase tracking-[0.35em] text-[#a85422]">
          Ramayana Journey
        </p>

        <h1 className="text-5xl font-semibold tracking-[-0.03em] text-[#211d18] md:text-7xl">
          Walking through the story.
        </h1>

        <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-[#6f675d] md:text-xl">
          Explore the places, landscapes, stories, and memories connected with
          the Ramayana across India.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Button type="button">Explore the Journey</Button>

          <Button type="button" variant="secondary">
            Discover Locations
          </Button>
        </div>
      </div>
    </section>
  )
}

export default HomePage