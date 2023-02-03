import { useRootState } from '@hooks';
import { useController, useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { reactSelectStyle } from './ButtonTypeSelector';

interface IReactSelect {
  value: string;
  label: string;
}

export const SelectNode = ({
  fieldName,
  defaultValue,
}: {
  fieldName: string;
  defaultValue?: string;
}) => {
  const nodes = useRootState((state) => state.makingNodeSliceReducer.present.nodes);

  const { control } = useFormContext();
  const { field } = useController({
    name: `view.${fieldName}`,
    control,
  });

  const scenarios: IReactSelect[] = nodes.map((item) => ({
    value: item.id,
    label: item.title || '',
  }));

  return (
    <Select
      {...field}
      options={scenarios}
      styles={reactSelectStyle}
      defaultValue={scenarios.find((item) => item.value === defaultValue)}
      value={scenarios.find((item) => item.value === field.value)}
      onChange={(options: any) => field.onChange(options?.value)}
    />
  );
};
