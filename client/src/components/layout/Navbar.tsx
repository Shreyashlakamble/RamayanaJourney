import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <header className="border-b border-[#ddd4c6] bg-[#f7f3eb]/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link
          to="/"
          className="text-xl font-semibold tracking-[-0.02em] text-[#211d18]"
        >
          Ramayana Journey
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className="text-sm font-medium text-[#6f675d] transition-colors duration-300 hover:text-[#211d18]"
          >
            Home
          </Link>

          <Link
            to="/journey"
            className="text-sm font-medium text-[#6f675d] transition-colors duration-300 hover:text-[#211d18]"
          >
            Journey
          </Link>

          <Link
            to="/locations"
            className="text-sm font-medium text-[#6f675d] transition-colors duration-300 hover:text-[#211d18]"
          >
            Locations
          </Link>

          <Link
            to="/about"
            className="text-sm font-medium text-[#6f675d] transition-colors duration-300 hover:text-[#211d18]"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Navbar