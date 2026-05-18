import React from 'react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      error,
      helperText,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const baseClasses = `block w-full rounded-lg border-2 px-4 py-2 transition-colors duration-200 ${
      error
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
    } focus:outline-none focus:ring-2`;

    const selectId = id || `select-${Math.random()}`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`${baseClasses} ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        {helperText && !error && <p className="text-gray-600 text-sm mt-1">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
