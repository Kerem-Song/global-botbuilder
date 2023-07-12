import '../../styles/checkbox.scss';

import { IHasClassNameNStyle } from '@models';
import { forwardRef } from 'react';

import { IDataEntryProp } from '../../models/interfaces/IDataEntryProp';

export interface CheckboxProps extends IDataEntryProp, IHasClassNameNStyle {
  checked?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>((args, ref) => {
  return (
    <div className="checkboxContainer" role="presentation">
      <input
        {...args}
        className="checkbox"
        type="checkbox"
        ref={ref}
        onFocus={(e) => e.target.blur()}
      />
    </div>
  );
});

Checkbox.displayName = 'luna_Checkbox';
