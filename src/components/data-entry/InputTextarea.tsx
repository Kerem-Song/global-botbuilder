import { IHasClassNameNStyle } from '@models';
import classNames from 'classnames';
import React, {
  ChangeEvent,
  FocusEvent,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

export interface InputTextareaProps extends IHasClassNameNStyle {
  maxLength?: number;
  placeholder?: string;
  showCount?: boolean;
  height?: number;
  autoHeight?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
  value?: string;
  isError?: boolean;
  required?: boolean;
  label?: string;
  hasTitle: boolean;
  isLight?: boolean;
  onBlur?: (e: FocusEvent<HTMLTextAreaElement>) => void;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

export const InputTextarea = forwardRef<HTMLTextAreaElement, InputTextareaProps>(
  (args, ref) => {
    const [text, setText] = useState<string>('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    //useImperativeHandle(ref, () => textareaRef.current!, [textareaRef.current]);
    const { style, height, isError, showCount, autoHeight, ...inputProps } = args;
    const handleTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value);
      args.onChange?.(e);
    };

    const handleTextareaHeight = useCallback(() => {
      if (!args.autoHeight || textareaRef.current === null) {
        return;
      }
      textareaRef.current.style.height = '40px';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }, [textareaRef]);

    useEffect(() => {
      // if (ref) {
      //   ref(textareaRef.current);
      // }

      if (!args.autoHeight || textareaRef.current === null) {
        return;
      }

      textareaRef.current.style.height = '40px';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }, [textareaRef.current]);

    const resultStyle = {
      ...style,
      minHeight: height,
    };
    const resultClassName = classNames('textInput', args.className);

    return (
      <>
        <div className="textareaWrapper">
          <span className={classNames('textareaLabel', { light: args.isLight })}>
            {args.label}
            {args.required && <span className="required"> *</span>}
          </span>
          {args.showCount ? (
            <span className="textCounter">
              {text.length || 0}
              {`/${args.maxLength}`}
            </span>
          ) : undefined}
        </div>
        <textarea
          {...inputProps}
          className={resultClassName}
          style={resultStyle}
          onChange={handleTextArea}
          onInput={handleTextareaHeight}
          placeholder={args.placeholder}
          maxLength={1000}
          ref={ref}
        />
      </>
    );
  },
);

InputTextarea.displayName = 'luna_input_textarea';
