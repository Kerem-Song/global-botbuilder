import { ChangeEvent, FocusEvent } from 'react';
export interface IDataEntryProp {
  disabled?: boolean;
  id?: string;
  name?: string;
  value?: string | number;
  defaultValue?: string | number;
  isError?: boolean;
  required?: boolean;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}
