import '../../styles/inputTextarea.scss';

import React, { FC, useCallback, useRef, useState } from 'react';

import { IDataEntryProp } from '../../models/interfaces/IDataEntryProp';

export interface InputTextareaProps extends IDataEntryProp {
  maxLength?: number;
  placeholder?: string;
  showCount?: boolean;
  onPressEnter?: (value: string | undefined) => void;
}

export const InputTextarea: FC<InputTextareaProps> = ({
  maxLength,
  showCount,
  placeholder,
}) => {
  const [text, setText] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleTextareaHeight = useCallback(() => {
    if (textareaRef === null || textareaRef.current === null) {
      return;
    }
    textareaRef.current.style.height = '40px';
    textareaRef.current.style.height = textareaRef.current?.scrollHeight + 'px';
  }, [textareaRef]);

  return (
    <>
      <textarea
        className="textInput"
        value={text}
        onChange={handleTextArea}
        onInput={handleTextareaHeight}
        placeholder={placeholder}
        maxLength={1000}
        ref={textareaRef}
      />
      {showCount ? (
        <span className="textCounter">
          {text.length || 0}
          {`/${maxLength}`}
        </span>
      ) : undefined}
    </>
  );
};
