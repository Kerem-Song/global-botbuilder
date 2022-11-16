// import './styles.css';s
import '../../../styles/dropdown.scss';

import { useState } from 'react';

import Dropdown from './Dropdown';

export const Menu = () => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [selectOption, setSelectOption] = useState<string>('');

  const options = () => {
    return ['option1', 'option2', 'option3'];
  };

  const handleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <>
      <button className="dropdownBtn" onClick={(): void => handleDropdown()}>
        <div>{selectOption ? selectOption : 'Button'}</div>
        {showDropdown && (
          <Dropdown
            showDropdown={showDropdown}
            options={options()}
            setSelectOption={setSelectOption}
          />
        )}
      </button>
    </>
  );
};

export default Menu;
