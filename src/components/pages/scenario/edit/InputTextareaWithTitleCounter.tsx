import { InputTextarea, InputTextareaProps } from '@components/data-entry';
import classNames from 'classnames';
import { forwardRef } from 'react';

interface InputWithTitleCounterProps extends InputTextareaProps {
  label?: string;
  isLight?: boolean;
  textLength?: number;
}
export const InputTextAreaWithTitleCounter = forwardRef<
  HTMLTextAreaElement,
  InputWithTitleCounterProps
>((args, ref) => {
  const { label, isLight, textLength, showCount, required, ...inputProps } = args;

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
            {`/${args.maxLength}`}
          </span>
        ) : undefined}
      </div>
      <InputTextarea {...inputProps} required={required} ref={ref} />
    </>
  );
});

InputTextAreaWithTitleCounter.displayName = 'luna_input_textarea_with_title_counter';