import { usePage, useRootState } from '@hooks';
import { getReactSelectStyle, NODE_PREFIX } from '@modules';
import { arrowHelper } from '@modules/arrowHelper';
import classNames from 'classnames';
import { useEffect } from 'react';
import { FieldError, useController, useFormContext } from 'react-hook-form';
import Select from 'react-select';

interface IReactSelect {
  value: string | null;
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
  const { t } = usePage();
  const nodes = useRootState((state) => state.makingNodeSliceReducer.present.nodes);
  const reactSelectStyle = getReactSelectStyle({});

  const { control, resetField } = useFormContext();
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
          fieldName !== 'nextNodeId' ? true : false,
        ) === undefined,
    )
    .sort((a, b) => ((a.title || '') > (b.title || '') ? 1 : -1))
    .map((item) => ({
      value: item.id,
      label: item.title || '',
    }));
  const selectorOptions = [{ value: null, label: t(`SET_OPTION_NULL`) }, ...nodeList];

  // useEffect(() => {
  //   resetField('view.nextNodeId');
  // }, [nodeId]);
  return (
    <Select
      className={classNames('react-selector', {
        'luna-input-error': error,
      })}
      {...field}
      options={selectorOptions}
      placeholder={t(`SET_OPTION_NULL`)}
      styles={reactSelectStyle}
      defaultValue={nodeList.find((item) => item.value === defaultValue)}
      value={nodeList.find((item) => item.value === field.value)}
      onChange={(options: any) => field.onChange(options?.value)}
    />
  );
};
