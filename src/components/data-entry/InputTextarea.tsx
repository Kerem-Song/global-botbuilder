import { IDataEntryProp, IHasClassNameNStyle } from '@models';
import classNames from 'classnames';
import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';

export interface InputTextareaProps extends IDataEntryProp, IHasClassNameNStyle {
  maxLength?: number;
  placeholder?: string;
  showCount?: boolean;
  height?: number;
  autoHeight?: boolean;
}

export const InputTextarea = forwardRef<HTMLTextAreaElement, InputTextareaProps>(
  (args, ref) => {
    const [text, setText] = useState<string>('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value);
    };

    const handleTextareaHeight = useCallback(() => {
      if (!args.autoHeight || textareaRef.current === null) {
        return;
      }
      textareaRef.current.style.height = '40px';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 10}px`;
    }, [textareaRef]);

    useEffect(() => {
      if (ref) {
        ref(textareaRef.current);
      }

      if (!args.autoHeight || textareaRef.current === null) {
        return;
      }
      textareaRef.current.style.height = '40px';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 10}px`;
    }, [textareaRef.current]);

    const { style, height } = args;
    const resultStyle = { ...style, height: height };
    const resultClassName = classNames('textInput', args.className);

    return (
      <>
        <textarea
          className={resultClassName}
          style={resultStyle}
          value={text}
          onChange={handleTextArea}
          onInput={handleTextareaHeight}
          placeholder={args.placeholder}
          maxLength={1000}
          ref={textareaRef}
        />
        {args.showCount ? (
          <span className="textCounter">
            {text.length || 0}
            {`/${args.maxLength}`}
          </span>
        ) : undefined}
      </>
    );
  },
);

InputTextarea.displayName = 'luna_input_textarea';
