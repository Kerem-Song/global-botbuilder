import { useRootState } from '@hooks';
import { NODE_PREFIX } from '@modules';
import { arrowHelper } from '@modules/arrowHelper';
import classNames from 'classnames';
import { FieldError, useController, useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { reactSelectStyle } from './ButtonTypeSelector';
interface IReactSelect {
  value: string;
  label: string;
}

export const SelectNode = ({
  fieldName,
  defaultValue,
  nodeId,
  error,
}: {
  fieldName: string;
  defaultValue?: string;
  nodeId?: string;
  error?: FieldError;
}) => {
  const nodes = useRootState((state) => state.makingNodeSliceReducer.present.nodes);

  const { control } = useFormContext();
  const { field } = useController({
    name: `${fieldName}`,
    control,
  });

  const nodeList: IReactSelect[] = [...nodes]
    .filter((item) => item.id !== nodeId)
    .filter(
      (item) =>
        arrowHelper.validateArrows(
          `${NODE_PREFIX}${nodeId}`,
          `${NODE_PREFIX}${item.id}`,
          nodes,
          true,
        ) === undefined,
    )
    .sort((a, b) => ((a.title || '') > (b.title || '') ? 1 : -1))
    .map((item) => ({
      value: item.id,
      label: item.title || '',
    }));

  return (
    <Select
      className={classNames('react-selector', {
        'luna-input-error': error,
      })}
      {...field}
      options={nodeList}
      styles={reactSelectStyle}
      defaultValue={nodeList.find((item) => item.value === defaultValue)}
      value={nodeList.find((item) => item.value === field.value)}
      onChange={(options: any) => field.onChange(options?.value)}
    />
  );
};
