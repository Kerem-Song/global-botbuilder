import { Input } from '@components/data-entry';
import { Autocomplete } from '@components/data-entry/Autocomplete';
import { useVariableSelectClient } from '@hooks/client/variableSelectClient';
import { VariableKind } from '@models';
import { IVariable } from '@models/interfaces/IVariable';
import { getReactSelectStyle } from '@modules/getReactSelectStyle';
import { Control, Path, useController, useFormContext } from 'react-hook-form';
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
  path,
}: IParameterSelectorProps<T>) => {
  const {
    getVariableSelectListQuery: { data },
  } = useVariableSelectClient();
  const { control, setValue } = useFormContext();
  const { field } = useController({ name: path, control });
  const parameters: IVariable[] =
    data?.filter((v) => v.kind === VariableKind.Parameter) || [];
  console.log('field.value', field.value);

  const handleCreate = (value: string | undefined, byUsingName = false) => {
    if (!value) {
      return undefined;
    }
    console.log(value, value.substring(2, value.length - 2));
    return {
      kind: VariableKind.Parameter,
      name: byUsingName
        ? value
          ? value.substring(2, value.length - 2)
          : undefined
        : value,
      usingName: byUsingName ? value : `{{${value}}}`,
    } as IVariable;
  };

  return (
    <>
      <Autocomplete
        items={parameters}
        displayName="name"
        defaultValue={
          parameters.find((x) => x.usingName === field.value) ||
          handleCreate(field.value, true)
        }
        onChange={(value) => {
          setValue<string>(path, value?.usingName);
        }}
        create={handleCreate}
      />
      {/* <CreatableSelect
        className="react-selector"
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
      /> */}
    </>
  );
};
