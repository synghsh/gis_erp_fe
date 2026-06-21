import React from 'react';
import './Components.css';

export const Card = ({
  children,
  title,
  extra,
  hoverable = true,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`erp-card ${hoverable ? 'erp-card-hover' : ''} ${className}`}
      {...props}
    >
      {(title || extra) && (
        <div className="erp-card-header">
          {title && <h3 className="erp-card-title">{title}</h3>}
          {extra && <div className="erp-card-extra">{extra}</div>}
        </div>
      )}
      <div className="erp-card-body">{children}</div>
    </div>
  );
};

export default Card;
