import { usePage } from '@hooks';
import { ACTION_TYPES } from '@models/interfaces/res/IGetFlowRes';
import { getReactSelectStyle } from '@modules';
import { useController, useFormContext } from 'react-hook-form';
import Select, { StylesConfig } from 'react-select';

interface IButtonCtrlSelectorProp {
  name: string;
  value: string;
}

export const ButtonCtrlSelector = ({ name, value }: IButtonCtrlSelectorProp) => {
  const { t } = usePage();
  const selectOptions = [
    { value: ACTION_TYPES.LUNA_NODE_REDIRECT, label: t(`SET_CONNECT_NEXT_NODE`) },
    { value: ACTION_TYPES.URL, label: t(`SET_URL_CONNECT`) },
    { value: ACTION_TYPES.ACT_VALUE_IS_UTTR, label: t(`SET_MESSAGE`) },
    { value: ACTION_TYPES.LBL_IS_UTTR, label: t(`SET_BUTTON_NAME`) },
  ];
  const { setValue, control } = useFormContext();
  const reactSelectStyle = getReactSelectStyle({});
  const { field } = useController({
    name,
    control,
  });

  return (
    <Select
      className="react-selector"
      {...field}
      options={selectOptions}
      placeholder={t(`SET_OPTION_NULL`)}
      styles={reactSelectStyle}
      value={selectOptions.find((item) => item.value === field.value)}
      onChange={(options: any) => {
        field.onChange(options?.value);
        setValue(value, '', { shouldDirty: true });
      }}
    />
  );
};
