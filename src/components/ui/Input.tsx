import React from 'react'
import { LucideIcon } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: LucideIcon
  helperText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className = '',
    type = 'text',
    label,
    error,
    icon: Icon,
    helperText,
    ...props
  }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-secondary mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon className="h-5 w-5 text-accent" />
            </div>
          )}
          <input
            type={type}
            className={`input-field ${Icon ? 'pl-10' : ''} ${error ? 'border-red-500 focus:border-red-500' : ''} ${className}`}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-accent">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input }