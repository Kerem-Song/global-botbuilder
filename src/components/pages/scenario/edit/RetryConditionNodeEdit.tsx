import { Collapse, Divider, FormItem, Space } from '@components';
import { useNodeEditSave, usePage } from '@hooks';
import { IGNodeEditModel } from '@models';
import { IRetryConditionView } from '@models/interfaces/res/IGetFlowRes';
import { getReactSelectStyle } from '@modules';
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
  console.log('value.view in RetryConditionNodeEdit', values.view);

  return (
    <>
      <Collapse label={t(`RETRY_CONDITION_NODE_SET_RETRY_CONDITION`)} useSwitch={false}>
        <div className="m-b-8">
          <span className="subLabel">
            {t(`RETRY_CONDITION_NODE_SET_RETRY_CONDITION_COUNT`)}{' '}
          </span>
          <span className="required">*</span>
        </div>
        <div className={classnames('input m-b-8', {})}>
          <Select
            className="react-selector"
            {...field}
            options={countOptions}
            styles={reactSelectStyle}
            defaultValue={countOptions[0]}
            value={countOptions.find((item) => item.value === field.value)}
            onChange={(options: any) => field.onChange(options?.value)}
            isSearchable={false}
          />
        </div>
        <div className="m-b-8">
          <Space direction="vertical">
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

          <Divider />
        </div>
        <div className="m-b-8">
          <Space direction="vertical">
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
    </>
  );
};
