import { InputProps } from '@components/data-entry';
import classNames from 'classnames';
import { ChangeEvent, forwardRef, KeyboardEvent, useState } from 'react';
import { useForm, useFormContext } from 'react-hook-form';

interface InputWithTitleCounterProps extends InputProps {
  label?: string;
  isLight?: boolean;
}
export const InputWithTitleCounter = forwardRef<
  HTMLInputElement,
  InputWithTitleCounterProps
>((args, ref) => {
  const { watch, register } = useForm();

  const [value, setValue] = useState<string | undefined>(args.value || args.defaultValue);

  const {
    showCount,
    isError,
    required,
    size,
    label,
    isLight,
    maxLength,
    onSearch,
    onPressEnter,
    onPressEsc,
    ...inputProps
  } = args;

  const inputClassName = classNames('luna-input', {
    'luna-input-error': isError,
    'luna-input-large': size === 'large',
    'luna-input-normal': size === 'normal',
  });

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) {
      return;
    }
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

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    args.onChange?.(e);
  };

  const input = (
    <input
      {...register(`inputWithTitleCounter`)}
      className={inputClassName}
      {...inputProps}
      onChange={onChangeHandler}
      onKeyDown={args.onPressEnter ? handleKeyDown : undefined}
      ref={ref}
      aria-invalid={isError}
      aria-required={required}
    />
  );
  console.log('watch', watch(`inputWithTitleCounter`));
  return (
    <>
      <div className="textareaWrapper">
        <p className={classNames('textareaLabel', { light: isLight })}>
          {label}
          {required && <span className="required"> *</span>}
        </p>
        {showCount ? (
          <span className="textCounter">
            {value?.length || 0}
            {/* {watch(`inputWithTitleCounter`)?.length || 0} */}
            {`/${maxLength}`}
          </span>
        ) : undefined}
      </div>
      {input}
    </>
  );
});

InputWithTitleCounter.displayName = 'luna_input';
