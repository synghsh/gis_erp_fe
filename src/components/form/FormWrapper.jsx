import React from 'react';

export const FormWrapper = ({
  children,
  onSubmit,
  className = '',
  id,
  ...props
}) => {
  const handleSubmit = (e) => {
    if (onSubmit) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  return (
    <form
      id={id}
      onSubmit={handleSubmit}
      className={`erp-form-wrapper ${className}`}
      noValidate
      {...props}
    >
      {children}
    </form>
  );
};

export default FormWrapper;
