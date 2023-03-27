import { ChangeEvent, useState } from 'react';

export const useInputState = () => {
  const [value, setValue] = useState<string>('');
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setValue(e.target.value);
  };
  return { value, onChange };
};
