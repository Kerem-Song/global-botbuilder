import { usePage, useRootState } from '@hooks';
import { IHistoryCondition } from '@models/interfaces/IHistory';
import { getReactSelectStyle } from '@modules';
import { useController, useFormContext } from 'react-hook-form';
import Select from 'react-select';

export const HistoryYearSelector = () => {
  const { t } = usePage();
  const { control } = useFormContext<IHistoryCondition>();
  const reactSelectStyle = getReactSelectStyle({ width: 120 });

  const { field: yearField } = useController({
    name: `year`,
    control,
  });

  const yearOptions = useRootState(
    (state) => state.historyInfoReducer.historyYearSelector,
  );

  return (
    <Select
      options={yearOptions}
      styles={reactSelectStyle}
      defaultValue={{ value: null, label: t(`ALL_YEAR`) }}
      value={yearOptions.find((item) => item.value === yearField.value)}
      onChange={(options: any) => yearField.onChange(options?.value)}
    />
  );
};
