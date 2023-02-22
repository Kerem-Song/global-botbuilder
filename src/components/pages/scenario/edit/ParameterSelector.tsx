import { useVariableSelectClient } from '@hooks/client/variableSelectClient';
import { VariableKind } from '@models';
import { IVariable } from '@models/interfaces/IVariable';
import { getReactSelectStyle } from '@modules/getReactSelectStyle';
import { Control, Path, useController } from 'react-hook-form';
import CreatableSelect from 'react-select/creatable';

export interface IParameterSelectorProps<T extends object> {
  control: Control<T, any> | undefined;
  path: Path<T>;
  isDisabled?: boolean;
  placeholder?: string;
}

export const ParameterSelector = <T extends object>({
  isDisabled,
  placeholder,
  control,
  path,
}: IParameterSelectorProps<T>) => {
  const {
    getVariableSelectListQuery: { data },
  } = useVariableSelectClient();
  const { field } = useController({ name: path, control });
  const parameters = data?.filter((v) => v.kind === VariableKind.Parameter) || [];

  return (
    <CreatableSelect
      placeholder={placeholder}
      styles={getReactSelectStyle<IVariable>(true)}
      isDisabled={isDisabled}
      value={
        parameters.find((x) => x.usingName === field.value) || {
          name: field.value ? `${field.value}`.replace('{{', '').replace('}}', '') : '',
          usingName: field.value,
          kind: VariableKind.Parameter,
        }
      }
      getNewOptionData={(v) => {
        console.log(v);
        const newOption: IVariable = {
          name: v,
          usingName: `{{${v}}}`,
          kind: VariableKind.Parameter,
        };
        return newOption;
      }}
      getOptionValue={(v) => v.usingName || ''}
      formatOptionLabel={(value) => value?.name}
      onBlur={() => field.onBlur()}
      onChange={(value) => {
        field.onChange(value?.usingName);
      }}
      options={parameters}
    />
  );
};
