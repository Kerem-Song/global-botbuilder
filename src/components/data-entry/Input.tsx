import { ChangeEvent, KeyboardEvent, FocusEvent, forwardRef } from 'react';

export interface InputProps {
  disabled?: boolean;
  id?: string;
  name?: string;
  maxLength?: number;
  value?: string;
  placeholder?: string;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
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
