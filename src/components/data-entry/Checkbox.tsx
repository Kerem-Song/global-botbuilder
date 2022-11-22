import '../../styles/checkbox.scss';

import React, { useCallback, useState } from 'react';
import { forwardRef } from 'react';

import { IDataEntryProp } from '../../models/interfaces/IDataEntryProp';

export const Checkbox = forwardRef<HTMLInputElement, IDataEntryProp>((args, ref) => {
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
      <div>
        <input
          {...args}
          className="checkbox"
          id="option1"
          type="checkbox"
          onChange={(e) => onCheckedOption(e.target.checked, e.target.id)}
          ref={ref}
        />
        <label htmlFor="option1">option1</label>
      </div>
    </div>
  );
});

Checkbox.displayName = 'luna_Checkbox';
