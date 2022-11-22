import '../../styles/radio.scss';

import React, { useCallback, useState } from 'react';
import { forwardRef } from 'react';

import { IDataEntryProp } from '../../models/interfaces/IDataEntryProp';

export const Radio = forwardRef<HTMLInputElement, IDataEntryProp>((args, ref) => {
  const radioOptionList = [
    { id: 1, name: '' },
    { id: 2, name: '' },
  ];

  const [selectedOption, setSelectedOption] = useState<boolean>(false);

  const radioHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedOption(e.target.checked);
    },
    [selectedOption],
  );

  return (
    <div className="radioContainer">
      {radioOptionList.map((option) => {
        return (
          <>
            <input
              {...args}
              key={option.id}
              className="radio"
              type="radio"
              name="option"
              onChange={radioHandler}
              ref={ref}
            />
            <label htmlFor={args.name} className="radioOption">
              {option.name}
            </label>
          </>
        );
      })}
    </div>
  );
});

Radio.displayName = 'luna_Radio';
