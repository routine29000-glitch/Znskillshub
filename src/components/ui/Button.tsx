import { motion, type HTMLMotionProps } from 'framer-motion'
import { type ReactNode } from 'react'
import { useSound } from '@/hooks/useSound'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'gold'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: ReactNode
  children: ReactNode
}

const variants = {
  primary:   'bg-gradient-to-br from-primary to-primary-dark text-white shadow-glow hover:shadow-[0_0_25px_rgba(108,99,255,0.6)]',
  secondary: 'bg-white/5 dark:bg-white/5 border border-white/10 text-white dark:text-white hover:border-primary hover:text-primary',
  danger:    'bg-gradient-to-br from-red-500 to-red-700 text-white',
  ghost:     'text-primary hover:bg-primary/10',
  gold:      'bg-gradient-to-br from-gold to-gold-dark text-gray-900 font-black shadow-glow-gold',
}

const sizes = {
  sm: 'px-4 py-2 text-sm rounded-xl',
  md: 'px-6 py-3 text-base rounded-xl',
  lg: 'px-8 py-4 text-lg rounded-2xl',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  disabled,
  className = '',
  onClick,
  ...props
}: ButtonProps) {
  const { play } = useSound()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading) {
      play('click')
      onClick?.(e)
    }
  }

  return (
    <motion.button
      whileHover={disabled || loading ? {} : { scale: 1.02, y: -1 }}
      whileTap={disabled || loading ? {} : { scale: 0.97 }}
      className={`
        relative inline-flex items-center justify-center gap-2 font-bold
        transition-all duration-200 cursor-pointer select-none
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
        </svg>
      ) : icon}
      {children}
    </motion.button>
  )
}
