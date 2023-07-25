import '../../styles/reactSelect.scss';

import { IDataEntryProp, IHasClassNameNStyle } from '@models';
import { FC, useState } from 'react';
import Select from 'react-select';

const options = [
  { value: 'all', label: '전체' },
  { value: 'option1', label: 'option1' },
  { value: 'option2', label: 'option2' },
  { value: 'option3', label: 'option3' },
  { value: 'option4', label: 'option4' },
  { value: 'option5', label: 'option5' },
  { value: 'option6', label: 'option6' },
  { value: 'option7', label: 'option7' },
  { value: 'option8', label: 'option8' },
  { value: 'option9', label: 'option9' },
  { value: 'option10', label: 'option10' },
];

export const ReactSelect: FC<IDataEntryProp & IHasClassNameNStyle> = ({
  disabled,
  style,
}) => {
  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <div className="selectBox" style={style}>
      <Select
        className="selectList"
        defaultValue={selectedOption}
        onChange={() => setSelectedOption}
        options={options}
        isDisabled={disabled}
      />
    </div>
  );
};
