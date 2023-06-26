import React, { FC, ReactElement } from 'react';
import { FieldError } from 'react-hook-form';

export interface IFormItemProps {
  error?: FieldError;
  children: ReactElement;
  inline?: boolean;
}

export const FormItem: FC<IFormItemProps> = ({ children, error, inline }) => {
  const clone = React.cloneElement(children, { isError: error !== undefined });
  return (
    <div
      style={{
        display: inline ? 'flex' : 'block',
        flex: 1,
        height: '100%',
        whiteSpace: 'pre-line',
      }}
    >
      {clone}
      <div className="error-message">{error?.message}</div>
    </div>
  );
};
