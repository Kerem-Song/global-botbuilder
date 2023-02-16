import '../../styles/radio.scss';

import { IHasChildren } from '@models/interfaces';
import { forwardRef } from 'react';

import { IDataEntryProp } from '../../models/interfaces/IDataEntryProp';

export interface IRadioProps extends IHasChildren, IDataEntryProp {
  disabled?: boolean;
  checked?: boolean;
}

export const Radio = forwardRef<HTMLInputElement, IRadioProps>((args, ref) => {
  const { children, ...inputArgs } = args;
  return (
    <label className="radioContainer">
      <input {...inputArgs} className="radio" type="radio" name="radio" ref={ref} />
      {children}
    </label>
  );
});

Radio.displayName = 'luna_Radio';
