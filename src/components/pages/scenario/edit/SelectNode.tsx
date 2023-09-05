import { usePage, useRootState } from '@hooks';
import { getReactSelectStyle, NODE_PREFIX, onMenuOpenScroller } from '@modules';
import { arrowHelper } from '@modules/arrowHelper';
import classNames from 'classnames';
import React, { FC, useEffect } from 'react';
import { FieldError, useController, useFormContext } from 'react-hook-form';
import Select from 'react-select';

interface IReactSelect {
  value: string | null;
  label: string;
}

export interface ISelectNodeProps {
  fieldName: string;
  defaultValue?: string;
  nodeId?: string;
  error?: FieldError;
  isBottom?: boolean;
}

export const SelectNode: FC<ISelectNodeProps> = React.memo(
  ({ fieldName, defaultValue, nodeId, error, isBottom }) => {
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
            !isBottom,
          ) === undefined,
      )
      .sort((a, b) => ((a.title || '') > (b.title || '') ? 1 : -1))
      .map((item) => ({
        value: item.id,
        label: item.title || '',
      }));
    const selectorOptions = [{ value: null, label: t(`SET_OPTION_NULL`) }, ...nodeList];

    useEffect(() => {
      resetField(`${fieldName}`, { keepDirty: true, keepError: true });
    }, [nodeId]);

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
        onMenuOpen={onMenuOpenScroller}
      />
    );
  },
);

SelectNode.displayName = 'SelectNode';
