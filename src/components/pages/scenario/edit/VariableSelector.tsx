import { Autocomplete } from '@components/data-entry/Autocomplete';
import { useVariableSelectClient } from '@hooks/client/variableSelectClient';
import { VariableKind } from '@models';
import { IVariable } from '@models/interfaces/IVariable';
import { Control, Path, useController, useFormContext } from 'react-hook-form';

export interface IVariableSelectorProps<T extends object> {
  control: Control<T, any> | undefined;
  path: Path<T>;
  readOnly?: boolean;
  isDisabled?: boolean;
  placeholder?: string;
}

export const VariableSelector = <T extends object>({
  isDisabled,
  readOnly,
  placeholder,
  control,
  path,
}: IVariableSelectorProps<T>) => {
  const {
    getVariableSelectListQuery: { data },
  } = useVariableSelectClient();
  const { setValue } = useFormContext();
  const { field } = useController({ name: path, control });
  const variables = data || [];

  const handleCreate = (value: string | undefined) => {
    if (!value) {
      return undefined;
    }

    return {
      kind: VariableKind.Unknown,
      name: value,
      usingName: value,
    } as IVariable;
  };

  return (
    <Autocomplete
      items={variables}
      displayName="usingName"
      isDisabled={isDisabled}
      placeholder={placeholder}
      readOnly={readOnly}
      defaultValue={
        variables.find((x) => x.usingName === field.value) || handleCreate(field.value)
      }
      onChangeValue={(value) => {
        setValue<string>(path, value?.usingName || '', { shouldDirty: true });
      }}
      onChange={field.onChange}
      create={handleCreate}
    />
  );
};
