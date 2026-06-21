import React from 'react';

export interface FormWrapperProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
  id?: string;
}

export const FormWrapper: React.FC<FormWrapperProps> = ({
  children,
  onSubmit,
  className = '',
  id,
  ...props
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
