import '../../styles/radio.scss';

import React, { useCallback, useState } from 'react';
import { forwardRef } from 'react';

import { IDataEntryProp } from '../../models/interfaces/IDataEntryProp';

export const Radio = forwardRef<HTMLInputElement, IDataEntryProp>((args, ref) => {
  const radioOptionList = [
    { id: 1, name: 'option1' },
    { id: 2, name: 'option2' },
    { id: 3, name: 'option3' },
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
          <p key={option.id}>
            <input
              {...args}
              className="radio"
              type="radio"
              name="option"
              onChange={radioHandler}
              ref={ref}
            />
            <label htmlFor={args.name} className="radioOption">
              {option.name}
            </label>
          </p>
        );
      })}
    </div>
  );
});

Radio.displayName = 'luna_Radio';
