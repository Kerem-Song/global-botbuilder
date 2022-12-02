import classNames from 'classnames';
import { ChangeEvent, forwardRef, KeyboardEvent, useState } from 'react';

import { IDataEntryProp } from '../../models/interfaces/IDataEntryProp';

export interface InputProps extends IDataEntryProp {
  maxLength?: number;
  placeholder?: string;
  showCount?: boolean;
  onPressEnter?: (value: string | undefined) => void;
  onPressEsc?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>((args, ref) => {
  const [value, setValue] = useState(args.value);

  const { showCount, isError, required, onPressEnter, onPressEsc, ...inputProps } = args;

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
        onPressEnter?.(value);
        break;
      case 'Escape':
        onPressEsc?.();
        break;
    }
  };
  const isWrapping = false || showCount;

  const inputClassName = classNames('luna-input', { 'luna-input-error': isError });
  const inputWrapClassName = classNames('luna-input-wrap', {
    'luna-input-error': isError,
  });

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    args.onChange?.(e);
  };

  const input = (
    <input
      className={inputClassName}
      {...inputProps}
      value={value}
      onChange={onChangeHandler}
      onKeyDown={args.onPressEnter ? handleKeyDown : undefined}
      ref={ref}
      aria-invalid={isError}
      aria-required={required}
    />
  );

  if (isWrapping) {
    return (
      <span className={inputWrapClassName}>
        {input}
        {showCount ? (
          <span>
            <>
              {value?.length || 0}
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
