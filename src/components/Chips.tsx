import React from 'react';
import './Components.css';

export interface ChipsProps extends React.HTMLAttributes<HTMLSpanElement> {
  label?: string;
  type?: string; // success | warning | error | info | default
  showDot?: boolean;
}

export const Chips: React.FC<ChipsProps> = ({
  children,
  label,
  type = 'default',
  showDot = true,
  className = '',
  ...props
}) => {
  const content = label || children;
  
  // Normalize types
  let normalizedType: 'success' | 'warning' | 'error' | 'info' | 'default' = 'default';
  const checkType = type.toLowerCase();
  
  if (['success', 'active', 'enabled'].includes(checkType)) normalizedType = 'success';
  else if (['warning', 'pending', 'alert'].includes(checkType)) normalizedType = 'warning';
  else if (['error', 'danger', 'inactive', 'disabled'].includes(checkType)) normalizedType = 'error';
  else if (['info', 'primary', 'details'].includes(checkType)) normalizedType = 'info';

  return (
    <span className={`status-badge status-${normalizedType} ${className}`} {...props}>
      {showDot && <span className="status-badge-dot" />}
      <span>{content}</span>
    </span>
  );
};

export default Chips;
