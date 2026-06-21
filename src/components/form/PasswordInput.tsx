import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import './FormComponents.css';

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  error?: any;
  required?: boolean;
  icon?: LucideIcon;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(({
  label,
  name,
  error,
  placeholder = '••••••••',
  required,
  icon: Icon = Lock,
  className = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
  };

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
          type={showPassword ? 'text' : 'password'}
          ref={ref}
          placeholder={placeholder}
          className={`form-input ${Icon ? 'with-icon' : ''}`}
          {...props}
        />
        <button
          type="button"
          className="password-toggle-btn"
          onClick={toggleShowPassword}
          tabIndex={-1}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <span className="form-error-msg">{error.message || error}</span>}
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';
export default PasswordInput;
