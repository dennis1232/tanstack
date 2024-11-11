import React from 'react'

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  containerClassName?: string
  inputClassName?: string
  inputSize?: 'small' | 'medium' | 'large'
  icon?: React.ReactNode
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  helperText,
  containerClassName = '',
  inputClassName = '',
  inputSize = 'medium',
  icon,
  id,
  ...inputProps
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

  const sizeClasses = {
    small: 'text-sm px-2 py-1',
    medium: 'text-base px-3 py-2',
    large: 'text-lg px-4 py-3',
  }

  const baseInputClasses = `
    border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500
    ${error ? 'border-red-500' : 'border-gray-300'}
    ${icon ? 'pl-10' : ''}
    ${inputProps.disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
    ${inputProps.readOnly ? 'bg-gray-100' : ''}
    ${sizeClasses[inputSize]}
    ${inputClassName}
  `

  return (
    <div className={`flex flex-col ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className="mb-1 text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">{icon}</div>}
        <input
          id={inputId}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-help` : undefined}
          aria-invalid={!!error}
          className={baseInputClasses}
          {...inputProps}
        />
      </div>
      {helperText && !error && (
        <p id={`${inputId}-help`} className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

export default TextInput
