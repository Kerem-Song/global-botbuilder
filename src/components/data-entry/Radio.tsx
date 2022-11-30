import '../../styles/radio.scss';

import React, { useCallback, useState } from 'react';
import { forwardRef } from 'react';

import { IDataEntryProp } from '../../models/interfaces/IDataEntryProp';

export const Radio = forwardRef<HTMLInputElement, IDataEntryProp>((args, ref) => {
  const [selectedOption, setSelectedOption] = useState<boolean>(false);

  const radioHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedOption(e.target.checked);
    },
    [selectedOption],
  );

  return (
    <div className="radioContainer">
      <input
        {...args}
        className="radio"
        type="radio"
        name="option"
        onChange={radioHandler}
        ref={ref}
      />
    </div>
  );
});

Radio.displayName = 'luna_Radio';
