import { IHasChildren } from '@models/interfaces';
import { FC } from 'react';
import { FieldError } from 'react-hook-form';

export interface IFormItemProps extends IHasChildren {
  error?: FieldError;
}

export const FormItem: FC<IFormItemProps> = ({ children, error }) => {
  return (
    <div>
      {children}
      <div style={{ color: 'red', padding: '5px 5px 0 5px', height: '21px' }}>
        {error?.message}
      </div>
    </div>
  );
};
