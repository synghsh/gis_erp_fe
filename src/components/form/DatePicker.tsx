import React from 'react';
import { Calendar } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import './FormComponents.css';

export interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  error?: any;
  required?: boolean;
  icon?: LucideIcon;
}

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(({
  label,
  name,
  error,
  required,
  icon: Icon = Calendar,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`form-control-group ${error ? 'has-error' : ''} ${className}`}>
      {label && (
        <label className="form-label" htmlFor={name}>
          {label} {required && <span className="required-asterisk">*</span>}
        </label>
      )}
      <div className="input-wrapper">
        {Icon && <span className="input-icon"><Icon size={18} /></span>}
        <input
          id={name}
          name={name}
          type="date"
          ref={ref}
          className={`form-input form-datepicker ${Icon ? 'with-icon' : ''}`}
          {...props}
        />
      </div>
      {error && <span className="form-error-msg">{error.message || error}</span>}
    </div>
  );
});

DatePicker.displayName = 'DatePicker';
export default DatePicker;
