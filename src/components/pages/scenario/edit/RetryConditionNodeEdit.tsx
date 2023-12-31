import { Collapse, Divider, FormItem, Space } from '@components';
import { useNodeEditSave, usePage } from '@hooks';
import { IGNodeEditModel } from '@models';
import { IRetryConditionView } from '@models/interfaces/res/IGetFlowRes';
import { getReactSelectStyle, onMenuOpenScroller } from '@modules';
import classnames from 'classnames';
import { useController, useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { SelectNode } from './SelectNode';

interface IReactSelect {
  value: number;
  label: string;
}

export const RetryConditionNodeEdit = () => {
  useNodeEditSave();
  const { t } = usePage();

  const countOptions: IReactSelect[] = [
    { value: 1, label: '1' + t(`RETRY_CONDITION_NODE_COUNT_TIME`) },
    { value: 2, label: '2' + t(`RETRY_CONDITION_NODE_COUNT_TIME`) },
    { value: 3, label: '3' + t(`RETRY_CONDITION_NODE_COUNT_TIME`) },
    { value: 4, label: '4' + t(`RETRY_CONDITION_NODE_COUNT_TIME`) },
    { value: 5, label: '5' + t(`RETRY_CONDITION_NODE_COUNT_TIME`) },
  ];

  const {
    getValues,
    control,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IRetryConditionView>>();
  const reactSelectStyle = getReactSelectStyle({});
  const { field } = useController({
    name: `view.count`,
    control,
  });

  const values = getValues();

  return (
    <Collapse
      label={t(`RETRY_CONDITION_NODE_SET_RETRY_CONDITION`)}
      useSwitch={false}
      key={values.id}
    >
      <div className="m-b-12">
        <span className="subLabel">
          {t(`RETRY_CONDITION_NODE_SET_RETRY_CONDITION_COUNT`)}{' '}
        </span>
        <span className="required">*</span>
      </div>
      <div className={classnames('input m-b-12', {})}>
        <Select
          key={`${values.id}-retry-condition-count`}
          className="react-selector"
          {...field}
          options={countOptions}
          placeholder={t(`SET_OPTION_NULL`)}
          styles={reactSelectStyle}
          defaultValue={countOptions[0]}
          value={countOptions.find((item) => item.value === field.value)}
          onChange={(options: any) => field.onChange(options?.value)}
          isSearchable={false}
          onMenuOpen={onMenuOpenScroller}
        />
      </div>
      <div className="m-b-12">
        <Space direction="vertical" gap={12}>
          <div>
            <span className="label">
              {t(`RETRY_CONDITION_NODE_SET_RETRY_CONDITION_TRUE_THEN_NEXT_MESSAGE`)}{' '}
            </span>
            <span className="required">*</span>
          </div>
          <FormItem error={errors.view?.trueThenNextNodeId}>
            <SelectNode
              fieldName={'view.trueThenNextNodeId'}
              nodeId={getValues().id}
              error={errors.view?.trueThenNextNodeId}
            />
          </FormItem>
        </Space>
      </div>
      <Divider style={{ margin: '32px 0' }} />
      <div className="m-b-12">
        <Space direction="vertical" gap={12}>
          <div>
            <span>
              {t(`RETRY_CONDITION_NODE_SET_RETRY_CONDITION_FALSE_THEN_NEXT_MESSAGE`)}
            </span>
            <span className="required">*</span>
          </div>
          <FormItem error={errors.view?.falseThenNextNodeId}>
            <SelectNode
              fieldName={'view.falseThenNextNodeId'}
              nodeId={getValues().id}
              error={errors.view?.falseThenNextNodeId}
            />
          </FormItem>
        </Space>
      </div>
    </Collapse>
  );
};
