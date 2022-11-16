import React, { FC } from 'react';

export type DropdownProps = {
  showDropdown: boolean;
  options: string[];
  setSelectOption: React.Dispatch<React.SetStateAction<string>>;
};

export const Dropdown: FC<DropdownProps> = ({
  options,
  showDropdown,
  setSelectOption,
}: DropdownProps) => {
  const optionSelection = (option: string): void => {
    setSelectOption(option);
  };
  return (
    <div className="dropdown">
      {showDropdown ? (
        <ul className="options">
          {options.map((option: string, index: number) => (
            <li
              role="presentation"
              key={index}
              className="option"
              onClick={(): void => optionSelection(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

export default Dropdown;
