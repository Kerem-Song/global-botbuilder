import '../../styles/inputTextarea.scss';

import React, { FC, useState } from 'react';

import { IDataEntryProp } from '../../models/interfaces/IDataEntryProp';
import { IHasClassNameNStyle } from '../../models/interfaces/IHasStyle';

export const InputTextarea: FC<IDataEntryProp & IHasClassNameNStyle> = ({
  disabled,
  style,
}) => {
  const [text, setText] = useState<string>('');
  const handleTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };
  return (
    <>
      <form>
        <textarea
          maxLength={10}
          placeholder="텍스트 입력"
          onChange={handleTextArea}
          disabled={disabled}
        >
          {text}
        </textarea>
        <div className="textCounter" style={style}>
          {text.length > 0 ? text.length : 0}/10
        </div>
      </form>
    </>
  );
};
