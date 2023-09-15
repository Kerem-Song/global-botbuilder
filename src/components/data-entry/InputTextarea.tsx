import { useHistoryViewerMatch } from '@hooks/useHistoryViewerMatch';
import { IHasClassNameNStyle } from '@models';
import classNames from 'classnames';
import React, {
  ChangeEvent,
  FocusEvent,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import TextareaAutosize from 'react-textarea-autosize';

export interface InputTextareaProps extends IHasClassNameNStyle {
  maxLength?: number;
  placeholder?: string;
  showCount?: boolean;
  maxRows?: number;
  minRows?: number;
  disabled?: boolean;
  id?: string;
  name?: string;
  value?: string;
  isError?: boolean;
  required?: boolean;
  readOnly?: boolean;
  onBlur?: (e: FocusEvent<HTMLTextAreaElement>) => void;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

export const InputTextarea = forwardRef<HTMLTextAreaElement, InputTextareaProps>(
  (args, ref) => {
    const { style, isError, showCount, readOnly, ...inputProps } = args;
    // const handleTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    //   args.onChange?.(e);
    // };
    console.log('@Input Text area');
    const handleTextArea = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        return args.onChange?.(e);
      },
      [args],
    );

    const resultClassName = classNames('textInput', args.className);
    return (
      <TextareaAutosize
        {...inputProps}
        className={resultClassName}
        onChange={handleTextArea}
        placeholder={args.placeholder}
        maxLength={args.maxLength}
        ref={ref}
        readOnly={readOnly}
        autoComplete="off"
      />
    );
  },
);

InputTextarea.displayName = 'luna_input_textarea';
