import { Link } from 'react-router-dom'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'

function Navbar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header
      className="
        absolute inset-x-0 top-0 z-50
        border-b border-black/10 bg-white/5
        backdrop-blur-md
        dark:border-white/10
        dark:bg-black/10
      "
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link
          to="/"
          className="
            text-xl font-semibold tracking-[-0.02em]
            text-stone-900
            transition-colors duration-300
            dark:text-white
          "
        >
          Ramayana Journey
        </Link>

        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              to="/"
              className="
                text-sm font-medium
                text-stone-800
                transition-colors duration-300
                hover:text-[#a85422]
                dark:text-white/80
                dark:hover:text-white
              "
            >
              Home
            </Link>

            <Link
              to="/journey"
              className="
                text-sm font-medium
                text-stone-800
                transition-colors duration-300
                hover:text-[#a85422]
                dark:text-white/80
                dark:hover:text-white
              "
            >
              Journey
            </Link>

            <Link
              to="/locations"
              className="
                text-sm font-medium
                text-stone-800
                transition-colors duration-300
                hover:text-[#a85422]
                dark:text-white/80
                dark:hover:text-white
              "
            >
              Locations
            </Link>

            <Link
              to="/about"
              className="
                text-sm font-medium
                text-stone-800
                transition-colors duration-300
                hover:text-[#a85422]
                dark:text-white/80
                dark:hover:text-white
              "
            >
              About
            </Link>
          </nav>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === 'light'
                ? 'Switch to dark mode'
                : 'Switch to light mode'
            }
            className="
              flex h-10 w-10 items-center justify-center
              rounded-full
              border border-stone-300
              bg-white/70
              text-stone-700
              backdrop-blur-md
              transition-all duration-300
              hover:scale-105
              hover:bg-white
              dark:border-white/15
              dark:bg-white/10
              dark:text-white
              dark:hover:bg-white/15
            "
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Sun className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar