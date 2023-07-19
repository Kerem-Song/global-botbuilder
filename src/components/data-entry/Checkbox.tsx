import '../../styles/checkbox.scss';

import { IHasClassNameNStyle } from '@models';
import { forwardRef, RefObject } from 'react';

import { IDataEntryProp } from '../../models/interfaces/IDataEntryProp';

export interface CheckboxProps extends IDataEntryProp, IHasClassNameNStyle {
  checked?: boolean;
  utteranceRef?: RefObject<HTMLInputElement>;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>((props, ref) => {
  const { utteranceRef, ...rest } = props;

  return (
    <div className="checkboxContainer" role="presentation">
      <input
        {...rest}
        className="checkbox"
        type="checkbox"
        ref={ref}
        onFocus={(e) => {
          e.target.blur();
          if (utteranceRef?.current) {
            utteranceRef.current.focus();
          }
        }}
      />
    </div>
  );
});

Checkbox.displayName = 'luna_Checkbox';
