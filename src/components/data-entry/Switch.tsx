import '../../styles/switch.scss';

import { ChangeEvent, FC } from 'react';

interface SwitchProperties {
  id: string;
  onChange: (isChecked: boolean) => void;
  isChecked: boolean;
}

const Switch: FC<SwitchProperties> = (props) => {
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    props.onChange && props.onChange(e.target.checked);
  };

  return (
    <label htmlFor={props.id} className="switch">
      <input
        id={props.id}
        type="checkbox"
        role="switch"
        checked={props.isChecked}
        onChange={onChange}
      />
    </label>
  );
};

export default Switch;
