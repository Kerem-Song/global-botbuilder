import { useVariableSelectClient } from '@hooks/client/variableSelectClient';
import { VariableKind } from '@models';
import { IVariable } from '@models/interfaces/IVariable';
import { getReactSelectStyle } from '@modules/getReactSelectStyle';
import { Control, Path, useController } from 'react-hook-form';
import CreatableSelect from 'react-select/creatable';

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

  const getValue = () => {
    if (!field.value) {
      return null;
    }

    const found = variables.find((x) => x.usingName === field.value);
    if (found) {
      return found;
    }

    return {
      name: field.value,
      usingName: field.value,
      kind: VariableKind.Parameter,
    };
  };

  return (
    <CreatableSelect
      placeholder={placeholder}
      styles={getReactSelectStyle<IVariable>()}
      isDisabled={isDisabled}
      isClearable
      value={getValue()}
      getNewOptionData={(v) => {
        const newOption: IVariable = {
          name: v,
          usingName: v,
          kind: VariableKind.Unknown,
        };
        return newOption;
      }}
      getOptionValue={(v) => {
        return v.usingName;
      }}
      formatOptionLabel={(value) => {
        return value?.usingName;
      }}
      onBlur={(e) => {
        if (e.target.value) {
          field.onChange(e.target.value);
        }
      }}
      onChange={(value) => {
        if (
          value?.usingName?.startsWith('@sys.') &&
          !variables.find((x) => x.usingName === value?.usingName)
        ) {
          field.onChange(null);
          return;
        }

        if (!value) {
          field.onChange(null);
          return;
        }

        field.onChange(value.usingName);
      }}
      options={variables}
    />
  );
};
