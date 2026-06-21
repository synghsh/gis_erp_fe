import React from 'react';
import { ChevronDown } from 'lucide-react';
import './FormComponents.css';

export const SelectDropdown = React.forwardRef(({
  label,
  name,
  error,
  options = [],
  placeholder = 'Select an option',
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
      <div className="select-wrapper">
        {Icon && <span className="input-icon"><Icon size={18} /></span>}
        <select
          id={name}
          name={name}
          ref={ref}
          className={`form-select ${Icon ? 'with-icon' : ''}`}
          defaultValue=""
          {...props}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="select-arrow">
          <ChevronDown size={18} />
        </span>
      </div>
      {error && <span className="form-error-msg">{error.message || error}</span>}
    </div>
  );
});

SelectDropdown.displayName = 'SelectDropdown';
export default SelectDropdown;
