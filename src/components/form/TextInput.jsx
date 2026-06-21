import React from 'react';
import './FormComponents.css';

export const TextInput = React.forwardRef(({
  label,
  name,
  error,
  type = 'text',
  placeholder,
  required,
  icon: Icon,
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
          type={type}
          ref={ref}
          placeholder={placeholder}
          className={`form-input ${Icon ? 'with-icon' : ''}`}
          {...props}
        />
      </div>
      {error && <span className="form-error-msg">{error.message || error}</span>}
    </div>
  );
});

TextInput.displayName = 'TextInput';
export default TextInput;
