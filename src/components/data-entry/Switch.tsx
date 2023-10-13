import '../../styles/switch.scss';

import { IDataEntryProp } from '@models';
import { forwardRef } from 'react';

export interface ISwitchProps extends IDataEntryProp {
  checked?: boolean;
}

export const Switch = forwardRef<HTMLInputElement, ISwitchProps>((args, ref) => {
  return (
    <label htmlFor={args.id} className="switch">
      <input
        {...args}
        type="checkbox"
        role="switch"
        ref={ref}
        onClick={(e) => e.stopPropagation()}
        checked={args.checked}
        name="switch"
      />
    </label>
  );
});

Switch.displayName = 'luna_switch';
