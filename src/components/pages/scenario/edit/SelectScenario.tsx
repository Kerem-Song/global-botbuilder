import { useRootState, useScenarioClient } from '@hooks';
import { useEffect, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { reactSelectStyle } from './ButtonTypeSelector';

interface IReactSelect {
  value: string;
  label: string;
}

export const SelectScenario = ({ fieldName }: { fieldName: string }) => {
  const selectedScenario = useRootState(
    (state) => state.botBuilderReducer.selectedScenario,
  );
  const [scenario, setScenario] = useState<IReactSelect[]>([]);

  const { getCachedScenario } = useScenarioClient();
  const data = getCachedScenario(selectedScenario?.id);

  const { control } = useFormContext();
  const { field } = useController({
    name: `view.${fieldName}`,
    control,
  });

  useEffect(() => {
    if (data) {
      setScenario(data.nodes.map((item) => ({ value: item.alias, label: item.alias })));
    }
  }, [data]);

  return (
    <Select
      {...field}
      options={scenario}
      styles={reactSelectStyle}
      defaultValue={scenario[0]}
      value={scenario.find((item) => item.value === field.value)}
      onChange={(options: any) => field.onChange(options?.value)}
    />
  );
};
