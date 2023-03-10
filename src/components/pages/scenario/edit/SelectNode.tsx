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
  nodeId,
}: {
  fieldName: string;
  defaultValue?: string;
  nodeId?: string;
}) => {
  const nodes = useRootState((state) => state.makingNodeSliceReducer.present.nodes);

  const { control } = useFormContext();
  const { field } = useController({
    name: `${fieldName}`,
    control,
  });

  const scenarios: IReactSelect[] = [...nodes]
    .filter((item) => item.id !== nodeId)
    .sort((a, b) => ((a.title || '') > (b.title || '') ? 1 : -1))
    .map((item) => ({
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
