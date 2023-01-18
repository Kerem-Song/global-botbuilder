import '../../styles/checkbox.scss';

import { IHasClassNameNStyle } from '@models';
import React, { useCallback, useState } from 'react';
import { forwardRef } from 'react';

import { IDataEntryProp } from '../../models/interfaces/IDataEntryProp';

export interface CheckboxProps extends IDataEntryProp, IHasClassNameNStyle {
  disabled?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>((args, ref) => {
  const [checkedBox, setCheckedBox] = useState<Array<string>>([]);

  const onCheckedOption = useCallback(
    (checked: boolean, option: string) => {
      if (checked) {
        setCheckedBox((prev) => [...prev, option]);
      } else if (!checked) {
        setCheckedBox(checkedBox.filter((check) => check !== option));
      }
    },
    [checkedBox],
  );

  return (
    <div className="checkboxContainer">
      <input
        {...args}
        className="checkbox"
        type="checkbox"
        onChange={(e) => onCheckedOption(e.target.checked, e.target.id)}
        ref={ref}
      />
    </div>
  );
});

Checkbox.displayName = 'luna_Checkbox';
