import { useVariableSelectClient } from '@hooks/client/variableSelectClient';
import { VariableKind } from '@models';
import { IVariable } from '@models/interfaces/IVariable';
import { FC } from 'react';
import CreatableSelect from 'react-select/creatable';

export interface IParameterSelect {
  readonly value?: string;
  readonly label?: string;
}

export interface IParameterSelectorProps {
  fieldValue?: string;
  isDisabled?: boolean;
  placeholder?: string;
  onChange?: (value?: string) => void;
}

export const ParameterSelector: FC<IParameterSelectorProps> = ({
  isDisabled,
  placeholder,
  fieldValue,
  onChange,
}) => {
  const {
    getVariableSelectListQuery: { data },
  } = useVariableSelectClient();

  const parameters = data?.filter((v) => v.kind === VariableKind.Parameter) || [];
  console.log('fieldValue', fieldValue);
  return (
    <CreatableSelect
      isClearable
      placeholder={placeholder}
      isDisabled={isDisabled}
      value={
        parameters.find((x) => x.usingName === fieldValue) || {
          name: fieldValue?.replace('{{', '').replace('}}', ''),
          usingName: fieldValue,
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
      onChange={(value) => {
        console.log(value);
        onChange?.(value?.usingName);
      }}
      options={parameters}
    />
  );
};
