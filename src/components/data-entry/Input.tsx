import { Button } from '@components/general';
import { IHasClassNameNStyle, SizeType } from '@models';
import classNames from 'classnames';
import { ChangeEvent, forwardRef, KeyboardEvent, useEffect, useState } from 'react';

import { IDataEntryProp } from '../../models/interfaces/IDataEntryProp';

export interface InputProps extends IDataEntryProp, IHasClassNameNStyle {
  maxLength?: number;
  placeholder?: string;
  showCount?: boolean;
  size?: SizeType;
  search?: boolean;
  onPressEnter?: (value: string | undefined) => void;
  onSearch?: (value: string | undefined) => void;
  onPressEsc?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>((args, ref) => {
  const [value, setValue] = useState<string>();

  useEffect(() => {
    setValue(args.value || args.defaultValue);
  }, [args.value, args.defaultValue, args]);

  const {
    showCount,
    isError,
    required,
    size,
    search,
    onSearch,
    onPressEnter,
    onPressEsc,
    ...inputProps
  } = args;

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
        onPressEnter?.(value);
        onSearch?.(value);
        if (onPressEnter || onSearch) {
          e.preventDefault();
        }
        break;
      case 'Escape':
        onPressEsc?.();
        break;
    }
  };
  const isWrapping = false || showCount || search;

  const inputClassName = classNames('luna-input', {
    'luna-input-error': isError,
    'luna-input-large': size === 'large',
    'luna-input-normal': size === 'normal',
  });
  const inputWrapClassName = classNames('luna-input-wrap', {
    'luna-input-error': isError,
    'luna-input-large': size === 'large',
    'luna-input-small': size === 'small',
  });

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    args.onChange?.(e);
    //onSearch?.(e.target.value);
  };

  const input = (
    <input
      className={inputClassName}
      {...inputProps}
      //value={value}
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
          <span className="count">
            <>
              {value?.length || 0}
              {args.maxLength ? `/${args.maxLength}` : undefined}
            </>
          </span>
        ) : undefined}
        {search ? (
          <Button
            small
            shape="ghost"
            className="input-button"
            onClick={() => {
              setValue('');
              onSearch?.('');
            }}
          >
            <div className={classNames('search', { clear: value?.length })} />
          </Button>
        ) : undefined}
      </span>
    );
  }

  return input;
});

Input.displayName = 'luna_input';
