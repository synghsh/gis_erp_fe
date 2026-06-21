import React from 'react';
import type { LucideIcon } from 'lucide-react';
import './Components.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: LucideIcon;
  iconAlign?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  isLoading = false,
  icon: Icon,
  iconAlign = 'left',
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
