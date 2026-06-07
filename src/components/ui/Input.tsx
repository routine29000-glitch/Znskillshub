import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  icon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-semibold text-gray-300 dark:text-gray-300">
            {label}
            {props.required && <span className="text-red-400 mr-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={`
              w-full bg-white/5 dark:bg-surface border rounded-xl px-4 py-3
              text-white dark:text-white placeholder-gray-500
              transition-all duration-200 outline-none font-arabic
              ${icon ? 'pr-10' : ''}
              ${error
                ? 'border-red-500 focus:ring-2 focus:ring-red-500/30'
                : 'border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20'
              }
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <p className="text-red-400 text-xs mt-0.5">{error}</p>}
        {hint && !error && <p className="text-gray-500 text-xs mt-0.5">{hint}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

// ─── Select ────────────────────────────────────────────
interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string | number; label: string }[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-semibold text-gray-300">
            {label}
            {props.required && <span className="text-red-400 mr-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={`
            w-full bg-surface border border-white/10 rounded-xl px-4 py-3
            text-white focus:border-primary focus:ring-2 focus:ring-primary/20
            transition-all outline-none font-arabic
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {error && <p className="text-red-400 text-xs mt-0.5">{error}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'

// ─── Textarea ──────────────────────────────────────────
interface TextareaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  rows?: number
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, rows = 4, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-semibold text-gray-300">
            {label}
            {props.required && <span className="text-red-400 mr-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          rows={rows}
          className={`
            w-full bg-surface border border-white/10 rounded-xl px-4 py-3
            text-white placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20
            transition-all outline-none font-arabic resize-none
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-red-400 text-xs mt-0.5">{error}</p>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
