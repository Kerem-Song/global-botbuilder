import '../../styles/dropdown.scss';

import React, { FC, useEffect, useState } from 'react';

import { IDataEntryProp } from '../../models/interfaces/IDataEntryProp';
import { IHasClassNameNStyle } from '../../models/interfaces/IHasStyle';

export const DropDown: FC<IDataEntryProp & IHasClassNameNStyle> = ({
  disabled,
  style,
}) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const getSelectOption = (id: number, text: string) => {
    return {
      id,
      text,
    };
  };

  const selectOption = [
    getSelectOption(1, 'option1'),
    getSelectOption(2, 'option2'),
    getSelectOption(3, 'option3'),
  ];

  const [selected, setSelected] = useState<string>('');

  const handleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const optionSelection = (option: string): void => {
    setSelected(option);
  };

  useEffect(() => {
    setSelected(selected);
  }, [selected]);

  return (
    <>
      <button
        className="dropdownBtn"
        onClick={(): void => handleDropdown()}
        disabled={disabled}
        style={style}
      >
        <div className="dropdown">
          {selected ? selected : 'Button'}
          {showDropdown ? (
            <ul className="options">
              {selectOption.map((option) => (
                <li
                  role="presentation"
                  key={option.id}
                  className="option"
                  onClick={(): void => optionSelection(option.text)}
                >
                  {option.text}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </button>
    </>
  );
};
