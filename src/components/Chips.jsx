import React from 'react';
import './Components.css';

export const Chips = ({
  children,
  label,
  type = 'default', // success | warning | error | info | default
  showDot = true,
  className = '',
  ...props
}) => {
  const content = label || children;
  
  // Normalize types
  let normalizedType = 'default';
  if (['success', 'active', 'enabled'].includes(type.toLowerCase())) normalizedType = 'success';
  else if (['warning', 'pending', 'alert'].includes(type.toLowerCase())) normalizedType = 'warning';
  else if (['error', 'danger', 'inactive', 'disabled'].includes(type.toLowerCase())) normalizedType = 'error';
  else if (['info', 'primary', 'details'].includes(type.toLowerCase())) normalizedType = 'info';

  return (
    <span className={`status-badge status-${normalizedType} ${className}`} {...props}>
      {showDot && <span className="status-badge-dot" />}
      <span>{content}</span>
    </span>
  );
};

export default Chips;
