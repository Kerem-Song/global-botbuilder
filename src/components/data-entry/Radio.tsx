import '../../styles/radio.scss';

import { IHasChildren } from '@models/interfaces';
import React, { useCallback, useState } from 'react';
import { forwardRef } from 'react';

import { IDataEntryProp } from '../../models/interfaces/IDataEntryProp';

export interface IRadioProps extends IHasChildren, IDataEntryProp {
  disabled?: boolean;
}

export const Radio = forwardRef<HTMLInputElement, IRadioProps>((args, ref) => {
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
        name="radio"
        onChange={radioHandler}
        ref={ref}
      />
      {args.children}
    </div>
  );
});

Radio.displayName = 'luna_Radio';
