import React, { FC, ReactElement } from 'react';
import { FieldError } from 'react-hook-form';

export interface IFormItemProps {
  error?: FieldError;
  children: ReactElement;
}

export const FormItem: FC<IFormItemProps> = ({ children, error }) => {
  const clone = React.cloneElement(children, { isError: error !== undefined });
  return (
    <div>
      {clone}
      <div className="error-message">{error?.message}</div>
    </div>
  );
};
