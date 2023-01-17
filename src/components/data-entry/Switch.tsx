import '../../styles/switch.scss';

import { forwardRef } from 'react';

import { IDataEntryProp } from '../../models/interfaces/IDataEntryProp';

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
      />
    </label>
  );
});

Switch.displayName = 'luna_switch';
