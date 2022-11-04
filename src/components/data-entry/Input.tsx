import { forwardRef, KeyboardEvent } from 'react';

import { IDataEntryProp } from '../../models/interfaces/IDataEntryProp';

export interface InputProps extends IDataEntryProp {
  maxLength?: number;
  placeholder?: string;
  onPressEnter?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>((args, ref) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter') {
      args.onPressEnter?.(e);
    }
  };

  return (
    <input
      {...args}
      onKeyDown={args.onPressEnter ? handleKeyDown : undefined}
      ref={ref}
    />
  );
});

Input.displayName = 'luna_input';
