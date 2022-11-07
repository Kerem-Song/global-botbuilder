import '../../styles/switch.scss';

import { forwardRef } from 'react';

import { IDataEntryProp } from '../../models/interfaces/IDataEntryProp';

export const Switch = forwardRef<HTMLInputElement, IDataEntryProp>((args, ref) => {
  return (
    <label htmlFor={args.id} className="switch">
      <input {...args} type="checkbox" role="switch" ref={ref} />
    </label>
  );
});

Switch.displayName = 'luna_switch';