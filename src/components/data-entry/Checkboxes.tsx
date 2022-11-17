import '../../styles/checkbox.scss';

import React, { useCallback, useState } from 'react';
import { forwardRef } from 'react';

import { IDataEntryProp } from '../../models/interfaces/IDataEntryProp';

export const Checkboxes = forwardRef<HTMLInputElement, IDataEntryProp>((args, ref) => {
  const [checkedBox, setCheckedBox] = useState<Array<string>>([]);
  const checkBoxList = [
    { id: 1, name: 'option1' },
    { id: 2, name: 'option2' },
    { id: 3, name: 'option3' },
  ];

  const onCheckedAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        const checkedListArray: Array<string> = [];
        checkBoxList.forEach((option) => checkedListArray.push(option.name));
        setCheckedBox(checkedListArray);
      } else {
        setCheckedBox([]);
      }
    },
    [checkBoxList],
  );

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
        type="checkbox"
        onChange={(e) => onCheckedAll(e.target.checked)}
        checked={
          checkedBox.length === 0
            ? false
            : checkedBox.length === checkBoxList.length
            ? true
            : false
        }
        ref={ref}
      />
      {checkBoxList.map((option) => {
        return (
          <p key={option.id}>
            <input
              {...args}
              className="checkbox"
              type="checkbox"
              onChange={(e) => {
                onCheckedOption(e.target.checked, option.name);
              }}
              checked={checkedBox.includes(option.name) ? true : false}
              ref={ref}
            />
            <label htmlFor={option.name} className="customCheckbox">
              {option.name}
            </label>
          </p>
        );
      })}
    </div>
  );
});

Checkboxes.displayName = 'luna_Checkboxes';
