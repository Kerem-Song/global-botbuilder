import { IDataEntryProp, IHasChildren, IHasClassNameNStyle } from '@models';
import { forwardRef } from 'react';

interface ICheckboxProps extends IHasChildren, IDataEntryProp, IHasClassNameNStyle {
  disabled?: boolean;
  checked?: boolean;
}

export const HistoryCategoryFilterBtn = forwardRef<HTMLInputElement, ICheckboxProps>((args,ref) => {
  const {children, disabled, checked, onChange, ...inputArgs} = args;
  return (
    <label>
      <input
        type="checkbox"
        disabled={disabled}
        checked={checked}
        onChange={({ target: { checked } }) => onChange(checked)}
      />
      {children}
    </label>
  );
};
