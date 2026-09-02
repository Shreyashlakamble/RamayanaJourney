import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variants: Record<ButtonVariant, string> = {
    primary:
      'bg-[#a85422] text-white hover:bg-[#7d3e18] focus:ring-[#a85422]',

    secondary:
      'border border-[#ddd4c6] bg-[#fcfaf5] text-[#211d18] hover:bg-[#eee8dc] focus:ring-[#a85422]',

    ghost:
      'text-[#6f675d] hover:bg-[#eee8dc] hover:text-[#211d18] focus:ring-[#a85422]',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button