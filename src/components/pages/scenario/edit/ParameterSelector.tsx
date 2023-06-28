import { Autocomplete } from '@components/data-entry/Autocomplete';
import { useVariableSelectClient } from '@hooks/client/variableSelectClient';
import { VariableKind } from '@models';
import { IVariable } from '@models/interfaces/IVariable';
import { ChangeEvent } from 'react';
import { Control, Path, useController, useFormContext } from 'react-hook-form';

export interface IParameterSelectorProps<T extends object> {
  control: Control<T, any> | undefined;
  path: Path<T>;
  readOnly?: boolean;
  isDisabled?: boolean;
  placeholder?: string;
  error?: any;
}

export const ParameterSelector = <T extends object>({
  isDisabled,
  placeholder,
  readOnly,
  path,
  error,
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
        isDisabled={isDisabled}
        placeholder={placeholder}
        readOnly={readOnly}
        prefix={
          <span style={{ color: '#4478FF' }} className="m-r-5">
            {'{{'}
          </span>
        }
        sufix={
          <span style={{ color: '#4478FF' }} className="m-l-5">
            {'}}'}
          </span>
        }
        defaultValue={
          parameters.find((x) => x.name === field.value) || handleCreate(field.value)
        }
        onChangeValue={(value) => {
          setValue<string>(path, value?.name || '', { shouldDirty: true });
        }}
        onChange={field.onChange}
        create={handleCreate}
        error={error}
      />
    </>
  );
};
