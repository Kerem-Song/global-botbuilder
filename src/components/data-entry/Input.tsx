import { ChangeEvent, FC, KeyboardEvent } from 'react';

export interface InputProps {
  disabled?: boolean;
  id?: string;
  maxLength?: number;
  value?: string;
  placeholder?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onPressEnter?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

export const Input: FC<InputProps> = (args) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter') {
      args.onPressEnter?.(e);
    }
  };
  return <input {...args} onKeyDown={args.onPressEnter ? handleKeyDown : undefined} />;
};
