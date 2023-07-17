import { Input, InputProps } from '@components/data-entry';
import classNames from 'classnames';
import { forwardRef } from 'react';

interface InputWithTitleCounterProps extends InputProps {
  label?: string;
  isLight?: boolean;
  textLength?: number;
  counterLimit?: number;
}
export const InputWithTitleCounter = forwardRef<
  HTMLInputElement,
  InputWithTitleCounterProps
>((args, ref) => {
  const {
    label,
    isLight,
    textLength,
    showCount,
    required,
    readOnly,
    counterLimit,
    ...inputProps
  } = args;

  return (
    <>
      <div className="textareaWrapper">
        <p className={classNames('textareaLabel', { light: isLight })}>
          {label}
          {required && <span className="required"> *</span>}
        </p>
        {showCount ? (
          <span className="textCounter">
            {textLength || 0}
            {`/${counterLimit ? counterLimit : args.maxLength}`}
          </span>
        ) : undefined}
      </div>
      <Input {...inputProps} required={required} ref={ref} readOnly={readOnly} />
    </>
  );
});

InputWithTitleCounter.displayName = 'luna_input_with_title_counter';
