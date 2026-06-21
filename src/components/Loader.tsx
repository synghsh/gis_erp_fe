import React from 'react';
import './Components.css';

export interface LoaderProps {
  type?: 'spinner' | 'fullscreen' | 'skeleton';
  text?: string;
  rows?: number;
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  type = 'spinner',
  text = 'Loading details...',
  rows = 3,
  className = '',
}) => {
  if (type === 'fullscreen') {
    return (
      <div className="full-screen-loader">
        <div className="spinner" style={{ borderColor: 'rgba(255, 255, 255, 0.1)', borderTopColor: '#fff' }}></div>
        <span className="full-screen-loader-text">{text}</span>
      </div>
    );
  }

  if (type === 'skeleton') {
    return (
      <div className={`skeleton-row ${className}`}>
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="skeleton"
            style={{
              height: index === 0 ? '24px' : '16px',
              width: index === 0 ? '40%' : index === rows - 1 ? '60%' : '100%',
              marginBottom: '8px'
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`spinner-wrapper ${className}`}>
      <div className="spinner"></div>
    </div>
  );
};

export default Loader;
