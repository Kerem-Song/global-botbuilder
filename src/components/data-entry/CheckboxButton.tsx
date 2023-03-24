import '../../styles/checkbox.scss';

import { IHasChildren, IHasClassNameNStyle } from '@models';
import { forwardRef } from 'react';

import { IDataEntryProp } from '../../models/interfaces/IDataEntryProp';

interface CheckboxProps extends IHasChildren, IDataEntryProp, IHasClassNameNStyle {
  disabled?: boolean;
}

export const CheckboxButton = forwardRef<HTMLInputElement, CheckboxProps>((args, ref) => {
  const { children, ...inputArgs } = args;
  return (
    <label className="checkboxButtonContainer">
      <input {...inputArgs} className="checkboxButton" type="checkbox" ref={ref} />
      {children}
    </label>
  );
});

CheckboxButton.displayName = 'luna_Checkbox';
