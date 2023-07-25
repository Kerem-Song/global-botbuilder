import '../../styles/radio.scss';

import { IDataEntryProp, IHasChildren, IHasClassNameNStyle } from '@models';
import { forwardRef } from 'react';

export interface IRadioProps extends IHasChildren, IDataEntryProp, IHasClassNameNStyle {
  disabled?: boolean;
  checked?: boolean;
}

export const Radio = forwardRef<HTMLInputElement, IRadioProps>((args, ref) => {
  const { children, ...inputArgs } = args;
  return (
    <label className="radioContainer">
      <input {...inputArgs} className="radio" type="radio" name={args.name} ref={ref} />
      {children}
    </label>
  );
});

Radio.displayName = 'luna_Radio';
