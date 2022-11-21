import { ChangeEvent, forwardRef, KeyboardEvent, useState } from 'react';

import { IDataEntryProp } from '../../models/interfaces/IDataEntryProp';

export interface InputProps extends IDataEntryProp {
  maxLength?: number;
  placeholder?: string;
  showCount?: boolean;
  onPressEnter?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>((args, ref) => {
  const [value, setValue] = useState('');

  const { showCount, ...inputProps } = args;

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter') {
      args.onPressEnter?.(e);
    }
  };
  const isWrapping = false || showCount;

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  const input = (
    <input
      className="luna-input"
      {...inputProps}
      value={value}
      onChange={onChangeHandler}
      onKeyDown={args.onPressEnter ? handleKeyDown : undefined}
      ref={ref}
    />
  );

  if (isWrapping) {
    return (
      <span className="luna-input-wrap">
        {input}
        {showCount ? (
          <span>
            <>
              {value.length}
              {args.maxLength ? `/${args.maxLength}` : undefined}
            </>
          </span>
        ) : undefined}
      </span>
    );
  }

  return input;
});

Input.displayName = 'luna_input';
