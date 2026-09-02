import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <header className="border-b border-stone-200 bg-stone-50">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link
          to="/"
          className="text-xl font-semibold tracking-tight text-stone-900"
        >
          Ramayana Journey
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className="text-sm font-medium text-stone-700 transition hover:text-stone-950"
          >
            Home
          </Link>

          <Link
            to="/journey"
            className="text-sm font-medium text-stone-700 transition hover:text-stone-950"
          >
            Journey
          </Link>

          <Link
            to="/locations"
            className="text-sm font-medium text-stone-700 transition hover:text-stone-950"
          >
            Locations
          </Link>

          <Link
            to="/about"
            className="text-sm font-medium text-stone-700 transition hover:text-stone-950"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Navbar