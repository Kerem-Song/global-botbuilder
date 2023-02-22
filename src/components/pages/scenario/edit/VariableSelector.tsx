import { useVariableSelectClient } from '@hooks/client/variableSelectClient';
import { VariableKind } from '@models';
import { IVariable } from '@models/interfaces/IVariable';
import { Control, Path, useController } from 'react-hook-form';
import CreatableSelect from 'react-select/creatable';

export interface IVariableSelect {
  readonly value?: string;
  readonly label?: string;
}

export interface IVariableSelectorProps<T extends object> {
  control: Control<T, any> | undefined;
  path: Path<T>;
  isDisabled?: boolean;
  placeholder?: string;
}

export const VariableSelector = <T extends object>({
  isDisabled,
  placeholder,
  control,
  path,
}: IVariableSelectorProps<T>) => {
  const {
    getVariableSelectListQuery: { data },
  } = useVariableSelectClient();

  const { field } = useController({ name: path, control });
  const variables = data || [];
  return (
    <CreatableSelect
      isClearable
      placeholder={placeholder}
      isDisabled={isDisabled}
      value={
        variables.find((x) => x.usingName === field.value) || {
          name: field.value,
          usingName: field.value,
          kind: VariableKind.Parameter,
        }
      }
      getNewOptionData={(v) => {
        const newOption: IVariable = {
          name: v,
          usingName: v,
          kind: VariableKind.Parameter,
        };
        return newOption;
      }}
      getOptionValue={(v) => v.usingName || ''}
      formatOptionLabel={(value) => value?.usingName}
      onChange={(value) => {
        if (
          value?.usingName?.startsWith('@sys.') &&
          !variables.find((x) => x.usingName === value?.usingName)
        ) {
          field.onChange(undefined);
          return;
        }

        field.onChange(value?.usingName);
      }}
      options={variables}
    />
  );
};
