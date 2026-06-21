import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';
import './FormComponents.css';

export interface MultiSelectOption {
  value: string | number;
  label: string;
}

export interface MultiSelectDropdownProps {
  label?: string;
  name: string;
  error?: any;
  options: MultiSelectOption[];
  placeholder?: string;
  required?: boolean;
  value?: (string | number)[];
  onChange?: (value: (string | number)[]) => void;
  className?: string;
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label,
  name,
  error,
  options = [],
  placeholder = 'Select options',
  required,
  value = [],
  onChange,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleToggleOption = (optionValue: string | number) => {
    const isSelected = value.includes(optionValue);
    let newValue: (string | number)[];
    if (isSelected) {
      newValue = value.filter(v => v !== optionValue);
    } else {
      newValue = [...value, optionValue];
    }
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleRemoveValue = (e: React.MouseEvent<HTMLButtonElement>, optionValue: string | number) => {
    e.stopPropagation();
    const newValue = value.filter(v => v !== optionValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className={`form-control-group ${error ? 'has-error' : ''} ${className}`} ref={containerRef}>
      {label && (
        <label className="form-label">
          {label} {required && <span className="required-asterisk">*</span>}
        </label>
      )}
      <div className="multiselect-container">
        <div
          className={`multiselect-trigger ${isOpen ? 'focused' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {value.length === 0 ? (
            <span className="multiselect-trigger-placeholder">{placeholder}</span>
          ) : (
            value.map(val => {
              const opt = options.find(o => o.value === val);
              return (
                <span key={val} className="multiselect-chip">
                  {opt ? opt.label : val}
                  <button
                    type="button"
                    className="multiselect-chip-remove"
                    onClick={(e) => handleRemoveValue(e, val)}
                  >
                    <X size={10} />
                  </button>
                </span>
              );
            })
          )}
          <span className="select-arrow" style={{ right: '12px' }}>
            <ChevronDown size={18} />
          </span>
        </div>

        {isOpen && (
          <div className="multiselect-dropdown">
            {options.map((opt) => {
              const isSelected = value.includes(opt.value);
              return (
                <div
                  key={opt.value}
                  className={`multiselect-option ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleToggleOption(opt.value)}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check size={14} />}
                </div>
              );
            })}
            {options.length === 0 && (
              <div className="multiselect-option" style={{ pointerEvents: 'none', color: 'var(--text-muted)' }}>
                No options available
              </div>
            )}
          </div>
        )}
      </div>
      {error && <span className="form-error-msg">{error.message || error}</span>}
    </div>
  );
};

export default MultiSelectDropdown;
