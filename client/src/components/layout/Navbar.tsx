import {
  Compass,
  Home,
  Info,
  MapPinned,
  Menu,
  Moon,
  Sun,
  X,
} from 'lucide-react'
import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { useState } from 'react'

import { useTheme } from '../../contexts/ThemeContext'

function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false)

  const isJourneyPage =
    location.pathname === '/journey'

  const navItems = [
    {
      to: '/',
      label: 'Home',
      icon: Home,
    },
    {
      to: '/journey',
      label: 'Journey',
      icon: Compass,
    },
    {
      to: '/locations',
      label: 'Locations',
      icon: MapPinned,
    },
    {
      to: '/about',
      label: 'About',
      icon: Info,
    },
  ]

  const handleMobileNavigation = (
    path: string,
  ) => {
    setMobileMenuOpen(false)
    navigate(path)
  }

  /*
   * On Journey mobile, the JourneyMapShell
   * owns the mobile navigation menu.
   *
   * On desktop, Navbar remains visible.
   */
  const headerClass = isJourneyPage
    ? `
        absolute
        inset-x-0
        top-0
        z-[1500]
        hidden
        border-b
        border-black/10
        bg-[var(--surface)]/90
        backdrop-blur-md
        md:block
        dark:border-white/10
        dark:bg-[var(--background)]/90
      `
    : `
        absolute
        inset-x-0
        top-0
        z-[1500]
        border-b
        border-black/10
        bg-[var(--surface)]/90
        backdrop-blur-md
        dark:border-white/10
        dark:bg-[var(--background)]/90
      `

  return (
    <>
      <header className={headerClass}>
        <div
          className="
            mx-auto
            flex
            h-20
            max-w-7xl
            items-center
            justify-between
            px-6
            lg:px-8
          "
        >
          {/* Logo */}
          <Link
            to="/"
            className="
              text-xl
              font-semibold
              tracking-[-0.02em]
              text-stone-900
              transition-colors
              duration-300
              dark:text-white
            "
          >
            Ramayana Journey
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-6 md:flex">
            <nav className="flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="
                    text-sm
                    font-medium
                    text-stone-800
                    transition-colors
                    duration-300
                    hover:text-[var(--primary)]
                    dark:text-white/80
                    dark:hover:text-white
                  "
                >
                  {item.label}
                </Link>
              ))}
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
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-stone-300
                bg-white/70
                text-stone-700
                backdrop-blur-md
                transition-all
                duration-300
                hover:scale-105
                hover:bg-white
                dark:border-white/15
                dark:bg-white/10
                dark:text-white
                dark:hover:bg-white/15
              "
            >
              {theme === 'light' ? (
                <Moon
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              ) : (
                <Sun
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              )}
            </button>
          </div>

          {/* Mobile controls */}
          {!isJourneyPage && (
            <div className="flex items-center gap-2 md:hidden">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={
                  theme === 'light'
                    ? 'Switch to dark mode'
                    : 'Switch to light mode'
                }
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-stone-300
                  bg-white/80
                  text-stone-700
                  shadow-sm
                  dark:border-white/15
                  dark:bg-white/10
                  dark:text-white
                "
              >
                {theme === 'light' ? (
                  <Moon
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                ) : (
                  <Sun
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                )}
              </button>

              <button
                type="button"
                onClick={() =>
                  setMobileMenuOpen(
                    (current) => !current,
                  )
                }
                aria-label={
                  mobileMenuOpen
                    ? 'Close navigation menu'
                    : 'Open navigation menu'
                }
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-stone-300
                  bg-white/80
                  text-stone-700
                  shadow-sm
                  dark:border-white/15
                  dark:bg-white/10
                  dark:text-white
                "
              >
                {mobileMenuOpen ? (
                  <X
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                ) : (
                  <Menu
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                )}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Global mobile navigation */}
      {!isJourneyPage &&
        mobileMenuOpen && (
          <div
            className="
              fixed
              inset-0
              z-[1600]
              md:hidden
            "
          >
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={() =>
                setMobileMenuOpen(false)
              }
              className="
                absolute
                inset-0
                bg-black/40
                backdrop-blur-[2px]
              "
            />

            <div
              className="
                absolute
                right-0
                top-0
                flex
                h-full
                w-[min(88vw,360px)]
                flex-col
                bg-[var(--surface)]
                text-[var(--text)]
                shadow-2xl
              "
            >
              <div className="flex items-center justify-between border-b border-[var(--border)] p-5">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--primary)]">
                    Ramayana Journey
                  </p>

                  <p className="mt-1 text-sm text-[var(--text-muted)]">
                    Navigate the site
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                  aria-label="Close menu"
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[var(--border)]
                  "
                >
                  <X
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                </button>
              </div>

              <nav className="p-4">
                <p className="mb-3 px-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  Pages
                </p>

                <div className="space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon

                    const isActive =
                      location.pathname ===
                      item.to

                    return (
                      <button
                        key={item.to}
                        type="button"
                        onClick={() =>
                          handleMobileNavigation(
                            item.to,
                          )
                        }
                        className={`
                          flex
                          w-full
                          items-center
                          gap-3
                          rounded-xl
                          border
                          px-4
                          py-3
                          text-left
                          text-sm
                          font-medium
                          ${
                            isActive
                              ? 'border-[var(--primary)]/30 bg-[var(--accent-soft)]/30'
                              : 'border-[var(--border)] bg-[var(--background)]'
                          }
                        `}
                      >
                        <Icon
                          className="h-4 w-4 text-[var(--primary)]"
                          aria-hidden="true"
                        />

                        {item.label}
                      </button>
                    )
                  })}
                </div>
              </nav>

              <div className="mt-auto border-t border-[var(--border)] p-4">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-xl
                    border
                    border-[var(--border)]
                    bg-[var(--background)]
                    px-4
                    py-3
                    text-sm
                  "
                >
                  <span className="flex items-center gap-3">
                    {theme === 'light' ? (
                      <Moon
                        className="h-4 w-4"
                        aria-hidden="true"
                      />
                    ) : (
                      <Sun
                        className="h-4 w-4"
                        aria-hidden="true"
                      />
                    )}

                    {theme === 'light'
                      ? 'Dark mode'
                      : 'Light mode'}
                  </span>

                  <span className="text-xs text-[var(--text-muted)]">
                    Toggle
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
    </>
  )
}

export default Navbar