import React from 'react';
import './Components.css';

export const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // primary | secondary | outline | danger | ghost
  size = 'md', // sm | md | lg
  disabled = false,
  isLoading = false,
  icon: Icon,
  iconAlign = 'left', // left | right
  className = '',
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`btn btn-${variant} btn-${size} ${isLoading ? 'btn-loading' : ''} ${className}`}
      {...props}
    >
      {isLoading && <span className="btn-spinner"></span>}
      {!isLoading && Icon && iconAlign === 'left' && (
        <span className="btn-icon btn-icon-left"><Icon size={18} /></span>
      )}
      <span className="btn-text">{children}</span>
      {!isLoading && Icon && iconAlign === 'right' && (
        <span className="btn-icon btn-icon-right"><Icon size={18} /></span>
      )}
    </button>
  );
};

export default Button;
