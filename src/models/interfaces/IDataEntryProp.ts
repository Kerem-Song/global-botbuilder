import { ChangeEvent, FocusEvent } from 'react';
export interface IDataEntryProp {
  disabled?: boolean;
  id?: string;
  name?: string;
  value?: string;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}
